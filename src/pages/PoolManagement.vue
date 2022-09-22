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
//import PoolManagementProposalJSON from "../contracts/PoolManagementProposal.json";

export default {
  name: 'Portfolio',
  data() {
    return {
      loading: false,
      setParams: { //gov
        reserveRatio: null,
        withdrawFee: null,
        maturity: null,
        leverageMultiplier: null,
        hedgingManagerAddress: null,
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
    ...mapGetters("optionsExchange", ["getLiquidityPoolBalance", "getSelectedPool"]),
    ...mapGetters("liquidityPool", ["getLiquidityPoolAbi","getApy", "getUserPoolUsdValue", "getSelectedPoolAddress"]),
  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});
    }

    this.$store.dispatch("optionsExchange/fetchContract");
    this.$store.dispatch("liquidityPool/fetchContract");
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
        address: null,
        strike: null,
        maturity: null, 
        optionType: null,
        t0: null,
        t1: null,
        x: null,
        y: null,
        bsStockSpread: null
      });
    },
    addRange: function () {
      this.setRanges.push({
        symbol: null,
        op: null,
        start: null,
        end: null
      });
    },
    addOption: function () {
      this.createOptions.push({
        udlFeedAddr: null,
        optType: null,
        strike: null, 
        maturity: null
      });
    },
    removeSymbol: function () {
      this.removeSymbols.push({
        value: null
      });
    },
    async createProposal () {
      let component = this;
      //TODO: first need to seriralize data into list of strings, where each string is what the pool needs tp execute

      /*for (let i =3; i<component.getLiquidityPoolAbi.length; i++) {
        console.error(i);
        console.error(component.getLiquidityPoolAbi[i]);
      }*/

      let addSymbolAbiJSON = component.getLiquidityPoolAbi[1];
      let setRangeAbiJSON = component.getLiquidityPoolAbi[33];
      let setParametersAbiJSON = component.getLiquidityPoolAbi[26];

      console.error(JSON.stringify(setRangeAbiJSON));
      console.error(JSON.stringify(addSymbolAbiJSON));
      console.error(JSON.stringify(setParametersAbiJSON));

      //const data = new component.getWeb3.eth.abi.encodeFunctionCall(abiJson, parameters);
      
      //TODO: deploy proposal contract

      /*
      let loadedPoolManagementProposalJSON = JSON.parse(PoolManagementProposalJSON);
      const poolManagmentProposalContract = new component.getWeb3.eth.Contract(loadedPoolManagementProposalJSON);
        
      const deployPoolManagmentProposal = await poolManagmentProposalContract.deploy({
        data: loadedPoolManagementProposalJSON.bytecode
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
          component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
        }
        
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      }); */


      //TODO: save execution strings to proposal contract
      //TODO: register proposal contract with proposal manager
    }
  }
}
</script>
