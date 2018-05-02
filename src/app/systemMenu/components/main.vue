<script>
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
        name:'',
        data(){
            var validateParent= (rule, value, callback) => {
                 if(this.ruleForm.url != '' && this.ruleForm.belong ==''){
                    callback(new Error('请选择父级'));
                } else {
                    callback();
                }
            };
            var validateUrl= (rule, value, callback) => {
                if (this.ruleForm.belong != '' && this.ruleForm.url ==='') {
                    callback(new Error('请输入url'));
                }  else {
                    callback();
                }
            };
            return{
                dialogVisible:false,
                title:'',
                flag:1,
                ruleForm:{
                    name:'',
                    parentId:'',
                    belong:'',
                    numbers:1,
                    limit:'',
                    url:'',
                    showStatus:true,
                },
                rules:{
                    name: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' }
                    ],
                    belong: [
                        { validator:validateParent, trigger: 'change' }
                    ],
                    numbers: [
                        { required: false, message: '请输入菜单序号', trigger: 'blur' }
                    ],
                    limit: [
                        { required: false, message: '请输入权限', trigger: 'blur' }
                    ],
                    url: [
                        { validator:validateUrl, trigger: 'blur' }
                    ]
                },
                menuList:[],
                treeList:[],
                defaultProps: {
                    children: 'children',
                    label: 'menuName'
                },
                treeShow:false,
                selectIcon:false,
                editPermissionId:"",
            }

        },
        mounted:function () {
            this.menuLook()
        },
        methods:{
            cancledialog:function(formRule){
                this.dialogVisible = false;
                this.$refs[formRule].resetFields();
            },
            openDialog:function () {
                this.dialogVisible=true;
                this.title='添加菜单';
                this.flag=1;
                this.treeShow=false;
                this.selectIcon=false;
                this.ruleForm.name='';
                this.ruleForm.parentId='';
                this.ruleForm.belong='';
                this.ruleForm.numbers=1;
                this.ruleForm.limit='';
                this.ruleForm.url='';
                this.ruleForm.showStatus=true;
            },
            parentEditDialog:function (index) {
                var that=this;
                that.editPermissionId=that.menuList[index].menuId;
                this.$http.post(zyfUrl + '/permission/detail', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    permissionId:that.editPermissionId
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    console.log(result.data.data);
                    that.dialogVisible=true;
                    that.title='编辑菜单';
                    that.flag=0;
                    that.treeShow=false;//选择父级的树形菜单
                    that.selectIcon=false;//选择框图标
                    that.ruleForm.name=result.data.data.menuName;
                    that.ruleForm.numbers=result.data.data.menuSord;
                    that.ruleForm.parentId=result.data.data.parentId;
                    that.ruleForm.belong=result.data.data.parentName;
                    that.ruleForm.limit=result.data.data.menuCode;
                    that.ruleForm.url=result.data.data.menuURL;
                    if(result.data.data.showStatus == '0'){
                        that.ruleForm.showStatus=false;
                    }else{
                        that.ruleForm.showStatus=true;
                    }
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            childEditDialog:function (parent,index) {
                var that=this;
                for(var i = 0;i<that.menuList.length;i++){
                    if(parent == that.menuList[i].menuId){
                        that.editPermissionId=that.menuList[i].children[index].menuId;
                        break;
                    }
                }
                this.$http.post(zyfUrl + '/permission/detail', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    permissionId:that.editPermissionId
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    console.log(result.data.data);
                    that.dialogVisible=true;
                    that.title='编辑菜单';
                    that.flag=0;
                    that.treeShow=false;//选择父级的树形菜单
                    that.selectIcon=false;//选择框图标
                    that.ruleForm.name=result.data.data.menuName;
                    that.ruleForm.numbers=result.data.data.menuSord;
                    that.ruleForm.parentId=result.data.data.parentId;
                    that.ruleForm.belong=result.data.data.parentName;
                    that.ruleForm.limit=result.data.data.menuCode;
                    that.ruleForm.url=result.data.data.menuURL;
                    if(result.data.data.showStatus == '0'){
                        that.ruleForm.showStatus=false;
                    }else{
                        that.ruleForm.showStatus=true;
                    }
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });

            },
            menuUpdate:function (formRule) {
                //菜单更新
                var that=this;
                this.$refs[formRule].validate((valid) => {
                    if (valid) {
                        this.$http.post(zyfUrl + '/permission/update', {
                            userId:userId,
                            projectId:projectId,
                            jwt:jwt,
                            permissionId:that.editPermissionId,
                            menuName:that.ruleForm.name,
                            menuSord:that.ruleForm.numbers,
                            parentId:that.ruleForm.parentId,
                            menuCode:that.ruleForm.limit,
                            menuUrl:that.ruleForm.url,
                            menuShow:that.ruleForm.showStatus ? "1":"0",
                        }, {
                            headers: {
                            },
                            emulateJSON: true
                        }).then(function(result) {
                            // 这里是处理正确的回调
                            console.log(result.data.data);
                            this.dialogVisible=false;
                            if(result.data.code == 10000){
                                that.menuLook();
                            }else{
                                this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                                    dangerouslyUseHTMLString: true
                                });
                                return;
                            }


                        }, function(response) {
                            // 这里是处理错误的回调
                            console.log(response);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            menuCreate:function (formRule) {
                //控制弹框显示
                //查看菜单列表
                var that=this;
                console.log(that.ruleForm.name);
                console.log(that.ruleForm.numbers);
                console.log(that.ruleForm.belong);
                console.log(that.ruleForm.limit);
                console.log(that.ruleForm.url);
                console.log(that.ruleForm.showStatus ? "1":"0");
                this.$refs[formRule].validate((valid) => {
                    if (valid) {
                        this.$http.post(zyfUrl + '/permission/create', {
                            userId:userId,
                            projectId:projectId,
                            jwt:jwt,
                            menuName:that.ruleForm.name,
                            menuSord:that.ruleForm.numbers,
                            parentId:that.ruleForm.parentId,
                            menuCode:that.ruleForm.limit,
                            menuUrl:that.ruleForm.url,
                            menuShow:that.ruleForm.showStatus ? "1":"0",
                        }, {
                            headers: {
                            },
                            emulateJSON: true
                        }).then(function(result) {
                            // 这里是处理正确的回调
                            console.log(result.data.data);
                            this.dialogVisible=false;
                            that.menuLook();

                        }, function(response) {
                            // 这里是处理错误的回调
                            console.log(response);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            parentBlur:function () {
                // alert("失去焦点");
                // this.treeShow=false;
                this.selectIcon=false;
            },
            parentChange:function () {
                // alert("值改变了");
            },
            parentFocus:function(){
                 // alert("获取焦点");

                var that=this;
                if(that.treeList.length == 0){
                    that.menuParent();
                }
                that.treeShow=true;
                that.selectIcon=true;
            },
            nodeClick:function (data) {
                var that = this;
                console.log(data);
                that.ruleForm.parentId=data.menuId;
                that.ruleForm.belong = data.menuName;
                that.treeShow=false;
                that.selectIcon=false;
                that.treeList=[];
            },
            menuParent:function () {
                var that=this;
                this.$http.post(zyfUrl + '/permission/selectTree', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    console.log(result.data.data);
                    that.treeList=result.data.data;

                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            menuLook:function () {
                var that=this;
                this.$http.post(zyfUrl + '/permission/look', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    console.log(result.data.data);
                    that.menuList=result.data.data;

                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            childStatusChange:function (parent,i) {
                var that=this;
                var actionMenu=""
                for(var idx= 0;idx<that.menuList.length;idx++){
                    if(that.menuList[idx].menuId==parent){
                        actionMenu=that.menuList[idx].children[i].menuId;
                        break;
                    }
                }
                this.$http.post(zyfUrl + '/permission/status', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    permissionId:actionMenu
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    console.log(result.data.data);
                    if(result.data.code == 10000){
                        for(var idx= 0;idx<that.menuList.length;idx++){
                            if(that.menuList[idx].menuId==parent){
                                if(that.menuList[idx].children[i].showStatus=='0'){
                                    that.menuList[idx].children[i].showStatus='1';
                                }else{
                                    that.menuList[idx].children[i].showStatus='0';
                                }
                            }
                        }
                    }
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            parentStatusChange :function (i) {
                var that=this;
                this.$http.post(zyfUrl + '/permission/status', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    permissionId:that.menuList[i].menuId
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    console.log(result.data.data);
                    if(result.data.code == 10000){
                        if(that.menuList[i].showStatus=='0'){
                            that.menuList[i].showStatus='1';
                        }else{
                            that.menuList[i].showStatus='0';
                        }
                    }
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });


            },
            parentDeleteMenu:function (index) {
                this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var that=this;
                    that.editPermissionId=that.menuList[index].menuId;
                    this.$http.post(zyfUrl + '/permission/delete', {
                        userId:userId,
                        projectId:projectId,
                        jwt:jwt,
                        permissionId:that.editPermissionId
                    }, {
                        headers: {
                        },
                        emulateJSON: true
                    }).then(function(result) {
                        // 这里是处理正确的回调
                        if(result.data.code==10000){
                            that.menuList.splice(index,1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    }, function(response) {
                        // 这里是处理错误的回调
                        console.log(response);
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            childDeleteMenu:function(parent,index){
                this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var that=this;
                    for(var i = 0;i<that.menuList.length;i++){
                        if(parent == that.menuList[i].menuId){
                            that.editPermissionId=(that.menuList[i].children)[index].menuId;
                            break;
                        }
                    }
                    this.$http.post(zyfUrl + '/permission/delete', {
                        userId:userId,
                        projectId:projectId,
                        jwt:jwt,
                        permissionId:that.editPermissionId
                    }, {
                        headers: {
                        },
                        emulateJSON: true
                    }).then(function(result) {
                        // 这里是处理正确的回调
                        if(result.data.code==10000){
                            that.menuList[i].children.splice(index,1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    }, function(response) {
                        // 这里是处理错误的回调
                        console.log(response);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
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
                                <header class="widget-header">
                                    <div class="row">
                                        <div class="position-btn pull-right">
                                            <button type="button" class="btn primary backg-color" @click="openDialog()">添加菜单</button>
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

                                        <!--<table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">-->
                                        <table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">
                                            <thead>
                                            <tr>
                                                <th></th>
                                                <th>菜单名称</th>
                                                <th>位置</th>
                                                <th>类型</th>
                                                <th>URL</th>
                                                <th>添加时间</th>
                                                <th>启用</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>

                                            <tbody v-for="(menu,pindex) in menuList">
                                            <tr>
                                                <td></td>
                                                <td>
                                                    {{menu.menuName}}
                                                </td>
                                                <td>{{menu.menuSord}}</td>
                                                <td>主菜单</td>
                                                <td>{{menu.menuURL}}</td>
                                                <td>{{menu.time}}</td>
                                                <td>
                                                    <!--inactive-color="#ff4949"-->
                                                    <el-switch
                                                            v-model="menu.showStatus == '0' ? false:true"
                                                            active-color="#13ce66"
                                                            @change="parentStatusChange(pindex)">
                                                    </el-switch>
                                                </td>
                                                <td class="td-handles">
                                                    <i class="fa fa-edit fa-2 td-edit" @click="parentEditDialog(pindex)"></i>
                                                    <i class="fa fa-trash fa-2" aria-hidden="true" @click="parentDeleteMenu(pindex)"></i>
                                                </td>
                                            </tr>
                                            <tr v-for="(childrenMenu,cindex) in menu.children">
                                                <td></td>
                                                <td>
                                                    <div class="square-left">
                                                        <span class="square"></span>{{childrenMenu.menuName}}
                                                    </div>
                                                </td>
                                                <td>{{childrenMenu.menuSord}}</td>
                                                <td>子菜单</td>
                                                <td>{{childrenMenu.menuURL}}</td>
                                                <td>{{childrenMenu.time}}</td>
                                                <td>
                                                    <el-switch
                                                            v-model="childrenMenu.showStatus == '0' ? false:true "
                                                            active-color="#13ce66"
                                                            @change="childStatusChange(menu.menuId,cindex)">
                                                    </el-switch>
                                                </td>
                                                <td class="td-handles">
                                                    <i class="fa fa-edit fa-2 td-edit" @click="childEditDialog(menu.menuId,cindex)"></i>
                                                    <i class="fa fa-trash fa-2" aria-hidden="true" @click="childDeleteMenu(menu.menuId,cindex)"></i>
                                                </td>
                                            </tr>
                                            </tbody>

                                        </table>
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
                    <el-form-item label="菜单名称" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级" prop="belong">
                        <el-input placeholder="请选择父级" v-model="ruleForm.belong" @blur="parentBlur()" @change="parentChange()" @focus="parentFocus()">
                            <i v-if="selectIcon" slot="suffix" class="eel-select__caret el-input__icon el-icon-arrow-up"></i>
                            <i v-else slot="suffix" class="eel-select__caret el-input__icon el-icon-arrow-down"></i>
                        </el-input>


                        <!--<el-select v-model="ruleForm.belong"  placeholder="请选择所属父级" @focus="menuParent()" no-data-text="">-->
                            <!--<input type="search">-->
                            <!--<el-option :label="区域一" :value="shanghai"></el-option>-->
                            <!--<el-option :label="区域二" :value="beijing"></el-option>-->
                            <!--<el-option-->
                                    <!--v-for="item in options"-->
                                    <!--:key="item.value"-->
                                    <!--:label="item.label"-->
                                    <!--:value="item.value">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                        <el-tree :data="treeList" :props="defaultProps" v-show="treeShow"  @node-click="nodeClick"></el-tree>
                    </el-form-item>
                    <el-form-item label="菜单序号" prop="numbers">
                        <el-input v-model="ruleForm.numbers"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="limit">
                        <el-input v-model="ruleForm.limit"></el-input>
                    </el-form-item>
                    <el-form-item label="URL" prop="url">
                        <el-input v-model="ruleForm.url"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="showStatus">
                        <el-switch
                                v-model="ruleForm.showStatus"
                                active-color="#13ce66">
                        </el-switch>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
            <el-button @click="cancledialog('ruleForm')" >取 消</el-button>
            <el-button type="primary" v-if="flag==1" @click="menuCreate('ruleForm')">保 存</el-button>
            <el-button type="primary" v-else="flag==0" @click="menuUpdate('ruleForm')">保 存</el-button>
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
