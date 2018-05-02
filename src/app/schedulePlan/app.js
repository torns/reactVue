import 'publicPath';
import App from './components/app';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import vueResource from 'vue-resource';

import  './components/css/progress.css';
// import {loadScripts} from 'asyncLoad';

// import  './components/gantt/platform.css';
// import  './components/gantt/libs/dateField/jquery.dateField.css';
// import  './components/gantt/print.css';
// // import  'http://code.jquery.com/jquery-migrate-1.2.1.js';
// import  './components/gantt/jquery-migrate-1.2.1.js';
// import  './components/gantt/libs/jquery.livequery.min.js';
// import  './components/gantt/libs/jquery.timers.js';
// import  './components/gantt/libs/platform.js';
// import  './components/gantt/libs/date.js';
// import  './components/gantt/libs/i18nJs.js';
// import  './components/gantt/libs/dateField/jquery.dateField.js';
// import  './components/gantt/libs/JST/jquery.JST.js';
// import  './components/gantt/libs/jquery.svg.css'
// import  './components/gantt/libs/jquery.svg.min.js';
// import  './components/js/foundation-datepicker.min.js';
// import  './components/gantt/libs/jquery.svgdom.1.8';
// import  './components/gantt/ganttUtilities.js';
// import  './components/gantt/ganttTask.js';
// import  './components/gantt/ganttDrawerSVG.js';
// import  './components/gantt/ganttGridEditor.js';
// import './components/gantt/ganttMaster.js';
// import  './components/js/process-manage.js';

const ganttUrl =[
        '//116.62.203.181/zyfbim/gantt/platform.css',
        '//116.62.203.181/zyfbim/gantt/libs/dateField/jquery.dateField.css',
        '//116.62.203.181/zyfbim/gantt/print.css',
        '//116.62.203.181/zyfbim/gantt/jquery-migrate-1.2.1.js',
        '//116.62.203.181/zyfbim/gantt/libs/jquery.livequery.min.js',
        '//116.62.203.181/zyfbim/gantt/libs/jquery.timers.js',
        '//116.62.203.181/zyfbim/gantt/libs/platform.js',
        '//116.62.203.181/zyfbim/gantt/libs/date.js',
        '//116.62.203.181/zyfbim/gantt/libs/i18nJs.js',
        '//116.62.203.181/zyfbim/gantt/libs/dateField/jquery.dateField.js',
        '//116.62.203.181/zyfbim/gantt/libs/JST/jquery.JST.js',
        '//116.62.203.181/zyfbim/gantt/libs/jquery.svg.css',
        '//116.62.203.181/zyfbim/gantt/libs/jquery.svg.min.js',
        '//116.62.203.181/zyfbim/js/foundation-datepicker.min.js',
        '//116.62.203.181/zyfbim/gantt/libs/jquery.svgdom.1.8',
        '//116.62.203.181/zyfbim/gantt/ganttUtilities.js',
        '//116.62.203.181/zyfbim/gantt/ganttTask.js',
        '//116.62.203.181/zyfbim/gantt/ganttDrawerSVG.js',
        '//116.62.203.181/zyfbim/gantt/ganttGridEditor.js',
        '//116.62.203.181/zyfbim/gantt/ganttMaster.js',
        '//116.62.203.181/zyfbim/js/process-manage.js',
];

// Vue.use(ElementUI);
Vue.use(vueResource);

new Vue({
    el: '#root',
    render: h => h(App)
});
// loadScripts(urls);
