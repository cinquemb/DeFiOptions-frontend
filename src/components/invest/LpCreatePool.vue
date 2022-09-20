<template>
  <div>
    <h3>Create A Governable Liquidity Pool</h3>

    <div class="section-small">
      <div class="d-flex flex-wrap">
        <div>
          <input type="text" v-model="symbolSuffix" class="form-control deposit-input" placeholder="My Pool Symbol" aria-describedby="createPoolNameText">
        </div>

        <div>
          <input type="text" v-model="nameSuffix" class="form-control deposit-input" placeholder="My Pool Name" aria-describedby="createPoolSymbolText">
        </div>

        <div class="create-pool-button form-button-mobile">
          <button 
            class="btn btn-success btn-user btn-block text-uppercase form-control" 
            data-bs-toggle="modal" data-bs-target="#createPoolModal"
            :disabled="isCreatePoolValueNotValid.status"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Create Pool
          </button>
          <div></div>
        </div>
        
      </div>

      <!-- Help text -->
      <div class="help-text" v-if="isCreatePoolValueNotValid.status">
        {{ isCreatePoolValueNotValid.message }}
      </div>

      <!-- Create Pool Confirmation Modal -->
      <div class="modal fade" id="createPoolModal" tabindex="-1" aria-labelledby="createPoolModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="createPoolModalLabel">Create Pool Confirmation</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              By creating a liquidity pool you confirm being aware that:

              <ul>
                <li>You will not be able to manage the pool unless you deposit at least a token amount into the pool</li>
                <li>Pool changes can be dictated by the holders of the pool tokens, relative to the size of their tokens, through pool governance.</li>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancel</button>
              <button @click="createPool" type="button" class="btn btn-success" data-bs-dismiss="modal">Create Pool</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'LpCreatePool',
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getWeb3"]),
    ...mapGetters("optionsExchange", ["getOptionsExchangeAddress", "getOptionsExchangeContract"]), 

    isCreatePoolValueNotValid() { // validation for pool create
      // not enough chars in name string
      if (this.nameSuffix === null) {
        return {status: true, message: "Please make the name of the pool larger"};
      }

      //not enough chars in symbol string
      if (this.symbolSuffix === null) {
        return {status: true, message: "Please make the symbol of the pool larger"};
      }

      //need to check if pool symbol already exists?


      return {status: false, message: "Valid pool symbol and name suffix"};
    },
  },
  created() {
  },
  data() {
    return {
      nameSuffix: null,
      loading: false,
      symbolSuffix: null
    }
  },
  methods: {
    async createPool() {
      let component = this;
      component.loading = true;

      // make a liqudity pool
      await component.getOptionsExchangeContract.methods.createPool(
        component.nameSuffix,
        component.symbolSuffix
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
          component.$toast.success("Your liquidity pool was successfull");

          //TODO: may want to set this to the selected liquidity pool
          //TODO: update liquidity pool address list
          
          component.nameSuffix = null;
          component.symbolSuffix = null;
        } else {
          component.$toast.error("The transaction has failed. Please contact the DeFi Options support.");
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
</script>

<style>
.create-pool-button, .token-dropdown {
  margin-left: 10px;
}

.help-text {
  margin-top: .25rem;
  font-size: .775em;
  color: #ffffff;
}

/* Mobile screens */
@media screen and (max-width: 600px) {
  .create-pool-button, .token-dropdown {
    margin-left: 0px;
  }
}
</style>