<template>
  <div class="container">
    <Navbar />

    <div v-if="isUserConnected && !getChainName" class="alert alert-danger" role="alert">
      You are on an unsupported network. Click here to connect to either 
      <span @click="switchToPolygon" class="network-switch-link">Polygon</span> or 
      <span @click="switchToKovan" class="network-switch-link">Kovan testnet</span> or 
      <span @click="switchToMumbai" class="network-switch-link">Mumbai testnet</span> or 
      <span @click="switchToFuji" class="network-switch-link">Fuji testnet</span> or
      <span @click="switchToCantoTestnet" class="network-switch-link">Canto testnet</span>.
      <span @click="switchToArbitrumGoerli" class="network-switch-link">Arbitrum Goerli testnet</span>.
    </div>

    <router-view />

    <Footer />

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',

  components: {
    Navbar,
    Footer
  },

  computed: {
    ...mapGetters("accounts", ["getChainName", "getSupportedChains", "isUserConnected"]),
  },

  methods: {
    switchToPolygon() {
      window.ethereum.request({ 
        method: 'wallet_addEthereumChain', 
        params: [{ 
          chainId: '0x89', 
          chainName: 'Polygon PoS Chain', 
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, 
          rpcUrls: ['https://polygon-rpc.com/'], 
          blockExplorerUrls: ['https://polygonscan.com/']
        }] 
      });
    },
    switchToKovan() {
      window.ethereum.request({ 
        method: 'wallet_switchEthereumChain', 
        params: [{ 
          chainId: '0x2a'
        }] 
      });
    },
    switchToMumbai() {
      window.ethereum.request({ 
        method: 'wallet_switchEthereumChain', 
        params: [{ 
          chainId: '0x13881'
        }] 
      });
    },
    switchToFuji() {
      window.ethereum.request({ 
        method: 'wallet_switchEthereumChain', 
        params: [{ 
          chainId: '0xa869'
        }] 
      });
    },
    switchToCantoTestnet() {
      window.ethereum.request({ 
        method: 'wallet_switchEthereumChain', 
        params: [{ 
          chainId: '0x1e15'
        }] 
      });
    },
    switchToArbitrumGoerli() {
      window.ethereum.request({ 
        method: 'wallet_switchEthereumChain', 
        params: [{ 
          chainId: '0x66eed'
        }] 
      });
    }
  },
  watch: {
    getChainName: function () {
      // update everything whenever the network is changed
      this.$store.dispatch("optionsExchange/fetchContract");
      this.$store.dispatch("optionsExchange/storeAddress");
      this.$store.dispatch("liquidityPool/fetchContract");
      this.$store.dispatch("liquidityPool/storeAddress");
      this.$store.dispatch("proposalManager/fetchContract");
      this.$store.dispatch("proposalManager/storeAddress");


      this.$store.dispatch("dai/fetchContract");
      this.$store.dispatch("dai/storeAddress");
      this.$store.dispatch("usdc/fetchContract");
      this.$store.dispatch("usdc/storeAddress");
      this.$store.dispatch("creditToken/fetchContract");
      this.$store.dispatch("creditToken/storeAddress");

      this.$store.dispatch("dai/fetchUserBalance");
      this.$store.dispatch("usdc/fetchUserBalance");
      this.$store.dispatch("dai/fetchLpAllowance");
      this.$store.dispatch("usdc/fetchLpAllowance");

      this.$store.dispatch("optionsExchange/fetchExchangeUserBalance");
      this.$store.dispatch("optionsExchange/fetchUserOptions");
      this.$store.dispatch("optionsExchange/fetchExchangeBalanceAllowance");
      this.$store.dispatch("optionsExchange/fetchLiquidityPoolBalance");

      this.$store.dispatch("liquidityPool/fetchUserBalance");
      this.$store.dispatch("liquidityPool/fetchSymbolsList");
      this.$store.dispatch("liquidityPool/fetchApy");
      this.$store.dispatch("liquidityPool/fetchUserPoolUsdValue");
      this.$store.dispatch("liquidityPool/fetchPoolFreeBalance");
      this.$store.dispatch("liquidityPool/fetchPoolWithdrawalFee");
      this.$store.dispatch("liquidityPool/fetchPoolMaturityDate");

      this.$store.dispatch("creditToken/fetchUserBalance");

      this.$store.dispatch("accounts/fetchActiveBalance");


      this.$store.dispatch("proposalManager/fetchProposalCount");

    }
  }
}
</script>

<style scoped>
 .modal {
   display: block;
 }

.network-switch-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
