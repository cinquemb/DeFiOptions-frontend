import Vue from 'vue';
import Vuex from 'vuex';
import accounts from "./modules/accounts";
import optionsExchange from "./modules/optionsExchange";
import liquidityPool from "./modules/liquidityPool";
import proposalManager from "./modules/proposalManager";
import creditToken from "./modules/creditToken";
import dai from "./modules/dai";
import usdc from "./modules/usdc";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        accounts,
        creditToken,
        dai,
        liquidityPool,
        proposalManager,
        optionsExchange,
        usdc
    }
});