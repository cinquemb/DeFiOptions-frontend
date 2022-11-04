import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Invest from "./pages/Invest";
import Trade from "./pages/Trade";
import PoolManagement from "./pages/PoolManagement"
import PoolGovernance from "./pages/PoolGovernance"
import ProtocolManagement from "./pages/ProtocolManagement"
import ExchangeManagement from "./pages/ExchangeManagement"
import ProtocolGovernance from "./pages/ProtocolGovernance"
import DODGovernance from "./pages/DODGovernance"


Vue.use(Router);

export default new Router({
    // Make sure the server can handle the history mode
    // If not, set it to hash (or delete the mode)
    // More info here: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
    mode: "hash",
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/", // this is needed because of GH Pages
            name: "ghpages",
            component: Home
        },
        {
            path: "/portfolio",
            name: "portfolio",
            component: Portfolio
        },
        {
            path: "/invest",
            name: "invest",
            component: Invest
        },
        {
            path: "/trade",
            name: "trade",
            component: Trade
        },
        {
            path: "/manage",
            name: "manage",
            component: PoolManagement
        },
        {
            path: "/pool-governance",
            name: "pool-governance",
            component: PoolGovernance
        },
        {
            path: "/manage-dod",
            name: "manage-dod",
            component: ProtocolManagement
        },
        {
            path: "/manage-exchange",
            name: "manage-exchange",
            component: ExchangeManagement
        },
        {
            path: "/dod-governance",
            name: "dod-governance",
            component: ProtocolGovernance
        },
        {
            path: "/governance",
            name: "governance",
            component: DODGovernance
        },
    ],
    linkActiveClass: "active"
});
