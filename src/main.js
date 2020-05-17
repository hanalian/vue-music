import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "lib-flexible";
import "./assets/css/reset.css";
import "./assets/css/font.css";
import VueLazyLoad from "vue-lazyload";
import { post, fetch } from "./utils/fetch";

Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: require("./assets/img/a5.jpg"),
  loading: require("./assets/img/aje.png"),
  attempt: 2
});

Vue.config.productionTip = false;

Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
