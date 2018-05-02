<script>
//    import common from '../../../components/common.vue';
export default {
//    extends: common,
    name:'',
    data(){
        return{
            //apis
//            urls:[
//                "/model/listPcGroup",//list
//            ],
            //api index
//            url_idx:{
//                init:0,
//            },
//            //api parameters
//            params:[
//                {userId:window.userId,projectId:window.projectId,jwt:window.jwt,
//                    pcGroupName:'',pcGroupNumber:0,groupType:0,pcStatus:0,pageSize:0,number:0}
//            ],
//            m_list:[],
            dialogVisible:false,
            title:'',
            flag:1,
            ruleForm:{
                name:'',
                cricble:'',
                numbers:'1',
                rate:'',
                belong:'',
            },
            rules:{
                name: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' }
                ],
                cricble: [
                    { required: false, message: '请输入分组描述', trigger: 'blur' }
                ],
                numbers: [
                    { required: false, message: '请输入达标数量', trigger: 'blur' }
                ],
                rate: [
                    { required: false, message: '请输入达标比例', trigger: 'blur' }
                ],
                belong: [
                    { required: false, message: '请选择关联状态', trigger: 'change' }
                ]
            },
            allSysPcStatus:[],
            groupList: [],
            search_pcGroupName: "",
            search_pcGroupNumber: "",
            search_pcStatus: "0",




            //添加和编辑的时候用
            groupId:"",
            groupName:"",

            groupDesc:"",

            upToStandardCount:"",

            upToStandardScale:"",

            relateStatus:"",

            //分页
            //            当前页
            current:1,
//            每页数据
            showItem:20,
//            页数
            allpage:"",
//            总个数
            allNum:0,





        }
    },
    mounted:function () {
        this.my_init();
        this.getAllSysPcStatus();

    },
    methods:{
//        init_cb:function (result) {
//            //alert(result.data.message);
//            this.m_list = result.data.data.result;
//        },
//        insert_cb:function (result) {
//
//        },
        insert:function () {
            this.dialogVisible=true;
            this.title='添加分组';
            this.flag=1
        },
        update_cb:function (result) {

        },
        update:function (index) {
            this.dialogVisible=true;
            this.title='编辑分组';
            this.flag=0;
            var that=this;
            var data=that.groupList[index];
            that.groupId=data.groupId;
            that.groupName=data.groupName;

            that.groupDesc=data.groupDesc;

            that.upToStandardCount=data.upToStandardCount;

            that.upToStandardScale=data.upToStandardScale;

            that.relateStatus=data.relateStatus;


        },
        delete:function () {

        },
        handleChange(value) {
            console.log(value);
        },
        openDialog:function () {
            this.dialogVisible=true;
            this.title='添加分组';
            this.flag=1

            this.groupId="";
                this.groupName="";

                this.groupDesc="";

                this.upToStandardCount="";

                this.upToStandardScale="";

                this.relateStatus="";

        },
        my_init: function () {
            var that = this;
            this.$http.post(zyfUrl + '/model/listPcGroup', {
                userId: userId,
                projectId: projectId,
                jwt: jwt,
                pcGroupNumber: that.search_pcGroupNumber,
                pcStatus: that.search_pcStatus



            }, {
                headers: {},
                emulateJSON: true
            }).then(function (result) {
                // 这里是处理正确的回调
                console.log(result);
                if (result.data.code == 10000) {
                    if(result.data.data.result!=""){
                        that.groupList = result.data.data.result;
                        this.allNum=result.data.data.result.length;
                        this.allpage=Math.ceil(this.allNum/this.showItem);


                    }


                }else if(result.data.code == 20000){
                        that.groupList = [];
                        this.allNum=0;
                        this.allpage=0;
                }


            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        addNewGroup:function () {
            var that = this;
            if(that.groupName==""){

                this.$alert('<strong>'+'请输入分组名'+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
                return;
            }
            var data={
             groupName:that.groupName,

             groupDesc:that.groupDesc,

            upToStandardCount:that.upToStandardCount,

            upToStandardScale:that.upToStandardScale,

             relateStatus:that.relateStatus,

             groupType:that.groupType,

            createUserId:userId,

             projectId:projectId,

             updateUserId:userId,

             modelId:modelId,
                jwt: jwt,

        }
            this.$http.post(zyfUrl + '/model/addPcGroup'+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt, JSON.stringify(data), {
                headers: {},
//                emulateJSON: true
            }).then(function (result) {
                // 这里是处理正确的回调
                if (result.data.code == 10000) {
                    that.dialogVisible = false;
                    that.groupList.push(result.data.data);


                }
                   this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });


            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        updateGroup:function () {
            var that = this;
            if(that.groupName==""){

                this.$alert('<strong>'+'请输入分组名'+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
                return;
            }
            var data={
                groupId:that.groupId,
                groupName:that.groupName,

                groupDesc:that.groupDesc,

                upToStandardCount:that.upToStandardCount,

                upToStandardScale:that.upToStandardScale,

                relateStatus:that.relateStatus,

                groupType:that.groupType,

                createUserId:userId,

                projectId:projectId,

                updateUserId:userId,

                modelId:modelId,
                jwt: jwt,

            }
            this.$http.post(zyfUrl + '/model/updatePcGroup'+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt, JSON.stringify(data), {
                headers: {},
//                emulateJSON: true
            }).then(function (result) {
                // 这里是处理正确的回调
                console.log(result)

                if (result.data.code == 10000) {
                    that.dialogVisible = false;

                    for(var x=0;x<that.groupList.length;x++){
                        if(that.groupId==that.groupList[x].groupId){
                            console.log("genxinle ")

                            that.groupList.splice(x,1,result.data.data)
                            break;
                        }

                    }



                }
                this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });



            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });
            
        },
        deletePCGroup:function (index) {

            var that = this;
            this.$http.post(zyfUrl + '/model/deletePcGroup', {
                userId: userId,
                projectId: projectId,
                jwt: jwt,
                pcGroupId:that.groupList[index].groupId

            }, {
                headers: {},
                emulateJSON: true
            }).then(function (result) {
                // 这里是处理正确的回调

                if(result.data.code==10000){
                    that.groupList.splice(index,1)
                    that.allNum--;
                    this.allpage=Math.ceil(this.allNum/this.showItem);
                }
                this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
                return;


            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        reset:function () {

                this.search_pcGroupNumber= "";
            this.search_pcStatus="0";
        },
        searchByContion:function () {
            this.my_init();
        },
        getAllSysPcStatus:function () {
            var that = this;
            this.$http.post(zyfUrl + '/model/getAllSysPcStatus', {
                userId: userId,
                projectId: projectId,
                jwt: jwt

            }, {
                headers: {},
                emulateJSON: true
            }).then(function (result) {
                // 这里是处理正确的回调

                if(result.data.code==10000){
                    that.allSysPcStatus = result.data.data;
                }else {
                    // this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                    //     dangerouslyUseHTMLString: true
                    // });
                    // return;
                }



            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        goto:function(index){
            if(index == this.current) return;
            this.current = index;
        }



    },
    computed:{
        // 分页
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
    },
}
</script>

<template>
<!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap">
            <section class="app-content">
                <!--相应内容-->
                <div class="list-content">
                    <div class="row">
                        <div class="col-md-12" style="padding-right: 0;">
                            <div class="widget">
                                <header class="widget-header">
                                    <div class="row">
                                        <div class="col-xs-2">
                                            <input type="text" placeholder="请输入查询分组编号" v-model="search_pcGroupNumber">
                                        </div>
                                        <!--<div class="col-xs-2">-->
                                            <!--<select name="type" class="theaderSel">-->
                                                <!--<option value="0" checked="">选择分组进展</option>-->
                                                <!--<option value="1"><50</option>-->
                                                <!--<option value="2"><90</option>-->
                                                <!--<option value="3">=100</option>-->
                                            <!--</select>-->
                                        <!--</div>-->
                                        <div class="col-xs-2">
                                            <select name="type" class="theaderSel" v-model="search_pcStatus">
                                                <option value="0" checked="">选择构件状态</option>
                                                <!--<option value="1">未施工</option>-->
                                                <option v-for="status in allSysPcStatus"  :value=status.statusId>{{status.statusName}}</option>
                                            </select>
                                        </div>
                                        <div class="col-xs-2">
                                            <button type="button" class="btn primary backg-color top-select" @click="searchByContion">筛选</button>
                                            <button type="button" class="btn btn-default" @click="reset">重置</button>
                                        </div>
                                        <div class="pull-right">
                                            <button type="button" class="btn primary backg-color top-add" @click="openDialog()">新增分组</button>
                                            <!--<button type="button" class="btn btn-default">导出</button>-->
                                        </div>
                                    </div>
                                </header>
                                <hr class="widget-separator">
                                <div class="widget-body" style="padding: 0;">
                                    <div class="table-responsive">

                                        <!--<table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">-->
                                        <table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">
                                            <thead>
                                            <tr>
                                                <th>分组编号</th>
                                                <th>分组名称</th>
                                                <!--<th>分组进展</th>-->
                                                <th>关联状态</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(group,index) in groupList.slice((current-1)*showItem,current*showItem)">
                                                <td> {{group.groupNumber}}</td>
                                                <td class="td-content td-title">
                                                    {{group.groupName}}
                                                </td>
                                                <!--<td>未知</td>-->
                                                <td>
                                                    <span class="label label-danger td-status">{{group.statusName}}</span>
                                                </td>
                                                <td class="td-handles">
                                                    <i class="fa fa-edit fa-2" @click="update(index)"></i>
                                                    <i class="fa fa-trash-o fa-2" aria-hidden="true" @click="deletePCGroup(index)"></i>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <!--原有的行-->
                                        <!--<div class="col-sm-3">-->
                                            <!--&lt;!&ndash;id="default-datatable_info" &ndash;&gt;-->
                                            <!--<div class="dataTables_info" role="status" aria-live="polite">-->
                                                <!--共<span class="now-num">3</span>条质量问题-->
                                            <!--</div>-->
                                        <!--</div>-->
                                        <!--&lt;!&ndash;页数&ndash;&gt;-->
                                        <!--<div class="col-sm-6 text-center">-->
                                            <!--&lt;!&ndash; id="default-datatable_paginate"&ndash;&gt;-->
                                            <!--<div class="dataTables_paginate paging_simple_numbers">-->
                                                <!--<ul class="pagination">-->
                                                    <!--<li class="paginate_button previous disabled" id="default-datatable_previous">-->
                                                        <!--<a href="#" aria-controls="default-datatable" data-dt-idx="0" tabindex="0">-->
                                                            <!--<i class="fa fa-angle-left" aria-hidden="true"></i>-->
                                                        <!--</a>-->
                                                    <!--</li>-->
                                                    <!--<li class="paginate_button active">-->
                                                        <!--<a href="#" aria-controls="default-datatable" data-dt-idx="1" tabindex="0">1</a>-->
                                                    <!--</li>-->
                                                    <!--<li class="paginate_button ">-->
                                                        <!--<a href="#" aria-controls="default-datatable" data-dt-idx="2" tabindex="0">2</a>-->
                                                    <!--</li>-->
                                                    <!--<li class="paginate_button next" id="default-datatable_next">-->
                                                        <!--<a href="#" aria-controls="default-datatable" data-dt-idx="3" tabindex="0">-->
                                                            <!--<i class="fa fa-angle-right" aria-hidden="true"></i>-->
                                                        <!--</a>-->
                                                    <!--</li>-->
                                                <!--</ul>-->
                                            <!--</div>-->
                                        <!--</div>-->
                                    </div>
                                    <div class="pages text-center">
                                    <span class="allNum">共&nbsp;
                                        <span class="theme-color">{{allNum}}</span>
                                        &nbsp;构件分组</span>
                                        <ul class="pagination" >
                                            <li v-show="current != 1" @click="current-- && goto(current)" ><a href="#">上一页</a></li>
                                            <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
                                                <a href="#" >{{index}}</a>
                                            </li>
                                            <li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)"><a href="#" >下一页</a></li>
                                        </ul>
                                    </div>
                                </div><!-- .widget-body -->
                            </div>
                        </div>
                    </div>
                </div>
            </section><!-- #dash-content -->
            <el-dialog :visible.sync="dialogVisible" width="40%">
                <div class="modal-header primary backg-color">
                    <div class="modal-title">
                        {{title}}
                    </div>
                </div>
                <el-form  :rules="rules"  label-width="100px" class="demo-ruleForm">
                    <el-form-item label="分组名称" >
                        <el-input v-model.trim="groupName "></el-input>
                    </el-form-item>
                    <el-form-item label="分组描述" >
                        <el-input v-model="groupDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="达标数量" >
                        <el-input-number v-model="upToStandardCount" controls-position="right" @change="handleChange" :min="1" :max="10000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="达标比例" >
                        <el-input-number  v-model="upToStandardScale" controls-position="right" @change="handleChange" :min="1" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="关联状态" >
                        <el-select v-model="relateStatus" placeholder="请选择">
                            <el-option label="选择构件状态" value="0" ></el-option>
                            <el-option  v-for="status in allSysPcStatus" :label=status.statusName :value=status.statusId></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" v-if="flag==1" @click="addNewGroup">保 存</el-button>
            <el-button type="primary" v-else="flag==0" @click="updateGroup">保 存</el-button>
            </span>
            </el-dialog>
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


