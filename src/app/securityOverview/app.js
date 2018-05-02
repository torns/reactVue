import 'publicPath';
import App from './components/app';
import Vue from 'vue';
import VueResource from 'vue-resource';
import VCharts from 'v-charts';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import './components/css/security-overview.css';
// import './components/js/dom.js';
Vue.use(VueResource);
Vue.use(VCharts);
// Vue.use(ElementUI);
new Vue({
    el: '#root',
    render: h => h(App)
});