<script>
    import { ajax } from '../../../common/list-common.js'
export default {
    name:'',
    data(){
        return{
            urls:[
                "/role/look",//list
                "/role/create",//insert role
                "/role/modifyPermission",//role limit set
                "/role/changeUseStatus",//role Change Status
                "/role/update",//role edit
                "/role/search" //role search

            ],
            url_idx:{
                init:0,
                insert:1,
                setlimit:2,
                changeUserStatus:3,
                roleUpdate:4,
                roleSearch:5
            },
            params:[
                {userId:window.userId,projectId:window.projectId,jwt:jwt,start:1,pageSize:5},
                {userId:window.userId,projectId:window.projectId,roleName:"",roleDescription:"",userStatus:"",jwt:jwt},
                {userId:window.userId,projectId:window.projectId,roleId:"",permissionIds:"",jwt:jwt},
                {userId:window.userId,projectId:window.projectId,roleId:"",jwt:jwt},
                {userId:window.userId,projectId:window.projectId,jwt:jwt,roleName:'',roleDescription:'',useStatus:'',roleId:''},
                {userId:window.userId,projectId:window.projectId,jwt:jwt,start:1,pageSize:5,searchRoleName:''}
            ],
            list:[],
            dialogVisible:false,
            updateRoleDlgVisible:false,
            flag:1,
            //当前页
            current:1,
            //每页数据
            showItem:5,
            //页数
            allpage:"",
            //总个数
            allNum:0,
            title:'添加角色',
            updateRoleTitle:'update role',
            ruleForm:{
                name:'',
                desc:'',
                on:true //switch
            },
            rules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
//                     { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '请输入角色描述', trigger: 'change' }
                ]
            },
            updateForm:{
                roleName:'',
                roleDescription:'',
                useStatus:true,
            },
            updateFormRules:{
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
//                     { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                roleDescription: [
                    { required: true, message: '请输入角色描述', trigger: 'change' }
                ]},
            searchData:"",//搜索内容
        }

    },
    mounted:function () {
        var idx = this.url_idx.init;//api index
        ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
    },
    methods:{
        cancledialog:function(formRule){
            this.dialogVisible = false;
            this.$refs[formRule].resetFields();
        },
        search:function () {
            this.current=1;
            var idx=this.url_idx.roleSearch;
            console.log(idx);
            this.params[idx].searchRoleName=this.searchData;
            ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.search_cb);
        },
        search_cb:function (result) {
            this.list = result.data.data.list;
            this.allNum=result.data.data.count;
            this.allpage=Math.ceil(this.allNum/this.showItem);
        },
        pageInit_cb:function (result) {
            this.list = result.data.data.list;
        },
        init_cb:function (result) {
            //alert(result.data.message);
            this.list = result.data.data.list;
            this.allNum=result.data.data.count;
            this.allpage=Math.ceil(this.allNum/this.showItem);
        },
        insert_cb:function (result) {
            // alert(result.data.message);
            this.dialogVisible = false;


            //refresh page
            var idx = this.url_idx.init;//api index
            //alert("before ajax in created of projectManage");
            this.params[idx].start=this.current;
            ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
        },
        update_cb:function (result) {
            // alert(result.data.message);
            this.updateRoleDlgVisible = false;

            //refresh page
            var idx = this.url_idx.init;//api index
            //alert("before ajax in created of projectManage");
            ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
        },
        update:function (role) {
            this.updateForm.roleId = role.roleId;
            this.updateForm.roleName = role.roleName;
            this.updateForm.roleDescription = role.roleDescription;
            this.updateForm.useStatus = role.useStatus == '1' ? true :false;

            this.updateRoleDlgVisible = true;
        },
        updateSubmit:function () {
            var idx = this.url_idx.roleUpdate;
            this.params[idx].roleId=this.updateForm.roleId;
            this.params[idx].roleName=this.updateForm.roleName;
            this.params[idx].roleDescription=this.updateForm.roleDescription;
            this.params[idx].useStatus=this.updateForm.useStatus ? "1":"0";
            ajax(this,zyfUrl+this.urls[idx],this.params[idx],0,this.update_cb);
        },
        insert:function () {
            this.ruleForm.name="";
            this.ruleForm.desc="";
            this.ruleForm.on=true;
            this.dialogVisible=true;
            this.title='添加角色';
            this.flag=1;

        },
        insertSubmit:function () {
            var idx = this.url_idx.insert;//api index
            //prepare params
            var param = this.params[idx];
            param.roleName = this.ruleForm.name;
            param.roleDescription = this.ruleForm.desc;
            param.userStatus = this.ruleForm.on ? 1 : 0;
            ajax(this,zyfUrl + this.urls[idx],param,0,this.insert_cb);
        },
        switchUserStatus_cb:function (result) {
            // alert(result.data.message);
        },
        switchUserStatus:function (roleId) {
            var idx = this.url_idx.changeUserStatus;
            var param = this.params[idx];
            param.roleId = roleId;
            ajax(this,zyfUrl + this.urls[idx],param,0,this.switchUserStatus_cb);
        },
        //分页
        goto:function(index){
            if(index == this.current) return;
            this.current = index;
            if(this.searchData == ""){
                var idx=this.url_idx.init;
                this.params[idx].start=this.current;
                ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.pageInit_cb);
            }else{
                var idx=this.url_idx.roleSearch;
                this.params[idx].start=this.current;
                ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.pageInit_cb);
            }
            // var that=this;
            // that.allNum=that.qualityList.length;
            // that.allpage=Math.ceil(that.qualityList.length/this.showItem);
        },
        upgoto:function (index) {
            //上一页面
            this.current=index-1;
            if(this.searchData == ""){
                var idx=this.url_idx.init;
                this.params[idx].start=this.current;
                ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.pageInit_cb);
            }else{
                var idx=this.url_idx.roleSearch;
                this.params[idx].start=this.current;
                ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.pageInit_cb);
            }

        },
        downgoto:function (index) {
            //下一页面
            this.current=index+1;
            if(this.searchData == ""){

                var idx=this.url_idx.init;
                this.params[idx].start=this.current;
                ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.pageInit_cb);
            }else{
                var idx=this.url_idx.roleSearch;
                this.params[idx].start=this.current;
                ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.pageInit_cb);
            }
        },

    //    角色管理
        roleManage:function (index){
            var param=index+"&jwt="+jwt+"&projectId="+projectId+"&userId="+userId;
            window.location.href=zyfUrl+'/systemRoleLimitSet?rId='+param;
            // window.location.href='http://192.168.3.31:10091/zyfbim/systemRoleLimitSet?'
        }
    },
    computed: {
        // 分页的
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
        // filteredItems: function () {
        //     return this.qualityList.slice(this.current, this.current+4);
        // }


    }

}
</script>

<template>
<!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap">
            <section class="app-content">
                <div class="system-manage">
                    <div class="list-header">
                        <div class="row">
                            <div class="col-md-12 widget">
                                <header class="widget-header">
                                    <div class="row">
                                        <div class="col-xs-2">
                                            <input class="theaderSel" placeholder="请输入查询角色" v-model="searchData">
                                        </div>
                                        <div class="col-xs-2">
                                          <button type="button" class="btn primary backg-color" @click="search()">筛选</button>
                                        </div>
                                        <div class="position-btn">
                                            <button type="button" class="btn primary backg-color" @click="insert()">添加角色</button>
                                        </div>
                                    </div>
                                </header>
                            </div>
                        </div>
                    </div>
                    <div class="list-content">
                        <div class="row">
                            <div class="col-md-12 widget">
                                <div class="widget-body" style="padding: 0;">
                                    <div class="table-responsive">
                                        <table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">
                                            <thead>
                                            <tr>
                                                <th></th>
                                                <th>角色</th>
                                                <th>角色描述</th>
                                                <th>角色成员数量</th>
                                                <th>创建时间</th>
                                                <th>启用</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(i,index) in list">
                                                <td></td>
                                                <td>{{i.roleName}}</td>
                                                <td class="td-content td-title">{{i.roleDescription}}</td>
                                                <td>{{i.userCount}}</td>
                                                <td>{{i.createTime}}</td>
                                                <td>
                                                    <div class="m-r-xl inline-block">
                                                        <el-switch
                                                                v-model="i.useStatus"
                                                                active-value="1"
                                                                inactive-value="0"
                                                                active-color="#13ce66"
                                                                inactive-color="#ff4949" @change='switchUserStatus(i.roleId)' v-if="i.editStatus==='0'" disabled>
                                                        </el-switch>
                                                        <el-switch
                                                                v-model="i.useStatus"
                                                                active-value="1"
                                                                inactive-value="0"
                                                                active-color="#13ce66"
                                                                inactive-color="#ff4949" @change='switchUserStatus(i.roleId)' v-else>
                                                        </el-switch>
                                                    </div>
                                                </td>

                                                <td v-if="i.editStatus==='0'">
                                                    <!--<i class="fa fa-edit fa-2 td-edit" @click="update(i)" ></i>-->
                                                    <!--<i class="fa fa-search fa-2 td-search" aria-hidden="true"></i>-->
                                                    <!--<a @click="roleManage()"><i class="fa fa-user fa-2" aria-hidden="true"></i></a>-->
                                                </td>
                                                <td v-else>
                                                    <i class="fa fa-edit fa-2 td-edit" @click="update(i)" ></i>
                                                    <!--<i class="fa fa-search fa-2 td-search" aria-hidden="true"></i>-->
                                                    <a @click="roleManage(i.roleId)"><i class="fa fa-user fa-2" aria-hidden="true"></i></a>
                                                </td>

                                            </tr>
                                            </tbody>
                                        </table>
                                        <!--分页-->
                                        <div class="pages text-center">
                                            <span class="allNum">共&nbsp;<span class="theme-color">{{allNum}}</span>条角色信息</span>
                                            <ul class="pagination" >
                                                <li v-show="current != 1" ><a href="#" @click="upgoto(current)">上一页</a></li>
                                                <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
                                                    <a href="#" >{{index}}</a>
                                                </li>
                                                <li v-show="allpage != current && allpage != 0 " @click="downgoto(current)"><a href="#" >下一页</a></li>
                                            </ul>
                                        </div>
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
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="desc">
                        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="secret">
                        <el-switch
                                v-model="ruleForm.on"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
            <el-button  @click="cancledialog('ruleForm')">取 消</el-button>
            <el-button type="primary" v-if="flag==1" @click="insertSubmit()">完成添加</el-button>
            <!--<el-button type="primary" v-else="flag==0" @click="dialogVisible = false">完成添加2</el-button>-->
            </span>
            </el-dialog>

            <el-dialog v-bind:title="updateRoleTitle" :visible.sync="updateRoleDlgVisible" width="40%">
                <el-form :model="updateForm" :rules="updateFormRules" ref="updateForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="updateForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDescription">
                        <el-input type="textarea" v-model="updateForm.roleDescription"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="useStatus">
                        <el-switch
                                v-model="updateForm.useStatus"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
            <el-button @click="updateRoleDlgVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateSubmit()">保存修改</el-button>
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


