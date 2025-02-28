<template>
  <div>
    <div class="row">
      <div class="btn-group mt-2" role="group" aria-label="Basic example">
          <button @click="changeSellType('WRITE')" type="button" class="btn btn-outline-primary btn-md" :class="{'btn-outline-primary-active':'WRITE' === selectedSellType}">WRITE</button>
          <button @click="changeSellType('SELL')" type="button" class="btn btn-outline-primary btn-md" :class="{'btn-outline-primary-active':'SELL' === selectedSellType}">SELL</button>
      </div>
    </div>

    <h3 class="mt-3">
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

    <div class="btn-group mt-1" role="group" aria-label="Basic example" v-if="!getSellType">
      <button @click="changeCoveredType('COVERED')" type="button" class="btn btn-outline-primary btn-md" :class="{'btn-outline-primary-active':'COVERED' === selectedCoveredType}" v-if="!isPut">COVERED</button>
      <button @click="changeCoveredType('NAKED')" type="button" class="btn btn-outline-primary btn-md" :class="{'btn-outline-primary-active':'NAKED' === selectedCoveredType}">CASH SECURED</button>
    </div>

    <div class="d-flex flex-wrap mt-3">

      <div>
        <input type="text" v-model="selectedOptionSize" class="form-control sell-input" placeholder="0.0">

        <div class="form-text sell-text">
          <span v-if="isOptionSizeNotValid.status" >
            {{ isOptionSizeNotValid.message }}
          </span>

          <span class="form-text sell-text">
            <span v-if="Number(selectedOptionSize) > Number(getMaxOptionSize)"> 
            Max size: <span class="max-sell" @click="selectedOptionSize = getMaxOptionSize">{{getMaxOptionSize}}</span>.
            </span>

            <span> 
              Collateral Required: ${{ getCollateralNeeded }}
            </span>
            
            <span v-if="Number(this.option.holding) > Number(getMaxOptionSize)"> 
              (Your total holding is bigger: {{this.option.holding}})
            </span>
          </span>
        </div>

        <div class="form-button-mobile" v-if="getCoveredType && !getSellType && !isPut">
          <div class="show-text form-text" :key="writingOptionsBalance">
            Balance: {{Number(underlyingBalance).toFixed(2)}} 
            <a target="_blank" :href="'https://polygonscan.com/token/'+this.underlyingAddr">{{underlyingSymbol}}</a>.
          </div>
        </div>

      </div>

      <div class="form-button-mobile" v-if="!getCoveredType">
        <div class="btn-group" aria-describedby="button-text">
          <button type="button" class="btn btn-outline-success dropdown-toggle text-uppercase" data-bs-toggle="dropdown" aria-expanded="false">
            {{buyWith}}
          </button>
          <ul class="dropdown-menu">
            <li>
              <span class="dropdown-item text-uppercase" @click="setBuyWith('DAI')">DAI</span>
              <span class="dropdown-item text-uppercase" @click="setBuyWith('USDC')">USDC</span>
              <span class="dropdown-item text-uppercase" @click="setBuyWith('Exchange Surplus Balance')">Exchange Surplus Balance</span>
            </li>
          </ul>
        </div>

        <div class="show-text form-text">
          Balance: {{Number(getUserStablecoinBalance).toFixed(2)}} {{buyWith}}.
        </div>
      </div>
    </div>

     <!-- write to open and sell option -->
    <div class="d-flex flex-row" v-if="!getSellType">
      <div class="p-2" v-if="(!getCoveredType) && (!isBuyWithExchangeBalance)">
        <button @click="approveStablecoinCollateralDeposit" class="btn btn-success form-control" :disabled="(isOptionSizeNotValid.status || isEnoughAllowance)">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Approve {{buyWith}}
        </button>
      </div>
      <!-- <div></div> -->

      <div class="p-2" v-if="getCoveredType">
        <button @click="approveAllowanceCovered" class="btn btn-success form-control" :disabled="(isOptionSizeNotValid.status || isEnoughAllowance) || (writingStepTx > 0) || getMaxOptionSize === 0">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Approve {{underlyingSymbol}}
        </button>
      </div>
      <!-- <div></div> -->

      <div class="p-2"  v-if="(!getCoveredType) && (!isBuyWithExchangeBalance)">
        <button @click="depositCollateral" class="btn btn-success form-control" :disabled="(isOptionSizeNotValid.status || isEnoughAllowance) || (writingStepTx < 1)">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Deposit {{buyWith}}
        </button>
      </div>
      <!-- <div></div> -->

      <div class="p-2" v-if="!getCoveredType">
        <button @click="writeOptions" class="btn btn-success form-control" :disabled="(isOptionSizeNotValid.status) || ((writingStepTx < 2) && (!isBuyWithExchangeBalance))">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Write Cash Secured and Sell for ${{getTotal.toFixed(2)}}
        </button>
      </div>

      <div class="p-2" v-if="!getCoveredType">
        <button @click="writeOptionsPending" class="btn btn-success form-control" :disabled="(isOptionSizeNotValid.status) || ((writingStepTx < 2) && (!isBuyWithExchangeBalance))">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Write Cash Secured and make Sell order for ${{getTotal.toFixed(2)}}
        </button>
      </div>
      <!-- <div></div> -->

      <div class="p-2" v-if="getCoveredType">
        <button @click="writeCovered" class="btn btn-success form-control" :disabled="(isOptionSizeNotValid.status) || (writingStepTx < 1)">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Write Covered and Sell for ${{getTotal.toFixed(2)}}
        </button>
      </div>
      <div class="p-2" v-if="getCoveredType">
        <button @click="writeCoveredPending" class="btn btn-success form-control" :disabled="(isOptionSizeNotValid.status) || (writingStepTx < 1)">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Write Covered and make Sell order for ${{getTotal.toFixed(2)}}
        </button>
      </div>
      <!-- <div></div> -->
    </div>

    <small v-if="allowanceNeeded && getSellType" class="show-text form-text text-center">
      You'll need to make 2 transactions (if already holding options): approve & sell. If you want to sell to open, you must toggle "WRITE" first.
    </small>
    <div></div>

    <small v-if="allowanceNeeded && !getSellType" class="show-text form-text text-center">
        You'll need to make 1-3 transactions (if not holding options): approve (and deposit) collateral.
    </small>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import OptionTokenContractJson from "../../contracts/RedeemableToken.json";
import ChainlinkContractJson from "../../contracts/ChainlinkFeed.json";
import ERC20ContractJson from "../../contracts/ERC20.json";
import addresses from "../../contracts/addresses.json";
import LiquidityPool from "../../contracts/GovernableLinearLiquidityPool.json";

export default {
  name: "SellOption",
  props: ["option", "side"],

  data() {
    return {
      buyWith: "DAI",
      loading: false,
      optionPriceSell: null,
      optionPriceFormattedSell: "loading",
      selectedOptionSize: 0.1,
      selectedOptionVolume: null,
      selectedOptionPrice: null,
      selectedSellType: "WRITE",
      selectedCoveredType: "NAKED",
      slippage: 0.125, // 2% by default
      tooLowVolume: false,
      //unlimitedApproval: false,
      underlyingBalance: 0,
      underlyingSymbol: "N/A",
      underlyingAddr: "N/A",
      writingOptionsBalance: 0,
      collateralNeededRaw: 0,
      collateralDepositValue: 0,
      writingStepTx: 0,
    }
  },

  created() {
    this.setFormData();
    this.fetchUnderlyingAssetBalance();
    this.setHoldingOptions();
    this.fetchOptionAllowance();
  },

  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainId", "getWeb3"]),
    //...mapGetters("liquidityPool", ["getLiquidityPoolContract"]),
    ...mapGetters("dai", ["getUserDaiBalance", "getDaiContract", "getLpDaiAllowance"]),
    ...mapGetters("optionsExchange", ["getOptionsExchangeAddress", "getOptionsExchangeContract", "getExchangeUserBalance", "getUserCollateralSurplus", "getUserExchangeBalanceAllowance", "getUserOptions", "getPendingExposureRouterContract"]),
    ...mapGetters("usdc", ["getUserUsdcBalance", "getUsdcContract", "getLpUsdcAllowance"]),

    allowanceNeeded() {
      if (this.buyWith === "DAI") {
        return this.getLpDaiAllowance < this.getTotal;

      } else if (this.buyWith === "USDC") {
        return this.getLpUsdcAllowance < this.getTotal;

      } else if (this.buyWith === "USDT") { // Tether
        return true; // TODO

      } else if (this.buyWith === "Exchange Surplus Balance") {
        return this.getUserExchangeBalanceAllowance < this.getTotal;
      }

      return false;
    },

    getHoldingOptions() {
      let sym = this.option.symbol;
      let matchingUserOptions = this.getUserOptions.filter(option => option.symbol === sym);
      if (matchingUserOptions.length > 0){
        return matchingUserOptions[0].holding;
      } else {
        return 0;
      }
    },

    getCollateralNeeded(){
      return this.collateralNeededRaw.toFixed(4)
    },
    
    getMaxOptionSize() {
      let availableOptionVolume = Math.floor(Number(this.selectedOptionVolume*1000000000000))/1000000000000;
      let optionPriceSell = Number(this.optionPriceSell);
      let maxTotal = availableOptionVolume * optionPriceSell;

      // max option size that current user can write
      if (this.option.holding == 0) {

        if (this.selectedCoveredType === "COVERED") {
          let userBalance = Number(this.underlyingBalance);

          if (maxTotal > userBalance) {
            return userBalance;
          } else {
            return availableOptionVolume;
          }
        } else {
          // NAKED
          let userBalance = Number(this.getUserStablecoinBalance);
          if (this.collateralNeededRaw > userBalance) {
            return (this.selectedOptionSize * (userBalance / this.collateralNeededRaw)).toFixed(8);
          } else {
            return this.selectedOptionSize;
          }
        }
      } else {
        return this.option.holding;
      }
    },

    getTotal() {
      return Number(this.selectedOptionSize) * Number(this.optionPriceSell);
    },

    getUserStablecoinBalance() {
      if (this.buyWith === "DAI") {
        return this.getUserDaiBalance;
      } else if (this.buyWith === "USDC") {
        return this.getUserUsdcBalance;
      } else if (this.buyWith === "Exchange Surplus Balance") {
        return this.getUserCollateralSurplus;
      }

      return null;
    },

    isOptionSizeNotValid() { // validation for option size
      // option size bigger than volume.
      /*if (Number(this.selectedOptionSize) > Number(this.selectedOptionVolume)) {
        return {status: true, message: "Must not be bigger than " + Math.floor(Number(this.selectedOptionVolume*1000000000000))/1000000000000 + "!"};
      }*/

      /*if (Number(this.selectedOptionSize) > Number(this.getMaxOptionSize)) {
        return {status: true, message: "Too big!"};
      }*/

      // too many digits
      if (String(this.selectedOptionSize).length > 14) {
        return {status: true, message: "Please reduce the number of digits."};
      }

      // negative option size
      if (Number(this.selectedOptionSize) < 0) {
        return {status: true, message: "Option size must not be negative!"};
      }

      // not a number
      if (isNaN(this.selectedOptionSize)) {
        return {status: true, message: "Please enter a number."};
      }

      // null option size
      if (this.selectedOptionSize === null || Number(this.selectedOptionSize) === 0 || this.selectedOptionSize === undefined || this.selectedOptionSize === "") {
        return {status: true, message: "Must not be empty or zero!"};
      }

      // total bigger than balance
      if ((this.getTotal > Number(this.getUserStablecoinBalance)) && (this.side == "BUY")) {
        if (this.buyWith === "Exchange Surplus Balance") {
          return {status: true, message: "Your exchange balance is too low. Some aleady allocated for colateral."};
        }

        return {status: true, message: "Your " + this.buyWith + " balance is too low."};
      }

      return {status: false, message: "Valid option size"};
    },

    isEnoughAllowance() {
      if (Number(this.optionAllowance) >= Number(this.selectedOptionSize)) {
        return true;
      }

      return false;
    },

    isBuyWithExchangeBalance() {
      return this.buyWith === "Exchange Surplus Balance";
    },

    getSellType() {
      return this.selectedSellType == "SELL";
    },

    getCoveredType() {
      return this.selectedCoveredType == "COVERED";
    },

    isBuy() {
      return this.side == "BUY";
    },

    isPut() {
      if (this.option.symbol.includes("EC")) { // CALL
          return false;
      } else {
          return true;
      }
    }
  },

  watch: {
      selectedOptionSize: async function() {
        this.calcCollateral().then(this.writingOptionsBalance += 1);
      }
  },

  methods: {

    // approve the amount of underlying to use as collateral
    async approveAllowanceCovered() {
      let component = this;
      component.loading = true;

      let priceFeedType = this.option.pair;

      const feedAddress = addresses[priceFeedType][parseInt(component.getChainId)];
      const feedContract = new component.getWeb3.eth.Contract(ChainlinkContractJson.abi, feedAddress);
      const underlyingAddr = await feedContract.methods.getUnderlyingAddr().call();

      // underlying token contract
      const underlyingContract = new component.getWeb3.eth.Contract(ERC20ContractJson.abi, underlyingAddr);
      // get underlying balance in wei
      //const underlyingBalanceWei = await underlyingContract.methods.balanceOf(this.getActiveAccount).call();
      
      const underlyingDecimals = await underlyingContract.methods.decimals().call();
      const selectedUnderlyingBalanceWei = this.getWeb3.utils.toBN(parseInt(component.selectedOptionSize * (10 ** underlyingDecimals)));
      const allowanceValue = Number(selectedUnderlyingBalanceWei / (this.getWeb3.utils.toBN(10 ** underlyingDecimals))).toFixed(4);

      // call the approve method
      await underlyingContract.methods.approve(component.getOptionsExchangeAddress, selectedUnderlyingBalanceWei).send({
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

          component.underlyingAllowance = allowanceValue; // manually increase the allowance amount
          component.writingStepTx = 1;
          
        } else {
          component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
        }
        
        component.loading = false;

      }).on('error', function(error){
        console.log(error);
        component.loading = false;
        component.writingStepTx = 0;
        component.$toast.error("There has been an error. Please contact the DeFi Options support.");
      });
    },

    // approve allowance to sell an option
    async approveAllowanceOption() {
      let component = this;
      component.loading = true;

      // convert selected option size to wei
      let tokensWei = component.getWeb3.utils.toWei(String(component.selectedOptionSize), "ether");
      const allowanceValue = component.selectedOptionSize;

      if (this.option.address === undefined) {
        this.option.address = await component.getOptionsExchangeContract.methods.resolveToken(this.option.symbol).call();
      }

      // option token contract
      const optionContract = new component.getWeb3.eth.Contract(OptionTokenContractJson.abi, this.option.address);

      // call the approve method
      await optionContract.methods.approve(component.option.poolAddr, tokensWei).send({
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

    // approve the amount of stablecoins to use as collateral agaisnt exchange
    async approveStablecoinCollateralDeposit() {
      let component = this;
      component.loading = true;

      component.fetchUnderlyingAssetBalance();

      // define unit and token contract
      let unit = "ether"; // Exchange Balance & DAI - 18 decimals
      let tokenContract;

      if (component.buyWith === "USDT") {
        unit = "kwei"; // USDT (Tether) - 4 decimals
        // TODO: tokenContract = ...; // USDT contract
      }

      if (component.buyWith === "USDC") {
        unit = "mwei"; // USDC - 6 decimals
        tokenContract = component.getUsdcContract; // USDC contract
      }

      if (component.buyWith === "DAI") {
        tokenContract = component.getDaiContract; // DAI contract
      }

      console.log("component.collateralNeededRaw: "+ component.collateralNeededRaw);
      // define allowance value
      let allowanceValue = component.collateralNeededRaw * 1.05; // make it 5% bigger to avoid slippage issues

      /*
      if (component.unlimitedApproval) {
        allowanceValue = 10 ** 9; // 1B tokens as "unlimited" value
      }
      */

      const allowanceValueWei = component.getWeb3.utils.toWei(String(allowanceValue.toFixed(4)), unit); // round to 4 decimals
      
      // call the approve method
      try {
        await tokenContract.methods.approve(component.getOptionsExchangeAddress, allowanceValueWei).send({
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
            component.writingStepTx = 1;
            component.collateralDepositValue = String(component.collateralNeededRaw.toFixed(4));

            // refresh values
            if (component.buyWith === "DAI") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              component.$store.state.dai.exchangeAllowance = allowanceValue;
            } else if (component.buyWith === "USDC") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              component.$store.state.usdc.exchangeAllowance = allowanceValue;
            } else if (component.buyWith === "USDT") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              // component.$store.state.tether.exchangeAllowance = allowanceValue;
            }

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

    //calculated the mount of collateral needed to write the option
    async calcCollateral() {
      let priceFeedType = this.option.pair;

      const feedAddress = addresses[priceFeedType][parseInt(this.getChainId)];
      const optionSizeWei = this.getWeb3.utils.toWei(String(this.selectedOptionSize), "ether");
      const strikeInWei = this.getWeb3.utils.toWei(String(this.option.strikeRaw / 10 **18), "ether");


      const collateralNeeded = await this.getOptionsExchangeContract.methods.calcCollateral(
        feedAddress, // feed address
        optionSizeWei, //volume of options to write
        (this.option.type === "CALL") ? 0 : 1, //option type
        this.getWeb3.utils.toBN(strikeInWei), // strike price of option
        Number(this.option.timestamp), // maturity of option in utc
      ).call();

      console.log("option size:"+optionSizeWei)
      console.log("collateral req" +((collateralNeeded * 1.0025) / 10**18));

      this.collateralNeededRaw = (collateralNeeded * 1.0025) / 10**18; //estimate higher just in case
    },

    changeCoveredType(sellType) {
      this.selectedCoveredType = sellType;
    },

    changeSellType(sellType) {
      this.selectedSellType = sellType;
    },

    //deposit collateral into exchange if not avaialble exchnage balance
    async depositCollateral() {
      let component = this;
      component.loading = true;
      let tokenContract;
      // define unit and token contract
      let unit = "ether"; // Exchange Balance & DAI - 18 decimals

      if (component.buyWith === "USDT") {
        unit = "kwei"; // USDT (Tether) - 4 decimals
        // TODO: tokenContract = ...; // USDT contract
      }

      if (component.buyWith === "USDC") {
        unit = "mwei"; // USDC - 6 decimals
        tokenContract = component.getUsdcContract; // USDC contract
      }

      if (component.buyWith === "DAI") {
        tokenContract = component.getDaiContract; // DAI contract
      }

      let tokensWei = component.getWeb3.utils.toWei(component.collateralDepositValue, unit);

      // make a deposit
      await component.getOptionsExchangeContract.methods.depositTokens(
        component.getActiveAccount, 
        tokenContract._address, 
        tokensWei
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
          component.$toast.success("Your collateral deposit was successfull.");
          component.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
          component.writingStepTx = 2;
          component.collateralDepositValue = null;
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

    async fetchOptionAllowance() {
      if (this.option.address === undefined) {
        this.option.address = await this.getOptionsExchangeContract.methods.resolveToken(this.option.symbol).call();
      }

      const optionContract = new this.getWeb3.eth.Contract(OptionTokenContractJson.abi, this.option.address);

      const allowanceWei = await optionContract.methods.allowance(this.getActiveAccount, this.option.poolAddr).call();

      this.optionAllowance = this.getWeb3.utils.fromWei(String(allowanceWei), "ether");
    },

    async fetchUnderlyingAssetBalance() {

      let priceFeedType = this.option.pair;

      const feedAddress = addresses[priceFeedType][parseInt(this.getChainId)];
      const feedContract = new this.getWeb3.eth.Contract(ChainlinkContractJson.abi, feedAddress);
      const underlyingAddr = await feedContract.methods.getUnderlyingAddr().call();
      const underlyingContract = new this.getWeb3.eth.Contract(ERC20ContractJson.abi, underlyingAddr);
      const underlyingBalanceWei = await underlyingContract.methods.balanceOf(this.getActiveAccount).call();
      const underlyingDecimals = await underlyingContract.methods.decimals().call();
      const underlyingSymbol = await underlyingContract.methods.symbol().call();
      this.underlyingSymbol = underlyingSymbol;
      this.underlyingAddr = underlyingAddr;
      this.underlyingBalance = Number(underlyingBalanceWei / (this.getWeb3.utils.toBN(10 ** underlyingDecimals))).toFixed(4);
    },

    async getOptionPrice() {
      // fetch option price
      const poolContract = new this.getWeb3.eth.Contract(LiquidityPool.abi, this.option.poolAddr);

      let resultSell = await poolContract.methods.queryBuy(this.option.symbol, 0).call();

      if (resultSell) {
        this.optionPriceSell = this.getWeb3.utils.fromWei(resultSell.price, "ether") * (1 - (this.slippage/100));
        this.optionPriceFormattedSell = "$" + Number(this.optionPriceSell).toFixed(2);
      }
    },

    setBuyWith(choice) {
      this.buyWith = choice;
    },

    async setFormData() {
      this.selectedOptionSize = this.option.holding || 0.1;
      this.optionPriceSell = null;
      this.optionPriceFormattedSell = "loading";
      this.selectedOptionVolume = null;

      // fetch option price and volume
      const poolContract = new this.getWeb3.eth.Contract(LiquidityPool.abi, this.option.poolAddr);

      let resultSell = await poolContract.methods.queryBuy(this.option.symbol, 0).call();

      if (resultSell) {
        this.optionPriceSell = this.getWeb3.utils.fromWei(resultSell.price, "ether") * (1 - (this.slippage/100));

        this.optionPriceFormattedSell = "$" + Number(this.optionPriceSell).toFixed(2);
        this.selectedOptionVolume = this.getWeb3.utils.fromWei(resultSell.volume, "ether");

        if (this.selectedOptionVolume < 0.001) {
          this.tooLowVolume = true;
        }
      }
      
    },

    setHoldingOptions() {
      this.option.holding = this.getHoldingOptions;
    },

    async setSellData() {
      const poolContract = new this.getWeb3.eth.Contract(LiquidityPool.abi, this.option.poolAddr);
      const result = await poolContract.methods.queryBuy(this.option.symbol, 0).call();

      if (result) {
        this.selectedOptionPrice = this.getWeb3.utils.fromWei(String(result.price), "ether");
        this.selectedOptionVolume = this.getWeb3.utils.fromWei(String(result.volume), "ether");

        if (!this.selectedOptionSize) {
          this.selectedOptionSize = this.getMaxOptionSize;
        }

        // hardcoded 1% slippage
        this.selectedOptionPrice -= Number(this.selectedOptionPrice) * 0.01;
      }
    },

    showInfo() {
      // enable tooltip
      var infoEl = document.getElementById('infoEl')
      var tooltip = new window.bootstrap.Tooltip(infoEl)
      tooltip.show();
    },

    // write option covered by underlying balance
    async writeCovered() {
      let component = this;
      component.loading = true;

      // get options size in wei
      const optionSizeWei = this.getWeb3.utils.toWei(String(component.selectedOptionSize), "ether");

      console.log([
            [component.option.symbol],//string[] symbols;
            [optionSizeWei],//uint[] volume;
            [1],//bool[] isShort; 1 is true 0 is false
            [1],//bool[] isCovered; 1 is true 0 is false (false for stablcoin short)
            [component.option.poolAddr],//address[] poolAddrs;
            ["0x0000000000000000000000000000000000000000"]//address[] paymentTokens; only needed for buying options
          ]);


      // write covered option transaction
      try {
        await component.getOptionsExchangeContract.methods.openExposure(
          [
            [component.option.symbol],//string[] symbols;
            [optionSizeWei],//uint[] volume;
            [1],//bool[] isShort; 1 is true 0 is false
            [1],//bool[] isCovered; 1 is true 0 is false (false for stablcoin short)
            [component.option.poolAddr],//address[] poolAddrs;
            ["0x0000000000000000000000000000000000000000"]//address[] paymentTokens; only needed for buying options
          ],
          component.getActiveAccount
        ).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The openExposure (covered) transaction has been submitted. Please wait for it to be confirmed.");

        }).on('receipt', function(receipt){
          console.log(receipt);

          if (receipt.status) {
            component.$toast.success("You have successfully wrote and sold option.");
            component.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
            component.writingStepTx = 0;
          } else {
            component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
          }

        }).on('error', function(error){
          console.log(error);
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });
      } catch (e) {
          window.console.log("Error:", e);
          //component.$toast.error("The transaction has been reverted. Please contact DeFi Options support.");
          
      } finally {
        component.loading = false;
        
      }
    },

    // write stablecoin collateral options
    async writeOptions() {
      let component = this;
      component.loading = true;

      // get options size in wei
      const optionSizeWei = component.getWeb3.utils.toWei(String(component.selectedOptionSize), "ether");

      // write stablecoin collateral options transaction
      try {
        await component.getOptionsExchangeContract.methods.openExposure(
          [
            [component.option.symbol],//string[] symbols;
            [optionSizeWei],//uint[] volume;
            [1],//bool[] isShort; 1 is true 0 is false
            [0],//bool[] isCovered; 1 is true 0 is false (false for stablcoin short)
            [component.option.poolAddr],//address[] poolAddrs;
            ["0x0000000000000000000000000000000000000000"]//address[] paymentTokens; only needed for buying options
          ],
          component.getActiveAccount
        ).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The openExposure (naked) transaction has been submitted. Please wait for it to be confirmed.");

        }).on('receipt', function(receipt){
          console.log(receipt);

          if (receipt.status) {
            component.$toast.success("You have successfully wrote and sold and option");
            component.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
            component.writingStepTx = 0;
          } else {
            component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
          }

        }).on('error', function(error){
          console.log(error);
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });
      } catch (e) {
          window.console.log("Error:", e);
          //component.$toast.error("The transaction has been reverted. Please contact DeFi Options support.");
          
      } finally {
        component.loading = false;
        
      }
    },

    // write option covered by underlying balance
    async writeCoveredPending() {
      let component = this;
      component.loading = true;

      // get options size in wei
      const optionSizeWei = this.getWeb3.utils.toWei(String(component.selectedOptionSize), "ether");

      console.log([
            [component.option.symbol],//string[] symbols;
            [optionSizeWei],//uint[] volume;
            [1],//bool[] isShort; 1 is true 0 is false
            [1],//bool[] isCovered; 1 is true 0 is false (false for stablcoin short)
            [component.option.poolAddr],//address[] poolAddrs;
            ["0x0000000000000000000000000000000000000000"]//address[] paymentTokens; only needed for buying options
          ]);


      // write covered option transaction
      try {
        await component.getPendingExposureRouterContract.methods.createOrder(
          [
            [component.option.symbol],//string[] symbols;
            [optionSizeWei],//uint[] volume;
            [1],//bool[] isShort; 1 is true 0 is false
            [1],//bool[] isCovered; 1 is true 0 is false (false for stablcoin short)
            [component.option.poolAddr],//address[] poolAddrs;
            ["0x0000000000000000000000000000000000000000"]//address[] paymentTokens; only needed for buying options
          ],
          Number(Math.floor(Date.now() / 1000) + (60 * 10)), // cancelAfter, default to 5 min
          30 // sliipage in bps
        ).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The sell order (covered) transaction has been submitted. Please wait for it to be confirmed.");

        }).on('receipt', function(receipt){
          console.log(receipt);

          if (receipt.status) {
            component.$toast.success("You have successfully wrote and make an order to sell options.");
            component.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
            component.writingStepTx = 0;
          } else {
            component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
          }

        }).on('error', function(error){
          console.log(error);
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });
      } catch (e) {
          window.console.log("Error:", e);
          //component.$toast.error("The transaction has been reverted. Please contact DeFi Options support.");
          
      } finally {
        component.loading = false;
        
      }
    },

    // write stablecoin collateral options
    async writeOptionsPending() {
      let component = this;
      component.loading = true;

      // get options size in wei
      const optionSizeWei = component.getWeb3.utils.toWei(String(component.selectedOptionSize), "ether");

      // write stablecoin collateral options transaction
      try {
        await component.getPendingExposureRouterContract.methods.createOrder(
          [
            [component.option.symbol],//string[] symbols;
            [optionSizeWei],//uint[] volume;
            [1],//bool[] isShort; 1 is true 0 is false
            [0],//bool[] isCovered; 1 is true 0 is false (false for stablcoin short)
            [component.option.poolAddr],//address[] poolAddrs;
            ["0x0000000000000000000000000000000000000000"]//address[] paymentTokens; only needed for buying options
          ],
          Number(Math.floor(Date.now() / 1000) + (60 * 10)), // cancelAfter, default to 5 min
          30 // sliipage in bps
        ).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The sell order (cash secured) transaction has been submitted. Please wait for it to be confirmed.");

        }).on('receipt', function(receipt){
          console.log(receipt);

          if (receipt.status) {
            component.$toast.success("You have successfully wrote and made an order to sell options");
            component.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
            component.writingStepTx = 0;
          } else {
            component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
          }

        }).on('error', function(error){
          console.log(error);
          component.$toast.error("There has been an error. Please contact the DeFi Options support.");
        });
      } catch (e) {
          window.console.log("Error:", e);
          //component.$toast.error("The transaction has been reverted. Please contact DeFi Options support.");
          
      } finally {
        component.loading = false;
        
      }
    }
    
  }
}
</script>

<style>
.show-text {
  color: white;
  font-weight: 400;
  font-size: 12px;
}
</style>