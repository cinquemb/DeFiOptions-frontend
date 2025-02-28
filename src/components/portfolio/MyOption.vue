<template>

<div class="section-small" v-if="!hide">

  <div class="d-flex justify-content-between flex-wrap">

    <!-- Option data -->
    <div class="div-flex justify-content-center">
      <OptionDataItem class="data-item" title="Option" :data="option.pair+' · ' + option.type" :divider="true" />
      <OptionDataItem class="data-item" title="Side" :data="optionSide" :divider="true" />
      <OptionDataItem class="data-item" title="Size" :data="optionAmount" :divider="true" />
      <OptionDataItem class="data-item" title="Strike" :data="strikePrice" :divider="true" />
      <OptionDataItem v-if="Number(option.timestamp)*1e3 < Date.now()" class="data-item" title="Expiry price" :data="'$'+expiryPrice" :divider="true" />
      <OptionDataItem class="data-item" title="Expiration" :data="option.maturity" :divider="true" />
      <OptionDataItem class="data-item" title="Intrinsic value" :green="true" :data="'$'+intrinsicValue" info="Intrinsic value is the difference between the current price of the underlying asset and the strike price of the option." />
    </div>

    <!-- Action button -->
    <div>
      <button @click="toggleSellForm" v-if="!isOptionExpired(option) && !showSellForm && (option.holding > 0)" class="btn btn-success">
        Sell
        <i class="fas fa-chevron-down"></i>
      </button>

      <button @click="burnOption" v-if="!isOptionExpired(option) && !showSellForm && (option.holding > 0) && (option.holding == option.written)" class="btn btn-success">
        Burn
        <i class="fas fa-chevron-down"></i>
      </button>

      <button @click="toggleSellForm" v-if="!isOptionExpired(option) && showSellForm" class="btn btn-outline-success">
        Close
        <i class="fas fa-chevron-up"></i>
      </button>

      <button @click="redeemOption" v-if="isOptionExpired(option) && intrinsicValue > 0" class="btn btn-success">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Redeem
      </button>
      
      <button v-if="isOptionExpired(option) && intrinsicValue == 0" class="btn btn-danger" @click="copyOptionAddr">Expired</button>

      <button @click="liquidateOptions" v-if="isOptionExpired(option) && ((this.option.written > this.option.holding) || ((this.isPoolExposure === true) && ((this.option.written > 0) || ((this.option.holding > 0)))))" class="btn btn-outline-success">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Free Collateral
      </button>

      <span></span>
    </div>

  </div>

  <!-- Sell option form -->
  <div v-if="showSellForm" class="sell-form">
    <h3>
      Option size
      <i 
        @mouseover="showInfo" 
        id="infoEl" 
        class="fas fa-info-circle" 
        data-bs-toggle="tooltip" 
        data-bs-placement="bottom" 
        title="The Sell button shows the price the liquidity pool is willing to pay for your options, 
        consisting of the option's intrinsic value and a potential premium on top of it. If you sell
        your option before expiry, you may get a lesser value due to a spread."
      ></i>
    </h3>

    <div class="d-flex flex-wrap">

      <div>
        <input type="text" v-model="selectedOptionSize" class="form-control sell-input" placeholder="0.0">

        <div class="form-text sell-text">
          <span v-if="isOptionSizeNotValid.status" >
            {{ isOptionSizeNotValid.message }}
          </span>

          <span class="form-text sell-text">
            Max size: <span class="max-sell" @click="selectedOptionSize = getMaxOptionSize">{{getMaxOptionSize}}</span>
            <span v-if="Number(this.option.holding) > Number(getMaxOptionSize)"> 
              (Your total holding is bigger: {{this.option.holding}})
            </span>.
          </span>
        </div>

      </div>

      <div class="form-button-mobile" v-if="isEnoughAllowance">
        <button @click="sellOption" class="btn btn-success form-control" :disabled="isOptionSizeNotValid.status">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Sell for ${{getTotal.toFixed(2)}}
        </button>
        <div></div>
      </div>

      <div class="form-button-mobile" v-if="!isEnoughAllowance">
        <button @click="approveAllowance" class="btn btn-success form-control" :disabled="isOptionSizeNotValid.status">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Approve the sell (${{getTotal.toFixed(2)}})
        </button>
        <div></div>
      </div>
      
    </div>
  </div>
  
</div>
  
</template>

<script>
import { mapGetters } from "vuex";
import OptionDataItem from '../OptionDataItem.vue';
import OptionTokenContractJson from "../../contracts/OptionToken.json";
import ChainlinkContractJson from "../../contracts/ChainlinkFeed.json";
import addresses from "../../contracts/addresses.json";


export default {
  name: "MyOption",
  props: ["option", "isPoolExposure"],
  data() {
    return { 
      expiryPrice: null, // price at the expiration date (if option expired already)
      hide: false,
      loading: false,
      slippage: 2, // 2% by default
      optionAllowance: 0, // has user approved the option token yet and for what amount
      selectedOptionPrice: null, // sell option data
      selectedOptionSize: null, // sell option data
      selectedOptionVolume: null, // sell option data
      showSellForm: false
    }
  },

  components: { 
    OptionDataItem 
  },

  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainId", "getWeb3"]),
    ...mapGetters("liquidityPool", ["getLiquidityPoolContract", "getLiquidityPoolAddress"]),
    ...mapGetters("incentivized", ["getIncentivizedContract"]),

    
    getMaxOptionSize() {
      // max option size that current user can sell
      let availableOptionVolume = Math.floor(Number(this.selectedOptionVolume*1000))/1000;
      let userOptionBalance = Number(this.option.holding);

      if (userOptionBalance > availableOptionVolume) {
        return availableOptionVolume;
      } else {
        return userOptionBalance;
      }
    },
    getTotal() {
      return Number(this.selectedOptionSize) * Number(this.selectedOptionPrice);
    },
    intrinsicValue() {
      return (this.option.holding > 0) ? (Number(this.option.intrinsicValue)*Number(this.option.holding)).toFixed(2) : (Number(this.option.intrinsicValue)*Number(-1)*Number(this.option.written)).toFixed(2);
    },
    isEnoughAllowance() {
      if (Number(this.optionAllowance) >= Number(this.selectedOptionSize)) {
        return true;
      }

      return false;
    },
    isOptionSizeNotValid() { // validation for option size
      // option size bigger than volume.
      if (Number(this.selectedOptionSize) > Number(this.getMaxOptionSize)) {
        return {status: true, message: "Option size too big!"};
      }

      // too many digits
      if (String(this.selectedOptionSize).length > 14) {
        return {status: true, message: "Reduce the number of digits."};
      }

      // negative option size
      if (Number(this.selectedOptionSize) < 0) {
        return {status: true, message: "Must not be negative!"};
      }

      // not a number
      if (isNaN(this.selectedOptionSize)) {
        return {status: true, message: "Please enter a number."};
      }

      // null option size
      if (this.selectedOptionSize === null || Number(this.selectedOptionSize) === 0 || this.selectedOptionSize === undefined || this.selectedOptionSize === "") {
        return {status: true, message: "Must not be empty/zero!"};
      }

      return {status: false, message: "Valid option size"};
    },
    strikePrice() {
      return "$"+Number(this.option.strike).toFixed(0);
    },
    optionSide() {
      return (this.option.written > this.option.holding) ? "NET SHORT": "NET LONG";
    },
    optionAmount(){
      return (this.option.written > this.option.holding) ? (this.option.written-this.option.holding) : this.option.holding
    },
  },

  created() {
    this.fetchExpiryPrice();
    this.fetchOptionAllowance();
    this.$store.dispatch("incentivized/fetchContract");

  },

  methods: {

    async copyOptionAddr() {
      try {
        await navigator.clipboard.writeText(this.option.address);
        let msg = "Copied Option Address (" + this.option.address + ") to clipboard";
        this.$toast.success(msg);
      } catch($e) {return;}
    },

    // approve allowance to sell an option
    async approveAllowance() {
      let component = this;
      component.loading = true;

      // convert selected option size to wei
      let tokensWei = component.getWeb3.utils.toWei(String(component.selectedOptionSize), "ether");
      const allowanceValue = component.selectedOptionSize;

      // option token contract
      const optionContract = new component.getWeb3.eth.Contract(OptionTokenContractJson.abi, this.option.address);

      // call the approve method
      await optionContract.methods.approve(component.getLiquidityPoolAddress, tokensWei).send({
        from: component.getActiveAccount,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      }).on('transactionHash', function(hash){
        console.log("tx hash: " + hash);
        component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");

      }).on('receipt', function(receipt){
        console.log(receipt);

        if (receipt.status) {
          component.$toast.success("The approval was successfull. You can sell the option now.");

          component.optionAllowance += allowanceValue; // manually increase the allowance amount
          component.$store.dispatch("optionsExchange/fetchUserOptions"); // refresh values
          
        } else {
          component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
        }
        
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });

    },

    async fetchExpiryPrice() {
      if (Number(this.option.timestamp)*1000 < Date.now()) {
        let priceFeedType = this.option.pair; // ETH/USD, BTC/USD etc. addresses in addresses.json are ChainLink feeds

        const feedAddress = addresses[priceFeedType][parseInt(this.getChainId)];
        const feedContract = new this.getWeb3.eth.Contract(ChainlinkContractJson.abi, feedAddress);
        const historicPriceObj = await feedContract.methods.getPrice(Number(this.option.timestamp)).call();
        this.expiryPrice = Number(this.getWeb3.utils.fromWei(historicPriceObj.price, "ether")).toFixed(0);
      }

    },

    async fetchOptionAllowance() {
      const optionContract = new this.getWeb3.eth.Contract(OptionTokenContractJson.abi, this.option.address);

      const allowanceWei = await optionContract.methods.allowance(this.getActiveAccount, this.getLiquidityPoolAddress).call();

      this.optionAllowance = this.getWeb3.utils.fromWei(String(allowanceWei), "ether");
    },

    isOptionExpired(option) {
      return Math.floor(Date.now()/1000) > Number(option.timestamp);
    },

    async burnOption() {
      let component = this;
      component.loading = true;

      // get option contract
      let optionContract = new this.getWeb3.eth.Contract(OptionTokenContractJson.abi, this.option.address);
      const optionBalanceWei = await optionContract.methods.balanceOf(component.getActiveAccount).call(); 

      // burn option transaction
      await optionContract.methods.burn(
        optionBalanceWei
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
          component.$toast.success("You have successfully burned your written option. It may take 10 seconds or more for values to update.");

          // hide the option manually, because Polygon's nodes have a lag
          component.hide = true;

          // refresh values
          component.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
          component.$store.dispatch("optionsExchange/fetchUserOptions");
          
        } else {
          component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
        }
        
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },

    async redeemOption() {
      let component = this;
      component.loading = true;

      // get option contract
      let optionContract = new this.getWeb3.eth.Contract(OptionTokenContractJson.abi, this.option.address);

      // redeem option transaction
      await optionContract.methods.redeem(
        (component.isPoolExposure === true) ? component.getLiquidityPoolAddress : component.getActiveAccount
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
          component.$toast.success("You have successfully redeemed your expired option. It may take 10 seconds or more for values to update.");

          // hide the option manually, because Polygon's nodes have a lag
          component.hide = true;

          // refresh values
          component.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
          component.$store.dispatch("optionsExchange/fetchUserOptions");
          
        } else {
          component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
        }
        
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },

    async liquidateOptions() {
      let component = this;
      component.loading = true;

      // liquidateOptions transaction
      await component.getIncentivizedContract.methods.liquidateExpired(
        component.option.address,
        [(component.isPoolExposure === true) ? component.getLiquidityPoolAddress : component.getActiveAccount]
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
          component.$toast.success("You have successfully liquidated your expired written options and freed your collateral. It may take 10 seconds or more for values to update.");

          // hide the option manually, because Polygon's nodes have a lag
          component.hide = true;

          // refresh values
          component.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
          component.$store.dispatch("optionsExchange/fetchUserOptions");
          
        } else {
          component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
        }
        
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },

    async sellOption() {
      const component = this;
      component.loading = true;

      component.setSellData(component.option); // fetch price again to avoid errors 

      const optionSizeWei = component.getWeb3.utils.toWei(String(component.selectedOptionSize), "ether");
      const optionUnitPrice = component.getWeb3.utils.toWei(String(component.selectedOptionPrice), "ether");

      // sell option transaction
      await component.getLiquidityPoolContract.methods.sell(
        component.option.symbol, // symbol
        optionUnitPrice, // price per one option
        optionSizeWei, // volume a.k.a. user's selected option size
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
          component.$toast.success("You have successfully sold an option. Please reload the website to refresh values.");

          // reduce the amount of options user can sell
          // needs to be reduced manually, because Polygon nodes have a lag
          // BigNumber needs to be used to avoid precision errors
          let bnHolding = component.getWeb3.utils.toBN(component.getWeb3.utils.toWei(String(component.option.holding), "ether"));
          let bnSold = component.getWeb3.utils.toBN(component.getWeb3.utils.toWei(String(component.selectedOptionSize), "ether"));
          component.option.holding = component.getWeb3.utils.fromWei(bnHolding.sub(bnSold), "ether").toString();
        } else {
          component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
        }
        
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });

    },

    async setSellData() {
      const result = await this.getLiquidityPoolContract.methods.queryBuy(this.option.symbol, 0).call();

      if (result) {
        this.selectedOptionPrice = this.getWeb3.utils.fromWei(String(result.price), "ether"); //* (1 + (this.slippage/100));
        this.selectedOptionVolume = this.getWeb3.utils.fromWei(String(result.volume), "ether");

        if (!this.selectedOptionSize) {
          this.selectedOptionSize = this.getMaxOptionSize;
        }

        // hardcoded 0.125% slippage
        this.selectedOptionPrice -= Number(this.selectedOptionPrice) * 0.00125;
      }
    },

    toggleSellForm() {
      if (this.showSellForm) {
        this.showSellForm = false;
      } else {
        this.setSellData();
        this.showSellForm = true;
      }
    },

    showInfo() {
      // enable tooltip
      var infoEl = document.getElementById('infoEl')
      var tooltip = new window.bootstrap.Tooltip(infoEl)
      tooltip.show();
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

.sell-form {
  margin-top: 24px;
}

.sell-input {
  max-width: 200px;
  margin-right: 10px;
}

.sell-text {
  color: white;
  font-weight: 400;
  font-size: 12px;
}

.section-small {
  margin-top: 16px;
}

/* Mobile screens */
@media screen and (max-width: 600px) {
  .data-time {
    margin-right: 0px;
  }

  .div-flex {
    display: block;
  }
}
</style>