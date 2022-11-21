import ProposalManagerJSON from "../../contracts/ProposalManager.json";
import ProtocolReaderJSON from "../../contracts/ProtocolReader.json";

import addresses from "../../contracts/addresses.json";

const ContractName = "ProposalManager";

const state = {
  abi: null,
  address: null,
  contract: null,
  proposalCount: null,
  proposals: [],
};

const getters = {
  getProposalManagerAbi(state) {
    return state.abi;
  },
  getProposalManagerAddress(state) {
    return state.address;
  },
  getProposalManagerContract(state) {
    return state.contract;
  },
  getProposalCount(state) {
    return state.proposalCount;
  },
  getProposals(state) {
    return state.proposals;
  }
};

const actions = {
  async fetchContract({ commit, rootState }) {
    let web3 = rootState.accounts.web3;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let address = addresses[ContractName][chainIdDec];
    let contract = new web3.eth.Contract(ProposalManagerJSON.abi, address);
    commit("setContract", contract);
  },

  async fetchProposalCount({dispatch, state}) {
    if (!state.contract) {
      dispatch("fetchContract");
    }
  },
  async fetchProposals({ commit, dispatch, state, rootState}) {
    if (!state.contract) {
      dispatch("fetchContract");
    }
    //store a list of proposals with their information: wrapper addr. addr, governance token, vote type, status
    let proposals = [];

    let protocolReaderAddr = addresses["ProtocolReader"][parseInt(rootState.accounts.chainId)];
    const protocolReaderContract = await new rootState.accounts.web3.eth.Contract(ProtocolReaderJSON.abi, protocolReaderAddr);
    let proposalData = await protocolReaderContract.methods.listProposals().call();

    if(proposalData.length > 0) {
      for(let i=0; i<proposalData[0].length; i++){
        let proposal = {wrapperAddr: null, addr: null, govToken: null, voteType: null, status: null};
        proposal['addr'] = proposalData[0][i];
        proposal['wrapperAddr'] = proposalData[1][i];
        proposal['govToken'] = proposalData[2][i];
        proposal['voteType'] = proposalData[3][i];
        proposal['status'] = proposalData[4][i];
        proposal['isActive'] = proposalData[5][i];
        proposals.push(proposal);
      }
    }

    commit("setProposals", proposals);
  },
  storeAbi({commit}) {
    commit("setAbi", ProposalManagerJSON.abi);
  },
  storeAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);
    commit("setAddress", addresses[ContractName][chainIdDec]);
  }
};

const mutations = {
  setAbi(state, abi) {
    state.abi = abi;
  },
  setAddress(state, address) {
    state.address = address;
  },
  setContract(state, _contract) {
    state.contract = _contract;
  },
  setProposalCount(state, count) {
    state.proposalCount = count;
  },
  setProposals(state, proposals) {
    state.proposals = proposals;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
