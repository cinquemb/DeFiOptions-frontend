import ProposalManagerJSON from "../../contracts/ProposalManager.json";
import ProposalWrapperJSON from "../../contracts/ProposalWrapper.json";
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

  async fetchProposalCount({ commit, dispatch, state}) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    // check user's Exchange Balance allowance for the Liquidity Pool contract
    let proposalCount = parseInt(await state.contract.methods.proposalCount().call());

    console.error("proposalCount");
    console.error(proposalCount);
    
    commit("setProposalCount", proposalCount);

  },
  async fetchProposals({ commit, dispatch, state, rootState}) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    
    if(!state.proposalCount) {
        dispatch("fetchProposalCount");
    }

    console.error("before proposal");

    //store a list of proposals with their information: wrapper addr. addr, governance token, vote type, status
    let proposals = [];

    for(let i=1; i<state.proposalCount; i++){

      console.error("in iter proposal");
      let web3 = rootState.accounts.web3;
      let proposal = {wrapperAddr: null, addr: null, govToken: null, voteType: null, status: null};
      proposal['addr'] = await state.contract.methods.resolveProposal(web3.utils.toBN(i)).call();
      console.error("proposal.addr");
      console.error( proposal.addr);
      proposal['wrapperAddr'] = await state.contract.methods.resolve(proposal['addr']).call();
      console.error("proposal.wrapperAddr");
      console.error( proposal.wrapperAddr);
      let pWrapperContract = new web3.eth.Contract(ProposalWrapperJSON.abi, proposal.wrapperAddr);
      proposal['govToken'] = await pWrapperContract.methods.getGovernanceToken().call();
      proposal['voteType'] = await pWrapperContract.methods.getVoteType().call();
      proposal['status'] = await pWrapperContract.methods.getStatus().call();

      console.error("proposal");
      console.error(proposal);

      proposals.push(proposal);
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
