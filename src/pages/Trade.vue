<template>
  <div>
    <div class="section-big row mt-4 mx-3">
      <div class="col-md-3 mb-4">
        <h3>Markets</h3>

        <div v-for="pair in pairs" v-bind:key="pair">
          <button @click="changePair(pair)" class="btn btn-outline-primary btn-xl mt-2" :class="{'btn-outline-primary-active':pair === selectedPair}">
            {{pair}}
          </button>
        </div>
        <div>
          <button data-bs-toggle="modal" :data-bs-target="'#createLimitOrderModal-123'" class="btn btn-success mt-2">
            Create Limit Order
          </button>
        </div>
      </div>

      <div class="col-md-9">
        <div class="d-flex flex-wrap justify-content-between">
          <div class="mb-4">
            <h3>Type</h3>

            <div class="btn-group mt-2" role="group" aria-label="Basic example">
              <button @click="changeOptionType('CALL')" type="button" class="btn btn-outline-primary btn-md" :class="{'btn-outline-primary-active':'CALL' === selectedType}">CALL</button>
              <button @click="changeOptionType('PUT')" type="button" class="btn btn-outline-primary btn-md" :class="{'btn-outline-primary-active':'PUT' === selectedType}">PUT</button>
            </div>
          </div>

          <div class="mb-4">
            <h3>Side</h3>

            <div class="btn-group mt-2" role="group" aria-label="Basic example">
              <button @click="changeOptionSide('BUY')" type="button" class="btn btn-outline-primary btn-md" :class="{'btn-outline-primary-active':'BUY' === selectedSide}">BUY</button>
              <button @click="changeOptionSide('SELL')" type="button" class="btn btn-outline-primary btn-md" :class="{'btn-outline-primary-active':'SELL' === selectedSide}">SELL</button>
            </div>
          </div>

          <div class="mb-4">
            <h3>Current price</h3>

            <button class="btn btn-primary mt-2 btn-md">
              ${{getUnderlyingPrice}}
            </button>
          </div>

          <div class="mb-4">
            <h3>Maturity</h3>

            <div class="btn-group mt-2">
              <button type="button" class="btn btn-primary btn-md dropdown-toggle text-uppercase" data-bs-toggle="dropdown" aria-expanded="false">
                {{getSelectedMaturity}}
              </button>
              <ul class="dropdown-menu">
                <li>
                  <span class="dropdown-item text-uppercase" @click="changeMaturity(maturity)" v-for="maturity in maturities" v-bind:key="maturity">{{maturity}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <OptionsList :symbols="getFilteredSymbols" :side="getSelectedSide" />
        <h3 v-if="Object.keys(this.getAllSymbolsListJson).length === 0">No options available.</h3>

        <!-- Limit order Modal -->
        <div class="modal fade" id="createLimitOrderModal-123" tabindex="-1" aria-labelledby="createLimitOrderModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="createLimitOrderModalLabel">Create Limit Order</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <button @click="approveStablecoinDeposit" class="btn btn-success">
                  <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Approve FPM Contract For Synthetic Limit Orders
                </button>
                <!--------- REACT OPTION BUILDER GOES HERE --------->
                <react :component="OptViz" :underlyingData="OptVizData" @onChange="handleOptVizEvent" :loading="loading"/>

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>


  </div>
</template>

<script>
import { mapGetters } from "vuex";
import OptionsList from '../components/trade/OptionsList.vue';

import { ReactWrapper } from 'vuera';
import App from '../components/react/App/App';

import PoolManagementProposalJSON from "../contracts/PoolManagementProposal.json";
import FastPoolManagementJSON from "../contracts/FastPoolManagement.json";
import ChainlinkContractJson from "../contracts/ChainlinkFeed.json";
import bs from 'black-scholes';

export default {
  name: 'Trade',
  beforeDestroy() {
    this.unsubscribe();
  },
  components: {
    OptionsList,
    'react': ReactWrapper,
  },
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getActiveBalanceEth", "getWeb3", "isUserConnected", "getLastSelectedTradePair", "getLastSelectedTradeMaturity", "getLastSelectedTradeType", "getLastSelectedTradeSide"]),
    ...mapGetters("optionsExchange", ["getOptionsExchangeContract", "getOptionsExchangeAbi", "getOptionsExchangeAddress", "getExchangeUserBalance", "getUnderlyingPrice", "getOptionTokenAddress", "getSelectedPool", "getUnderlyingsAvailable"]),
    ...mapGetters("liquidityPool", ["getLiquidityPoolContract", "getLiquidityPoolAbi", "getLiquidityPoolAddress", "getAllSymbolsListJson", "getDefaultMaturity", "getDefaultPair", "getDefaultType", "getDefaultSide", "getSelectedPoolAddress"]),
    ...mapGetters("proposalManager", ["getProposalManagerContract", "getProposalManagerAddress", "getFastPoolManagementAddress"]),

    ...mapGetters("dai", ["getDaiAddress", "getUserDaiBalance", "getDaiContract"]), // todo: delete
    ...mapGetters("usdc", ["getUsdcAddress", "getUserUsdcBalance", "getUsdcContract"]),

    getFilteredSymbols() {
      try {
        const filteredList = this.getAllSymbolsListJson[this.getSelectedPair][this.getSelectedMaturity][this.getSelectedType];
        return filteredList.sort((a, b) => a.strike - b.strike);
      } catch {
        return [];
      }
    },
    getSelectedMaturity() {
      if (this.selectedMaturity) {
        return this.selectedMaturity;
      }
      return this.getDefaultMaturity;
    },
    getSelectedPair() {
      if (this.selectedPair) {
        return this.selectedPair;
      }
      return this.getDefaultPair;
    },
    getSelectedType() {
      if (this.selectedType) {
        return this.selectedType;
      }
      return this.getDefaultType;
    },
    getSelectedSide() {
      if (this.selectedSide) {
        return this.selectedSide;
      }
      return this.getDefaultSide;
    },
    getMarkets() {
      return Object.keys(this.getAllSymbolsListJson) || this.pairs;
    }
  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      // if web3 is not yet loaded or user not connected, redirect to home page
      this.$router.push({ name: 'home'});
    }

    this.$store.dispatch("optionsExchange/fetchContract");
    this.$store.dispatch("optionsExchange/storeAddress");
    this.$store.dispatch("liquidityPool/storeAbi");
    this.$store.dispatch("liquidityPool/fetchAllPoolOptions");
    this.$store.dispatch("dai/fetchContract");
    this.$store.dispatch("dai/fetchUserBalance");
    this.$store.dispatch("dai/storeAddress");
    this.$store.dispatch("usdc/fetchContract");
    this.$store.dispatch("usdc/fetchUserBalance");
    this.$store.dispatch("usdc/storeAddress");

    this.OptVizData = this.getUnderlyingsAvailable;

    this.loadOptionsAndMarkets();

    this.updateAvailableUdlCurrentPrice();
    this.setUdlRealizedVol();

    
  },
  data() {
    return {
      depositWith: "DAI",
      OptViz: App,
      syntheticLimitOrder: {},
      OptVizData: {},
      loading: false,
      maturities: null,
      pairs: [],
      selectedMaturity: null,
      selectedPair: null,
      selectedType: null,
      selectedSide: null,
      optTypes: {
        "CALL" : 0,
        "PUT": 1
      },
      typeNames: null // PUT, CALL
    }
  },

  watch: {
      getAllSymbolsListJson: async function() {
        this.loadOptionsAndMarkets()
      }
  },

  methods: {
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
    async handleOptVizEvent (optVizState) {
      let optVizData = optVizState.getState();
      console.log(optVizData);

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
      
      let low = currentPrice - (3*realizedVol);
      let high = currentPrice + (3*realizedVol);

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
        console.log(strat);
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

          console.log(udlFeed)
          console.log(String((optionsSize * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})))
          console.log(this.optTypes[(strat["legs"][lKey]["type"] == 'C') ? "CALL" : "PUT"])
          console.log(String((parseInt(strat["legs"][lKey]["strike"]) * (10 ** 18)).toLocaleString('fullwide', {useGrouping:false})))
          console.log(strat["legs"][lKey]["expiration"])

          console.log(tCol / (10 ** 18));
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

          console.log(yVals1);

          let yVals2 = xVals.map(
            p => bs.blackScholes(p,strike,dt1,rvol,0, (strat["legs"][lKey]["type"] === 'P') ? 'put' : 'call')
          );

          console.log(yVals2);

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
      console.log(depositTotal);

      this.syntheticLimitOrder["setParams"] = setParams; //works
      this.syntheticLimitOrder["depositTotal"] = depositTotal; //works
      this.syntheticLimitOrder["addSymbols"] = addSymbols; //works
      this.syntheticLimitOrder["createOptions"] = createOptions; //works

      this.createSyntheticLimitOrder();

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

          console.log(component.OptVizData);
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
      console.log(this.OptVizData);
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
          component.$toast.success("Limit order sucessful.");
          
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

    loadOptionsAndMarkets() {
      if (Object.keys(this.getAllSymbolsListJson).length > 0) {
        // extract values from getSymbolsListJson and pre-populate dropdowns (pair, maturity, type)
        this.pairs = Object.keys(this.getAllSymbolsListJson);
        this.selectedPair = this.pairs[0];

        this.maturities = Object.keys(this.getAllSymbolsListJson[this.selectedPair]);
        this.selectedMaturity = this.maturities[0];

        this.typeNames = Object.keys(this.getAllSymbolsListJson[this.selectedPair][this.selectedMaturity]);
        this.selectedType = this.typeNames[0];

        
        if (this.getLastSelectedTradePair) {
          // persistent storage for a user that's switching between pages
          this.selectedPair = this.getLastSelectedTradePair;
        }

        if (this.getLastSelectedTradeMaturity) {
          // persistent storage for a user that's switching between pages
          this.selectedMaturity = this.getLastSelectedTradeMaturity;
        }

        if (this.getLastSelectedTradeType) {
          // persistent storage for a user that's switching between pages
          this.selectedType = this.getLastSelectedTradeType;
        }

        if (this.getLastSelectedTradeSide) {
          // persistent storage for a user that's switching between pages
          this.selectedSide = this.getLastSelectedTradeSide;
        } else {
          this.selectedSide = "BUY";
        }

        try {
          let pair = this.getAllSymbolsListJson[this.selectedPair][this.selectedMaturity][this.selectedType][0].pair;
          this.$store.dispatch("optionsExchange/fetchUnderlyingPrice", {pair});
        } catch {
          this.$store.dispatch("optionsExchange/fetchUnderlyingPrice", {pair: "N/A"});
        }
        
      }
    },
    changePair(pair) {
      this.selectedPair = pair;
      this.maturities = Object.keys(this.getAllSymbolsListJson[this.selectedPair]);
      this.$store.commit("accounts/setLastSelectedTradePair", pair);
      this.selectedMaturity = this.maturities[0];
      this.$store.commit("accounts/setLastSelectedTradeMaturity", this.selectedMaturity);


      this.typeNames = Object.keys(this.getAllSymbolsListJson[this.selectedPair][this.selectedMaturity]);
      this.selectedType = this.typeNames[0];
      this.$store.commit("accounts/setLastSelectedTradeType", this.selectedType);

      // fetch new underlying price
      try {
        let pair = this.getAllSymbolsListJson[this.selectedPair][this.selectedMaturity][this.selectedType][0].pair;
        this.$store.dispatch("optionsExchange/fetchUnderlyingPrice", {pair});
      } catch {
        this.$store.dispatch("optionsExchange/fetchUnderlyingPrice", {pair: "N/A"});
      }
    },
    changeMaturity(maturity) {
      this.selectedMaturity = maturity;
      this.$store.commit("accounts/setLastSelectedTradeMaturity", maturity);
    },
    changeOptionType(optionType) {
      this.selectedType = optionType;
      this.$store.commit("accounts/setLastSelectedTradeType", optionType);
    },
    changeOptionSide(optionSide) {
      this.selectedSide = optionSide;
      this.$store.commit("accounts/setLastSelectedTradeSide", optionSide);
    }
  }
}
</script>
