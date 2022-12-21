import LiquidityPool from "../../contracts/GovernableLinearLiquidityPool.json";
import ProtocolReaderJSON from "../../contracts/ProtocolReader.json";

import addresses from "../../contracts/addresses.json";

const state = {
  abi: {undefined:null},
  address: {undefined:null},
  apy: {undefined:null},
  contract: {undefined:null},
  defaultPair: null,
  defaultType: null,
  defaultSide: null,
  defaultMaturity: null,
  poolFreeBalance: {undefined:null},
  poolMaturityDate: {undefined:null},
  poolWithdrawalFee: {undefined:null},
  symbolsListJson: {undefined:null},
  allSymbolsListJSON: null,
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
    //return state.defaultMaturity[state.selectedPoolAddress];
    return state.defaultMaturity;
  },
  getDefaultPair(state) {
    //return state.defaultPair[state.selectedPoolAddress];
    return state.defaultPair;
  },
  getDefaultType(state) {
    //return state.defaultType[state.selectedPoolAddress];
    return state.defaultType;
  },
  getDefaultSide(state) {
    //return state.defaultSide[state.selectedPoolAddress];
    return state.defaultSide;
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
  getAllSymbolsListJson(state) {
    return state.allSymbolsListJSON;
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
    let symbolsRaw = state.pool[state.selectedPoolAddress]["poolSymbolList"];//await state.contract[state.selectedPoolAddress].methods.listSymbols().call();

    commit("setSymbolsList", {web3, symbolsRaw});
  },
  async fetchAllPoolOptions({ commit, rootState }){
    let protocolReaderAddr = addresses["ProtocolReader"][parseInt(rootState.accounts.chainId)];
    const protocolReaderContract = new rootState.accounts.web3.eth.Contract(ProtocolReaderJSON.abi, protocolReaderAddr);
    let poolOptions = await protocolReaderContract.methods.listPoolOptions().call();

    let marketOptionsPoolMap = {};
    if (poolOptions.length > 0){
      for (var i=0; i < poolOptions[0].length; i++) {
        let pSym = poolOptions[0][i];
        let poolAddr = poolOptions[1][i];
        let poolOptionsVals = poolOptions[2][i];

        let symbolsLines = poolOptionsVals.split("\n");

        for (let opSym of symbolsLines) {
          if (symbolsLines.length === 1 && symbolsLines[0] === '') {
            // if the symbolsLines array is [''], skip the rest of the code in the loop
            continue;
          }

          // market
          let itemList = opSym.split("-");
          let pair = itemList[0];

          let maturityHumanReadable = new Date(Number(itemList[3])*1e3).toLocaleDateString('en-GB', 
          { 
            hour12 : true,
            hour: 'numeric',
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          });

          // type
          let typeName = "CALL";
          if (itemList[1] === "EP") {
            typeName = "PUT";
          }

          let timestamp = itemList[3];
          let strikeRaw = itemList[2];

          let udlSymbol = pair.split("/")[0];
          console.log(pair);
          state.defaultPair = pair;
          state.defaultType = typeName;

          // side
          let sideName = "BUY";
          state.defaultSide = sideName;
          state.defaultMaturity = maturityHumanReadable;
          
          // strike price
          let strikePriceBigUnit = Math.round(rootState.accounts.web3.utils.fromWei(Number(itemList[2]).toString(16), "ether")*100)/100;

          /*

            TODO: THERE MAY BE DUPLICATE OF THE SAME STRIKE, WILL NEED TO MAKE UNIQUE AND THEN SHOW THE DIFFERENT PRICES
          */
          if (pair in marketOptionsPoolMap) {
            if (maturityHumanReadable in marketOptionsPoolMap[pair]) {
              if (typeName in marketOptionsPoolMap[pair][maturityHumanReadable]) {
                marketOptionsPoolMap[pair][maturityHumanReadable][typeName].push({strike: strikePriceBigUnit, symbol: opSym, pair: pair, strikeRaw: strikeRaw, timestamp: timestamp, udlSymbol: udlSymbol, type: typeName, pool: pSym, poolAddr: poolAddr});
              } else {
                marketOptionsPoolMap[pair][maturityHumanReadable][typeName] = [
                  {strike: strikePriceBigUnit, symbol: opSym, pair: pair, strikeRaw: strikeRaw, timestamp: timestamp, udlSymbol: udlSymbol, type: typeName, pool: pSym, poolAddr: poolAddr}
                ]
              }
            } else {
              marketOptionsPoolMap[pair][maturityHumanReadable] = {
                [typeName]: [
                  {strike: strikePriceBigUnit, symbol: opSym, pair: pair, strikeRaw: strikeRaw, timestamp: timestamp, udlSymbol: udlSymbol, type: typeName, pool: pSym, poolAddr: poolAddr}
                ]
              }
            }
          } else {
            marketOptionsPoolMap[pair] = {
              [maturityHumanReadable]: {
                [typeName]: [
                {strike: strikePriceBigUnit, symbol: opSym, pair: pair, strikeRaw: strikeRaw, timestamp: timestamp, udlSymbol: udlSymbol, type: typeName, pool: pSym, poolAddr: poolAddr}
                ]
              }
            }
          }
        }
      }
    }
    commit("setAllSymbolsList", marketOptionsPoolMap);

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
  setAllSymbolsList(state, allSymbolsList) {
    state.allSymbolsListJSON = allSymbolsList;
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

      console.log(itemList);

      
      let timestamp = itemList[3];
      let strikeRaw = itemList[2];

      // pair
      let pair = itemList[0];
      let udlSymbol = pair.split("/")[0];
      state.defaultPair[state.selectedPoolAddress] = pair

      // type
      let typeName = "CALL";
      if (itemList[1] === "EP") {
        typeName = "PUT";
      }
      state.defaultType[state.selectedPoolAddress] = typeName;

      // side
      let sideName = "BUY";
      state.defaultSide[state.selectedPoolAddress] = sideName;

      // maturity
      let maturityHumanReadable = new Date(Number(itemList[3])*1e3).toLocaleDateString('en-GB', 
        { 
          hour12 : true,
          hour: 'numeric',
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      state.defaultMaturity[state.selectedPoolAddress] = maturityHumanReadable;
      
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
              {strike: strikePriceBigUnit, symbol: item, pair: pair, strikeRaw: strikeRaw, timestamp: timestamp, udlSymbol: udlSymbol, type: typeName}
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
