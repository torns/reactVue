import 'publicPath';
import App from './components/app';
import VueResource from 'vue-resource';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
//自己的css
import './css/quality/quality.css';
import { loadScripts } from 'asyncLoad';
import {loadLinks} from 'asyncLoad';
import './css/BimModel.css';

// import './modelResource/js/jquery.ui.touch-punch.min.js';
// import './modelResource/js/keymaster.min.js';
// import './modelResource/js/iscroll.min.js';
// import './modelResource/js/jquery.minicolors.min.js';
// import './modelResource/ztree/jquery.ztree.all.min.js';
// import './modelResource/js/v3d.min.js';
// import './modelResource/js/Interface.js';

// import 'foundation-datepicker/js/foundation-datepicker.min.js';
// import 'foundation-datepicker/js/locales/foundation-datepicker.zh-CN.js';
// import 'webuploader/dist/webuploader.js';
// 自己的js
// import './js/quality.js'
import './js/quality-form.js'
// import './js/quality-problem.js'
// Vue.use(ElementUI);
Vue.use(VueResource);

// Vue.component('parent-component',{
//     template: '#parent-component',
// })
new Vue({
    el: '#root',
    render: h => h(App)
});

const urls = [
    '//116.62.203.181/zyfbim/modelResource/js/jquery-ui.min.js',
    '//116.62.203.181/zyfbim/modelResource/js/jquery.ui.touch-punch.min.js',
    '//116.62.203.181/zyfbim/modelResource/js/keymaster.min.js',
    '//116.62.203.181/zyfbim/modelResource/js/iscroll.min.js',
    '//116.62.203.181/zyfbim/modelResource/js/jquery.minicolors.min.js',
    '//116.62.203.181/zyfbim/modelResource/ztree/jquery.ztree.all.min.js',
    '//116.62.203.181/zyfbim/modelResource/js/v3d.min.js',
    '//116.62.203.181/zyfbim/modelResource/js/Interface.js'
];
const linkUrl = [
     '//116.62.203.181/zyfbim/modelResource/css/TreeControl.css',
     '//116.62.203.181/zyfbim/modelResource/css/Toolbar.css',
     '//116.62.203.181/zyfbim/modelResource/css/Desktop.css',
     '//116.62.203.181/zyfbim/modelResource/css/NoteText.css',

     '//116.62.203.181/zyfbim/modelResource/css/jquery-ui.min.css',

    //import './modelResource/css/jquery.minicolors.css';
    //  'jquery-minicolors/jquery.minicolors.css',
    
    '//116.62.203.181/zyfbim/modelResource/ztree/css/zTreeStyle/zTreeStyle.css',
    '//116.62.203.181/zyfbim/modelResource/ztree/css/zTreeStyle/ztreeCommon.css',
    '//116.62.203.181/zyfbim/modelResource/ztree/css/Common.css',
    //  '//116.62.203.181/zyfbim/ztree/css/demo.css',//common
    // '//116.62.203.181/zyfbim/modelResource/css/BimModel.css',
];

loadLinks(linkUrl);
loadScripts(urls);
