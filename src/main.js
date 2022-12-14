import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/iconfont.css'
import http from "@/api/http";
import s from 'vue-sweetalert2'

ElementUI.Dialog.props.lockScroll.default = false;

Vue.use(ElementUI).use(s);
Vue.config.productionTip = false
Vue.prototype.$http = http;
Vue.prototype.$imgBaseUrl = 'http://39.101.68.6:8080/'

router.afterEach(() => {
  window.scrollTo(0, 0);
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
