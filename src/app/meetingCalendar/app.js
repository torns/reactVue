import 'publicPath';
import App from './components/app';
import VueResource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import 'fullcalendar/dist/fullcalendar.min.css';
// import 'fullcalendar/dist/fullcalendar.min.js';
import fullCalendar from 'vue-fullcalendar';
//自己的css
import './css/quality/quality.css';
// 自己的js
// import './js/vue-fullcalendar.js';
//require('./js/vue-fullcalendar.js');
Vue.use(ElementUI);
Vue.use(VueResource);
//Vue.component('full-calendar', fullCalendar) 

new Vue({
    el: '#root',
    render: h => h(App)
});