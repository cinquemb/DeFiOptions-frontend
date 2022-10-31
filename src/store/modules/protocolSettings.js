import ProtocolSettingsJSON from "../../contracts/ProtocolSettings.json";
import addresses from "../../contracts/addresses.json";

const ContractName = "ProtocolSettings";

const state = {
  abi: null,
  address: null,
  contract: null,
};

const getters = {
  getProtocolSettingsAbi(state) {
    return state.abi;
  },
  getProtocolSettingsAddress(state) {
    return state.address;
  },
  getProtocolSettingsContract(state) {
    return state.contract;
  }
};

const actions = {
  async fetchContract({ commit, rootState }) {
    let web3 = rootState.accounts.web3;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let address = addresses[ContractName][chainIdDec];
    let contract = new web3.eth.Contract(ProtocolSettingsJSON.abi, address);
    commit("setContract", contract);
  },
  storeAbi({commit}) {
    commit("setAbi", ProtocolSettingsJSON.abi);
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
