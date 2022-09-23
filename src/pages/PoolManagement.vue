<template>
  <div>

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
        Add New Options To Exchange
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


    <!------ Adding/modifying tradeable price ranges ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetRange :ranges="setRanges" />
        <span></span>
      </div>
      <button @click="addRange" class="btn btn-success">
        Add/Modify Range
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
        Add/Modify Symbol
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
import CreateOption from '../components/manage/CreateOption.vue';
import RemoveSymbol from '../components/manage/RemoveSymbol.vue';
import PoolManagementProposalJSON from "../contracts/PoolManagementProposal.json";

export default {
  name: 'PoolManagement',
  data() {
    return {
      loading: false,
      setParams: { //gov
        reserveRatio: null, //slider as a percentage
        withdrawFee: null, //slider as a percentage
        maturity: null, //datetime picker
        leverageMultiplier: null, //slider from 1-30? or manual with validation
        hedgingManagerAddress: null, //toggle from hdeging manager addresses hardcoded in ui?
      },
      setRanges: [], //gov
      addSymbols: [],//gov
      removeSymbols: [],//non gov
      createOptions: []//non gov
    }
  },
  components: {
    AddSymbol,
    SetRange,
    SetParams,
    CreateOption,
    RemoveSymbol,
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
        op: null,//button
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
          Number(Number(component.setParams.reserveRatio) * (10** 7)), //5 * (10**7) == 5%
          Number(Number(component.setParams.withdrawFee) * (10 **7)), //1 * (10**7) == 1%
          Number(Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 10)),//Number(component.setParams.maturity) ,  //Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 10) //10 years
          Number(component.setParams.leverageMultiplier), // 15
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
            component.addSymbols.strike,
            component.addSymbols.maturity,
            component.addSymbols.optionType,
            component.addSymbols.t0,
            component.addSymbols.t1,
            component.addSymbols.x,
            component.addSymbols.y,
            component.addSymbols.bsStockSpread
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
            component.setRanges.op,
            component.setRanges.start,
            component.setRanges.end
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

      await deployPoolManagmentProposal.methods.setexecutionBytes(
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

      console.error("pool management proposal address");
      console.error(deployPoolManagmentProposal.options.address);
      console.error("pool addr");
      console.error(component.getSelectedPoolAddress);

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
            component.createOptions[i].optType,
            component.createOptions[i].strike,
            component.createOptions[i].maturity
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

    }
  }
}
</script>
