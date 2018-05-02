import 'publicPath';
import App from './components/app';
import VueResource from 'vue-resource';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
//自己的css
import './css/quality/quality.css';
//import './css/security-problem.css';
import { loadScripts } from 'asyncLoad';
import {loadLinks} from 'asyncLoad';
import './css/BimModel.css';
// 模型的导入
// const urls = [
//     '//116.62.203.181/zyfbim/modelResource/js/jquery-ui.min.js',
//     '//116.62.203.181/zyfbim/modelResource/js/jquery.ui.touch-punch.min.js',
//     '//116.62.203.181/zyfbim/modelResource/js/keymaster.min.js',
//     '//116.62.203.181/zyfbim/modelResource/js/iscroll.min.js',
//     '//116.62.203.181/zyfbim/modelResource/js/jquery.minicolors.min.js',
//     '//116.62.203.181/zyfbim/modelResource/ztree/jquery.ztree.all.min.js',
//     '//116.62.203.181/zyfbim/modelResource/js/v3d.min.js',
//     '//116.62.203.181/zyfbim/modelResource/js/Interface.js'
// ];

// const urls = ['../../common/modelResource/js/jquery-ui.min.js',
//     '../../common/modelResource/js/jquery.ui.touch-punch.min.js',
//     '../../common/modelResource/js/keymaster.min.js',
//     '../../common/modelResource/js/iscroll.min.js',
//     '../../common/modelResource/js/jquery.minicolors.min.js',
//     '../../common/modelResource/ztree/jquery.ztree.all.min.js',
//     '../../common/modelResource/js/v3d.min.js',
//     '../../common/modelResource/js/Interface.js'
//
// ];

// import '../../common/modelResource/js/jquery-ui.min.js';
// import '../../common/modelResource/js/jquery.ui.touch-punch.min.js';
// import '../../common/modelResource/js/keymaster.min.js';
// import '../../common/modelResource/js/iscroll.min.js';
// import '../../common/modelResource/js/jquery.minicolors.min.js';
// import '../../common/modelResource/ztree/jquery.ztree.all.min.js';
// import '../../common/modelResource/js/v3d.min.js';
// import '../../common/modelResource/js/Interface.js';

// const linkUrl = [
//     '//116.62.203.181/zyfbim/modelResource/css/TreeControl.css',
//     '//116.62.203.181/zyfbim/modelResource/css/Toolbar.css',
//     '//116.62.203.181/zyfbim/modelResource/css/Desktop.css',
//     '//116.62.203.181/zyfbim/modelResource/css/NoteText.css',
//
//     '//116.62.203.181/zyfbim/modelResource/css/jquery-ui.min.css',
//
//     //import './modelResource/css/jquery.minicolors.css';
//     //  'jquery-minicolors/jquery.minicolors.css',
//
//     '//116.62.203.181/zyfbim/modelResource/ztree/css/zTreeStyle/zTreeStyle.css',
//     '//116.62.203.181/zyfbim/modelResource/ztree/css/zTreeStyle/ztreeCommon.css',
//     '//116.62.203.181/zyfbim/modelResource/ztree/css/Common.css',
//     //  '//116.62.203.181/zyfbim/ztree/css/demo.css',//common
//     // '//116.62.203.181/zyfbim/modelResource/css/BimModel.css',
// ];

// const linkUrl = [
//     '../../common/modelResource/css/TreeControl.css',
//     '../../common/modelResource/css/Toolbar.css',
//     '../../common/modelResource/css/Desktop.css',
//     '../../common/modelResource/css/NoteText.css',
//     '../../common/modelResource/css/jquery-ui.min.css',
//     '../../common/modelResource/ztree/css/zTreeStyle/zTreeStyle.css',
//     '../../common/modelResource/ztree/css/zTreeStyle/ztreeCommon.css',
//     '../../common/modelResource/ztree/css/Common.css'
//     ];

// import '../../common/modelResource/css/TreeControl.css';
// import '../../common/modelResource/css/Toolbar.css';
// import '../../common/modelResource/css/Desktop.css';
// import '../../common/modelResource/css/NoteText.css';
// import '../../common/modelResource/css/jquery-ui.min.css';
// import '../../common/modelResource/ztree/css/zTreeStyle/zTreeStyle.css';
// import '../../common/modelResource/ztree/css/zTreeStyle/ztreeCommon.css';
// import '../../common/modelResource/ztree/css/Common.css';



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


// Vue.use(ElementUI);
Vue.use(VueResource);

new Vue({
    el: '#root',
    render: h => h(App)
});