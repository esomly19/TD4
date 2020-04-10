import Vue from "nativescript-vue";

import Login from "./components/LoginPage";


Vue.config.silent = true;
new Vue({
    render: h => h("frame", [h(Login)])
}).$start();
