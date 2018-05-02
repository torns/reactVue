// import 'publicPath';
import './sass/font-awesome.min.css';
// import './fonts/fontawesome-webfont.woff2'
import './sass/material-design-iconic-font.css';
import './sass/animate.min.css';
import './sass/fullcalendar.min.css';
import './sass/perfect-scrollbar.css';
import './sass/bootstrap.css';
import './sass/core.css';
import './sass/app.css';
import './sass/layout.css';
import './sass/pages-index.css';

//import './list-common.js'

//全局引入
// import $ from 'jquery';
// window.$ = $;
window.global = window;
window.jQuery =require('jquery');
window.$ = jQuery;
require ('bootstrap/dist/js/bootstrap');
window.nds={};
//全局模型构件的属性值输出
window.componentMes=[];
// import $ from 'jquery';
import Vue from 'vue';
window.Vue = Vue;
import vueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.use(vueRouter);

// require ('vue-resource/dist/vue-resource');
// import VueResource from 'vue-resource';
// window.Vue.use(VueResource);
//服务器接口
// window.zyfUrl = 'http://192.168.3.31:10091/zyfbim';
// window.zyfUrl = 'http://192.168.3.56:8787/zyfbim';
//window.zyfUrl = 'http://192.168.3.84:8080/zyfbim';
// window.zyfUrl = "http://116.62.114.241:8080/zyfbim";
//window.zyfUrl = 'http://192.168.3.29:8080';
window.zyfUrl='http://116.62.114.241:8080/zyfbim';


localStorage.getItem("userId");
localStorage.getItem("projectId");
localStorage.getItem("jwt");
window.userId=localStorage.userId;
window.projectId=localStorage.projectId;
if(window.projectId==undefined){
    window.projectId='';
}
window.jwt=localStorage.jwt;
//全局的ID
// if(window.userId==undefined){
//     window.userId='123456';/*用户ID*/
//     window.projectId='95a1ddecc59f499f8f759d35936d64f6';/*项目ID*/
//     window.jwt='sadasdadsa';/*token*/
//     console.log('游客登录'+window.userId);
// }else{
//     console.log('用户登录'+window.userId);
// }
window.modelId='1';/*项目ID*/
//质量表单名字
window.getformName="";
//全局session
window.responsive=function (data,$this) {
    if(data==10001){
        $this.$message.error('返回信息异常');
    }else if(data==20000){
        $this.$message.error('暂无数据');
    }else if(data==20001){
        $this.$message.error('请求参数错误');
    }else if(data==20002){
        $this.$message.error('存在重复数据');
    }else if(data ==10005){
        window.location.href=zyfUrl;
    }
};
//模型播放属性
window.modelPlay=false;
const initRoot = () => {
    if ($('#root').length) return;
    $('body').append('<div id="root"></div>');
};

initRoot();
//    页面loading效果
function completeLoading() {
    console.log(document.readyState);
    if (document.readyState == "interactive" ||document.readyState == "complete" ) {
        setTimeout(function () {
            var loadingMask = document.getElementById('loading');
            $(loadingMask).remove();
        },1000)
    }
}
$(document).ready(function () {
    completeLoading();
});
completeLoading();

