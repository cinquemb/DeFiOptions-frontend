<template>
  <div class="pool-management-body-text-color">

    <h1> Current Pool: ({{getSelectedPoolAddress.substring(0, 6)}}...{{getSelectedPoolAddress.substring(38, 42)}})</h1>

    <MyOptions :getUserOptions="getPoolOptions" class="mb-5" :isPoolExposure="true" />


    <react :component="OptViz" :underlyingData="OptVizData" @onChange="handleOptVizEvent" :loading="loading" class="section-big row mt-4 mx-3"/>


    <!------ create hedging manager ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <button @click="createHedgingManager" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Create Hedging Manager (GMX-like)
        </button>

        <button @click="createD8xHedgingManager" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Create Hedging Manager (D8X-like)
        </button>

      </div>
    </div>
    <span></span>
    <span></span>

    

    <!------ transfer excess stables in hedging manager ------>

    <div class="section-big row mt-4 mx-3" v-if="isHedgingManagerReady">
      <div class="col-md-12">
        <SetAddress :data="TransferTokensToCreditProvider" />
        <span></span>
        <button @click="transferTokensToCreditProvider" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Settle Hedging Manager Token Balance (Total Stablecoins Holding: ${{ totalStableBalance }})
        </button>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ balance pool exposure ------>

    <div class="section-big row mt-4 mx-3" v-if="isHedgingManagerReady">
      <div class="col-md-12">
        <SetAddress :data="BalanceExposure" />
        <span></span>
          <button @click="balanceExposure" class="btn btn-success m-1">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Manually Balance Pool Options Exposure
          </button>
          <button @click="syncHedgingManagerStats" class="btn btn-success m-1">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Update Hedging Manager Stats
          </button>
      </div>
    </div>
    <div class="section-big row mt-4 mx-3" v-if="isHedgingManagerReady">
      <div class="col-md-12">
        <h3>Ideal Exposure</h3>
        {{this.idealExpo}}
        <span></span>
        <h3>Curent Exposure</h3>
        {{this.realExpo}}
      </div>
    </div>

    
    <span></span>
    <span></span>

    <!------ Adding/modifying pool paramters ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetParams :params="setParams" />
        <span></span>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Create option in exchnage ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <CreateOption :options="createOptions" />
        <span></span>
      </div>
      <div class="flex flex-col gap-2">
        <button @click="addOption" class="btn btn-success">
          Add More Options To Exchange
        </button>
        <button @click="createSymbols" class="btn btn-success">
          Submit New Options
        </button>
        <button @click="createSymbolsBulk" class="btn btn-success">
          Submit New Options (Bulk)
        </button>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ Adding/modifying symbols ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <AddSymbol :symbols="addSymbols" />
        <span></span>
      </div>
      <button @click="addSymbol" class="btn btn-success">
        Add/Modify Symbol (GOV REQUIRED)
      </button>
    </div>

    <span></span>
    <span></span>


    <!------ Adding/modifying tradeable price ranges ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetRange :ranges="setRanges" />
        <span></span>
      </div>
      <button @click="addRange" class="btn btn-success">
        Add/Modify Range (GOV REQUIRED)
      </button>
    </div>
    <span></span>
    <span></span>

    <!------ Remove symbol from pool (if expired) ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <RemoveSymbol :symbols="removeSymbols" />
        <span></span>
      </div>
      <button @click="removeSymbol" class="btn btn-success">
        Remove Symbol
      </button>
    </div>

    <div class="pool-submit-buttons">
      <button @click="createExecuteFastProposal" class="btn btn-success disabled">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Create + Register + Vote + Execute Proposal (1 tx)
      </button>
    </div>

    <div class="pool-submit-buttons">
      <button @click="createExecuteProposal" class="btn btn-success">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Create and Register Proposal (FAST, 1 tx + gov tx's)
      </button>
    </div>
    
    <div class="pool-submit-buttons">
      <button @click="createProposal" class="btn btn-success">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Create and Register Proposal (SLOW, 3 tx's + gov tx's)
      </button>
    </div>

    <div class="pool-submit-buttons">
      <div class="form-button-mobile">
        <div class="btn-group" aria-describedby="button-text">
          <button type="button" class="btn btn-outline-success dropdown-toggle text-uppercase" data-bs-toggle="dropdown" aria-expanded="false">
            {{depositWith}}
          </button>
          <ul class="dropdown-menu">
            <li>
              <span class="dropdown-item text-uppercase" @click="setDepositWith('DAI')">DAI</span>
              <span class="dropdown-item text-uppercase" @click="setDepositWith('USDC')">USDC</span>
            </li>
          </ul>
        </div>

        <div class="show-text form-text">
          Balance: {{Number(getUserStablecoinBalance).toFixed(2)}} {{depositWith}}.
        </div>
      </div>

      <button @click="approveStablecoinDeposit" class="btn btn-success">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Approve FPM Contract For Synthetic Limit Orders
      </button>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddSymbol from '../components/manage/AddSymbol.vue';
import SetRange from '../components/manage/SetRange.vue';
import SetParams from '../components/manage/SetParams.vue';
import SetAddress from '../components/manage/exchange/SetAddress.vue';
import CreateOption from '../components/manage/CreateOption.vue';
import RemoveSymbol from '../components/manage/RemoveSymbol.vue';
import MyOptions from '../components/portfolio/MyOptions.vue';

import { ReactWrapper } from 'vuera';
//import { ReactInVue } from 'vuera';
import App from '../components/react/App/App';

import PoolManagementProposalJSON from "../contracts/PoolManagementProposal.json";
import FastPoolManagementJSON from "../contracts/FastPoolManagement.json";
import BaseHedgingManagerJSON from "../contracts/BaseHedgingManager.json";
import MetavaultHedgingManagerFactoryJSON from "../contracts/MetavaultHedgingManagerFactory.json";
import ChainlinkContractJson from "../contracts/ChainlinkFeed.json";
import addresses from "../contracts/addresses.json";
import bs from 'black-scholes';


export default {
  name: 'PoolManagement',
  data() {
    return {
      depositWith: "DAI",
      OptViz: App,
      syntheticLimitOrder: {},
      OptVizData: {},
      pairs: {},
      totalStableBalance: null,
      idealExpo: {},
      realExpo: {},
      optTypes: {
        "CALL" : 0,
        "PUT": 1
      },
      marketOpTypes: {
        "NONE": 0,
        "BUY": 1,
        "SELL":2
      },
      TransferTokensToCreditProvider: {
        addr: null,
        desc: "If there are tokens in hedging contract left over from hedging, this will pay them back to the DAO (token address)"
      },
      BalanceExposure: {
        addr: null,
        desc: "Manually Hedge Pool for UnderlyingFeed Exposure"
      },
      loading: false,
      setParams: { //gov
        reserveRatio: null, //slider as a percentage
        withdrawFee: null, //slider as a percentage
        maturity: null, //datetime picker
        leverageMultiplier: null, //slider from 1-30? or manual with validation
        hedgingManagerAddress: null, //toggle from hdeging manager addresses hardcoded in ui?
        hedgingNotionalThreshold:  null, //silder of dollar amount?
      },
      setRanges: [], //gov
      addSymbols: [],//gov
      removeSymbols: [],//non gov
      createOptions: []//non gov
    }
  },
  components: {
    AddSymbol,
    SetAddress,
    SetRange,
    SetParams,
    CreateOption,
    RemoveSymbol,
    MyOptions,
    'react': ReactWrapper,
    //'OptViz': ReactInVue(App),
  },
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainId", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("optionsExchange", ["getOptionsExchangeContract","getOptionsExchangeAbi", "getLiquidityPoolBalance", "getSelectedPool", "getUnderlyingsAvailable", "getPoolOptions"]),
    ...mapGetters("liquidityPool", ["getLiquidityPoolContract", "getLiquidityPoolAbi","getApy", "getUserPoolUsdValue", "getSelectedPoolAddress", "getSymbolsListJson"]),
    ...mapGetters("proposalManager", ["getProposalManagerContract", "getProposalManagerAddress", "getFastPoolManagementAddress"]),
    ...mapGetters("dai", ["getUserDaiBalance", "getDaiContract"]),
    ...mapGetters("usdc", ["getUserUsdcBalance", "getUsdcContract"]),

    getUserStablecoinBalance() {
      if (this.depositWith === "DAI") {
        return this.getUserDaiBalance;
      } else if (this.depositWith === "USDC") {
        return this.getUserUsdcBalance;
      } /*

      else if (this.depositWith === "Exchange Surplus Balance") {
        return this.getUserCollateralSurplus;
      }
      */

      return null;
    },
  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }

    this.$store.dispatch("optionsExchange/fetchContract");
    this.$store.dispatch("liquidityPool/fetchContract");
    this.$store.dispatch("proposalManager/fetchContract");
    this.$store.dispatch("dai/fetchContract");
    this.$store.dispatch("usdc/fetchContract");
    this.$store.dispatch("creditToken/fetchContract");
    this.$store.dispatch("optionsExchange/fetchLiquidityPools");
    this.$store.dispatch("liquidityPool/fetchUserBalance");
    this.$store.dispatch("liquidityPool/storeAddress");
    this.$store.dispatch("dai/fetchUserBalance");
    this.$store.dispatch("usdc/fetchUserBalance");
    this.$store.dispatch("creditToken/fetchUserBalance");
    this.$store.dispatch("accounts/fetchActiveBalance");
    this.$store.dispatch("liquidityPool/fetchSymbolsList");

    this.OptVizData = this.getUnderlyingsAvailable;

    this.setHedgingManagerAddr();
    this.totalTokenStock();

    this.pairs = Object.keys(this.getSymbolsListJson);

    this.updateAvailableUdlCurrentPrice();
    this.setUdlRealizedVol();
  },

  methods: {
    setDepositWith(choice) {
      this.depositWith = choice;
    },
    async handleOptVizEvent (optVizState) {
      let optVizData = optVizState.getState();

      if (!optVizData["currentSymbol"] || !optVizData["currentStrategies"]){
        return;
      }

      if (optVizData["isSumbit"] != true){
        return;
      }      

      let udlFeed = this.OptVizData[optVizData["currentSymbol"]]["udlAddr"];
      let realizedVol = this.OptVizData[optVizData["currentSymbol"]]["realizedVol"];
      let currentPrice = this.OptVizData[optVizData["currentSymbol"]]["currentPrice"];
      let expirations = [];
      let collaterals = [];
      let bins = 15;
      let sigma = 1;
      
      let low = currentPrice - (sigma*realizedVol);
      let high = currentPrice + (sigma*realizedVol);

      let lower_bound = Math.ceil(low - currentPrice/bins - realizedVol);
      let upper_bound = Math.ceil(high + currentPrice/bins + realizedVol);
      let bound_width = (upper_bound - lower_bound)/bins;
      let xVals = [];
      for(let i =0; i < bins; i++){
        xVals.push(lower_bound+(i*bound_width));
      }
      let addSymbols = [];
      let createOptions = [];

      let rvol = realizedVol / currentPrice * 30;
      
      for (let sidx in optVizData["currentStrategies"]) {
        let strat = optVizData["currentStrategies"][sidx];
        let numLegs = Object.keys(strat["legs"]).length;
        for (let i =0; i < numLegs; i++){
          let lKey = i.toString();
          let strike = parseInt(strat["legs"][lKey]["strike"]);
          let optionsSize = parseInt(strat["legs"][lKey]["quantity"]);
          expirations.push(strat["legs"][lKey]["expiration"]);

          let tCol;

          if ((strat["legs"][lKey]["direction"] == "-")){
            //how much need to write this leg
            tCol = await this.getOptionsExchangeContract.methods.calcCollateral(
              udlFeed,
              String((optionsSize * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              this.optTypes[(strat["legs"][lKey]["type"] == 'C') ? "CALL" : "PUT"],
              String((parseInt(strat["legs"][lKey]["strike"]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              strat["legs"][lKey]["expiration"]
            ).call();
          } else {
            //premium willing to pay to buy this leg
            tCol = strat["legs"][lKey]["premium"];
          }

          collaterals.push(parseInt(tCol) / (10 ** 18));

          createOptions.push({
            udlFeedAddr: udlFeed,//button
            optType: (strat["legs"][lKey]["type"] == 'C') ? "CALL" : "PUT", //button
            strike: strat["legs"][lKey]["strike"], //manual?
            maturity: strat["legs"][lKey]["expiration"] //datetimepicker
          });

          let dt = (strat["legs"][lKey]["expiration"] - Number(Math.floor(Date.now() / 1000))) / (60 * 60 * 24 * 365);
          let dt1 = (60 * 60 * 24) / (60 * 60 * 24 * 365);

          let yVals1 = xVals.map(
            p => bs.blackScholes(p,strike,dt,rvol,0, (strat["legs"][lKey]["type"] === 'P') ? 'put' : 'call')
          );

          let yVals2 = xVals.map(
            p => bs.blackScholes(p,strike,dt1,rvol,0, (strat["legs"][lKey]["type"] === 'P') ? 'put' : 'call')
          );

          let yVals = yVals1.concat(yVals2);

          addSymbols.push({
            udlFeed: udlFeed, // these can
            strike: strat["legs"][lKey]["strike"], // be inputed from 
            maturity: strat["legs"][lKey]["expiration"], // avaiable options 
            optionType: (strat["legs"][lKey]["type"] == 'C') ? "CALL" : "PUT", // in exchange
            t0: Number(Math.floor(Date.now() / 1000)), //date time picker?
            t1: strat["legs"][lKey]["expiration"] - (60*60*24), //datetime picker
            x: xVals.join(','),
            y: yVals.join(','),
            bsStockSpread: [
              (strat["legs"][lKey]["direction"] == "-") ? optionsSize : 0, //how much people can buy against pool
              (strat["legs"][lKey]["direction"] == "-") ? 0 : optionsSize, //how much people can sell against pool
              1,// 1 percent spread
            ].join(',')
          });
        }
      }

      let setParams = { //gov
        reserveRatio: 0, //slider as a percentage
        withdrawFee: 0, //slider as a percentage
        maturity: Math.max(expirations) + (60 * 60 * 24 * 7), //datetime picker
        leverageMultiplier: 1, //slider from 1-30? or manual with validation
        hedgingManagerAddress: "0x0000000000000000000000000000000000000000", //toggle from hdeging manager addresses hardcoded in ui?
        hedgingNotionalThreshold:  1000, //silder of dollar amount?
      };

      let depositTotal = collaterals.reduce((a, b) => a + b, 0);

      this.syntheticLimitOrder["setParams"] = setParams; //works
      this.syntheticLimitOrder["depositTotal"] = depositTotal; //works
      this.syntheticLimitOrder["addSymbols"] = addSymbols; //works
      this.syntheticLimitOrder["createOptions"] = createOptions; //works

      this.createSyntheticLimitOrder();

    },
    addSymbol: function () {
      this.addSymbols.push({
        udlFeed: null, // these can
        strike: null, // be inputed from 
        maturity: null, // avaiable options 
        optionType: null, // in exchange
        t0: null, //date time picker?
        t1: null, //datetime picker
        x: null, //manual, but needs conversion check
        y: null,//manual but needs conversion check
        bsStockSpread: null // manual for a[0], and a[1], but can be a slider for a[2]
      });
    },
    addRange: function () {
      this.setRanges.push({
        symbol: null,//toggle from avaiable options in pool
        op: null,//toggle button from: none, buy, sell
        start: null,//datetimepicker
        end: null//datetimepicker
      });
    },
    addOption: function () {
      this.createOptions.push({
        udlFeedAddr: null,//button
        optType: null, //button
        strike: null, //manual?
        maturity: null //datetimepicker
      });
    },
    removeSymbol: function () {
      this.removeSymbols.push({
        value: null // toggle from available options in pool that have old maturity date greater than current unix time
      });
    },
    validateAddr(obj) {
      if (obj.addr === null){
        return false;
      }

      return true;
    },
    validateSetParameters() {
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
          if (obj[i][key] === null) {
            return false;
          }
        }
      }

      return true;
    },
    isHedgingManagerReady(){

      if(this.setParams.hedgingManagerAddress != null) {
        return false;
      }

      if(this.setParams.hedgingManagerAddress === "0x0000000000000000000000000000000000000000") {
        return false;
      }
      

      return true;

    },
    async updateAvailableUdlCurrentPrice() {
      //      "ETH/USD": {"udlAddr": addresses["ETH/USD"][chainIdDec], "currentPrice": null, "realizedVol": null}, 
      let component = this;

      setTimeout(
        async function(){
          for (var key in component.OptVizData) {

            if (component.OptVizData[key]["udlAddr"] != "") {
              let contract = new component.getWeb3.eth.Contract(ChainlinkContractJson.abi, component.OptVizData[key]["udlAddr"]);

              let underlyingPrice = await contract.methods.getLatestPrice().call();      
              let underlyingPriceBig = Math.round(component.getWeb3.utils.fromWei(Number(underlyingPrice.price).toString(16), "ether")*100)/100;

              component.OptVizData[key]["currentPrice"] = underlyingPriceBig;
            }
          }

        },
        1000 * 60 * 2//update price every 2 min
      );
    },
    async setUdlRealizedVol() {
      for (var key in this.OptVizData) {

        if (this.OptVizData[key]["udlAddr"] != "") {
          let contract = new this.getWeb3.eth.Contract(ChainlinkContractJson.abi, this.OptVizData[key]["udlAddr"]);

          let underlyingVol = await contract.methods.getDailyVolatility(60*60*24*90).call();      
          let underlyingVolBig = Math.round(this.getWeb3.utils.fromWei(Number(underlyingVol).toString(16), "ether")*100)/100;

          let underlyingPrice = await contract.methods.getLatestPrice().call();      
          let underlyingPriceBig = Math.round(this.getWeb3.utils.fromWei(Number(underlyingPrice.price).toString(16), "ether")*100)/100;

          this.OptVizData[key]["currentPrice"] = underlyingPriceBig;
          this.OptVizData[key]["realizedVol"] = underlyingVolBig;
        }
      }
    },
    async setHedgingManagerAddr() {
      const hedgingManagerAddr = await this.getLiquidityPoolContract.methods.getHedgingManager().call();
      this.setParams.hedgingManagerAddress = (hedgingManagerAddr.length > 0) ? hedgingManagerAddr : null;
    },
    async createProposal () {
      let component = this;
      component.loading = true;

      let addSymbolAbiJSON = component.getLiquidityPoolAbi[8];
      let setRangeAbiJSON = component.getLiquidityPoolAbi[33];
      let setParametersAbiJSON = component.getLiquidityPoolAbi[32];

      let encodedData = [];

      //encode setParameters first if exists
      if (component.validateSetParameters()) {
        let parameters = [
          Number(Number(component.setParams.reserveRatio) * (10** 7)), //5 * (10**7) == 5%, 0 to 100
          Number(Number(component.setParams.withdrawFee) * (10 **7)), //1 * (10**7) == 1%, 0 to 100
          Number(component.setParams.maturity) ,  //Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 10) //10 years
          Number(component.setParams.leverageMultiplier), // 15, 1 to 30
          component.setParams.hedgingManagerAddress,// 0x3d8E35BB6FdBEBFAefb1674b5B717aa946b85191
          String((parseInt(component.setParams.hedgingNotionalThreshold) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setParametersAbiJSON, parameters)
        );
      }
      //encode all addSymbols
      if (component.validateObj(component.addSymbols)) {
        for(let i=0; i<component.addSymbols.length; i++) {
          let parameters = [
            component.addSymbols[i].udlFeed, 
            String((parseInt(component.addSymbols[i].strike) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),//strike * (10**EXCHG['decimals'])
            component.addSymbols[i].maturity, //unix timestamp format
            component.optTypes[component.addSymbols[i].optionType], //0 if optionType == 'CALL' else 1
            Number(component.addSymbols[i].t0), // unix timestamp format
            Number(component.addSymbols[i].t1), //unix timestamp format
            component.addSymbols[i].x.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// x * (10**EXCHG['decimals'])
            component.addSymbols[i].y.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// y * (10**EXCHG['decimals'])
            [
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[0]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[1]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[2]) * (10 ** 7)).toLocaleString('fullwide', {useGrouping:false}))
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
            component.setRanges[i].symbol, 
            component.marketOpTypes[component.setRanges[i].op], //    enum Operation { NONE, BUY, SELL } == 0, 1, 2 respectively
            String((parseInt(component.setRanges[i].start) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})), //price * 10 ** 18
            String((parseInt(component.setRanges[i].end) *  (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))//price * 10 ** 18
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

    },
    async createExecuteFastProposal () {
      let component = this;
      component.loading = true;

      //console.log(component.getLiquidityPoolAbi);

      let addSymbolAbiJSON = component.getLiquidityPoolAbi[8];
      let setRangeAbiJSON = component.getLiquidityPoolAbi[33];
      let setParametersAbiJSON = component.getLiquidityPoolAbi[32];

      let encodedData = [];

      //encode setParameters first if exists
      if (component.validateSetParameters()) {
        let parameters = [
          Number(Number(component.setParams.reserveRatio) * (10** 7)), //5 * (10**7) == 5%, 0 to 100
          Number(Number(component.setParams.withdrawFee) * (10 **7)), //1 * (10**7) == 1%, 0 to 100
          Number(component.setParams.maturity) ,  //Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 10) //10 years
          Number(component.setParams.leverageMultiplier), // 15, 1 to 30
          component.setParams.hedgingManagerAddress,// 0x3d8E35BB6FdBEBFAefb1674b5B717aa946b85191
          String((parseInt(component.setParams.hedgingNotionalThreshold) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setParametersAbiJSON, parameters)
        );
      }
      //encode all addSymbols
      if (component.validateObj(component.addSymbols)) {
        for(let i=0; i<component.addSymbols.length; i++) {
          let parameters = [
            component.addSymbols[i].udlFeed, 
            String((parseInt(component.addSymbols[i].strike) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),//strike * (10**EXCHG['decimals'])
            component.addSymbols[i].maturity, //unix timestamp format
            component.optTypes[component.addSymbols[i].optionType], //0 if optionType == 'CALL' else 1
            Number(component.addSymbols[i].t0), // unix timestamp format
            Number(component.addSymbols[i].t1), //unix timestamp format
            component.addSymbols[i].x.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// x * (10**EXCHG['decimals'])
            component.addSymbols[i].y.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// y * (10**EXCHG['decimals'])
            [
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[0]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[1]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[2]) * (10 ** 7)).toLocaleString('fullwide', {useGrouping:false}))
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
            component.setRanges[i].symbol, 
            component.marketOpTypes[component.setRanges[i].op], //    enum Operation { NONE, BUY, SELL } == 0, 1, 2 respectively
            String((parseInt(component.setRanges[i].start) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})), //price * 10 ** 18
            String((parseInt(component.setRanges[i].end) *  (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))//price * 10 ** 18
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setRangeAbiJSON, parameters)
          );
        }
      }

      const fastPoolManagementContract = new component.getWeb3.eth.Contract(
        FastPoolManagementJSON.abi,
        component.getFastPoolManagementAddress
      );
    
      await fastPoolManagementContract.methods.deployProposeVoteExecute(
        component.getProposalManagerAddress,
        PoolManagementProposalJSON.bytecode,
        encodedData,
        component.getSelectedPoolAddress,
        2, //enum Quorum { SIMPLE_MAJORITY, TWO_THIRDS, QUADRATIC } 0,1,2
        1, //enum VoteType {PROTOCOL_SETTINGS, POOL_SETTINGS, ORACLE_SETTINGS} 0,1,2
        Number(Math.floor(Date.now() / 1000) + (60 * 60)), //30 min to vote
        true
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
          component.$toast.success("Updating the pool was successful.");
          
        } else {
          component.$toast.error("The storing proposal transactions tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },

    async createExecuteProposal () {
      let component = this;
      component.loading = true;

      //console.log(component.getLiquidityPoolAbi);

      let addSymbolAbiJSON = component.getLiquidityPoolAbi[8];
      let setRangeAbiJSON = component.getLiquidityPoolAbi[33];
      let setParametersAbiJSON = component.getLiquidityPoolAbi[32];

      let encodedData = [];

      //encode setParameters first if exists
      if (component.validateSetParameters()) {
        let parameters = [
          Number(Number(component.setParams.reserveRatio) * (10** 7)), //5 * (10**7) == 5%, 0 to 100
          Number(Number(component.setParams.withdrawFee) * (10 **7)), //1 * (10**7) == 1%, 0 to 100
          Number(component.setParams.maturity) ,  //Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 10) //10 years
          Number(component.setParams.leverageMultiplier), // 15, 1 to 30
          component.setParams.hedgingManagerAddress,// 0x3d8E35BB6FdBEBFAefb1674b5B717aa946b85191
          String((parseInt(component.setParams.hedgingNotionalThreshold) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setParametersAbiJSON, parameters)
        );
      }
      //encode all addSymbols
      if (component.validateObj(component.addSymbols)) {
        for(let i=0; i<component.addSymbols.length; i++) {
          let parameters = [
            component.addSymbols[i].udlFeed, 
            String((parseInt(component.addSymbols[i].strike) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),//strike * (10**EXCHG['decimals'])
            component.addSymbols[i].maturity, //unix timestamp format
            component.optTypes[component.addSymbols[i].optionType], //0 if optionType == 'CALL' else 1
            Number(component.addSymbols[i].t0), // unix timestamp format
            Number(component.addSymbols[i].t1), //unix timestamp format
            component.addSymbols[i].x.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// x * (10**EXCHG['decimals'])
            component.addSymbols[i].y.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// y * (10**EXCHG['decimals'])
            [
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[0]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[1]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.addSymbols[i].bsStockSpread.split(",")[2]) * (10 ** 7)).toLocaleString('fullwide', {useGrouping:false}))
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
            component.setRanges[i].symbol, 
            component.marketOpTypes[component.setRanges[i].op], //    enum Operation { NONE, BUY, SELL } == 0, 1, 2 respectively
            String((parseInt(component.setRanges[i].start) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})), //price * 10 ** 18
            String((parseInt(component.setRanges[i].end) *  (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))//price * 10 ** 18
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(setRangeAbiJSON, parameters)
          );
        }
      }

      const fastPoolManagementContract = new component.getWeb3.eth.Contract(
        FastPoolManagementJSON.abi,
        component.getFastPoolManagementAddress
      );

      await fastPoolManagementContract.methods.deployProposeVoteExecute(
        component.getProposalManagerAddress,
        PoolManagementProposalJSON.bytecode,
        encodedData,
        component.getSelectedPoolAddress,
        2, //enum Quorum { SIMPLE_MAJORITY, TWO_THIRDS, QUADRATIC } 0,1,2
        1, //enum VoteType {PROTOCOL_SETTINGS, POOL_SETTINGS, ORACLE_SETTINGS} 0,1,2
        Number(Math.floor(Date.now() / 1000) + (60 * 60)), //30 min to vote
        false
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
          component.$toast.success("Register the proposal transactions was successfull. You can now vote on the proposal in the pool governance page");
          
        } else {
          component.$toast.error("The storing proposal transactions tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });

    },
    async createSymbols () {
      let component = this;

      if (component.validateObj(component.createOptions)) {
        for (let i=0; i < component.createOptions.length; i++) {
          component.getOptionsExchangeContract.methods.createSymbol(
            component.createOptions[i].udlFeedAddr,
            component.optTypes[component.createOptions[i].optType], //0 if optionType == 'CALL' else 1
            String((parseInt(component.createOptions[i].strike) * (10**18)).toLocaleString('fullwide', {useGrouping:false})),//strike * (10**EXCHG['decimals'])
            component.createOptions[i].maturity //unix timestamp format
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
              component.$toast.success("Create Symbol transaction was successfull.");
              
            } else {
              component.$toast.error("The create symbol tx has failed. Please contact the DeFi Options support.");
            }
            component.loading = false;

          }).on('error', function(error){
            console.log(error);
            component.loading = false;
            component.$toast.error("There has been an error. Please contact the DeFi Options support.");
          });
        }
      }
    },



    async createSymbolsBulk () {
      //encode all createSymbols and us FPM
      let component = this;

      let encodedData = [];
      let createSymbolAbiJSON = component.getOptionsExchangeAbi[32];


      if (component.validateObj(component.createOptions)) {
        for (let i=0; i < component.createOptions.length; i++) {
          let parameters = [
            component.createOptions[i].udlFeedAddr,
            component.optTypes[component.createOptions[i].optType], //0 if optionType == 'CALL' else 1
            String((parseInt(component.createOptions[i].strike) * (10**18)).toLocaleString('fullwide', {useGrouping:false})),//strike * (10**EXCHG['decimals'])
            component.createOptions[i].maturity //unix timestamp format
          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(createSymbolAbiJSON, parameters)
          );
        }
      }

      const fastPoolManagementContract = new component.getWeb3.eth.Contract(
        FastPoolManagementJSON.abi,
        component.getFastPoolManagementAddress
      );

      await fastPoolManagementContract.methods.bulkRegisterSymbols(
        component.getOptionsExchangeContract.options.address,
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
          component.$toast.success("Register the proposal transactions was successfull. You can now vote on the proposal in the pool governance page");
          
        } else {
          component.$toast.error("The storing proposal transactions tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },
    
    async removeAllSymbols () {
      //TODO: BULK REMOVAL LATER
      //loop over removes and ask user to keep pressin mm tx's
      let component = this;
      if (component.validateObj(component.removeSymbols)) {
        for (let i=0; i < component.removeSymbols.length; i++) {
          component.getLiquidityPoolContract.methods.removeSymbol(
            component.removeSymbols[i].value
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
              component.$toast.success("Remove symbol transaction was successfull.");
              
            } else {
              component.$toast.error("The remove symbol tx has failed. Please contact the DeFi Options support.");
            }
            component.loading = false;

          }).on('error', function(error){
            console.log(error);
            component.loading = false;
            component.$toast.error("There has been an error. Please contact the DeFi Options support.");
          });
        }
      }

    },
    async createHedgingManager() {
      let component = this;
        component.loading = true;
        const mvhedgingManagerFactoryAddr = addresses["MetavaultHedgingManagerFactory"][parseInt(component.getChainId)];

        const mvhedgingManagerFactoryContract = await new component.getWeb3.eth.Contract(MetavaultHedgingManagerFactoryJSON.abi, mvhedgingManagerFactoryAddr);

        await mvhedgingManagerFactoryContract.methods.create(
          component.getSelectedPoolAddress,
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
            console.log(receipt.events.NewHedgingManager.returnValues.hedgingManager);
            component.setParams.hedgingManagerAddress = receipt.events.NewHedgingManager.returnValues.hedgingManager;
            component.$toast.success("Hedging Manager Creation Succeeded, Please Set the Pool Parameters Again With the Hedging Manager Contract Address From This TX");
          } else {
            component.$toast.error("The create on MetavaultHedgingManagerFactory tx has failed. Please contact the DeFi Options support.");
          }
          component.loading = false;

        }).on('error', function(error){
          console.log(error);
          component.loading = false;
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });

        

    },
    async createD8xHedgingManager() {
      let component = this;
        component.loading = true;
        const mvhedgingManagerFactoryAddr = addresses["D8xHedgingManagerFactory"][parseInt(component.getChainId)];

        const mvhedgingManagerFactoryContract = await new component.getWeb3.eth.Contract(MetavaultHedgingManagerFactoryJSON.abi, mvhedgingManagerFactoryAddr);

        await mvhedgingManagerFactoryContract.methods.create(
          component.getSelectedPoolAddress,
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
            console.log(receipt.events.NewHedgingManager.returnValues.hedgingManager);
            component.setParams.hedgingManagerAddress = receipt.events.NewHedgingManager.returnValues.hedgingManager;
            component.$toast.success("Hedging Manager Creation Succeeded, Please Set the Pool Parameters Again With the Hedging Manager Contract Address From This TX");
          } else {
            component.$toast.error("The create on MetavaultHedgingManagerFactory tx has failed. Please contact the DeFi Options support.");
          }
          component.loading = false;

        }).on('error', function(error){
          console.log(error);
          component.loading = false;
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });

        

    },
    async syncHedgingManagerStats(){
      this.loading = true;

      await this.idealHedgeExposure();
      await this.realHedgeExposure();

      this.loading = false;

    },
    async balanceExposure() {
      let component = this;

      if (component.validateAddr(component.BalanceExposure)) {
        component.loading = true;

        const hedgingManagerAddr = this.setParams.hedgingManagerAddress;
        if(hedgingManagerAddr === null) {
          return false;
        }
        if(hedgingManagerAddr === "0x0000000000000000000000000000000000000000") {
          return false;
        }
        const hedgingManagerContract = await new component.getWeb3.eth.Contract(BaseHedgingManagerJSON.abi, hedgingManagerAddr);

        hedgingManagerContract.methods.balanceExposure(
          component.BalanceExposure.addr
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
            component.$toast.success("Manual Balancing Pool Exposure Initiated");
          } else {
            component.$toast.error("The balanceExposure tx has failed. Please contact the DeFi Options support.");
          }
          component.loading = false;

        }).on('error', function(error){
          console.log(error);
          component.loading = false;
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });
      }

    },
    async transferTokensToCreditProvider() {
      let component = this;
      if (component.validateAddr(component.TransferTokensToCreditProvider)) {
        component.loading = true;


        const hedgingManagerAddr = this.setParams.hedgingManagerAddress;
        if(hedgingManagerAddr === null) {
          return false;
        }
        if(hedgingManagerAddr === "0x0000000000000000000000000000000000000000") {
          return false;
        }
        const hedgingManagerContract = await new component.getWeb3.eth.Contract(BaseHedgingManagerJSON.abi, hedgingManagerAddr);

        hedgingManagerContract.methods.transferTokensToCreditProvider(
          component.TransferTokensToCreditProvider.addr
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
            component.$toast.success("Settled Hedging Manager Balance For Token Succeeded");
          } else {
            component.$toast.error("The transferTokensToCreditProvider tx has failed. Please contact the DeFi Options support.");
          }
          component.loading = false;

        }).on('error', function(error){
          console.log(error);
          component.loading = false;
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });
      }
    },
    async idealHedgeExposure() {
      //function idealHedgeExposure(address underlying) virtual override public view returns (int256);

      let component = this;
      //TODO: ADD TO READER

      const hedgingManagerAddr = this.setParams.hedgingManagerAddress;
      if(hedgingManagerAddr === null) {
        return false;
      }
      if(hedgingManagerAddr === "0x0000000000000000000000000000000000000000") {
        return false;
      }
      const hedgingManagerContract = await new component.getWeb3.eth.Contract(BaseHedgingManagerJSON.abi, hedgingManagerAddr);


      for (let pair of component.pairs){
          let priceFeedType = pair;

          let feedAddress = addresses[priceFeedType][parseInt(this.getChainId)];
          let feedContract = new this.getWeb3.eth.Contract(ChainlinkContractJson.abi, feedAddress);
          let underlyingAddr = await feedContract.methods.getUnderlyingAddr().call();
          let idealExpoRaw = await hedgingManagerContract.methods.idealHedgeExposure(underlyingAddr).call();
          this.idealExpo[feedAddress] = idealExpoRaw  / 10 **18;
      }   


    },
    async realHedgeExposure() {
      //function realHedgeExposure(address udlFeedAddr) virtual override public view returns (int256);

      let component = this;
      //TODO: ADD TO READER


      const hedgingManagerAddr = this.setParams.hedgingManagerAddress;
      if(hedgingManagerAddr === null) {
        return false;
      }
      if(hedgingManagerAddr === "0x0000000000000000000000000000000000000000") {
        return false;
      }

      const hedgingManagerContract = await new component.getWeb3.eth.Contract(BaseHedgingManagerJSON.abi, hedgingManagerAddr);


      for (let pair of component.pairs){
          let priceFeedType = pair;

          let feedAddress = addresses[priceFeedType][parseInt(this.getChainId)];
          this.realExpo[feedAddress] = (await hedgingManagerContract.methods.realHedgeExposure(feedAddress).call())  / 10 **18;
      }
    },
    async totalTokenStock() {
     // function totalTokenStock() virtual override public view returns (uint v);

      let component = this;
      const hedgingManagerAddr = this.setParams.hedgingManagerAddress;
      
      if(hedgingManagerAddr === null) {
        return false;
      }
      if(hedgingManagerAddr === "0x0000000000000000000000000000000000000000") {
        return false;
      }

      const hedgingManagerContract = await new component.getWeb3.eth.Contract(BaseHedgingManagerJSON.abi, hedgingManagerAddr);

      this.totalStableBalance = (await hedgingManagerContract.methods.totalTokenStock().call()) / 10 **18;

    },

    // approve the amount of stablecoins to use as collateral to sell/buy options against FPM contract
    async approveStablecoinDeposit() {
      let component = this;
      component.loading = true;

      // define unit and token contract
      let unit = "ether"; // Exchange Balance & DAI - 18 decimals
      let tokenContract;

      if (component.depositWith === "USDT") {
        unit = "kwei"; // USDT (Tether) - 4 decimals
        // TODO: tokenContract = ...; // USDT contract
      }

      if (component.depositWith === "USDC") {
        unit = "mwei"; // USDC - 6 decimals
        tokenContract = component.getUsdcContract; // USDC contract
      }

      if (component.depositWith === "DAI") {
        tokenContract = component.getDaiContract; // DAI contract
      }

      // define allowance value
      let allowanceValue = 10 ** 9; // 1B tokens as "unlimited" value

      const allowanceValueWei = component.getWeb3.utils.toWei(String(allowanceValue.toFixed(4)), unit); // round to 4 decimals
      
      // call the approve method
      try {
        await tokenContract.methods.approve(component.getFastPoolManagementAddress, allowanceValueWei).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");

        }).on('receipt', function(receipt){
          console.log(receipt);

          if (receipt.status) {
            component.$toast.success("The approval was successfull. You make your order now");

          } else {
            component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
          }

        }).on('error', function(error){
          console.log(error);
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });
      } catch (e) {
          window.console.log("Error:", e);
          component.$toast.error("The transaction has been reverted. Please try again or contact DeFi Options support.");
      } finally {
        component.loading = false;
      }

    },

    async createSyntheticLimitOrder () {
      //create synthetic limit order that abstracts typical pool operations
      let component = this;

      let tokenContract;
      //let unit;

      let createOptionsEncodedData = [];
      let createSymbolAbiJSON = component.getOptionsExchangeAbi[32];
      let addSymbolAbiJSON = component.getLiquidityPoolAbi[8];
      let setParametersAbiJSON = component.getLiquidityPoolAbi[32];

      let encodedData = [];

      //encode setParameters
      if (component.syntheticLimitOrder["setParams"]) {
        let parameters = [
          Number(Number(component.syntheticLimitOrder["setParams"].reserveRatio) * (10** 7)), //5 * (10**7) == 5%, 0 to 100
          Number(Number(component.syntheticLimitOrder["setParams"].withdrawFee) * (10 **7)), //1 * (10**7) == 1%, 0 to 100
          Number(component.syntheticLimitOrder["setParams"].maturity) ,  //Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 10) //10 years
          Number(component.syntheticLimitOrder["setParams"].leverageMultiplier), // 15, 1 to 30
          component.syntheticLimitOrder["setParams"].hedgingManagerAddress,// 0x3d8E35BB6FdBEBFAefb1674b5B717aa946b85191
          String((parseInt(component.syntheticLimitOrder["setParams"].hedgingNotionalThreshold) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))
        ];
        encodedData.push(
          component.getWeb3.eth.abi.encodeFunctionCall(setParametersAbiJSON, parameters)
        );
      }

      /*

        udlFeedAddr: udlFeed,//button
        optType: (strat["legs"][lKey]["type"] == 'C') ? "CALL" : "PUT", //button
        strike: strat["legs"][lKey]["strike"], //manual?
        maturity: strat["legs"][lKey]["expiration"] //datetimepicker
      */

      // encode create options
      if (component.validateObj(component.syntheticLimitOrder["createOptions"])) {
        for (let i=0; i < component.syntheticLimitOrder["createOptions"].length; i++) {
          let parameters = [
            component.syntheticLimitOrder["createOptions"][i].udlFeedAddr,
            component.optTypes[component.syntheticLimitOrder["createOptions"][i].optType], //0 if optionType == 'CALL' else 1
            String((parseInt(component.syntheticLimitOrder["createOptions"][i].strike) * (10**18)).toLocaleString('fullwide', {useGrouping:false})),//strike * (10**EXCHG['decimals'])
            component.syntheticLimitOrder["createOptions"][i].maturity //unix timestamp format
          ];
          createOptionsEncodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(createSymbolAbiJSON, parameters)
          );
        }
      }

      //encode all addSymbols
      if (component.validateObj(component.syntheticLimitOrder["addSymbols"])) {
        for(let i=0; i<component.syntheticLimitOrder["addSymbols"].length; i++) {
          let parameters = [
            component.syntheticLimitOrder["addSymbols"][i].udlFeed, 
            String((parseInt(component.syntheticLimitOrder["addSymbols"][i].strike) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),//strike * (10**EXCHG['decimals'])
            component.syntheticLimitOrder["addSymbols"][i].maturity, //unix timestamp format
            component.optTypes[component.syntheticLimitOrder["addSymbols"][i].optionType], //0 if optionType == 'CALL' else 1
            Number(component.syntheticLimitOrder["addSymbols"][i].t0), // unix timestamp format
            Number(component.syntheticLimitOrder["addSymbols"][i].t1), //unix timestamp format
            component.syntheticLimitOrder["addSymbols"][i].x.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// x * (10**EXCHG['decimals'])
            component.syntheticLimitOrder["addSymbols"][i].y.split(",").map(val => String((parseInt(val) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false}))),// y * (10**EXCHG['decimals'])
            [
              String((parseInt(component.syntheticLimitOrder["addSymbols"][i].bsStockSpread.split(",")[0]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.syntheticLimitOrder["addSymbols"][i].bsStockSpread.split(",")[1]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
              String((parseInt(component.syntheticLimitOrder["addSymbols"][i].bsStockSpread.split(",")[2]) * (10 ** 7)).toLocaleString('fullwide', {useGrouping:false}))
            ]//[buyStock * (10**EXCHG['decimals']),sellStock * (10**EXCHG['decimals']), spreadPercent * (10**7)]

          ];
          encodedData.push(
            component.getWeb3.eth.abi.encodeFunctionCall(addSymbolAbiJSON, parameters)
          );
        }
      }
      

      if (component.depositWith === "USDT") {
        //unit = "kwei"; // USDT (Tether) - 4 decimals
        // TODO: tokenContract = ...; // USDT contract
      }

      if (component.depositWith === "USDC") {
        //unit = "mwei"; // USDC - 6 decimals
        tokenContract = component.getUsdcContract; // USDC contract
      }

      if (component.depositWith === "DAI") {
        tokenContract = component.getDaiContract; // DAI contract
      }

      /*

      struct FPMLimitOrder {
        address stableToken;
        uint256 stableTokenValue;
        bool isDeposit;
        address proposalManagerAddr;
        bytes _code;
        bytes[] _executionBytes;
        IProposalManager.Quorum quorum;
        IProposalManager.VoteType voteType;
        uint expiresAt;
        address optionsExchangeAddr;
        bytes[] _executionCreateOptionsBytes;
      }
      */

      const fastPoolManagementContract = new component.getWeb3.eth.Contract(
        FastPoolManagementJSON.abi,
        component.getFastPoolManagementAddress
      );

      await fastPoolManagementContract.methods.createSyntheticLimitOrder(
        [
          tokenContract.options.address,
          String((component.syntheticLimitOrder["depositTotal"] * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})),
          true,
          component.getProposalManagerAddress,
          PoolManagementProposalJSON.bytecode,
          encodedData,
          2, //enum Quorum { SIMPLE_MAJORITY, TWO_THIRDS, QUADRATIC } 0,1,2
          1, //enum VoteType {PROTOCOL_SETTINGS, POOL_SETTINGS, ORACLE_SETTINGS} 0,1,2
          Number(Math.floor(Date.now() / 1000) + (60 * 60)), //30 min to vote
          component.getOptionsExchangeContract.options.address,
          createOptionsEncodedData
        ]
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
          component.$toast.success("Limit order succesful.");
          
        } else {
          component.$toast.error("The storing proposal transactions tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },
  }
}
</script>

<style scoped>
.pool-submit-buttons {
  padding: 20px 20px !important;
}
.pool-management-body-text-color {
  color: #48cc8c;
}
</style>
