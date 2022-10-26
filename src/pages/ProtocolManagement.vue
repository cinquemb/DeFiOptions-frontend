<template>
  <div>
    <!------ Setting circulating supply ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetUint :data="setCirculatingSupply" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Min DOD needed for proposal------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetRate :data="setMinShareForProposal" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Debt interest ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetRate :data="setDebtInterestRate" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Credit token interest ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetRate :data="setCreditInterestRate" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Processing Fee ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetRate :data="setProcessingFee" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Volitility period ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetRate :data="setVolatilityPeriod" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Slippage for liquidation swaps ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetRate :data="setSwapRouterTolerance" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Swap info ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetAddressMap :data="setSwapRouterInfo" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Incentives ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetUint :data="setBaseIncentivisation" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Modify existing stablecoin token rates (if they have changed) ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="rate in setTokenRates" v-bind:key="rate.token">
          <SetTokenRate :data="rate" />
        </div>
        <span></span>
      </div>
      <button @click="addTokenRate" class="btn btn-success">
        Edit aditional allowed stablcoin
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Add allowed stablecoins to exchange------>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="rate in setAllowedTokens" v-bind:key="rate.token">
          <SetTokenRate :data="rate" />
        </div>
        <span></span>
      </div>
      <button @click="addAllowedToken" class="btn btn-success">
        Add New Stablecoin to exchange
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Add/modify underlying feed------>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="udlfeed in setUdlFeeds" v-bind:key="udlfeed.addr">
          <SetUdlFeed :data="udlfeed" />
        </div>
        <span></span>
      </div>
      <button @click="addUdlFeed" class="btn btn-success">
        Add/Modify Underlying Feed to exchange
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Add/modify swap path------>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="path in setSwapPaths" v-bind:key="path.from">
          <SetSwapPath :data="path" />
        </div>
        <span></span>
      </div>
      <button @click="addSwapPath" class="btn btn-success">
        Add/Modify swap path of underlying token (for liquidations)
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Add/modify what pools are allowed to buy options on exchange credit------>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="pool in setPoolBuyCreditTradables" v-bind:key="pool.addr">
          <SetAddressBoolable :data="pool" />
        </div>
        <span></span>
      </div>
      <button @click="addPoolBuyCreditTradable" class="btn btn-success">
        Add/Modify ability for pool to buy options on exchange credit
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Add/modify what pools are allowed to sell options on exchange credit------>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="pool in setPoolSellCreditTradables" v-bind:key="pool.addr">
          <SetAddressBoolable :data="pool" />
        </div>
        <span></span>
      </div>
      <button @click="addPoolSellCreditTradable" class="btn btn-success">
        Add/Modify ability for pool to sell options on exchange credit
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Add/modify what chanlink feeds are incentivized ------>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="feed in setUdlIncentiveBlacklists" v-bind:key="feed.addr">
          <SetAddressBoolable :data="feed" />
        </div>
        <span></span>
      </div>
      <button @click="addUdlIncentiveBlacklist" class="btn btn-success">
        Add/Modify ability for chainlink underlying feed to have incentives
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Add/modify what pools are allowed to sell options on exchange credit------>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="dexFeed in setDexAggIncentiveBlacklists" v-bind:key="dexFeed.addr">
          <SetAddressBoolable :data="dexFeed" />
        </div>
        <span></span>
      </div>
      <button @click="addDexAggIncentiveBlacklist" class="btn btn-success">
        Add/Modify ability for dex based underlying feed to have incentives
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Add/modify a dex oralces twap period----->


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="dexOracle in setDexOracleTwapPeriods" v-bind:key="dexOracle.addr">
          <SetDexOracleTwapPeriod :data="dexOracle" />
        </div>
        <span></span>
      </div>
      <button @click="addDexOracleTwapPeriod" class="btn btn-success">
        Add/Modify Dex Oracle TWAP Period
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ udl collateral manager info ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="udlCtlmngrMap in setUdlCollateralManagers" v-bind:key="udlCtlmngrMap.value1">
          <SetAddressMap :data="udlCtlmngrMap" />
        </div>
        <span></span>
        <button @click="addUdlCollateralManager" class="btn btn-success">
        Map (Dex) Underlying Feed to Collateral Manager
      </button>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Add/modify what pools are allowed to sell options on exchange credit ------>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="hdgMngr in setAllowedHedgingManagers" v-bind:key="hdgMngr.addr">
          <SetAddressBoolable :data="hdgMngr" />
        </div>
        <span></span>
      </div>
      <button @click="addAllowedHedgingManager" class="btn btn-success">
        Add/Modify allowed hedging manager contracts
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Add/modify what pools are allowed to sell options on exchange credit------>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="poolLeverage in setAllowedCustomPoolLeverages" v-bind:key="poolLeverage.addr">
          <SetAddressBoolable :data="poolLeverage" />
        </div>
        <span></span>
      </div>
      <button @click="addDexAggIncentiveBlacklist" class="btn btn-success">
        Add/Modify ability for liquidity pools to set their own leverage
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Transfer DAO exchange balance ------>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="transfer in transferBalances" v-bind:key="transfer.to">
          <Transfer :data="transfer" />
        </div>
        <span></span>
      </div>
      <button @click="addTransfer" class="btn btn-success">
        Add exchange balance transfer operation from DAO
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Transefer DAO DOD balance ------>


    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <div v-for="transferGov in transferGovTokens" v-bind:key="transferGov.to">
          <Transfer :data="transferGov" />
        </div>
        <span></span>
      </div>
      <button @click="addTransferGov" class="btn btn-success">
        Add DOD balance transfer operation from DAO
      </button>
    </div>
    <span></span>
    <span></span>

    <button @click="createProposal" class="btn btn-success">
      <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Create and Register Proposal
    </button>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SetUint from '../components/manage/settings/SetUint.vue';
import SetRate from '../components/manage/settings/SetRate.vue';
import SetAddressMap from '../components/manage/settings/SetAddressMap.vue';
import SetTokenRate from '../components/manage/settings/SetTokenRate.vue';
import SetAddressBoolable from '../components/manage/settings/SetAddressBoolable.vue';
import SetDexOracleTwapPeriod from '../components/manage/settings/SetDexOracleTwapPeriod.vue';
import SetUdlFeed from '../components/manage/settings/SetUdlFeed.vue';
import SetSwapPath from '../components/manage/settings/SetSwapPath.vue';
import Transfer from '../components/manage/settings/Transfer.vue';
import ProtocolSettingsProposalJSON from "../contracts/ProtocolSettingsProposal.json";


/*    

    //single op
    function SetCirculatingSupply(uint supply) external //SetUint.vue
    function SetMinShareForProposal(uint s, uint b) external //SetRate.vue
    function SetDebtInterestRate(uint i, uint b) external//SetRate.vue
    function SetCreditInterestRate(uint i, uint b) external//SetRate.vue
    function SetProcessingFee(uint f, uint b) external//SetRate.vue
    function SetVolatilityPeriod(uint _volatilityPeriod) external //SetUint.vue
    function SetSwapRouterTolerance(uint r, uint b) external//SetRate.vue
    function (address router, address token) external //SetAddressMap.vue
    function SetBaseIncentivisation(uint amount) external //SetUint.vue


    //multi op
    function SetTokenRate(address token, uint v, uint b) external//SetTokenRate.vue
    function SetAllowedToken(address token, uint v, uint b) external//SetTokenRate.vue
    function SetUdlFeed(address addr, int v) external //SetUdlFeed.vue
    function SetSwapPath(address from, address to, address[] calldata path) external //SetSwapPath.vue
    function SetPoolBuyCreditTradable(address poolAddress, bool isTradable) external//SetAddressBoolable.vue
    function SetPoolSellCreditTradable(address poolAddress, bool isTradable) external//SetAddressBoolable.vue
    function SetUdlIncentiveBlacklist(address udlAddr, bool isIncentivizable) external//SetAddressBoolable.vue
    function SetDexAggIncentiveBlacklist(address dexAggAddress, bool isIncentivizable) external//SetAddressBoolable.vue
    function SetDexOracleTwapPeriod(address dexOracleAddress, uint256 _twapPeriod) external//SetDexOracleTwapPeriod.vue
    function SetUdlCollateralManager(address udlFeed, address ctlMngr) external //SetAddressMap.vue
    function SetAllowedHedgingManager(address hedgeMngr, bool val) external//SetAddressBoolable.vue
    function SetAllowedCustomPoolLeverage(address poolAddr, bool val) external//SetAddressBoolable.vue
    function TransferBalance(address to, uint amount) external//Transfer.vue
    function TransferGovTokens(address to, uint amount) external//Transfer.vue


*/
export default {
  name: 'ProtocolSettingsManagement',
  data() {
    return {
      loading: false,
      setCirculatingSupply: {
        field_name: "supply",
        value: null,
        desc: "Circulating supply of DOD"
      },
      setMinShareForProposal: {
        base: null,
        value: null,
        desc: "Min % needed to make DOD governance proposal"
      },
      setDebtInterestRate: {
        base: null,
        value: null,
        desc: "Interest rate on any DOD debt incured"
      },
      setCreditInterestRate: {
        base: null,
        value: null,
        desc: "Interest rate on any DOD credit tokens issued  (and redeemed)"
      },
      setProcessingFee: {
        base: null,
        value: null,
        desc: "How much to charge for settlement of options and swaps"
      },
      setVolatilityPeriod: {
        name: "volatilityPeriod",
        value: null,
        desc: "The default number of days to look back to calculate volitility"
      },
      setSwapRouterTolerance: {
        base: null,
        value: null,
        desc: "Amount of slippage to incur during dex liquidation"
      },
      setSwapRouterInfo: {
        field_name1: "router",
        value1: null,
        field_name2: "token",
        value2: null,
        desc: "Router address to be used with token address"
      },
      setBaseIncentivisation: {
        name: "amount",
        value: null,
        desc: "How much to credit protocol actions that are incentivized directly"
      },
      setTokenRates: [], //gov
      setAllowedTokens: [],//gov
      setUdlFeeds: [],//non gov
      setSwapPaths: [], //gov
      setPoolBuyCreditTradables: [], //gov
      setPoolSellCreditTradables: [], //gov
      setUdlIncentiveBlacklists: [], //gov
      setDexAggIncentiveBlacklists: [], //gov
      setDexOracleTwapPeriods: [], //gov
      setUdlCollateralManagers: [], //gov
      setAllowedHedgingManagers: [], //gov
      setAllowedCustomPoolLeverages: [], //gov
      transferBalances: [], //gov
      transferGovTokens: []
    }
  },
  components: {
    SetUint,
    SetRate,
    SetAddressMap,
    SetTokenRate,
    SetAddressBoolable,
    SetDexOracleTwapPeriod,
    SetUdlFeed,
    SetSwapPath,
    Transfer,
  },
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("optionsExchange", ["getOptionsExchangeContract","getLiquidityPoolBalance", "getSelectedPool"]),
    ...mapGetters("liquidityPool", ["getLiquidityPoolContract", "getLiquidityPoolAbi","getApy", "getUserPoolUsdValue", "getSelectedPoolAddress"]),
    ...mapGetters("proposalManager", ["getProposalManagerContract"]),
  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }

  },

  methods: {
    addTokenRate: function () {
      this.setTokenRates.push({
        token: null,
        value: null,
        base: null,
      });
    }, //gov
    addAllowedToken: function () {
      this.setAllowedTokens.push({
        token: null,
        value: null,
        base: null,
      });
    },//gov
    addUdlFeed: function () {
      this.setUdlFeeds.push({
        addr: null,
        value: null
      });
    },//non gov
    addSwapPath: function () {
      this.setSwapPaths.push({
        from: null,
        to: null,
        path: [],
      });
    }, //gov
    addPoolBuyCreditTradable: function () {
      this.setPoolBuyCreditTradables.push({
        addr: null,
        bool: null,
        desc: "Allow/Dissallow pool to buy options on exchange credit"
      });
    }, //gov
    addPoolSellCreditTradable: function () {
      this.setPoolSellCreditTradables.push({
        addr: null,
        bool: null,
        desc: "Allow/dissallow pool to sell options on exchange credit"
      });
    }, //gov
    addUdlIncentiveBlacklist: function () {
      this.setUdlIncentiveBlacklists.push({
        addr: null,
        bool: null,
        desc: "Allow/Dissallow chainlink based underlying feed management to be incentivized"
      });
    }, //gov
    addDexAggIncentiveBlacklist: function () {
      this.setDexAggIncentiveBlacklists.push({
        addr: null,
        bool: null,
        desc: "Allow/Dissallow dex underlying feed management to be incentivized"
      });
    }, //gov
    addDexOracleTwapPeriod: function () {
      this.setDexOracleTwapPeriods.push({
        dexOracleAddress: null,//toggle from avaiable options in pool
        twapPeriod: null,//between 1 hour and 24 hours in seconds
      });
    }, //gov
    addUdlCollateralManager: function () {
      this.setUdlCollateralManagers.push({
        field_name1: "Underlying Feed Address",
        value1: null,
        field_name2: "Collateral Manager Addr",
        value2: null,
        desc: "underlying Feeed address to be used with collateral manager address"
      });
    }, //gov
    addAllowedHedgingManager: function () {
      this.setAllowedHedgingManagers.push({
        addr: null,
        bool: null,
        desc: "Allow/Dissallow hedging manager addresss
      });
    }, //gov
    addAllowedCustomPoolLeverage: function () {
      this.setAllowedCustomPoolLeverages.push({
        addr: null,
        bool: null,
        desc: "Allow/Dissallow liquidity pool to have custom leverage factor for hedging"
      });
    }, //gov
    addTransfer: function () {
      this.transferBalances.push({
        to: null,//toggle from avaiable options in pool
        amount: null,//toggle button from: none, buy, sell
      });
    }, //gov
    addTransferGov: function () {
      this.transferGovTokens.push({
        to: null,//toggle from avaiable options in pool
        amount: null,//toggle button from: none, buy, sell
      });
    },
    validateSingle() {
      for (const key in this.setParams) {
        if (this.setParams[key] === null) {
          return false;
        }
      }

      return true;
    },
    validateObj(obj) {
      if (obj.length == 0)
        return false;

      for (let i =0; i < obj.length; i++) {
        for (const key in obj[i]) {
          if (key === "desc") {
            continue;
          }
          if (obj[i][key] === null) {
            return false;
          }
        }
      }

      return true;
    },
    async createProposal () {
      let component = this;
      component.loading = true;

      let addSymbolAbiJSON = component.getLiquidityPoolAbi[31];
      let setRangeAbiJSON = component.getLiquidityPoolAbi[33];
      let setParametersAbiJSON = component.getLiquidityPoolAbi[26];

      let encodedData = [];

      //encode setParameters first if exists
      if (component.validateSetParameters()) {
        let parameters = [
          Number(Number(component.setParams.reserveRatio) * (10** 7)), //5 * (10**7) == 5%, 0 to 100
          Number(Number(component.setParams.withdrawFee) * (10 **7)), //1 * (10**7) == 1%, 0 to 100
          Number(component.setParams.maturity) ,  //Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 10) //10 years
          Number(component.setParams.leverageMultiplier), // 15, 1 to 30
          component.setParams.hedgingManagerAddress// 0x3d8E35BB6FdBEBFAefb1674b5B717aa946b85191
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setParametersAbiJSON, parameters)
        );
      }

      //encode all addSymbols
      if (component.validateObj(component.addSymbols)) {
        for(let i=0; i<component.addSymbols.length; i++) {
          let parameters = [
            component.addSymbols.udlFeed, 
            Number(Number(component.addSymbols.strike) * (10 ** 18)),//strike * (10**EXCHG['decimals'])
            component.addSymbols.maturity, //unix timestamp format
            component.optTypes[component.addSymbols.optionType], //0 if optionType == 'CALL' else 1
            Number(component.addSymbols.t0), // unix timestamp format
            Number(component.addSymbols.t1), //unix timestamp format
            component.addSymbols.x.map(val => Number(Number(val) * (10 ** 18))),// x * (10**EXCHG['decimals'])
            component.addSymbols.y.map(val => Number(Number(val) * (10 ** 18))),// y * (10**EXCHG['decimals'])
            [
              Number(Number(component.addSymbols.bsStockSpread[0] * (10 ** 18))),
              Number(Number(component.addSymbols.bsStockSpread[1] * (10 ** 18))),
              Number(Number(component.addSymbols.bsStockSpread[2] * (10 ** 7)))
            ]//[buyStock * (10**EXCHG['decimals']),sellStock * (10**EXCHG['decimals']), spreadPercent * (10**7)]

          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(addSymbolAbiJSON, parameters)
          );
        }
      }

      //encode all setRanges
      if (component.validateObj(component.setRanges)) {
        for(let i=0; i<component.setRanges.length; i++) {
          let parameters = [
            component.setRanges.symbol, 
            component.marketOpTypes[component.setRanges.op], //    enum Operation { NONE, BUY, SELL } == 0, 1, 2 respectively
            Number(Number(component.setRanges.start) * (10**18)), //price * 10 ** 18
            Number(Number(component.setRanges.end) * (10**18)) //price * 10 ** 18
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setRangeAbiJSON, parameters)
          );
        }
      }

      // deploy proposal contract
      //let loadedPoolManagementProposalJSON = JSON.parse(PoolManagementProposalJSON);
      const poolManagmentProposalContract = new component.getWeb3.eth.Contract(PoolManagementProposalJSON.abi);
        
      const deployPoolManagmentProposal = await poolManagmentProposalContract.deploy({
        data: PoolManagementProposalJSON.bytecode
      }).send({
        from: component.getActiveAccount,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null

      }).on('transactionHash', function(hash){
        console.log("tx hash: " + hash);
        component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");

      }).on('receipt', function(receipt){
        console.log(receipt);

        if (receipt.status) {
          component.$toast.success("Initializing the proposal was successfull. You will be promted to save the pool proposal transactions now.");
          
        } else {
          component.$toast.error("The initializing proposal transaction has failed. Please contact the DeFi Options support.");
        }
        
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });

      // save execution strings to proposal contract

      await deployPoolManagmentProposal.methods.setExecutionBytes(
        encodedData
      ).send({
        from: component.getActiveAccount,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      }).on('transactionHash', function(hash){
        console.log("tx hash: " + hash);
        component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");
      }).on('receipt', function(receipt){
        console.log(receipt);
        if (receipt.status) {
          component.$toast.success("Storing the proposal transactions was successfull. You will be promted to register the proposal");
          
        } else {
          component.$toast.error("The storing proposal transactions tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
      

      //register proposal contract with proposal manager (and choosing the params for such)
      await component.getProposalManagerContract.methods.registerProposal(
        deployPoolManagmentProposal.options.address,
        component.getSelectedPoolAddress,
        2, //enum Quorum { SIMPLE_MAJORITY, TWO_THIRDS, QUADRATIC } 0,1,2
        1, //enum VoteType {PROTOCOL_SETTINGS, POOL_SETTINGS, ORACLE_SETTINGS} 0,1,2
        Number(Math.floor(Date.now() / 1000) + (60 * 60)) //30 min to vote
      ).send({
        from: component.getActiveAccount,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      }).on('transactionHash', function(hash){
        console.log("tx hash: " + hash);
        component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");
      }).on('receipt', function(receipt){
        console.log(receipt);
        if (receipt.status) {
          component.$toast.success("Register the proposal transactions was successfull. You can now vote on the proposal in the pool governance page.");
          
        } else {
          component.$toast.error("The register proposal tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });

    }
  }
}
</script>
