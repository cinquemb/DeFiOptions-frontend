<template>

<div class="section-small">

  <div class="d-flex justify-content-between flex-wrap">

    <!-- Option data -->
    <div class="div-flex justify-content-center flex-wrap">
      <OptionDataItem class="data-item" title="Pool" :data="formatOptionPool" :divider="true" />
      <OptionDataItem class="data-item" title="Strike" :data="'$' + option.strike" :divider="true" />
      <OptionDataItem v-if="getBreakEvenPrice" class="data-item" title="Break even" :data="getBreakEvenPrice" :divider="true" />
      <OptionDataItem class="data-item" title="Price" :green="true" :data="optionPriceFormatted" v-if="isGetBuy" />
      <OptionDataItem class="data-item" title="Price" :green="true" :data="optionPriceFormattedSell" v-if="isGetSell" />
    </div>

    <!-- Action button -->
    <div>
      <button @click="toggleForm" class="btn btn-success" v-if="!showForm && isGetBuy">
        Buy
        <i class="fas fa-chevron-down"></i>
        <i class="fas fa-chevron-up" v-if="showForm"></i>
      </button>

      <button @click="toggleForm" class="btn btn-success" v-if="!showForm && isGetSell">
        Sell
        <i class="fas fa-chevron-down"></i>
        <i class="fas fa-chevron-up" v-if="showForm"></i>
      </button>

      <button @click="toggleForm" class="btn btn-outline-success" v-if="showForm">
        Close
        <i class="fas fa-chevron-up"></i>
      </button>

      <span></span>
    </div>
  </div>

  <!-- Buy option form -->
  <BuyOption v-if="showForm && isGetBuy" class="show-form" :option="option" :side="side" />

  <!-- Sell option form -->
  <SellOption v-if="showForm && isGetSell" class="sell-form" :option="option" :side="side" />
  
</div>
  
</template>

<script>
import { mapGetters } from "vuex";
import OptionDataItem from '../OptionDataItem.vue';

import BuyOption from './BuyOption.vue';
import SellOption from './SellOption.vue';
import LiquidityPool from "../../contracts/GovernableLinearLiquidityPool.json";


export default {
  name: "Option",
  props: ["option", "side"],
  data() {
    return {
      optionPrice: null,
      optionPriceSell: null,
      optionPriceFormatted: "loading",
      optionPriceFormattedSell: "loading",
      showForm: false,
      slippage: 2, // 2% by default
    }
  },

  components: { 
    OptionDataItem,
    BuyOption,
    SellOption
  },

  created() {
    this.getOptionPrice();

    this.$store.dispatch("dai/fetchUserBalance");
    this.$store.dispatch("dai/fetchLpAllowance");
    this.$store.dispatch("dai/fetchPERAllowance");
    this.$store.dispatch("usdc/fetchUserBalance");
    this.$store.dispatch("usdc/fetchLpAllowance");
    this.$store.dispatch("usdc/fetchPERAllowance");
    this.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
    this.$store.dispatch("optionsExchange/fetchExchangeBalanceAllowance");
    this.$store.dispatch("optionsExchange/fetchPERBalanceAllowance");
  },

  computed: {
    ...mapGetters("accounts", ["getWeb3"]),
    //...mapGetters("liquidityPool", ["getLiquidityPoolContract"]),

    getBreakEvenPrice() {
      if (this.side == "BUY") {
        if (this.option.symbol.includes("EC")) { // CALL
          return "$" + Number(Number(this.optionPrice)+Number(this.option.strike)).toFixed(2);
        } else if (this.option.symbol.includes("EP")) { // PUT
          return "$" + Number(Number(this.option.strike)-Number(this.optionPrice)).toFixed(2);
        }
      } else {
        return null;
      }
      return null;
    },
    isGetBuy() {
      return this.side == "BUY"
    },

    formatOptionPool () {
      if (this.option.pool.length > 10) {
        let ts = '0x' + this.option.pool

        return ts.substring(0, 6) + '...' + ts.substring(38, 42)
      } else {
        return this.option.pool
      }
    }, 

    isGetSell() {
      return this.side == "SELL"
    }

  },

  methods: {

    async getOptionPrice() {
      // fetch option price
      console.log(this.option.symbol);
      const poolContract = new this.getWeb3.eth.Contract(LiquidityPool.abi, this.option.poolAddr);

      let result = await poolContract.methods.queryBuy(this.option.symbol, 1).call();
      let resultSell = await poolContract.methods.queryBuy(this.option.symbol, 0).call();
      
      if (result) {
        this.optionPrice = this.getWeb3.utils.fromWei(result.price, "ether") * (1 + (this.slippage/100));
        this.optionPriceFormatted = "$" + Number(this.optionPrice).toFixed(2);
      }

      if (resultSell) {
        this.optionPriceSell = this.getWeb3.utils.fromWei(resultSell.price, "ether") * (1 + (this.slippage/100));
        this.optionPriceFormattedSell = "$" + Number(this.optionPriceSell).toFixed(2);
      }
    },

    toggleForm() {
      this.getOptionPrice(); // refresh the option price

      if (this.showForm) {
        this.showForm = false;
      } else {
        this.showForm = true;
      }
    }

  }
}
</script>

<style>
.data-item {
  margin-right: 5px;
}

.div-flex {
  display: flex;
}

.fa-chevron-down, .fa-chevron-up {
  margin-left: 10px;
}

.show-form {
  margin-top: 24px;
}

.section-small {
  margin-top: 16px;
}

/* Mobile screens */
@media screen and (max-width: 600px) {
  .data-item {
    margin-right: 0px;
  }

  .div-flex {
    display: block;
  }
}
</style>