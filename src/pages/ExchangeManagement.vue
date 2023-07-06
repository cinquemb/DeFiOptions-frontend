<template>
  <div>

    <h1> Incentivized Management of Exchange Risk </h1>
    <!------ update dex agg ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetAddress :data="IncrementRoundDexAgg" />
        <span></span>
        <button @click="incrementRoundDexAgg" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Update DEX Aggregator
        </button>
      </div>
    </div>
    <span></span>
    <span></span>


    <!------ update udl sample ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetAddress :data="PrefetchSample" />
        <span></span>
        <button @click="prefetchSample" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Update Feed Samples
        </button>
      </div>
    </div>
    <span></span>
    <span></span>


    <!------ update udl daily price ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetAddress :data="PrefetchDailyPrice" />
        <span></span>
        <button @click="prefetchDailyPrice" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Update Daily Price
        </button>
      </div>
    </div>
    <span></span>
    <span></span>


    <!------ update udl daily volitility ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetAddress :data="PrefetchDailyVolatility" />
        <span></span>
        <button @click="prefetchDailyVolatility" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Update Daily Volitilty
        </button>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ liquidate expired options ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetAddressMap :data="LiquidateExpired" />
        <span></span>
        <button @click="liquidateExpired" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Settle Expired
        </button>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ liquidate options ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetAddressMapMultiple :data="LiquidateOptions" />
        <span></span>
        <button @click="liquidateOptions" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Liquidate
        </button>
      </div>
    </div>
    <span></span>
    <span></span>

    <!------ burn options ------>

    <div class="section-big row mt-4 mx-3">
      <div class="col-md-12">
        <SetAddressMapMultiple :data="BurnOptions" />
        <span></span>
        <button @click="burnOptions" class="btn btn-success">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Remove Expired Options From Book
        </button>
      </div>
    </div>
    <span></span>
    <span></span>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SetAddress from '../components/manage/exchange/SetAddress.vue';
import SetAddressMap from '../components/manage/exchange/SetAddressMap.vue';
import SetAddressMapMultiple from '../components/manage/exchange/SetAddressMapMultiple.vue';
import UnderlyingFeedJSON from "../contracts/UnderlyingFeed.json";
import AggregatorV3InterfaceJSON from '../contracts/AggregatorV3Interface.json';
import OptionTokenJSON from '../contracts/OptionToken.json';


export default {
  name: 'ExchangeManagement',
  data() {
    return {
      loading: false,
      IncrementRoundDexAgg: {
        addr: null,
        desc: "Update DEX Aggregator contract"
      },
      PrefetchSample: {
        addr: null,
        desc: "Set Updated data for underlying feed"
      },
      PrefetchDailyPrice: {
        addr: null,
        desc: "Set daily price for the underlying feed"
      },
      PrefetchDailyVolatility: {
        addr: null,
        desc: "Set daily volitility for the underlying feed"
      },
      LiquidateExpired: {
        field_name1: "Option Token Address",
        value1: null,
        field_name2: "List of Option Token Holder(s)/Writer Address(es)",
        value2: [],
        desc: "Settle Option After Expiration"
      },
      LiquidateOptions: {
        field_name1: "Option Token Address",
        value1: null,
        field_name2: "Option Token Holder/Writer Adress",
        value2: null,
        desc: "Execute Collateral Call/Liquidate Option Writer"
      },
      CleanUp: {
        field_name1: "Account Address",
        value1: null,
        field_name2: "Option Token Address",
        value2: null,
        desc: "Execute Collateral Call/Liquidate Option Writer"
      },
      BurnOptions: {
        field_name1: "Account Address",
        value1: null,
        field_name2: "Option Token Address",
        value2: null,
        desc: "Burn Options"
      },
    }
  },
  components: {
    SetAddress,
    SetAddressMap,
    SetAddressMapMultiple,
  },
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "getWeb3", "isUserConnected"]),
    ...mapGetters("optionsExchange", ["getOptionsExchangeContract","getLiquidityPoolBalance", "getSelectedPool"]),
    ...mapGetters("protocolSettings", ["getProtocolSettingsContract"]),
    ...mapGetters("incentivized", ["getIncentivizedContract"]),
  },
  created() {
    if (!this.getWeb3 || !this.isUserConnected) {
      this.$router.push({ name: 'home'});

      this.$store.dispatch("protocolSettings/fetchContract");
      this.$store.dispatch("protocolSettings/storeAbi");

      this.$store.dispatch("incentivized/fetchContract");
      this.$store.dispatch("incentivized/storeAbi");
    }

  },

  methods: {
    async incrementRoundDexAgg() {
      //      function incrementRoundDexAgg(address dexAggAddr) incentivized external, SetAddress
      let component = this;
      component.loading = true;

      await component.getIncentivizedContract.methods.incrementRoundDexAgg(
        component.IncrementRoundDexAgg.addr
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
          component.$toast.success("Updated DEX Agg Succeeded");
        } else {
          component.$toast.error("The incrementRoundDexAgg tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },
    async prefetchSample() {
      //      function prefetchSample(address udlFeed) incentivized external, SetAddress
      let component = this;
      component.loading = true;

      await component.getIncentivizedContract.methods.prefetchSample(
        component.PrefetchSample.addr
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
          component.$toast.success("Update Feed Samples Succeeded");
        } else {
          component.$toast.error("The prefetchSample tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },
    async prefetchDailyPrice() {
      //      function prefetchDailyPrice(address udlFeed, uint roundId) incentivized external , SetAddress
      let component = this;
      component.loading = true;

      const feedContract = await new component.getWeb3.eth.Contract(UnderlyingFeedJSON.abi, component.PrefetchDailyPrice.addr);

      const feedAggrContractAddr = await feedContract.methods.getUnderlyingAggAddr().call();
      const feedAggrContract = await new component.getWeb3.eth.Contract(AggregatorV3InterfaceJSON.abi, feedAggrContractAddr);

      //function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound );

      const latestRoundData = await feedAggrContract.methods.latestRoundData().call();

      await component.getIncentivizedContract.methods.prefetchDailyPrice(
        component.PrefetchDailyPrice.addr,
        latestRoundData[0]
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
          component.$toast.success("Update Feed Daily Price Succeeded");
        } else {
          component.$toast.error("The prefetchDailyPrice tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },
    async prefetchDailyVolatility() {
      //      function prefetchDailyVolatility(address udlFeed, uint timespan) incentivized external, SetAddress
      let component = this;
      component.loading = true;

      const timespan = await component.getProtocolSettingsContract.methods.getVolatilityPeriod().call();

      await component.getIncentivizedContract.methods.prefetchDailyVolatility(
        component.PrefetchDailyVolatility.addr,
        timespan
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
          component.$toast.success("Update Feed Volitility Succeeded");
        } else {
          component.$toast.error("The prefetchDailyVolatility tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },
    async liquidateExpired() {
      //      function liquidateExpired(address _tk, address[] calldata owners) external, SetAddressMapMultiple
      let component = this;
      component.loading = true;

      await component.getIncentivizedContract.methods.liquidateExpired(
        component.LiquidateExpired.value1,
        component.LiquidateExpired.value2.split(","),
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
          component.$toast.success("Settlement Of Expired Option Succeeded");
        } else {
          component.$toast.error("The liquidateExpired tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },
    async liquidateOptions() {
      //      function liquidateOptions(address _tk, address owner) public returns (uint value), SetAddressMap
      let component = this;
      component.loading = true;

      await component.getIncentivizedContract.methods.liquidateOptions(
        component.LiquidateOptions.value1,
        component.LiquidateOptions.value2,
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
          component.$toast.success("Collateral Call/Liquidation Succeeded");
        } else {
          component.$toast.error("The liquidateOptions tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },
    async cleanUp() {
      //      function cleanUp(address owner, address _tk) public returns (uint value), SetAddressMap
      let component = this;
      component.loading = true;

      await component.getOptionsExchangeContract.methods.cleanUp(
        component.CleanUp.value1,
        component.CleanUp.value2,
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
          component.$toast.success("Removal Success");
        } else {
          component.$toast.error("The cleanUp tx has failed. Please contact the DeFi Options support.");
        }
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },

    async burnOptions() {
      //      function  burn(address owner, uint value) public returns (uint value), SetAddressMap
      let component = this;
      component.loading = true;

      const optionContract = await new component.getWeb3.eth.Contract(OptionTokenJSON.abi,       component.BurnOptions.value2);

      const burnValue = await optionContract.methods.balanceOf(component.BurnOptions.value1).call();

      await component.getOptionsExchangeContract.methods.burn(
        component.BurnOptions.value1,
        burnValue,
        component.BurnOptions.value2
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
          component.$toast.success("Removal Success");
        } else {
          component.$toast.error("The cleanUp tx has failed. Please contact the DeFi Options support.");
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
