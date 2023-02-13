import OptionsExchange from "../../contracts/OptionsExchangeV2.json";
import UnderlyingFeed from "../../contracts/UnderlyingFeed.json";
import ProtocolReaderJSON from "../../contracts/ProtocolReader.json";

import addresses from "../../contracts/addresses.json";

const state = {
  abi: null,
  address: null,
  contract: null,
  poolBalance: {},
  userBalance: null,
  userSurplusBalance: null,
  userExchangeBalanceAllowance: null,
  userOptions: null,
  underlyingPrice: null,
  availableLiquidityPools: [],
  poolSymbolsAddrsMap: {},
  underlyingsAvailable: {},
  selectedPool: "N/A"
};

const getters = {
  getExchangeUserBalance(state) {
    return state.userBalance;
  },
  getUserCollateralSurplus(state) {
    return state.userSurplusBalance;
  },
  getLiquidityPoolBalance(state) {
    return state.poolBalance[state.poolSymbolsAddrsMap[state.selectedPool]];
  },
  getLiquidityPoolAddresses(state) {
    return state.availableLiquidityPools;
  },
  getOptionsExchangeAbi(state) {
    return state.abi;
  },
  getOptionsExchangeAddress(state) {
    return state.address;
  },
  getOptionsExchangeContract(state) {
    return state.contract;
  },
  getUnderlyingPrice(state) {
    // underlying price for the currently selected pair/symbol
    return state.underlyingPrice;
  },
  getOptionTokenAddress(state) {
    // option token address for the currently selected pair/symbol
    return state.optionTokenAddress;
  },
  getUserExchangeBalanceAllowance(state) {
    return state.userExchangeBalanceAllowance;
  },
  getSelectedPool(state) {
    return state.selectedPool;
  },
  getUserOptions(state) {
    return state.userOptions;
  },
  getSelectedPoolAddr(state) {
    return state.poolSymbolsAddrsMap[state.selectedPool];
  },
  getExchangeLiquidityPools(state) {
    return state.exchangeLiquidityPools;
  },
  getUnderlyingsAvailable(state){
   return state.underlyingsAvailable; 
  }
};

const actions = {
  async fetchContract({ commit, rootState }) {
    let web3 = rootState.accounts.web3;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let address = addresses.OptionsExchange[chainIdDec];
    let contract = new web3.eth.Contract(OptionsExchange.abi, address);

    let underlyingMap = {
      "BTC/USD": {"udlAddr": addresses["BTC/USD"][chainIdDec], "currentPrice": null, "realizedVol": null}, 
      "ETH/USD": {"udlAddr": addresses["ETH/USD"][chainIdDec], "currentPrice": null, "realizedVol": null}, 
      "MATIC/USD": {"udlAddr": addresses["MATIC/USD"][chainIdDec], "currentPrice": null, "realizedVol": null}, 
      "CANTO/USD": {"udlAddr": addresses["CANTO/USD"][chainIdDec], "currentPrice": null, "realizedVol": null}, 
      "AVAX/USD": {"udlAddr": addresses["AVAX/USD"][chainIdDec], "currentPrice": null, "realizedVol": null}
    };
    commit("setUnderlyingsAvailable", underlyingMap);
    commit("setContract", contract);
    commit("setAbi", OptionsExchange.abi);
  },
  async fetchExchangeBalanceAllowance({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let spender = rootState.liquidityPool.selectedPoolAddress;
    let owner = rootState.accounts.activeAccount;

    // check user's Exchange Balance allowance for the Liquidity Pool contract
    let allowanceWei = await state.contract.methods.allowance(owner, spender).call();

    let web3 = rootState.accounts.web3;
    let allowance = web3.utils.fromWei(allowanceWei, "ether");

    commit("setExchangeBalanceAllowance", allowance);
  },
  async fetchExchangeUserBalance({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let activeAccount = rootState.accounts.activeAccount;
    let balanceWei = await state.contract.methods.balanceOf(activeAccount).call();

    let web3 = rootState.accounts.web3;
    let balance = web3.utils.fromWei(balanceWei, "ether");

    commit("setUserExchangeBalance", balance);
  },
  async fetchExchangeCollateralSurplus({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let activeAccount = rootState.accounts.activeAccount;
    let balanceWei = await state.contract.methods.calcSurplus(activeAccount).call();

    let web3 = rootState.accounts.web3;
    let balance = web3.utils.fromWei(balanceWei, "ether");

    commit("setUserExchangeCollateralSurplus", balance);
  },
  async fetchLiquidityPoolBalance({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    //let chainIdDec = parseInt(rootState.accounts.chainId);
    let address = state.poolSymbolsAddrsMap[state.selectedPool];
    let balanceWei = await state.contract.methods.balanceOf(address).call();

    let web3 = rootState.accounts.web3;
    let balance = web3.utils.fromWei(balanceWei, "ether");

    commit("setLiquidityPoolBalance", balance);
  },
  async fetchUnderlyingPrice({ commit, dispatch, state, rootState }, data) {
    // underlying price for the currently selected pair/symbol
    if (!state.contract) {
      dispatch("fetchContract");
    }

    commit("setUnderlyingPrice", "N/A");

    try {
      let chainIdDec = parseInt(rootState.accounts.chainId);
      let address = addresses[data.pair][chainIdDec];
      let web3 = rootState.accounts.web3;

      let contract = new web3.eth.Contract(UnderlyingFeed.abi, address);

      let underlyingPrice = await contract.methods.getLatestPrice().call();      
      let underlyingPriceBig = Math.round(web3.utils.fromWei(Number(underlyingPrice.price).toString(16), "ether")*100)/100;
      commit("setUnderlyingPrice", underlyingPriceBig);
    } catch {
      commit("setUnderlyingPrice", "N/A");
    }
  },
  async fetchOptionTokenAddress({ commit, dispatch, state }, data) {
    // option token address for the currently selected pair/symbol
    if (!state.contract) {
      dispatch("fetchContract");
    }

    commit("setOptionTokenAddress", "N/A");
    
    try {
      let optionTokenAddress = await state.contract.methods.resolveToken(String(data.symbol)).call();
      commit("setOptionTokenAddress", optionTokenAddress);
    } catch {
      commit("setOptionTokenAddress", "N/A");
    }
  },
  async fetchLiquidityPools({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }
    let poolSymbols = [];
    let poolSymbolsAddrsMap = {};
    let exchangePools = [];

    let protocolReaderAddr = addresses["ProtocolReader"][parseInt(rootState.accounts.chainId)];
    const protocolReaderContract = await new rootState.accounts.web3.eth.Contract(ProtocolReaderJSON.abi, protocolReaderAddr);
    let poolData = await protocolReaderContract.methods.listPoolsData(rootState.accounts.activeAccount).call();
    if (poolData.length > 0){
      for (var i=0; i < poolData[0].length; i++) {
          let pSym = poolData[0][i];
          let poolAddr = poolData[1][i];
          let poolApy = poolData[2][i];
          let poolBalance = poolData[3][i];
          let poolFreeBalance = poolData[4][i];
          let userPoolBalance = poolData[5][i];
          let userPoolUsdValue = poolData[6][i];
          let poolMaturityDate = poolData[7][i];
          let poolWithdrawalFee = poolData[8][i];
          let poolSymbolList = poolData[9][i];

          poolSymbolsAddrsMap[pSym] = poolAddr;
          poolSymbols.push(pSym);
          let symbol = poolSymbols[i];
          let address = poolSymbolsAddrsMap[symbol];
          // option object
          let poolObject = {symbol, address, poolApy, poolBalance, poolFreeBalance, userPoolBalance, userPoolUsdValue, poolMaturityDate, poolWithdrawalFee, poolSymbolList};
          exchangePools.push(poolObject);
      }
    }
    exchangePools.sort((a, b) => a["userPoolBalance"] < b["userPoolBalance"]);

    commit("setPoolSymbols", poolSymbols);
    commit("setPoolSymbolsAddrsMap", poolSymbolsAddrsMap);
    commit("setExchangeLiquidityPools", exchangePools);
  },
  async fetchUserOptions({ commit, dispatch, state, rootState }) {
    if (!state.contract) {
      dispatch("fetchContract");
    }

    let activeAccount = rootState.accounts.activeAccount;
    let options = await state.contract.methods.getBook(activeAccount).call();

    let web3 = rootState.accounts.web3;

    let symbolsList = options.symbols.split("\n");

    let optionsList = [];
    if (symbolsList[0] !== "") { // if the list is not empty  
      let counter = 0;


      for (let symbol of symbolsList) {
        let itemList = symbol.split("-");
        console.log(itemList);

        let pair = itemList[0];
        let udlSymbol = pair.split("/")[0];
        let timestamp = itemList[3];
        let strike = Math.round(web3.utils.fromWei(Number(itemList[2]).toString(16), "ether"));
        let strikeRaw = itemList[2];

        let holding = web3.utils.fromWei(options.holding[counter], "ether");
        let written = web3.utils.fromWei(options.written[counter], "ether");
        let intrinsicValue = web3.utils.fromWei(options.iv[counter], "ether");
        let address = options.tokens[counter];

        // type
        let type = "CALL";
        if (itemList[1] === "EP") {
          type = "PUT";
        }

        // maturity
        let maturity = new Date(Number(itemList[3])*1e3).toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' });
        
        // option object
        let optionObject = {symbol, pair, udlSymbol, type, maturity, strike, strikeRaw, holding, written, intrinsicValue, timestamp, address}
        optionsList.push(optionObject);

        counter++;
      }
    }

    commit("setUserOptions", optionsList);
  },
  storeAbi({commit}) {
    commit("setAbi", OptionsExchange.abi);
  },
  storeAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);

    commit("setAddress", addresses.OptionsExchange[chainIdDec]);
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
  setLiquidityPoolBalance(state, balance) {
    state.poolBalance[state.poolSymbolsAddrsMap[state.selectedPool]] = balance;
  },
  setExchangeBalanceAllowance(state, allowance) {
    state.userExchangeBalanceAllowance = allowance;
  },
  setUserExchangeBalance(state, balance) {
    state.userBalance = balance;
  },
  setUserExchangeCollateralSurplus(state, balance) {
    state.userSurplusBalance = balance;
  },
  setUnderlyingPrice(state, underlyingPrice) {
    state.underlyingPrice = underlyingPrice;
  },
  setOptionTokenAddress(state, optionTokenAddress) {
    state.optionTokenAddress = optionTokenAddress;
  },
  setUserOptions(state, options) {
    state.userOptions = options;
  },
  setPoolSymbols(state, poolSymbols) {
      state.availableLiquidityPools = poolSymbols;
  },
  setPoolSymbolsAddrsMap(state, poolSymbolsAddrsMap) {
    state.poolSymbolsAddrsMap = poolSymbolsAddrsMap;
  },
  setSelectedPool(state, poolSymbol) {
    state.selectedPool = poolSymbol;
  },
  setExchangeLiquidityPools(state, pools) {
    state.exchangeLiquidityPools = pools;
  },
  setUnderlyingsAvailable(state, data) {
    state.underlyingsAvailable = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
