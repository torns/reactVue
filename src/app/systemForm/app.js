import 'publicPath';
import App from './components/app';
import VueResource from 'vue-resource';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
//自己的css
import './css/quality/quality.css';
// 自己的js

// Vue.use(ElementUI);
Vue.use(VueResource);

new Vue({
    el: '#root',
    render: h => h(App)
});