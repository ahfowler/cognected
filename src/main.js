import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import { Multipane, MultipaneResizer } from "vue-multipane";
import vSelect from "vue-select";
import { Network } from "vue2vis";
import VueCookies from 'vue-cookies'


Vue.use(VueCookies)
Vue.component("network", Network);
Vue.component("v-select", vSelect);
Vue.component("multipane", Multipane);
Vue.component("multipane-resizer", MultipaneResizer);

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;
axios.defaults.baseURL = "https://api.example.com";
Vue.$cookies.config('7d');

new Vue({
  render: (h) => h(App),
}).$mount("#app");
