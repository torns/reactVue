<script>
    import common from '../../../components/common.vue';
// 请求列表
export default {
    extends: common,
    name:"system form",
    data(){
        return{
            //apis
            urls:[
                "/sysFormsSetting/selectSysFormsSettingByPro",//list
                "/sysFormsSetting/addSysFormsSetting"//insert
            ],
            //api index
            url_idx:{
                init:0,
                insert:1
            },
            //api parameters
            params:[
                {userId:window.userId,projectId:window.projectId},
                {userId:window.userId,projectId:window.projectId,formName:"",professionalId:"",
                    formContent:''}
            ],
            m_list:[],
            //当前页
            current:1,
            //每页数据
            showItem:10,
            //页数
            allpage:"",
            //总个数
            allNum:0,
            //select
            select:{
                formName:"",
                profession:"",
            },
        }
    },
    mounted: function() {
        //请求数据调用
    },
    methods: {
        init_cb:function (result) {
//            alert(result.data.message);
            this.m_list = result.data.data.result;
        },
        //分页
        goto:function(index){
            if(index == this.current) return;
            this.current = index;
            // var that=this;
            // that.allNum=that.qualityList.length;
            // that.allpage=Math.ceil(that.qualityList.length/this.showItem);
        },
        //跳转编辑器
        urlHtml:function(){
            var toUrl;
            //console.log(this.form.formId);
            toUrl=zyfUrl+"/editors.html?block=systemForm&type=add";
            window.open(toUrl);
        },
        edit:function(){
            var toUrl;
            toUrl=zyfUrl+"/editors.html?block=systemForm&type=edit&sessionId="+'11';
            window.open(toUrl);
        }
    },
    computed: {
        //分页的
        pages:function(){
            var pag = [];
            if( this.current < this.showItem ){ //如果当前的激活的项 小于要显示的条数
                //总页数和要显示的条数那个大就显示多少条
                var i = Math.min(this.showItem,this.allpage);
                while(i){
                    pag.unshift(i--);
                }
            }else{ //当前页数大于显示页数了
                var middle = this.current - Math.floor(this.showItem / 2 ),//从哪里开始
                    i = this.showItem;
                if( middle >  (this.allpage - this.showItem)  ){
                    middle = (this.allpage - this.showItem) + 1
                }
                while(i--){
                    pag.push( middle++ );
                }
            }
            return pag
        },

    }
}
</script>

<template>
    <main id="root" class="app-main">
        <div class="wrap">
            <securityDanger></securityDanger>
        </div><!-- .wrap -->
    </main>
</template>
<template>
  <section class="app-content layout-center" id="security-danger">
        <!--相应内容-->
        <div class="list-content">
            <div class="row">
                <div class="col-md-12" style="padding-right: 0;">
                    <div class="widget">
                        <header class="widget-header">
                            <div class="row">
                                <div class="col-xs-3">
                                    <el-input type="text" v-model="select.formName" placeholder="请输入表单名称" :disabled="lookDisabled"></el-input>
                                </div>
                                <div class="col-xs-3">
                                    <el-select v-model="select.profession" placeholder="选择专业">
                                        <el-option label="1" value="1"></el-option>
                                        <el-option label="2" value="2"></el-option>
                                        <el-option label="3" value="3"></el-option>
                                    </el-select>
                                </div>
                                <div class="col-xs-3">
                                    <button type="button" class="btn primary backg-color top-select">筛选</button>
                                    <button type="button" class="btn btn-default">重置</button>
                                </div>
                                <div class="pull-right">
                                    <el-button type="text" class="el-button--primary" @click="urlHtml()">新增模板</el-button>
                                </div>
                            </div>
                        </header>
                        <hr class="widget-separator">
                        <div class="widget-body security-body" style="padding: 0;">
                            <div class="table-responsive">
                                <!--表格-->
                                <table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">
                                    <thead>
                                    <tr>
                                        <th>编号</th>
                                        <th>表单名称</th>
                                        <th>专业</th>
                                        <th>创建人</th>
                                        <th>修改时间</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="i in m_list">
                                        <td> {{i.formSettingNo}}</td>
                                        <td class="td-content">
                                            {{i.formName}}
                                        </td>
                                        <td>{{i.professionalName}}</td>
                                        <td>{{i.userName}}</td>
                                        <td>{{i.upadateDate}}</td>
                                        <td class="td-handles">
                                            <i class="fa fa-trash-o fa-2 fa-fw"></i>
                                            <i class="fa fa-edit fa-2 td-edit"  @click="edit()"></i>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <!--分页-->
                                <div class="pages text-center">
                                    <span class="allNum">共&nbsp;
                                        <span class="theme-color">{{allNum}}</span>
                                        &nbsp;条质量问题</span>
                                    <ul class="pagination" >
                                        <li v-show="current != 1" @click="current-- && goto(current)" ><a href="#">上一页</a></li>
                                        <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
                                            <a href="#" >{{index}}</a>
                                        </li>
                                        <li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)"><a href="#" >下一页</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div><!-- .widget-body -->
                    </div>
                </div>
            </div>
        </div>
    </section><!-- #dash-content -->
</template>


<style scoped>
    .app-main{
        margin-top: 60px;
        margin-bottom: 15px;
    }
</style>

