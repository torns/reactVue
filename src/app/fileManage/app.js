import 'publicPath';
import App from './components/app';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import vueResource from 'vue-resource';
import { loadScripts } from 'asyncLoad';
import {loadLinks} from 'asyncLoad';

import './components/css/fileManage.css';
import './components/js/fileManage';

// Vue.use(ElementUI);
Vue.use(vueResource);

new Vue({
    el: '#root',
    render: h => h(App)
});

const urls = [
    '//116.62.203.181/zyfbim/modelResource/ztree/jquery.ztree.all.min.js',
];
const linkUrl = [
    '//116.62.203.181/zyfbim/modelResource/ztree/css/zTreeStyle/zTreeStyle.css',
    '//116.62.203.181/zyfbim/modelResource/ztree/css/zTreeStyle/ztreeCommon.css',
    '//116.62.203.181/zyfbim/modelResource/ztree/css/Common.css',
];

loadLinks(linkUrl);
loadScripts(urls);
