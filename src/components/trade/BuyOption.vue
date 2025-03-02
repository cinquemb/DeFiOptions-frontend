<template>
  <div>
    <h3>Option size</h3>

    <div class="d-flex flex-wrap">
      <div>
        <input type="text" v-model="selectedOptionSize" class="form-control show-input" placeholder="0.0" aria-describedby="show-text">
        <div class="show-text form-text" v-if="!isOptionSizeNotValid.status">
          Maximum option size to buy: <span class="max-buy" @click="selectedOptionSize = getMaxOptionSize">{{getMaxOptionSize}}</span>
          <span v-if="Number(this.option.holding) > Number(getMaxOptionSize)"> 
            (Your total holding is bigger: {{this.option.holding}})
          </span>.
        </div>

        <div v-if="isOptionSizeNotValid.status" class="show-text form-text" >{{ isOptionSizeNotValid.message }}</div>
      </div>

      <div class="form-button-mobile">
        <div class="btn-group" aria-describedby="button-text">
          <button type="button" class="btn btn-outline-success dropdown-toggle text-uppercase" data-bs-toggle="dropdown" aria-expanded="false">
            {{buyWith}}
          </button>
          <ul class="dropdown-menu">
            <li>
              <span class="dropdown-item text-uppercase" @click="setBuyWith('DAI')">DAI</span>
              <span class="dropdown-item text-uppercase" @click="setBuyWith('USDC')">USDC</span>
              <span class="dropdown-item text-uppercase" @click="setBuyWith('Exchange Balance')">Exchange Balance</span>
            </li>
          </ul>
        </div>

        <div class="show-text form-text">
          Balance: {{Number(getUserStablecoinBalance).toFixed(2)}} {{buyWith}}.
        </div>
      </div>
      
    </div>

    <div class="row mt-3">
      <button v-if="!allowanceNeeded" @click="buyOption" class="btn btn-success form-control" :disabled="isOptionSizeNotValid.status">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Buy for ${{getTotal.toFixed(2)}}
      </button>

      <button v-if="!allowancePERNeeded" @click="buyOptionPending" class="btn btn-success form-control" :disabled="isOptionSizeNotValid.status">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Buy for ${{getTotal.toFixed(2)}} (PER)
      </button>

      <button 
        v-if="allowanceNeeded" 
        class="btn btn-success form-control" 
        data-bs-toggle="modal" :data-bs-target="'#approveModal'+getUniqueOptionId"
        :disabled="isOptionSizeNotValid.status"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Approve {{buyWith}} for ${{getTotal.toFixed(2)}}
      </button>

      <small v-if="allowanceNeeded" class="show-text form-text text-center">
        You'll need to make 2 transactions: approve & buy.
      </small>


      <button 
        v-if="allowancePERNeeded" 
        class="btn btn-success form-control" 
        data-bs-toggle="modal" :data-bs-target="'#approvePERModal'+getUniqueOptionId"
        :disabled="isOptionSizeNotValid.status"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Approve {{buyWith}} (PER) for ${{getTotal.toFixed(2)}}
      </button>

      <small v-if="allowancePERNeeded" class="show-text form-text text-center">
        You'll need to make 2 transactions: approve & submit pending market order (buy).
      </small>

    </div>

    <!-- Approve Confirmation Modal -->
    <div class="modal fade" :id="'approveModal'+getUniqueOptionId" tabindex="-1" aria-labelledby="approveModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="approveModalLabel">Confirm allowance</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Choose the amount of {{buyWith}} that you want to give 
            <a target="_blank" :href="'https://polygonscan.com/address/'+option.poolAddr">this pool</a> 
            on DeFi Options spending approval for:

            <div class="form-check" @click="unlimitedApproval=false">
              <input 
                class="form-check-input" 
                name="buyApprovalCheckbox" 
                type="radio" id="specifiedRadio" 
                :value="!unlimitedApproval"
                :checked="!unlimitedApproval"
              >
              <label class="form-check-label" for="specifiedRadio">
                ${{getTotal.toFixed(2)}}
              </label>
            </div>

            <div class="form-check" @click="unlimitedApproval=true">
              <input 
                class="form-check-input" 
                name="buyApprovalCheckbox" 
                type="radio" id="unlimitedRadio"
                :value="unlimitedApproval"
                :checked="unlimitedApproval"
              >
              <label class="form-check-label" for="unlimitedRadio">
                Unlimited amount of {{buyWith}}
              </label>
            </div>

            <p class="mt-3">
              After the approval transaction goes through you can click the Buy button and actually buy the option.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancel</button>
            <button @click="approveAllowance" type="button" class="btn btn-success" data-bs-dismiss="modal">
              <span v-if="!unlimitedApproval">Approve {{buyWith}} for ${{getTotal.toFixed(2)}}</span>
              <span v-if="unlimitedApproval">Approve {{buyWith}} (unlimited)</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve PER Confirmation Modal -->
    <div class="modal fade" :id="'approvePERModal'+getUniqueOptionId" tabindex="-1" aria-labelledby="approvePERModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="approvePERModalLabel">Confirm allowance</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Choose the amount of {{buyWith}} that you want to give 
            <a target="_blank" :href="'https://polygonscan.com/address/'+getPendingExposureRouterContract.options.address">the pending order router</a> 
            on DeFi Options spending approval for:

            <div class="form-check" @click="unlimitedApproval=false">
              <input 
                class="form-check-input" 
                name="buyApprovalCheckbox" 
                type="radio" id="specifiedRadio" 
                :value="!unlimitedApproval"
                :checked="!unlimitedApproval"
              >
              <label class="form-check-label" for="specifiedRadio">
                ${{getTotal.toFixed(2)}}
              </label>
            </div>

            <div class="form-check" @click="unlimitedApproval=true">
              <input 
                class="form-check-input" 
                name="buyApprovalCheckbox" 
                type="radio" id="unlimitedRadio"
                :value="unlimitedApproval"
                :checked="unlimitedApproval"
              >
              <label class="form-check-label" for="unlimitedRadio">
                Unlimited amount of {{buyWith}}
              </label>
            </div>

            <p class="mt-3">
              After the approval transaction goes through you can click the Buy button and sumbit your order to buy the option (which may get filled or canceld).
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancel</button>
            <button @click="approvePERAllowance" type="button" class="btn btn-success" data-bs-dismiss="modal">
              <span v-if="!unlimitedApproval">Approve {{buyWith}} for ${{getTotal.toFixed(2)}}</span>
              <span v-if="unlimitedApproval">Approve {{buyWith}} (unlimited)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LiquidityPool from "../../contracts/GovernableLinearLiquidityPool.json";


export default {
  name: "BuyOption",
  props: ["option", "side"],

  data() {
    return {
      buyWith: "DAI",
      loading: false,
      optionPrice: null,
      optionPriceFormatted: "loading",
      selectedOptionSize: 0.1,
      selectedOptionVolume: null,
      showForm: false,
      slippage: 2, // 2% by default
      tooLowVolume: false,
      unlimitedApproval: false
    }
  },

  created() {
    this.setFormData();
  },

  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getWeb3"]),
    //...mapGetters("liquidityPool", ["getLiquidityPoolContract"]),
    ...mapGetters("dai", ["getDaiAddress", "getUserDaiBalance", "getDaiContract", "getLpDaiAllowance", "getPERDaiAllowance"]),
    ...mapGetters("optionsExchange", ["getOptionsExchangeAddress", "getOptionsExchangeContract", "getExchangeUserBalance", "getUserExchangeBalanceAllowance", "getUserPERBalanceAllowance" ,"getPendingExposureRouterContract"]),
    ...mapGetters("usdc", ["getUsdcAddress", "getUserUsdcBalance", "getUsdcContract", "getLpUsdcAllowance", "getPERUsdcAllowance"]),

    allowanceNeeded() {
      if (this.buyWith === "DAI") {
        return this.getLpDaiAllowance < this.getTotal;
      } else if (this.buyWith === "USDC") {
        return this.getLpUsdcAllowance < this.getTotal;
      } else if (this.buyWith === "USDT") { // Tether
        return true; // TODO
      } else if (this.buyWith === "Exchange Balance") {
        return this.getUserExchangeBalanceAllowance < this.getTotal;
      } 
      return false;
    },

    allowancePERNeeded() {
      if (this.buyWith === "DAI") {
        return this.getPERDaiAllowance < this.getTotal;
      } else if (this.buyWith === "USDC") {
        return this.getPERUsdcAllowance < this.getTotal;
      } else if (this.buyWith === "USDT") { // Tether
        return true; // TODO
      } else if (this.buyWith === "Exchange Balance") {
        return this.getUserPERBalanceAllowance < this.getTotal;
      } 
      return false;
    },

    getBreakEvenPrice() {
      if (this.option.symbol.includes("EC")) { // CALL
        return "$" + Number(Number(this.optionPrice)+Number(this.option.strike)).toFixed(2);
      } else if (this.option.symbol.includes("EP")) { // PUT
        return "$" + Number(Number(this.option.strike)-Number(this.optionPrice)).toFixed(2);
      }
      return null;
    },

    getMaxOptionSize() {
      // max option size that current user can buy
      let availableOptionVolume = Math.floor(Number(this.selectedOptionVolume*1000))/1000;
      let optionPrice = Number(this.optionPrice);
      let maxTotal = availableOptionVolume * optionPrice;
      let userBalance = Number(this.getUserStablecoinBalance);
      if (maxTotal > Number(this.getUserStablecoinBalance)) {
        return Math.floor(Number(userBalance / optionPrice * 1000))/1000;
      } else {
        return availableOptionVolume;
      }
    },

    getStablecoinAddress() {
      if (this.buyWith === "DAI") {
        return this.getDaiAddress;
      } else if (this.buyWith === "USDC") {
        return this.getUsdcAddress;
      } else if (this.buyWith === "Exchange Balance") {
        return this.getOptionsExchangeAddress;
      } 
      return null;
    },

    getTotal() {
      return Number(this.selectedOptionSize) * Number(this.optionPrice);
    },

    getUniqueOptionId() {
      return this.option.symbol.replace("/", "-");
    },

    getUserStablecoinBalance() {
      if (this.buyWith === "DAI") {
        return this.getUserDaiBalance;
      } else if (this.buyWith === "USDC") {
        return this.getUserUsdcBalance;
      } else if (this.buyWith === "Exchange Balance") {
        return this.getExchangeUserBalance;
      }
      return null;
    },

    isOptionSizeNotValid() { // validation for option size
      // option size bigger than volume.
      /*if (Number(this.selectedOptionSize) > Number(this.selectedOptionVolume)) {
        return {status: true, message: "Must not be bigger than " + Math.floor(Number(this.selectedOptionVolume*1000))/1000 + "!"};
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
      if (this.getTotal > Number(this.getUserStablecoinBalance)) {
        if (this.buyWith === "Exchange Balance") {
          return {status: true, message: "Your exchange balance is too low."};
        }
        return {status: true, message: "Your " + this.buyWith + " balance is too low."};
      }
      return {status: false, message: "Valid option size"};
    }
  },

  methods: {

    async approveAllowance() {
      let component = this;
      component.loading = true;
      component.getOptionPrice(); // refresh the option price
      // define unit and token contract
      let unit = "ether"; // Exchange Balance & DAI - 18 decimals
      let tokenContract = component.getOptionsExchangeContract; // Exchange Balance contract
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
      // define allowance value
      let allowanceValue = component.getTotal * 1.05; // make it 5% bigger to avoid slippage issues
      if (component.unlimitedApproval) {
        allowanceValue = 10 ** 9; // 1B tokens as "unlimited" value
      }
      const allowanceValueWei = component.getWeb3.utils.toWei(String(allowanceValue.toFixed(4)), unit); // round to 4 decimals
      
      // call the approve method
      try {
        await tokenContract.methods.approve(component.option.poolAddr, allowanceValueWei).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");
        }).on('receipt', function(receipt){
          console.log(receipt);
          if (receipt.status) {
            component.$toast.success("The approval was successfull. You can buy the option now.");
            // refresh values
            if (component.buyWith === "DAI") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              component.$store.state.dai.lpAllowance = allowanceValue;
            } else if (component.buyWith === "USDC") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              component.$store.state.usdc.lpAllowance = allowanceValue;
            } else if (component.buyWith === "USDT") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              // component.$store.state.tether.lpAllowance = allowanceValue;
            } else if (component.buyWith === "Exchange Balance") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              component.$store.state.optionsExchange.userExchangeBalanceAllowance = allowanceValue;
            }
            component.getOptionPrice(); // refresh the option price
            
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

    async approvePERAllowance() {
      let component = this;
      component.loading = true;
      component.getOptionPrice(); // refresh the option price
      // define unit and token contract
      let unit = "ether"; // Exchange Balance & DAI - 18 decimals
      let tokenContract = component.getOptionsExchangeContract; // Exchange Balance contract
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
      // define allowance value
      let allowanceValue = component.getTotal * 1.05; // make it 5% bigger to avoid slippage issues
      if (component.unlimitedApproval) {
        allowanceValue = 10 ** 9; // 1B tokens as "unlimited" value
      }
      const allowanceValueWei = component.getWeb3.utils.toWei(String(allowanceValue.toFixed(4)), unit); // round to 4 decimals
      
      // call the approve method
      try {
        await tokenContract.methods.approve(component.getPendingExposureRouterContract.options.address, allowanceValueWei).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The transaction has been submitted. Please wait for it to be confirmed.");
        }).on('receipt', function(receipt){
          console.log(receipt);
          if (receipt.status) {
            component.$toast.success("The approval was successfull. You can buy the option now.");
            // refresh values
            if (component.buyWith === "DAI") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              component.$store.state.dai.perAllowance = allowanceValue;
            } else if (component.buyWith === "USDC") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              component.$store.state.usdc.perAllowance = allowanceValue;
            } else if (component.buyWith === "USDT") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              // component.$store.state.tether.perAllowance = allowanceValue;
            } else if (component.buyWith === "Exchange Balance") {
              // needs to be updated this way because Polygon RPC nodes are slow with updating state
              component.$store.state.optionsExchange.userPERBalanceAllowance = allowanceValue;
            }
            component.getOptionPrice(); // refresh the option price
            
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

    async buyOption() {
      let component = this;
      component.loading = true;
      component.getOptionPrice(); // refresh the option price
      let optionSizeWei = component.getWeb3.utils.toWei(String(component.selectedOptionSize), "ether");
      let optionUnitPrice = component.getWeb3.utils.toWei(String(component.optionPrice), "ether");
      // buy option transaction
      const poolContract = new component.getWeb3.eth.Contract(LiquidityPool.abi, component.option.poolAddr);

      try {
        await poolContract.methods.buy(
          component.option.symbol, // symbol
          optionUnitPrice, // price per one option
          optionSizeWei, // volume a.k.a. user's selected option size
          component.getStablecoinAddress, // selected stablecoin
        ).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The Buy transaction has been submitted. Please wait for it to be confirmed.");
        }).on('receipt', function(receipt){
          console.log(receipt);
          if (receipt.status) {
            component.$toast.success("You have successfully bought an option.");
            // refresh values
            if (component.buyWith === "DAI") {
              component.$store.dispatch("dai/fetchUserBalance");
              if (component.getTotal === Number(component.$store.state.dai.lpAllowance)) {
                console.log("equal")
                component.$store.state.dai.lpAllowance = 0;
              } else {
                console.log("not equal")
                component.$store.state.dai.lpAllowance = Number(component.$store.state.dai.lpAllowance) - component.getTotal;
              }
              //component.$store.dispatch("dai/fetchLpAllowance");
            } else if (component.buyWith === "USDC") {
              component.$store.dispatch("usdc/fetchUserBalance");
              
              if (component.getTotal === Number(component.$store.state.usdc.lpAllowance)) {
                component.$store.state.usdc.lpAllowance = 0;
              } else {
                component.$store.state.usdc.lpAllowance = Number(component.$store.state.usdc.lpAllowance) - component.getTotal;
              }
              //component.$store.dispatch("usdc/fetchLpAllowance");
            } else if (component.buyWith === "USDT") {
              // TODO
              //component.$store.dispatch("tether/fetchUserBalance");
              
              //this.$store.dispatch("tether/fetchLpAllowance");
            } else if (component.buyWith === "Exchange Balance") {
              component.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
              if (component.getTotal === Number(component.$store.state.optionsExchange.userExchangeBalanceAllowance)) {
                component.$store.state.optionsExchange.userExchangeBalanceAllowance = 0;
              } else {
                component.$store.state.optionsExchange.userExchangeBalanceAllowance = Number(component.$store.state.optionsExchange.userExchangeBalanceAllowance) - component.getTotal;
              }
              
              //component.$store.dispatch("optionsExchange/fetchExchangeBalanceAllowance");
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
          //component.$toast.error("The transaction has been reverted. Please contact DeFi Options support.");
          
      } finally {
        component.setFormData(); // refresh the option price
        component.loading = false;
      }
    },

    async buyOptionPending() {
      let component = this;
      component.loading = true;
      component.getOptionPrice(); // refresh the option price
      let optionSizeWei = component.getWeb3.utils.toWei(String(component.selectedOptionSize), "ether");
      //let optionUnitPrice = component.getWeb3.utils.toWei(String(component.optionPrice), "ether");

      try {
        await component.getPendingExposureRouterContract.methods.createOrder(
          [
            [component.option.symbol],//string[] symbols;
            [optionSizeWei],//uint[] volume;
            [0],//bool[] isShort; 1 is true 0 is false
            [0],//bool[] isCovered; 1 is true 0 is false (false for stablcoin short)
            [component.option.poolAddr],//address[] poolAddrs;
            [component.getStablecoinAddress]//address[] paymentTokens; only needed for buying options
          ],
          Number(Math.floor(Date.now() / 1000) + (60 * 10)), // cancelAfter, default to 5 min
          30 // slippage in bps
        ).send({
          from: component.getActiveAccount,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null
        }).on('transactionHash', function(hash){
          console.log("tx hash: " + hash);
          component.$toast.info("The Buy order transaction has been submitted. Please wait for it to be confirmed and oracle approvals.");
        }).on('receipt', function(receipt){
          console.log(receipt);
          if (receipt.status) {
            component.$toast.success("You have successfully made your order.");
            // refresh values
            if (component.buyWith === "DAI") {
              component.$store.dispatch("dai/fetchUserBalance");
              if (component.getTotal === Number(component.$store.state.dai.lpAllowance)) {
                console.log("equal")
                component.$store.state.dai.lpAllowance = 0;
              } else {
                console.log("not equal")
                component.$store.state.dai.lpAllowance = Number(component.$store.state.dai.lpAllowance) - component.getTotal;
              }
              //component.$store.dispatch("dai/fetchLpAllowance");
            } else if (component.buyWith === "USDC") {
              component.$store.dispatch("usdc/fetchUserBalance");
              
              if (component.getTotal === Number(component.$store.state.usdc.lpAllowance)) {
                component.$store.state.usdc.lpAllowance = 0;
              } else {
                component.$store.state.usdc.lpAllowance = Number(component.$store.state.usdc.lpAllowance) - component.getTotal;
              }
              //component.$store.dispatch("usdc/fetchLpAllowance");
            } else if (component.buyWith === "USDT") {
              // TODO
              //component.$store.dispatch("tether/fetchUserBalance");
              
              //this.$store.dispatch("tether/fetchLpAllowance");
            } else if (component.buyWith === "Exchange Balance") {
              component.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
              if (component.getTotal === Number(component.$store.state.optionsExchange.userExchangeBalanceAllowance)) {
                component.$store.state.optionsExchange.userExchangeBalanceAllowance = 0;
              } else {
                component.$store.state.optionsExchange.userExchangeBalanceAllowance = Number(component.$store.state.optionsExchange.userExchangeBalanceAllowance) - component.getTotal;
              }
              
              //component.$store.dispatch("optionsExchange/fetchExchangeBalanceAllowance");
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
          //component.$toast.error("The transaction has been reverted. Please contact DeFi Options support.");
          
      } finally {
        component.setFormData(); // refresh the option price
        component.loading = false;
      }
    },

    async getOptionPrice() {
      // fetch option price
      const poolContract = new this.getWeb3.eth.Contract(LiquidityPool.abi, this.option.poolAddr);

      let result = await poolContract.methods.queryBuy(this.option.symbol, 1).call();
      
      if (result) {
        
        this.optionPrice = this.getWeb3.utils.fromWei(result.price, "ether") * (1 + (this.slippage/100));
        
        this.optionPriceFormatted = "$" + Number(this.optionPrice).toFixed(2);
      }
    },

    setBuyWith(choice) {
      this.buyWith = choice;
    },

    async setFormData() {
      this.selectedOptionSize = 0.1;
      this.optionPrice = null;
      this.optionPriceFormatted = "loading";
      this.selectedOptionVolume = null;
      // fetch option price and volume

      const poolContract = new this.getWeb3.eth.Contract(LiquidityPool.abi, this.option.poolAddr);

      let result = await poolContract.methods.queryBuy(this.option.symbol, 1).call();
      
      if (result) {
        this.optionPrice = this.getWeb3.utils.fromWei(result.price, "ether") * (1 + (this.slippage/100));
        this.optionPriceFormatted = "$" + Number(this.optionPrice).toFixed(2);
        this.selectedOptionVolume = this.getWeb3.utils.fromWei(result.volume, "ether") * (10 ** 9);
        if (this.selectedOptionVolume < 0.001) {
          this.tooLowVolume = true;
        }
      }
      
    },
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
.max-buy {
  color: #5AFFB0;
  text-decoration: underline;
}
.max-buy:hover {
  color: #5AFFB0;
  text-decoration: none;
  cursor: pointer;
}
.show-form {
  margin-top: 24px;
}
.show-input {
  max-width: 200px;
  margin-right: 10px;
}
.show-text {
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