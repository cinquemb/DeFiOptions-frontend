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

    <!------ Dex feed ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetTriAddressMap :data="setCreateDexFeed" />
        <span></span>
        <button @click="createDexFeed" class="btn btn-success">
          Create DEX TWAP Underlying Feed
        </button>
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
      <button @click="addAllowedCustomPoolLeverage" class="btn btn-success">
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
import SetTriAddressMap from '../components/manage/settings/SetTriAddressMap.vue';
import SetTokenRate from '../components/manage/settings/SetTokenRate.vue';
import SetAddressBoolable from '../components/manage/settings/SetAddressBoolable.vue';
import SetDexOracleTwapPeriod from '../components/manage/settings/SetDexOracleTwapPeriod.vue';
import SetUdlFeed from '../components/manage/settings/SetUdlFeed.vue';
import SetSwapPath from '../components/manage/settings/SetSwapPath.vue';
import Transfer from '../components/manage/settings/Transfer.vue';
import ProtocolSettingsProposalJSON from "../contracts/ProtocolSettingsProposal.json";


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
      setCreateDexFeed: {
        field_name1: "underlying",
        value1: null,
        field_name2: "stablecoin",
        value2: null,
        field_name3: "dex token pair",
        value3: null,
        desc: "Create DEX TWAP Underlying Feed (must contain a stablecoin used by the exchange)"
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
    SetTriAddressMap,
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
    ...mapGetters("protocolSettings", ["getProtocolSettingsContract", "getProtocolSettingsAbi","getDODAddress"]),
    ...mapGetters("proposalManager", ["getProposalManagerContract"]),
  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }

    this.$store.dispatch("protocolSettings/fetchContract");
    this.$store.dispatch("protocolSettings/storeAddress");
    this.$store.dispatch("protocolSettings/storeAbi");
    console.error(this.getDODAddress);
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
        desc: "Allow/Dissallow hedging manager addresss"
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
    validateUint(obj) {
      if (obj.value === null){
        return false;
      }

      return true;
    },
    validateRate(obj) {
      if (obj.value === null){
        return false;
      }

      if (obj.base === null){
        return false;
      }
      
      return true;
    },
    validateTokenRate(obj) {
      if (obj.token === null){
        return false;
      }

      if (obj.value === null){
        return false;
      }

      if (obj.base === null){
        return false;
      }
      
      return true;
    },
    validateUdlFeed(obj) {
      if (obj.addr === null){
        return false;
      }

      if (obj.value === null){
        return false;
      }
      
      return true;
    },
    validateAddressMap(obj) {
      if (obj.value1 === null){
        return false;
      }
      
      if (obj.value2 === null){
        return false;
      }

      return true;
    },
    validateTriAddressMap(obj) {
      if (obj.value1 === null){
        return false;
      }
      
      if (obj.value2 === null){
        return false;
      }

      if (obj.value3 === null){
        return false;
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


      /*    

        //single op
        function SetMinShareForProposal(uint s, uint b) external //SetRate.vue
        function SetDebtInterestRate(uint i, uint b) external//SetRate.vue
        function SetCreditInterestRate(uint i, uint b) external//SetRate.vue
        function SetProcessingFee(uint f, uint b) external//SetRate.vue
        function SetVolatilityPeriod(uint _volatilityPeriod) external //SetUint.vue
        function SetSwapRouterTolerance(uint r, uint b) external//SetRate.vue
        function SetSwapRouterInfo(address router, address token) external //SetAddressMap.vue
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

      let setCirculatingSupplyABI = component.getProtocolSettingsAbi[19];
      let setMinShareForProposalABI = component.getProtocolSettingsAbi[27];
      let setDebtInterestRateABI = component.getProtocolSettingsAbi[30];
      let setCreditInterestRateABI = component.getProtocolSettingsAbi[34];
      let setProcessingFeeABI = component.getProtocolSettingsAbi[36];
      let setVolatilityPeriodABI = component.getProtocolSettingsAbi[39];
      let setSwapRouterToleranceABI = component.getProtocolSettingsAbi[43];
      let setSwapRouterInfoABI = component.getProtocolSettingsAbi[41];
      let setBaseIncentivisationABI = component.getProtocolSettingsAbi[63];

      let setTokenRateABI = component.getProtocolSettingsAbi[21];
      let setAllowedTokenABI = component.getProtocolSettingsAbi[23];
      let setUdlFeedABI = component.getProtocolSettingsAbi[38];
      let setSwapPathABI = component.getProtocolSettingsAbi[45];
      let setPoolBuyCreditTradableABI = component.getProtocolSettingsAbi[51];
      let setPoolSellCreditTradableABI = component.getProtocolSettingsAbi[53];
      let setUdlIncentiveBlacklistABI = component.getProtocolSettingsAbi[55];
      let setDexAggIncentiveBlacklistABI = component.getProtocolSettingsAbi[57];
      let setDexOracleTwapPeriodABI = component.getProtocolSettingsAbi[59];
      let setUdlCollateralManagerABI = component.getProtocolSettingsAbi[61];
      let setAllowedHedgingManagerABI = component.getProtocolSettingsAbi[65];
      let setAllowedCustomPoolLeverageABI = component.getProtocolSettingsAbi[67];
      let transferBalanceABI = component.getProtocolSettingsAbi[47];
      let transferGovTokensABI = component.getProtocolSettingsAbi[48];

      let encodedData = [];


      //encode setCirculatingSupply first if exists
      if (component.validateUint(component.setCirculatingSupply)) {
        let parameters = [
          component.getWeb3.utils.toWei(component.setCirculatingSupply.value, "ether"), //1 to 100M
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setCirculatingSupplyABI, parameters)
        );
      }

      //encode setMinShareForProposal first if exists
      if (component.validateRate(component.setMinShareForProposal)) {
        let parameters = [
          Number(component.setMinShareForProposal.value),
          Number(component.setMinShareForProposal.base),
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setMinShareForProposalABI, parameters)
        );
      }

      //encode setDebtInterestRate first if exists
      if (component.validateRate(component.setDebtInterestRate)) {
        let parameters = [
          Number(component.setDebtInterestRate.value),
          Number(component.setDebtInterestRate.base),
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setDebtInterestRateABI, parameters)
        );
      }

      //encode setCreditInterestRate first if exists
      if (component.validateRate(component.setCreditInterestRate)) {
        let parameters = [
          Number(component.setCreditInterestRate.value),
          Number(component.setCreditInterestRate.base),
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setCreditInterestRateABI, parameters)
        );
      }


      //encode setProcessingFee first if exists
      if (component.validateRate(component.setProcessingFee)) {
        let parameters = [
          Number(component.setProcessingFee.value),
          Number(component.setProcessingFee.base),
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setProcessingFeeABI, parameters)
        );
      }

      //encode setVolatilityPeriod first if exists
      if (component.validateUint(component.setVolatilityPeriod)) {
        let parameters = [
          Number(component.setVolatilityPeriod.value), //number of days 1 <, default is 90?
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setVolatilityPeriodABI, parameters)
        );
      }

      //encode setSwapRouterTolerance first if exists, TODO, NEED TO CHECK DECIMALS?
      if (component.validateRate(component.setSwapRouterTolerance)) {
        let parameters = [
          Number(component.setSwapRouterTolerance.value),
          Number(component.setSwapRouterTolerance.base),
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setSwapRouterToleranceABI, parameters)
        );
      }

      //encode setSwapRouterInfo first if exists
      if (component.validateAddressMap(component.setSwapRouterInfo)) {
        let parameters = [
          component.setParams.value1,
          component.setParams.value2,
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setSwapRouterInfoABI, parameters)
        );
      }

      //encode setBaseIncentivisation first if exists
      if (component.validateUint(component.setBaseIncentivisation)) {
        let parameters = [
          Number(Number(component.setBaseIncentivisation.value) * (10** 18)), //in dollars, greater than 0
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setBaseIncentivisationABI, parameters)
        );
      }

      /* MULTI ALLOWED AT ONCE */

      //encode all setTokenRates
      if (component.validateObj(component.setTokenRates)) {
        for(let i=0; i<component.setTokenRates.length; i++) {
          if (component.validateTokenRate(component.setTokenRates[i])) {
            let parameters = [
              component.setTokenRates[i].token,
              Number(component.setTokenRates[i].value),
              Number(component.setTokenRates[i].base),
            ];
            encodedData.push(
              component.getWeb3.eth.abi.encodeFunctionCall(setTokenRateABI, parameters)
            );
          }
        }
      }

      //encode all setAllowedTokens
      if (component.validateObj(component.setAllowedTokens)) {
        for(let i=0; i<component.setAllowedTokens.length; i++) {
          if (component.validateTokenRate(component.setAllowedTokens[i])) {
            let parameters = [
              component.setAllowedTokens[i].token,
              Number(component.setAllowedTokens[i].value),
              parseInt(10**(18 - Number(component.setAllowedTokens[i].base))),
            ];
            encodedData.push(
              component.getWeb3.eth.abi.encodeFunctionCall(setAllowedTokenABI, parameters)
            );
          }
        }
      }

      //encode all setUdlFeeds
      if (component.validateObj(component.setUdlFeeds)) {
        for(let i=0; i<component.setUdlFeeds.length; i++) {
          if (component.validateUdlFeed(component.setUdlFeeds[i])) {
            let parameters = [
              component.setUdlFeeds[i].addr, 
              Number(component.setUdlFeeds[i].value),
            ];
            encodedData.push(
              component.getWeb3.eth.abi.encodeFunctionCall(setUdlFeedABI, parameters)
            );
          }
        }
      }

      //encode all setSwapPaths
      if (component.validateObj(component.setSwapPaths)) {
        for(let i=0; i<component.setSwapPaths.length; i++) {
          let parameters = [
            component.setSwapPaths[i].from, 
            component.setSwapPaths[i].to, 
            component.setSwapPaths[i].path
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setSwapPathABI, parameters)
          );
        }
      }


      //encode all setPoolBuyCreditTradables
      if (component.validateObj(component.setPoolBuyCreditTradables)) {
        for(let i=0; i<component.setPoolBuyCreditTradables.length; i++) {
          let parameters = [
            component.setPoolBuyCreditTradables[i].addr, 
            Number(component.setPoolBuyCreditTradables[i].bool)
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setPoolBuyCreditTradableABI, parameters)
          );
        }
      }

      //encode all setPoolSellCreditTradables
      if (component.validateObj(component.setPoolSellCreditTradables)) {
        for(let i=0; i<component.setPoolSellCreditTradables.length; i++) {
          let parameters = [
            component.setPoolSellCreditTradables[i].addr, 
            Number(component.setPoolSellCreditTradables[i].bool)
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setPoolSellCreditTradableABI, parameters)
          );
        }
      }

      //encode all setUdlIncentiveBlacklists
      if (component.validateObj(component.setUdlIncentiveBlacklists)) {
        for(let i=0; i<component.setUdlIncentiveBlacklists.length; i++) {
          let parameters = [
            component.setUdlIncentiveBlacklists[i].addr, 
            Number(component.setUdlIncentiveBlacklists[i].bool)
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setUdlIncentiveBlacklistABI, parameters)
          );
        }
      }

      //encode all setDexAggIncentiveBlacklists
      if (component.validateObj(component.setDexAggIncentiveBlacklists)) {
        for(let i=0; i<component.setDexAggIncentiveBlacklists.length; i++) {
          let parameters = [
            component.setDexAggIncentiveBlacklists[i].addr, 
            Number(component.setDexAggIncentiveBlacklists[i].bool)
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setDexAggIncentiveBlacklistABI, parameters)
          );
        }
      }

      //encode all setDexOracleTwapPeriods
      if (component.validateObj(component.setDexOracleTwapPeriods)) {
        for(let i=0; i<component.setDexOracleTwapPeriods.length; i++) {
          let parameters = [
            component.setDexOracleTwapPeriods[i].dexOracleAddress, 
            Number(component.setDexOracleTwapPeriods[i].twapPeriod)
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setDexOracleTwapPeriodABI, parameters)
          );
        }
      }

      //encode all setUdlCollateralManagers
      if (component.validateObj(component.setUdlCollateralManagers)) {
        for(let i=0; i<component.setUdlCollateralManagers.length; i++) {
          let parameters = [
            component.setUdlCollateralManagers[i].addr, 
            Number(component.setUdlCollateralManagers[i].bool)
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setUdlCollateralManagerABI, parameters)
          );
        }
      }

      //encode all setAllowedHedgingManagers
      if (component.validateObj(component.setAllowedHedgingManagers)) {
        for(let i=0; i<component.setAllowedHedgingManagers.length; i++) {
          let parameters = [
            component.setUdlCollateralManagers[i].addr, 
            Number(component.setAllowedHedgingManagers[i].bool)
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setAllowedHedgingManagerABI, parameters)
          );
        }
      }

      //encode all setAllowedCustomPoolLeverages
      if (component.validateObj(component.setAllowedCustomPoolLeverages)) {
        for(let i=0; i<component.setAllowedCustomPoolLeverages.length; i++) {
          let parameters = [
            component.setAllowedCustomPoolLeverages[i].addr, 
            Number(component.setAllowedCustomPoolLeverages[i].bool)
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setAllowedCustomPoolLeverageABI, parameters)
          );
        }
      }

      //encode all transferBalances
      if (component.validateObj(component.transferBalances)) {
        for(let i=0; i<component.transferBalances.length; i++) {
          let parameters = [
            component.transferBalances[i].to,
            Number(Number(component.transferBalances[i].amount) * (10**18)) //price * 10 ** 18
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(transferBalanceABI, parameters)
          );
        }
      }

      //encode all transferGovTokens
      if (component.validateObj(component.transferGovTokens)) {
        for(let i=0; i<component.transferGovTokens.length; i++) {
          let parameters = [
            component.transferGovTokens[i].to,
            Number(Number(component.transferGovTokens[i].amount) * (10**18)) //price * 10 ** 18
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(transferGovTokensABI, parameters)
          );
        }
      }


      // deploy proposal contract
      const protocolSettingsProposalContract = new component.getWeb3.eth.Contract(ProtocolSettingsProposalJSON.abi);
        
      const deployProtocolSettingsProposal = await protocolSettingsProposalContract.deploy({
        data: ProtocolSettingsProposalJSON.bytecode
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
          component.$toast.success("Initializing the proposal was successfull. You will be promted to save the DOD proposal transaction(s) now.");
          
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

      await deployProtocolSettingsProposal.methods.setExecutionBytes(
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
        deployProtocolSettingsProposal.options.address,
        component.getDODAddress,
        1, //enum Quorum { SIMPLE_MAJORITY, TWO_THIRDS, QUADRATIC } 0,1,2
        0, //enum VoteType {PROTOCOL_SETTINGS, POOL_SETTINGS, ORACLE_SETTINGS} 0,1,2
        Number(Math.floor(Date.now() / 1000) + (60 * 60 * 48)) //48h to vote
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
          component.$toast.success("Register the proposal transactions was successfull. You can now vote on the proposal in the \"Govern DOD\" page.");
          
        } else {
          component.$toast.error("The register proposal tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },
    async createDexFeed () {
      //function createDexFeed(address underlying, address stable, address dexTokenPair) external returns (address) 
      let component = this;
      component.loading = true;

      if (component.validateTriAddressMap(component.setCreateDexFeed)) {
        await component.getExchangeContract.methods.createDexFeed(
          component.setCreateDexFeed.value1,
          component.setCreateDexFeed.value2,
          component.setCreateDexFeed.value3
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
            component.$toast.success("Creating DEX TWAP Underlying feed was successfull.");
            
          } else {
            component.$toast.error("createDexFeed tx has failed. Please contact the DeFi Options support.");
          }
          component.loading = false;

        }).on('error', function(error){
          console.log(error);
          component.loading = false;
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });
      } else {
        component.loading = false;
      }
    }
  }
}
</script>
