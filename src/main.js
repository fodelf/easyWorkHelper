/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2020-05-11 21:44:05
 * @LastEditors: 吴文周
 * @LastEditTime: 2020-05-21 09:44:01
 * @FilePath: /workespacemanger/Users/fodelf/git/easyWorkHelper/src/main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/index.css'
// import 'vant/lib/index.css'
import 'vant/lib/icon/local.css'
import './assets/base.css'
import Vant from 'vant'
// import './assets/css/vant.css'
// import { Collapse, CollapseItem, NavBar} from 'vant'

// Vue.use(Collapse)
// Vue.use(CollapseItem)
// Vue.use(NavBar)
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
