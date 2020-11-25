import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import { Network } from "vue-vis-network";
import { Multipane, MultipaneResizer } from "vue-multipane";
 
Vue.component('multipane', Multipane);
Vue.component('multipane-resizer', MultipaneResizer);
Vue.component("network", Network);

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
