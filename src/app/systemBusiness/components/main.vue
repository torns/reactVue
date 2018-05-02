<script>
import { ajax } from '../../../common/list-common.js'
$(document).ready(function() {
    //table 高度设置
    var thisH = $(window).height();
    var centerH=thisH -215 + 'px';
    $(".table-responsive").css("height", centerH);
})
window.onresize = function() {
    var thisH = $(window).height();
    var centerH=thisH -215 + 'px';
    $(".table-responsive").css("height", centerH);
}
export default {
    name:'system-business',
    data(){
        return{
            //apis
            urls:[
                "/company/look",//list
                "/company/create"//insert
            ],
            //api index
            url_idx:{
                init:0,
                insert:1
            },
            //api parameters
            params:[
                {userId:window.userId,projectId:window.projectId},
                {userId:window.userId,projectId:window.projectId,companyName:"",parentId:""}
            ],
            dialogVisible:false,
            title:'',
            flag:1,
            list:[
            ],
            //
            tableList:"",
            businessId:"",
            filterText:"",
            companyList:"",
            //添加form
            insertForm: {
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                //上传的字段
                companyName:'',
                parentId:'',
                companyId:''
            },
            rules:{
                companyName: [
                    { required: true, message: '请输入企业名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                parentId: [
                    { required: true, message: '请输入所属父级', trigger: 'change' }
                ]
            }
        }
    },
    mounted:function () {
        this.getList();
        this.selectCompany();
        //var idx = this.url_idx.init;//api index
        //alert("before ajax in created of projectManage");
        //ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
    },
    created:function () {
    },
    methods:{
        init_cb:function (result) {
            //alert(result.data.message);
            this.list = result.data.data;
        },
        insert_cb:function (result) {
            //alert(result.data.message);
            this.dialogVisible = false;
        },
        update_cb:function (result) {
            //alert(result.data.message);
            this.dialogVisible = false;
        },
        insert:function () {
            this.dialogVisible=true;
            this.title='添加企业';
            this.flag=1;
            var that=this.insertForm;
            that.companyName="";
            that.parentId="";
            this.selectCompany();
        },
        //请求数据
         getList:function() {
            var _this=this;
            this.$http.post(zyfUrl + '/company/look', {
                userId:userId,
                projectId:projectId,
                jwt:jwt,
            }, {
                headers: {
                },
                emulateJSON: true
            }).then(function(result) {
                // 这里是处理正确的回调
                console.log(result.body.data);
                _this.tableList = result.body.data;

            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        //请求父级企业
        selectCompany:function() {
            var _this=this;
            this.$http.post(zyfUrl + '/company/lookTree', {
                userId:userId,
                projectId:projectId,
                jwt:jwt,
            }, {
                headers: {
                },
                emulateJSON: true
            }).then(function(result) {
                // 这里是处理正确的回调
                console.log(result.body.data);
                _this.companyList = result.body.data;

            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        //提交
        insertSubmit:function () {
            var _this=this;
            var that=this.insertForm;

            //var idx = this.url_idx.insert;//api index
            //prepare params
            // var param = this.params[idx];
            // param.companyName = this.insertForm.companyName;
            // param.professionType = this.insertForm.parentId;
            // ajax(this,zyfUrl + this.urls[idx],param,0,this.insert_cb);
            if(that.companyName==""||that.parentId==""){
                //警告 
                this.$message({
                    message: "请完善信息再提交！",
                    type: 'warning'
                });
                _this.dialogVisible=true;
                return false;
            }else{
                $.ajax({
                    type: 'POST',
                    data: that,
                    url: zyfUrl+'/company/create',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        //console.log(data);
                        if(data.code==10000){
                            _this.dialogVisible=false;
                            //刷新数据
                            _this.getList();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error ' + textStatus + ' ' + errorThrown);
                    }
                });
            }
        },
        //删除
        deleteBus:function(index){
            var _this=this;
            this.$confirm('将永久删除该企业, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认调用
                this.$http.post(zyfUrl + '/company/delete',{
                    companyId:index,
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                // 这里是处理正确的回调
                if(result.data.code==10000){
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //刷新数据
                    _this.getList();
                }
            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
                
            }).catch(() => {
                //取消事件
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //编辑
        edit:function(index){
            this.dialogVisible=true;
            this.title='编辑企业';
            this.flag=2;
            var that=this.insertForm;
            that.companyId=index;
            //通过id获取
            $.ajax({
                type: 'POST',
                data: {
                    companyId:index,
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                },
                url: zyfUrl+'/company/lookDetail',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                    that.companyName=data.data.companyName;
                    that.parentId=data.data.parentId;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
        },
        //编辑提交
        editSubmit:function () {
            var _this=this;
            var that=this.insertForm;
            if(that.companyName==""||that.parentId==""){
                //警告 
                this.$message({
                    message: "请完善信息再提交！",
                    type: 'warning'
                });
                _this.dialogVisible=true;
                return false;
            }else{
                $.ajax({
                    type: 'POST',
                    data: that,
                    url: zyfUrl+'/company/update',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        console.log(data);
                        if(data.code==10000){
                            _this.dialogVisible=false;
                            //刷新数据
                            _this.getList();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error ' + textStatus + ' ' + errorThrown);
                    }
                });
            }
        },
    },
    // watch: {
    //   filterText(val) {
    //     this.$refs.tree.filter(val);
    //   }
    // },
}
</script>

<template>
<!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap">
            <section class="app-content">
                <div class="system-profession">
                    <div class="list-header">
                        <div class="row">
                            <div class="col-md-12 widget">
                                <header class="widget-header" style="height: 64px;">
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <!--<input class="theaderSel" value="请输入查询企业名称">-->
                                            <!--<el-input placeholder="请输入查询企业名称" v-model="filterText" class="theaderSel"></el-input>-->
                                        </div>
                                        <div class="position-btn">
                                            <el-button type="text" @click="insert()" class="el-button--primary">添加企业</el-button>
                                            <!--<button type="button" class="btn primary backg-color" data-toggle="modal" data-target="#insert_business">添加企业</button>-->
                                        </div>
                                    </div>
                                </header>
                            </div>
                        </div>
                    </div>
                    <div class="list-content">
                        <div class="row">
                            <div class="col-md-12 widget">

                                <!--弹窗-->
                                <el-dialog class="my-modal" :visible.sync="dialogVisible" width="40%">
                                    <div class="modal-header primary backg-color">
                                        <div class="modal-title">
                                            {{title}}
                                        </div>
                                    </div>
                                    <!--内容-->
                                    <el-form :model="insertForm" :rules="rules" ref="insertForm">
                                        <el-form-item label="企业名称:">
                                            <el-input v-model="insertForm.companyName"></el-input>
                                        </el-form-item>
                                        <el-form-item label="所属父级:" prop="priority">
                                            <el-select v-model="insertForm.parentId" placeholder="请选择">
                                                <el-option label="无" value="0">无</el-option>
                                                <el-option :label="company.companyName" :value="company.companyId" v-for="company in companyList"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                    <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="insertSubmit()" v-if="flag==1">完成</el-button>
                                <el-button type="primary" @click="editSubmit()" v-else>完成</el-button>
                            </span>
                                </el-dialog>


                                <div class="widget-body" style="padding: 0;">
                                    <div class="table-responsive">
                                        <!--<table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">-->
                                        <table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">
                                            <thead>
                                            <tr>
                                                <th>序号</th>
                                                <th>企业名称</th>
                                                <th>所属父级</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(r,index) in tableList">
                                                <td>{{index+1}}</td>
                                                <td>{{r.companyName}}</td>
                                                <td v-if="r.parentName ==''">无</td>
                                                <td v-else>{{r.parentName}}</td>
                                                <td class="td-handles">
                                                    <i class="fa fa-edit fa-2 td-edit" aria-hidden="true" @click='edit(r.companyId)'></i>
                                                    <i class="fa fa-trash fa-2 fa-trash" aria-hidden="true" @click='deleteBus(r.companyId)'></i>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <!--原有的行-->
                                        <div class="col-sm-3">
                                            <div class="dataTables_info" role="status" aria-live="polite">
                                                共 &nbsp;<span class="now-num theme-color">{{tableList.length}}</span> &nbsp;条企业
                                            </div>
                                        </div>
                                    </div>
                                </div><!-- .widget-body -->
                            </div>
                        </div>
                    </div>
                </div>
            </section><!-- #dash-content -->
        </div><!-- .wrap -->
        <!-- APP FOOTER -->
        <!--<div class="wrap p-t-0">-->
            <!--<footer class="app-footer">-->
                <!--<div class="clearfix">-->
                    <!--&lt;!&ndash;<ul class="footer-menu pull-right">&ndash;&gt;-->
                    <!--&lt;!&ndash;<li><a href="javascript:void(0)">Careers</a></li>&ndash;&gt;-->
                    <!--&lt;!&ndash;<li><a href="javascript:void(0)">Privacy Policy</a></li>&ndash;&gt;-->
                    <!--&lt;!&ndash;<li><a href="javascript:void(0)">Feedback <i class="fa fa-angle-up m-l-md"></i></a></li>&ndash;&gt;-->
                    <!--&lt;!&ndash;</ul>&ndash;&gt;-->
                    <!--<div class="copyright pull-left">Copyright 智在云 2018 &copy;</div>-->
                <!--</div>-->
            <!--</footer>-->
        <!--</div>-->
        <!-- /#app-footer -->
    </main>


<!--</div>-->
</template>

<style scoped>
    .app-main{
        margin-top: 60px;
        margin-bottom: 15px;
    }
</style>


