import 'publicPath';
import App from './components/app';
// import Vue from 'vue';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import './components/css/announcement.css';
import vueResource from 'vue-resource'

// import './components/js/announcement.js';


// Vue.use(ElementUI);
Vue.use(vueResource);

new Vue({
    el: '#root',
    render: h => h(App)
});
