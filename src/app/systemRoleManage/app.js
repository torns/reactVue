import 'publicPath';
import App from './components/app';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import vueResource from 'vue-resource'

import  './components/css/system-roleManage.css';

// Vue.use(ElementUI);
Vue.use(vueResource);

new Vue({
    el: '#root',
    render: h => h(App)
});