import ProtocolSettingsJSON from "../../contracts/ProtocolSettings.json";
import addresses from "../../contracts/addresses.json";

const ContractName = "ProtocolSettings";

const state = {
  abi: null,
  address: null,
  DODaddress: null,
  contract: null,
};

const getters = {
  getProtocolSettingsAbi(state) {
    return state.abi;
  },
  getProtocolSettingsAddress(state) {
    return state.address;
  },
  getDODAddress(state) {
    return state.DODaddress;
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
    commit("setDODAddress", addresses["DOD"][chainIdDec]);
  },
  storeDODAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);
    commit("setDODAddress", addresses["DOD"][chainIdDec]);
  }
};

const mutations = {
  setAbi(state, abi) {
    state.abi = abi;
  },
  setAddress(state, address) {
    state.address = address;
  },
  setDODAddress(state, address) {
    state.DODaddress = address;
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
