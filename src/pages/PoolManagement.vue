<template>
  <div>

    <h1> Current Pool: ({{getSelectedPoolAddress.substring(0, 6)}}...{{getSelectedPoolAddress.substring(38, 42)}})</h1>

    <!------ create hedging manager ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <button @click="createHedgingManager" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Create Hedging Manager
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
        <button @click="balanceExposure" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Manually Balance Pool Options Exposure
        </button>
        <button @click="syncHedgingManagerStats" class="btn btn-success">
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
      <button @click="addOption" class="btn btn-success">
        Add More Options To Exchange
      </button>
      <button @click="createSymbols" class="btn btn-success">
       Submit New Options
      </button>
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
import AddSymbol from '../components/manage/AddSymbol.vue';
import SetRange from '../components/manage/SetRange.vue';
import SetParams from '../components/manage/SetParams.vue';
import SetAddress from '../components/manage/exchange/SetAddress.vue';
import CreateOption from '../components/manage/CreateOption.vue';
import RemoveSymbol from '../components/manage/RemoveSymbol.vue';
import PoolManagementProposalJSON from "../contracts/PoolManagementProposal.json";
import BaseHedgingManagerJSON from "../contracts/BaseHedgingManager.json";
import MetavaultHedgingManagerFactoryJSON from "../contracts/MetavaultHedgingManagerFactory.json";
import ChainlinkContractJson from "../contracts/ChainlinkFeed.json";
import addresses from "../contracts/addresses.json";

export default {
  name: 'PoolManagement',
  data() {
    return {
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
  },
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainId", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("optionsExchange", ["getOptionsExchangeContract","getLiquidityPoolBalance", "getSelectedPool"]),
    ...mapGetters("liquidityPool", ["getLiquidityPoolContract", "getLiquidityPoolAbi","getApy", "getUserPoolUsdValue", "getSelectedPoolAddress", "getSymbolsListJson"]),
    ...mapGetters("proposalManager", ["getProposalManagerContract"]),
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

    this.setHedgingManagerAddr();
    this.totalTokenStock();

    this.pairs = Object.keys(this.getSymbolsListJson);
  },

  methods: {
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
    async setHedgingManagerAddr() {
      const hedgingManagerAddr = await this.getLiquidityPoolContract.methods.getHedgingManager().call();
      this.setParams.hedgingManagerAddress = (hedgingManagerAddr.length > 0) ? hedgingManagerAddr : null;
    },
    async createProposal () {
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
    async createSymbols () {
      //TODO: BULK CREATION LATER, BOUNDED BY OPTIONS CONTRACT GAS COSTS * NUM SYMBOLS
      //loop over symbols and ask user to keep pressing mm tx's
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
      //TODO: display in ui
      //TODO: ADD TO READER

      const hedgingManagerAddr = this.setParams.hedgingManagerAddress;
      if(hedgingManagerAddr === null) {
        return false;
      }
      if(hedgingManagerAddr === "0x0000000000000000000000000000000000000000") {
        return false;
      }
      const hedgingManagerContract = await new component.getWeb3.eth.Contract(BaseHedgingManagerJSON.abi, hedgingManagerAddr);

      console.log(component.pairs);

      for (let pair of component.pairs){
          let priceFeedType = pair;

          let feedAddress = addresses[priceFeedType][parseInt(this.getChainId)];
          let feedContract = new this.getWeb3.eth.Contract(ChainlinkContractJson.abi, feedAddress);
          let underlyingAddr = await feedContract.methods.getUnderlyingAddr().call();
          let idealExpoRaw = await hedgingManagerContract.methods.idealHedgeExposure(underlyingAddr).call();
          console.log("idealExpoRaw");
          console.log(idealExpoRaw);
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

    }
  }
}
</script>
