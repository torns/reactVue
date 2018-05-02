import 'publicPath';
import App from './components/app';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import vueResource from 'vue-resource';

import './components/css/statusSetting.css';

// Vue.use(ElementUI);
Vue.use(vueResource);

new Vue({
    el: '#root',
    render: h => h(App)
});


//import extjs
//import '../../common/extjs/compressed-extjs.js';
//import './list-common.js';
