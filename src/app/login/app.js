import 'publicPath';
import App from './components/app';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import vueResource from 'vue-resource'
//自己的css
import './css/misc-pages.css';

// Vue.use(ElementUI);
Vue.use(vueResource);

new Vue({
    el: '#root',
    render: h => h(App)
});