import Vue from 'vue';
import Vuex from 'vuex';
import accounts from "./modules/accounts";
import optionsExchange from "./modules/optionsExchange";
import protocolSettings from "./modules/protocolSettings";
import liquidityPool from "./modules/liquidityPool";
import proposalManager from "./modules/proposalManager";
import incentivized from "./modules/incentivized";
import creditToken from "./modules/creditToken";
import dai from "./modules/dai";
import usdc from "./modules/usdc";
import mockusd from "./modules/mockusd";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        accounts,
        creditToken,
        dai,
        liquidityPool,
        proposalManager,
        incentivized,
        optionsExchange,
        protocolSettings,
        usdc,
        mockusd
    }
});