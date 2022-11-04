import IncentivizedJSON from "../../contracts/Incentivized.json";
import addresses from "../../contracts/addresses.json";

const ContractName = "Incentivized";

const state = {
  abi: null,
  address: null,
  contract: null,
};

const getters = {
  getIncentivizedAbi(state) {
    return state.abi;
  },
  getIncentivizedAddress(state) {
    return state.address;
  },
  getIncentivizedContract(state) {
    return state.contract;
  }
};

const actions = {
  async fetchContract({ commit, rootState }) {
    let web3 = rootState.accounts.web3;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let address = addresses[ContractName][chainIdDec];
    let contract = new web3.eth.Contract(IncentivizedJSON.abi, address);
    commit("setContract", contract);
  },
  storeAbi({commit}) {
    commit("setAbi", IncentivizedJSON.abi);
  },
  storeAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);
    commit("setAddress", addresses[ContractName][chainIdDec]);
  },
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
