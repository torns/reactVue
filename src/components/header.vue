<script>
export default {
    name:"root",
    data() {
        return {
            url: '/index.html',
            urlTitle:'',
            urlArr:[
                {name:'施工日记',url:'scheduleDiary',pName:'进度管理'},
                {name:'施工计划',url:'schedulePlan',pName:'进度管理'},
                {name:'录入进度',url:'scheduleEntry',pName:'进度管理'},
                {name:'计划进度模拟',url:'schedulePlanProgress',pName:'进度管理'},
                {name:'实际进度模拟',url:'scheduleActProgress',pName:'进度管理'},
                {name:'资料管理',url:'fileManage',pName:'资料管理'},
                {name:'质量总览',url:'qualityOverview',pName:'质量管理'},
                {name:'质量问题',url:'qualityProblem',pName:'质量管理'},
                {name:'质量验收',url:'qualityCheck',pName:'质量管理'},
                {name:'安全总览',url:'securityOverview',pName:'安全管理'},
                {name:'安全问题列表',url:'securityProblem',pName:'安全管理'},
                {name:'危险源',url:'securityDanger',pName:'安全管理'},
                {name:'构建分组',url:'constructGroup',pName:'构建管理'},
                {name:'构建列表',url:'constructList',pName:'构建管理'},
                {name:'会议日历',url:'meetingCalendar',pName:'会议中心'},
                {name:'周期会议',url:'cycleMeeting',pName:'会议中心'},
                {name:'通知公告',url:'announcement',pName:'会议中心'},
                {name:'用户管理',url:'systemManage',pName:'系统设置'},
                {name:'角色管理',url:'systemRoleManage',pName:'系统设置'},
                {name:'企业管理',url:'systemBusiness',pName:'系统设置'},
                {name:'菜单管理',url:'systemMenu',pName:'系统设置'},
                {name:'专业管理',url:'systemProfession',pName:'系统设置'},
                {name:'流程设置',url:'systemProcessSet',pName:'系统设置'},
                {name:'角色管理权限设置',url:'systemRoleLimitset',pName:'系统设置'},
                {name:'项目管理',url:'systemProjectManage',pName:'系统设置'},
                {name:'构建类型',url:'systemConstructType',pName:'系统设置'},
                {name:'状态设置',url:'statusSetting',pName:'系统设置'},
                {name:'表单设置',url:'systemForm',pName:'系统设置'},
                {name:'编辑器',url:'editors.html',pName:'其他页面'},
                {name:'登录日志',url:'loginDaily.html',pName:'其他页面'},
                {name:'施工日志',url:'builderDiary',pName:'其他页面'},


            ],
            zyfUrl:zyfUrl,
            isOpen:false,
            //outUl:false
        }
    },
    methods:{
        // loginOut:function(){
        //     this.outUl=!this.outUl;
        // },
        urlHtml:function(){
            localStorage.clear();
            window.location.href=zyfUrl;
        },
        styleSet:function () {
            var that=this;
            if($('#root').hasClass('openOver')){
                this.isOpen=false;
                $('#root').removeClass('openOver');
                $('#root').find('.submenu').removeClass('open');
                $('.col-xs-10').removeAttr('style','width:94%;margin-left:6%');
                $('.col-xs-10').find('.root').removeAttr('style','width:94%');
                $('.col-xs-10').find('#root').removeAttr('style','width:100%');
            }else{
                this.isOpen=true;
                $('#root').addClass('openOver');
                $('#root').find('.submenu').addClass('open');
                $('.col-xs-10').attr('style','width:94%;margin-left:6%');
                $('.col-xs-10').find('.root').attr('style','width:94%');
                $('.col-xs-10').find('#root').attr('style','width:100%');
            }

        }
    },
    mounted:function() {
        var $menubarFoldButton = $('#menubar-fold-btn');
//        面包屑
//        var urlArr = window.location.href.split('/')[3];
//        console.log(window.location.href);
        if(window.location.href.split('/').length > 4){
            var urlArr = window.location.href.split('/')[4].split('?')[0];
            var that=this;
            this.urlArr.forEach(function (item,index) {
                if(urlArr ==item.url){
                    that.urlTitle=item.name;
                }
            });
        }else{

        }
        
    }
}
</script>

<template>
<div class="root">
    <!--<div class="el-col el-col-4">logo</div> -->
    <!--<el-breadcrumb class="el-col el-col-20 bread" separator="/">-->
        <!--<el-breadcrumb-item>首页</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>活动管理</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>活动列表</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>活动详情</el-breadcrumb-item>-->
    <!--</el-breadcrumb>-->
    <div class="navbar-container container-fluid">
        <div class="collapse navbar-collapse" id="app-navbar-collapse">
            <ul class="nav navbar-toolbar navbar-toolbar-left navbar-left" v-bind:href=zyfUrl>
                <li class="hidden-float hidden-menubar-top">
                    <a @click="styleSet()" class="hamburger hamburger--arrowalt is-active js-hamburger">
                        <span class="hamburger-box">
                            <span v-bind:class="{opent:isOpen}" class="hamburger-inner"></span>
                            <!--<i class="fa fa-bars" aria-hidden="true"></i>-->
                        </span>
                    </a>
                </li>
                <li>
                    <h5 class="page-title hidden-menubar-top hidden-float">{{urlTitle}}</h5>
                </li>
            </ul>

            <ul class="nav navbar-toolbar navbar-toolbar-right navbar-right">
                
                <li class="dropdown">
                    <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="zmdi zmdi-hc-lg zmdi-settings"></i></a>
                    <ul class="dropdown-menu animated flipInY">
                        <li><a href="javascript:void(0)" @click="urlHtml()"><i class="zmdi m-r-md zmdi-hc-lg zmdi-account-box"></i>退出登录</a></li>
                    </ul>
                </li>

                <!--<li class="dropdown">
                    <a href="javascript:void(0)" class="side-panel-toggle" data-toggle="class" data-target="#side-panel" data-class="open" role="button"><i class="zmdi zmdi-hc-lg zmdi-apps"></i></a>
                </li>-->
            </ul>
        </div>
    </div>
</div>
</template>

<style scoped>
.root {
    /*height: 40px;*/
    /*line-height: 40px;*/
    width: 83.3333333333%;
    background-color: #188ae2;
    color: #fff;
    position: fixed;
    top: 0;
    z-index: 9;
}
.bread {
    padding-left: 20px;
    margin: 13px 0 0 0;
}
body.menubar-left .navbar-container{
    -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
.auto{
    width: 93%;
}
.opent{
    transform: rotate(180deg);
}
</style>

