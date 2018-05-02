import 'publicPath';
import App from './components/app';
import VueResource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Vueditor from 'vueditor'
//import { VueEditor } from 'vue2-editor'
import 'vueditor/dist/style/vueditor.min.css'
import 'vueditor/dist/language/lang.cn.js'
//自己的css
import './css/editor.css';
// 自己的js
//let uploadUrl = ''
//your config here
let config = {
 // toolbar:[
//     '清除格式','撤销','重做','|','代码语言',“元”、“大小”、“字体”、“字体颜色”、“背景色”、“分”、“大胆”、“斜体”、“下划线”、“删除线”，

// “链接”、“取消”、“分”、“下标”、“上标”、“分”、“左对齐”，“居中对齐”、“右对齐”、“两端对齐”，

// “| '，'订单'，'升级'，' insertorderedlist '，' insertunorderedlist '，' | '，'表情'，'图片'，'表'，' | '、'全屏'，'源'，'降价'
//   ],
  toolbar: [
    'removeFormat', 'undo', 'redo', '|', 'code', 'element', 'fontName', 'fontSize', 'foreColor', 'backColor', 'divider', 'bold', 'italic', 'underline', 'strikeThrough',
        'link', 'unLink', 'divider', 'subscript', 'superscript', 'divider', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
        '|', 'indent', 'outdent', 'insertOrderedList', 'insertUnorderedList', '|', 'emoji', 'picture', 'table', '|', 'fullscreen', 'sourceCode', 
        //'markdown'
  ],
  fontName: [
    {val: "宋体, SimSun", abbr: "宋体"}, {val: "黑体, SimHei", abbr: "黑体"},
    {val: "楷体, SimKai", abbr: "楷体"}, {val: "微软雅黑, 'Microsoft YaHei'", abbr: "微软雅黑"},
    {val: "arial black"}, {val: "times new roman"}, {val: "Courier New"}
  ],
  fontSize: ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'],
  emoji: [
  "1f600", "1f601", "1f602", "1f923", "1f603", "1f604", "1f605", "1f606", "1f609", "1f60a", "1f60b",
  "1f60e", "1f60d", "1f618", "1f617", "1f619", "1f61a", "263a", "1f642", "1f917", "1f914", "1f610",
  "1f611", "1f636", "1f644", "1f60f", "1f623", "1f625", "1f62e", "1f910", "1f62f", "1f62a", "1f62b",
  "1f634", "1f60c", "1f913", "1f61b", "1f61c", "1f61d", "1f924", "1f612", "1f613", "1f614", "1f615",
  "1f643", "1f911", "1f632", "2639", "1f641", "1f616", "1f61e", "1f61f", "1f624", "1f622", "1f62d",
  "1f626", "1f627", "1f628", "1f629", "1f62c", "1f630", "1f631", "1f633", "1f635", "1f621", "1f620",
  "1f607", "1f920", "1f921", "1f925", "1f637", "1f912", "1f915", "1f922", "1f927"
],
  //lang:'en',
  mode: 'default',
  iframePath: '',
  fileuploadUrl: '',
  //传参
  id: '',
  classList: []
};
Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(Vueditor, config,{lang: "zh-cn"});

new Vue({
  el: '#root',
  render: h => h(App)
});