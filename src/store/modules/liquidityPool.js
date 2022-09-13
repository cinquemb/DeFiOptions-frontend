import LiquidityPool from "../../contracts/LinearLiquidityPool.json";
import addresses from "../../contracts/addresses.json";

const state = {
  abi: {},
  address: {},
  apy: {},
  contract: {},
  defaultPair: {},
  defaultType: {},
  defaultSide: {},
  defaultMaturity: {},
  poolFreeBalance: {},
  poolMaturityDate: {},
  poolWithdrawalFee: {},
  symbolsListJson: {},
  userBalance: {},
  userPoolUsdValue: {} // USD value of the pool balance
};

const getters = {
  getApy(state) {
    return state.apy[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getDefaultMaturity(state) {
    return state.defaultMaturity[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getDefaultPair(state) {
    return state.defaultPair[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getDefaultType(state) {
    return state.defaultType[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getDefaultSide(state) {
    return state.defaultSide[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getLiquidityPoolAbi(state) {
    return state.abi[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getLiquidityPoolAddress(state) {
    return state.address[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getLiquidityPoolContract(state) {
    return state.contract[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getLiquidityPoolFreeBalance(state) {
    return state.poolFreeBalance[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getLiquidityPoolMaturityDate(state) {
    return state.poolMaturityDate[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getLiquidityPoolUserBalance(state) {
    return state.userBalance[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getLiquidityPoolWithdrawalFee(state) {
    return state.poolWithdrawalFee[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getSymbolsListJson(state) {
    return state.symbolsListJson[rootState.optionsExchange.getSelectedPoolAddr()];
  },
  getUserPoolUsdValue(state) {
    return state.userPoolUsdValue[rootState.optionsExchange.getSelectedPoolAddr()];
  }
};

const actions = {
  async fetchContract({ commit, rootState }) {
    let web3 = rootState.accounts.web3;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let address = rootState.optionsExchange.getSelectedPoolAddr();

    let contract = new web3.eth.Contract(LiquidityPool.abi, address);
    commit("setContract", contract);
  },
  async fetchApy({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    const apy = await state.contract.methods.yield(365 * 24 * 60 * 60).call();
    let apyBig = ((apy-1e9)/1e9)*100;

    if (parseInt(rootState.accounts.chainId) === 137) {
      // needed for the soft launch in Nov 2021 to reset yield to 0%
      const base = 1262535945;
      apyBig = (apy / base  - 1) * 100;
    }

    commit("setApy", apyBig);
  },
  async fetchSymbolsList({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let web3 = rootState.accounts.web3;

    const operation = { BUY: "1" }
    let symbolsRaw = await state.contract.methods.listSymbols(operation.BUY).call();

    commit("setSymbolsList", {web3, symbolsRaw});
  },
  async fetchPoolFreeBalance({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let freeBalanceWei = await state.contract.methods.calcFreeBalance().call();

    let web3 = rootState.accounts.web3;
    let balance = web3.utils.fromWei(freeBalanceWei, "ether");

    commit("setPoolFreeBalance", balance);
  },
  async fetchPoolMaturityDate({ commit, dispatch, state }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let maturitySec = await state.contract.methods.maturity().call();

    let maturityHumanReadable = new Date(Number(maturitySec)*1e3).toLocaleDateString('en-GB', { day: 'numeric', 
        month: 'short', 
        year: 'numeric' });

    commit("setPoolMaturityDate", maturityHumanReadable);
  },
  async fetchPoolWithdrawalFee({ commit, dispatch, state }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    const withdrawalFeeBig = await state.contract.methods.withdrawFee().call();

    const wFeeSmall = Number(withdrawalFeeBig) / 1000000000; // divide to remove 9 decimal places
    const wFeePercentage = wFeeSmall * 100; // the result is percentage

    commit("setPoolWithdrawalFee", wFeePercentage);
  },
  async fetchUserBalance({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let activeAccount = rootState.accounts.activeAccount;
    let balanceWei = await state.contract.methods.balanceOf(activeAccount).call();

    let web3 = rootState.accounts.web3;
    let balance = web3.utils.fromWei(balanceWei, "ether");

    commit("setUserLiquidityPoolBalance", balance);
  },
  async fetchUserPoolUsdValue({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let activeAccount = rootState.accounts.activeAccount;

    let balanceWei = "0";

    try {
      balanceWei = await state.contract.methods.valueOf(activeAccount).call();
    } catch(e) {
      console.log("The total pool balance is probably 0, which is why MetaMask may be showing the 'Internal JSON-RPC... division by 0' error.");
    }

    let web3 = rootState.accounts.web3;
    let value = web3.utils.fromWei(balanceWei, "ether");

    commit("setUserPoolUsdValue", value);
  },
  storeAbi({commit}) {
    commit("setAbi", LiquidityPool.abi);
  },
  storeAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);

    commit("setAddress", rootState.optionsExchange.getSelectedPoolAddr());
  }
};

const mutations = {
  setAbi(state, abi) {
    state.abi[rootState.optionsExchange.getSelectedPoolAddr()] = abi;
  },
  setAddress(state, address) {
    state.address[rootState.optionsExchange.getSelectedPoolAddr()] = address;
  },
  setApy(state, apy) {
    state.apy[rootState.optionsExchange.getSelectedPoolAddr()] = apy;
  },
  setContract(state, _contract) {
    state.contract[rootState.optionsExchange.getSelectedPoolAddr()] = _contract;
  },
  setDefaultMaturity(state, maturity) {
    state.defaultMaturity[rootState.optionsExchange.getSelectedPoolAddr()] = maturity;
  },
  setDefaultPair(state, pair) {
    state.defaultPair[rootState.optionsExchange.getSelectedPoolAddr()] = pair;
  },
  setDefaultType(state, type) {
    state.defaultType[rootState.optionsExchange.getSelectedPoolAddr()] = type;
  },
  setDefaultSide(state, side) {
    state.defaultSide[rootState.optionsExchange.getSelectedPoolAddr()] = side;
  },
  setPoolFreeBalance(state, balance) {
    state.poolFreeBalance[rootState.optionsExchange.getSelectedPoolAddr()] = balance;
  },
  setPoolMaturityDate(state, date) {
    state.poolMaturityDate[rootState.optionsExchange.getSelectedPoolAddr()] = date;
  },
  setPoolWithdrawalFee(state, fee) {
    state.poolWithdrawalFee[rootState.optionsExchange.getSelectedPoolAddr()] = fee;
  },
  setUserLiquidityPoolBalance(state, balance) {
    state.userBalance[rootState.optionsExchange.getSelectedPoolAddr()] = balance;
  },
  setUserPoolUsdValue(state, value) {
    state.userPoolUsdValue[rootState.optionsExchange.getSelectedPoolAddr()] = value;
  },
  setSymbolsList(state, {web3, symbolsRaw}) {
    let symbolsLines = symbolsRaw.split("\n");

    let symbolsArray = {}; // to be populated in the for loop

    for (let item of symbolsLines) {
      if (symbolsLines.length === 1 && symbolsLines[0] === '') {
        // if the symbolsLines array is [''], skip the rest of the code in the loop
        continue;
      }

      let itemList = item.split("-");

      
      let timestamp = itemList[3];
      let strikeRaw = itemList[2];

      // pair
      let pair = itemList[0];
      let udlSymbol = pair.split("/")[0];
      state.defaultPair = pair

      // type
      let typeName = "CALL";
      if (itemList[1] === "EP") {
        typeName = "PUT";
      }
      state.defaultType = typeName;

      // side
      let sideName = "BUY";
      state.defaultSide = sideName;

      // maturity
      let maturityHumanReadable = new Date(Number(itemList[3])*1e3).toLocaleDateString('en-GB', 
        { 
          hour12 : true,
          hour: 'numeric',
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      state.defaultMaturity = maturityHumanReadable;
      
      // strike price
      let strikePriceBigUnit = Math.round(web3.utils.fromWei(Number(itemList[2]).toString(16), "ether")*100)/100;

      // populate symbolsArray
      if (pair in symbolsArray) {
        if (maturityHumanReadable in symbolsArray[pair]) {
          if (typeName in symbolsArray[pair][maturityHumanReadable]) {
            if (!(strikePriceBigUnit in symbolsArray[pair][maturityHumanReadable][typeName])) {
              symbolsArray[pair][maturityHumanReadable][typeName].push({strike: strikePriceBigUnit, symbol: item, pair: pair, strikeRaw: strikeRaw, timestamp: timestamp, udlSymbol: udlSymbol, type: typeName});
            }
          } else {
            symbolsArray[pair][maturityHumanReadable][typeName] = [
              {strike: strikePriceBigUnit, symbol: item, pair: pair, strikeRaw: strikeRaw, timestamp: timestamp, udlSymbol: udlSymbol, type: typeName}
            ]
          }
        } else {
          symbolsArray[pair][maturityHumanReadable] = {
            [typeName]: [
              {strike: strikePriceBigUnit, symbol: item, pair: pair, strikeRaw: strikeRaw, timestamp: timestamp, udlSymbol: udlSymbol, type: typeName}
            ]
          }
        }
      } else {
        symbolsArray[pair] = {
          [maturityHumanReadable]: {
            [typeName]: [
              {strike: strikePriceBigUnit, symbol: item, pair: pair, strikeRaw: strikeRaw, timestamp: timestamp, udlSymbol: udlSymbol}
            ]
          }
        }
      }

    }

    state.symbolsListJson[rootState.optionsExchange.getSelectedPoolAddr()] = symbolsArray;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
