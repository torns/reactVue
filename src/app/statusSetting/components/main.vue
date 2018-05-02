<!--<script src="../../../common/list-common.js" ></script>-->

<script>
    import { ajax } from '../../../common/list-common.js'
    export default {
    name:'statusSetting',
    data(){
        return{
            //apis
            urls:[
                "/sysRenderStyleSetting/selectSysRenderStyleSettingBypro",//list
                "/sysRenderStyleSetting/addSysRenderStyleSetting",//insert
                "/sysStatusSetting/selectSysStatusSettingByConditions",//status list
                "/sysStatusSetting/addSysStatusSetting"//insert status
            ],
            //api index
            url_idx:{
                styleinit:0,
                styleinsert:1,
                statuslist:2,
                statusinsert:3
            },
            //api parameters
            params:[
                {userId:window.userId,projectId:window.projectId},
                {userId:window.userId,projectId:window.projectId,renderStyleName :"",renderStyleColor:""},
                {userId:window.userId,projectId:window.projectId,memberId:''},
                {userId:window.userId,projectId:window.projectId,memberId:'',statusName:'',processId:''  }
            ],
            resultParam:{},
            insertStyleDialogVisible:false,
            insertStatusDialogVisible:false,
            flag:1,
            title:'添加专业',
            stylelist:[
            ],
            statuslist:[],
            rules: {
                name: [
                    { required: true, message: '请输入专业名', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                code: [
                    { type: 'date', required: false, message: '请输入分类编码', trigger: 'change' }
                ]
            },
            insertStyleForm:{renderStyleName :"",renderStyleColor :0},
            insertStatusForm:{statusName:'',flowtemplate:'',biaodan_template:'',statususer:'',renderStyle:''}
        }
    },
    mounted:function () {
        var idx = this.url_idx.styleinit;//api index
        //alert("before ajax in created of projectManage");
        ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);


    },
    created:function () {
        var stidx = this.url_idx.statuslist;
        ajax(this,zyfUrl + this.urls[stidx],this.params[stidx],0,this.statuslist_cb);
    },
    methods:{
        init_cb:function (result) {
            //alert(result.data.message);

            this.stylelist = result.data.data;
        },
        statuslist_cb:function (result) {
            alert(result.data.message);
            this.statuslist = result.data.data;
        },
        insertStyle_cb:function (result) {
            alert(result.data.message);
            this.insertStyleDialogVisible = false;
        },
        insertStatus_cb:function (result) {
            alert(result.data.message);
            this.insertStatusDialogVisible = false;
        },
        update_cb:function (result) {
            alert(result.data.message);
            this.dialogVisible = false;
        },
        insertStyle:function () {
            this.insertStyleDialogVisible=true;
            this.title='添加渲染样式';
            this.flag=1;
        },
        insertStyleSubmit:function () {
            var idx = this.url_idx.insert;//api index
            //prepare params
            var param = this.params[idx];
            param.renderStyleName = this.insertStyleForm.renderStyleName;
            param.renderStyleColor = this.insertStyleForm.renderStyleColor;
            ajax(this,zyfUrl + this.urls[idx],param,0,this.insertStyle_cb);
        },
        insertStatus:function () {
            this.insertStatusDialogVisible=true;
            this.title='添加状态';
            this.flag=1;
        },
        insertStatusSubmit:function () {
            var idx = this.url_idx.statusinsert;//api index
            //prepare params
            var param = this.params[idx];
            param.statusName = this.insertStatusForm.statusName;
            param.processId = 1;
            ajax(this,zyfUrl + this.urls[idx],param,0,this.insertStatus_cb);
        },
        update:function () {
            this.dialogVisible=true;
            this.title='编辑专业';
            this.flag=0;
            
        },
        updateSubmit:function () {
            
        }
    }

}
</script>

<template>
<!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap">
            <section class="app-content">
                <!--相应内容-->
                <div class="add-flow-content">
                    <div class="row">
                        <div class="col-md-12" style="padding-right: 0;">
                            <div class="widget">
                                <header class="widget-header">
                                    <div >状态设置</div>
                                    <hr class="widget-separator">
                                </header>
                                <div class="widget-body">
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <div class="top-title text-center">
                                                渲染样式设置
                                            </div>
                                            <div class="setFlow-center">
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <div class="one-part" style="height: 420px;">
                                                            <!--弹窗-->
                                                            <el-dialog class="my-modal" :visible.sync="insertStyleDialogVisible" width="40%">
                                                                <div class="modal-header primary backg-color">
                                                                    <div class="modal-title">
                                                                        添加渲染样式
                                                                    </div>
                                                                </div>
                                                                <!--内容-->
                                                                <el-form :model="insertStyleForm" :rules="rules" ref="insertStyleForm">
                                                                    <el-form-item label="样式名称:">
                                                                        <el-input v-model="insertStyleForm.renderStyleName"></el-input>
                                                                    </el-form-item>
                                                                    <el-form-item label="样式颜色:" prop="priority">
                                                                    </el-form-item>
                                                                </el-form>
                                                                <span slot="footer" class="dialog-footer">
                                                                    <el-button @click="insertStyleDialogVisible = false">取 消</el-button>
                                                                    <el-button type="primary" @click="insertStyleSubmit()">完成</el-button>
                                                                </span>
                                                            </el-dialog>
                                                            <div class="row">
                                                                <div class="col-xs-6">
                                                                    渲染样式列表
                                                                </div>
                                                                <div class="pull-right">
                                                                    <el-button type="text" @click="insertStyle()" class="el-button--primary">添加渲染样式</el-button>
                                                                </div>
                                                            </div>
                                                            <hr class="widget-separator">
                                                            <div class="row pt_10 color-setting" v-for="i in stylelist">
                                                                <div class="col-xs-6">
                                                                    <span class="label primary"> </span>
                                                                    {{i.renderStyleName}}
                                                                </div>
                                                                <div class="pull-right">
                                                                    <span class="theme-color c-pointer">删除</span>
                                                                    <span class="theme-color c-pointer" data-toggle="modal" data-target="#edit_modal">编辑</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-8 pb_20">
                                            <div class="top-title text-center">
                                                状态设置
                                            </div>
                                            <div class="setFlow-center">
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <div class="one-part">
                                                            <div class="row part-top">
                                                                <div class="col-xs-2">
                                                                    <span>构件类型:</span>
                                                                </div>
                                                                <div class="col-xs-4">
                                                                    <select name="type" class="typeSel">
                                                                        <option value="0" checked="">选择构件类型</option>
                                                                        <option value="1">未处理</option>
                                                                        <option value="2">处理中</option>
                                                                        <option value="3">已关闭</option>
                                                                    </select>
                                                                </div>
                                                                <div class="pull-right">
                                                                    <el-button type="text" @click="insertStatus()" class="el-button--primary">添加状态</el-button>
                                                                </div>
                                                            </div>
                                                            <div class="row part-title">
                                                                <div class="col-xs-6 b-r">
                                                                    <span>状态列表</span>
                                                                </div>
                                                                <div class="col-xs-6">
                                                                    <span>不合格状态列表</span>
                                                                </div>
                                                            </div>
                                                            <!--弹窗-->
                                                            <el-dialog class="my-modal" :visible.sync="insertStatusDialogVisible" width="40%">
                                                                <div class="modal-header primary backg-color">
                                                                    <div class="modal-title">
                                                                        添加状态
                                                                    </div>
                                                                </div>
                                                                <!--内容-->
                                                                <el-form :model="insertStatusForm" :rules="rules" ref="insertStyleForm">
                                                                    <el-form-item label="状态名称:">
                                                                        <el-input v-model="insertStatusForm.statusName"></el-input>
                                                                    </el-form-item>
                                                                    <el-form-item label="流程模板:">
                                                                        <el-select v-model="insertStatusForm.flowtemplate" placeholder="请选择流程模板">
                                                                            <el-option label="1" value="1"></el-option>
                                                                            <el-option label="2" value="2"></el-option>
                                                                            <el-option label="3" value="3"></el-option>
                                                                        </el-select>
                                                                    </el-form-item>
                                                                    <el-form-item label="表单模板:">
                                                                        <el-select v-model="insertStatusForm.biaodan_template" placeholder="请选择表单模板">
                                                                            <el-option label="1" value="1"></el-option>
                                                                            <el-option label="2" value="2"></el-option>
                                                                            <el-option label="3" value="3"></el-option>
                                                                        </el-select>
                                                                    </el-form-item>
                                                                    <el-form-item label="状态用户:">
                                                                        <el-select v-model="insertStatusForm.statususer" placeholder="请选择状态用户">
                                                                            <el-option label="1" value="1"></el-option>
                                                                            <el-option label="2" value="2"></el-option>
                                                                            <el-option label="3" value="3"></el-option>
                                                                        </el-select>
                                                                    </el-form-item>
                                                                    <el-form-item label="渲染样式:">
                                                                        <el-select v-model="insertStatusForm.renderStyle" placeholder="请选择渲染样式">
                                                                            <el-option label="1" value="1"></el-option>
                                                                            <el-option label="2" value="2"></el-option>
                                                                            <el-option label="3" value="3"></el-option>
                                                                        </el-select>
                                                                    </el-form-item>
                                                                    <div class="row">
                                                                        <div class="col-xs-3">
                                                                            是否不合格状态:
                                                                        </div>
                                                                        <div class="col-xs-9">
                                                                            <div class="checkbox checkbox-primary">
                                                                                <input type="checkbox" id="checkbox-demo-2">
                                                                                <label for="checkbox-demo-2"></label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-xs-3">
                                                                            是否完成状态:
                                                                        </div>
                                                                        <div class="col-xs-9">
                                                                            <div class="checkbox checkbox-primary">
                                                                                <input type="checkbox">
                                                                                <label></label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </el-form>
                                                                    <span slot="footer" class="dialog-footer">
                                                                        <el-button @click="insertStatusDialogVisible = false">取 消</el-button>
                                                                        <el-button type="primary" @click="insertStatusSubmit()">完成</el-button>
                                                                    </span>
                                                            </el-dialog>
                                                            <div class="row" v-for="i in statuslist">
                                                                <div class="col-xs-6 b-r">
                                                                    <div class="row pt_10">
                                                                        <div class="col-xs-6">
                                                                            {{i.statusName}}
                                                                        </div>
                                                                        <div class="pull-right">
                                                                            <span class="theme-color c-pointer">删除</span>
                                                                            <span class="theme-color c-pointer" data-toggle="modal" data-target="#edit_modal2">编辑</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div><!-- .widget-body -->
                            </div>
                        </div>
                    </div>
                </div>
            </section><!-- .app-content -->
        </div><!-- .wrap -->

    </main>
<!--</div>-->
</template>

<style scoped>
    .app-main{
        margin-top: 60px;
        margin-bottom: 15px;
    }
</style>


