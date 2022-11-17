import LiquidityPool from "../../contracts/GovernableLinearLiquidityPool.json";
//import addresses from "../../contracts/addresses.json";

const state = {
  abi: {undefined:null},
  address: {undefined:null},
  apy: {undefined:null},
  contract: {undefined:null},
  defaultPair: {undefined:null},
  defaultType: {undefined:null},
  defaultSide: {undefined:null},
  defaultMaturity: {undefined:null},
  poolFreeBalance: {undefined:null},
  poolMaturityDate: {undefined:null},
  poolWithdrawalFee: {undefined:null},
  symbolsListJson: {undefined:null},
  userBalance: {undefined:null},
  pool: {undefined: null},
  userPoolUsdValue: {undefined:null}, // USD value of the pool balance
  selectedPoolAddress: "N/A",
};

const getters = {
  getApy(state) {
    return state.apy[state.selectedPoolAddress];
  },
  getSelectedPoolAddress(state){
    return state.selectedPoolAddress;
  },
  getDefaultMaturity(state) {
    return state.defaultMaturity[state.selectedPoolAddress];
  },
  getDefaultPair(state) {
    return state.defaultPair[state.selectedPoolAddress];
  },
  getDefaultType(state) {
    return state.defaultType[state.selectedPoolAddress];
  },
  getDefaultSide(state) {
    return state.defaultSide[state.selectedPoolAddress];
  },
  getLiquidityPoolAbi(state) {
    return state.abi[state.selectedPoolAddress];
  },
  getLiquidityPoolAddress(state) {
    return state.address[state.selectedPoolAddress];
  },
  getLiquidityPoolContract(state) {
    return state.contract[state.selectedPoolAddress];
  },
  getLiquidityPoolFreeBalance(state) {
    return state.poolFreeBalance[state.selectedPoolAddress];
  },
  getLiquidityPoolMaturityDate(state) {
    return state.poolMaturityDate[state.selectedPoolAddress];
  },
  getLiquidityPoolUserBalance(state) {
    return state.userBalance[state.selectedPoolAddress];
  },
  getLiquidityPoolWithdrawalFee(state) {
    return state.poolWithdrawalFee[state.selectedPoolAddress];
  },
  getSymbolsListJson(state) {
    return state.symbolsListJson[state.selectedPoolAddress];
  },
  getUserPoolUsdValue(state) {
    return state.userPoolUsdValue[state.selectedPoolAddress];
  }
};
/*
            "poolBalance": poolBalance,
*/

const actions = {
  async fetchContract({ commit, rootState }) {
    let web3 = rootState.accounts.web3;
    //let chainIdDec = parseInt(rootState.accounts.chainId);
    let address = state.selectedPoolAddress;

    let contract = new web3.eth.Contract(LiquidityPool.abi, address);
    commit("setContract", contract);
    commit("setAbi", LiquidityPool.abi);
  },
  async fetchApy({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    try{
      const apy = state.pool[state.selectedPoolAddress]["poolApy"];//await state.contract[state.selectedPoolAddress].methods.yield(365 * 24 * 60 * 60).call();
      let apyBig = ((apy-1e9)/1e9)*100;

      if (parseInt(rootState.accounts.chainId) === 137) {
        // needed for the soft launch in Nov 2021 to reset yield to 0%
        const base = 1262535945;
        apyBig = (apy / base  - 1) * 100;
      }

      commit("setApy", apyBig);
    } catch {
      commit("setApy", 0);
    }

  },
  async fetchSymbolsList({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let web3 = rootState.accounts.web3;
    let symbolsRaw = await state.contract[state.selectedPoolAddress].methods.listSymbols().call();

    commit("setSymbolsList", {web3, symbolsRaw});
  },
  async fetchPoolFreeBalance({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let freeBalanceWei = state.pool[state.selectedPoolAddress]["poolFreeBalance"];//await state.contract[state.selectedPoolAddress].methods.calcFreeBalance().call();

    let web3 = rootState.accounts.web3;
    let balance = web3.utils.fromWei(freeBalanceWei, "ether");

    commit("setPoolFreeBalance", balance);
  },
  async fetchPoolMaturityDate({ commit, dispatch, state }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let maturitySec = state.pool[state.selectedPoolAddress]["poolMaturityDate"];//await state.contract[state.selectedPoolAddress].methods.maturity().call();

    let maturityHumanReadable = new Date(Number(maturitySec)*1e3).toLocaleDateString('en-GB', { day: 'numeric', 
        month: 'short', 
        year: 'numeric' });

    commit("setPoolMaturityDate", maturityHumanReadable);
  },
  async fetchPoolWithdrawalFee({ commit, dispatch, state }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    const withdrawalFeeBig = state.pool[state.selectedPoolAddress]["poolWithdrawalFee"];//await state.contract[state.selectedPoolAddress].methods.withdrawFee().call();
    console.error("withdrawalFeeBig:" + withdrawalFeeBig);

    const wFeeSmall = Number(withdrawalFeeBig) / 1000000000; // divide to remove 9 decimal places
    const wFeePercentage = wFeeSmall * 100; // the result is percentage

    commit("setPoolWithdrawalFee", wFeePercentage);
  },
  async fetchUserBalance({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    //let activeAccount = rootState.accounts.activeAccount;
    let balanceWei = state.pool[state.selectedPoolAddress]["userPoolBalance"];//await state.contract[state.selectedPoolAddress].methods.balanceOf(activeAccount).call();

    let web3 = rootState.accounts.web3;
    let balance = web3.utils.fromWei(balanceWei, "ether");

    commit("setUserLiquidityPoolBalance", balance);
  },
  async fetchUserPoolUsdValue({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    //let activeAccount = rootState.accounts.activeAccount;

    let balanceWei = "0";

    try {
      balanceWei = state.pool[state.selectedPoolAddress]["userPoolUsdValue"];//await state.contract[state.selectedPoolAddress].methods.valueOf(activeAccount).call();
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
  storeAddress({ commit }) {
    //let chainIdDec = parseInt(rootState.accounts.chainId);

    commit("setAddress", state.selectedPoolAddress);
  }
};

const mutations = {
  setAbi(state, abi) {
    state.abi[state.selectedPoolAddress] = abi;
  },
  setAddress(state, address) {
    state.address[state.selectedPoolAddress] = address;
  },
  setApy(state, apy) {
    state.apy[state.selectedPoolAddress] = apy;
  },
  setContract(state, _contract) {
    state.contract[state.selectedPoolAddress] = _contract;
  },
  setPoolData(state, poolAddr, poolData) {
    state.pool[poolAddr] = poolData;
  },
  setDefaultMaturity(state, maturity) {
    state.defaultMaturity[state.selectedPoolAddress] = maturity;
  },
  setDefaultPair(state, pair) {
    state.defaultPair[state.selectedPoolAddress] = pair;
  },
  setDefaultType(state, type) {
    state.defaultType[state.selectedPoolAddress] = type;
  },
  setDefaultSide(state, side) {
    state.defaultSide[state.selectedPoolAddress] = side;
  },
  setPoolFreeBalance(state, balance) {
    state.poolFreeBalance[state.selectedPoolAddress] = balance;
  },
  setPoolMaturityDate(state, date) {
    state.poolMaturityDate[state.selectedPoolAddress] = date;
  },
  setPoolWithdrawalFee(state, fee) {
    state.poolWithdrawalFee[state.selectedPoolAddress] = fee;
  },
  setUserLiquidityPoolBalance(state, balance) {
    state.userBalance[state.selectedPoolAddress] = balance;
  },
  setUserPoolUsdValue(state, value) {
    state.userPoolUsdValue[state.selectedPoolAddress] = value;
  },
  setSelectedPoolAddress(state, address) {
    state.selectedPoolAddress = address;
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

    state.symbolsListJson[state.selectedPoolAddress] = symbolsArray;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
