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
        data(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.confirmSecret !== '') {
                        this.$refs.ruleForm.validateField('confirmSecret');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.secret) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return{
                actionUserId:'',
                projectRoleList:[],
                canSetProjectRole:true,
                professionInfoList:[],
                companyInfoList:[],
                up_data:{
                   projectId:projectId,
                   jwt:jwt,
                   userId:userId,
                   createId:userId
                },
                projectIdAdmin:[],
                photoUrl:zyfUrl+'/acc/getPicBy/',
                photoUpUrl:zyfUrl+'/acc/upload',
                userSearch:"",
                userList:[],
                //当前页
                current:1,
                //每页数据
                showItem:15,
                //页数
                allpage:"",
                //总个数
                allNum:0,
                updateTitle:'编辑用户',
                updateDialogVisible:false,
                dialogVisible:false,
                settingDialogVisible:false,
                title:'添加用户',
                ruleForm: {
                    name: '',
                    secret:'',
                    confirmSecret:'',
                    actName:'',
                    contact:'',
                    region:'',
                    major:''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    secret:[
                        { required: true,validator:validatePass, trigger:'blur'},
                    ],
                    confirmSecret:[
                        { required: true,validator:validatePass2, trigger:'blur'},
                    ],
                    actName: [
                        { required: false, message: '请输入实际姓名', trigger: 'blur' }
                    ],
                    contact:[
                        { required:true, message: '请输入手机号码', trigger: 'blur'}
                    ],
                    region: [
                        { required: true, message: '请选择所属企业', trigger: 'change' }
                    ],
                    major:[
                        {required: true, message: '请选择专业', trigger: 'change'}
                    ]
                },
                updateRuleForm: {
                    uid:'',
                    name: '',
                    actName:'',
                    contact:'',
                    region:'',
                    major:''
                },
                editCompany:{
                 companyId:'',
                 companyName:''
                },
                editProfession:{
                    professionId:'',
                    professionName:''
                },
                updateRules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    actName: [
                        { required: false, message: '请输入实际姓名', trigger: 'blur' }
                    ],
                    contact:[
                        { required: true, message: '请输入手机号码', trigger: 'blur'}
                    ],
                    region: [
                        { required: true, message: '请选择所属企业', trigger: 'change' }
                    ],
                    major:[
                        {required: true, message: '请选择专业', trigger: 'change'}
                    ]
                },
                imageUrl: '',//会产生多余头像文件
                imageId:'',
                isSearch:false,
                searchData:'',
                projectRoleInfo:[],
                hasProject:[],
                editHasProject:[]
            }
        },
        mounted:function () {
            this.userListInit();
        },
        methods:{
            //新增
            openDialog:function (formRule) {
                if(this.$refs[formRule] != undefined ){
                    this.$refs[formRule].resetFields();
                }
                this.title='添加用户';
                if(this.imageUrl!=''){
                    this.imageUrl='';
                    this.imageId='';
                }
                this.dialogVisible=true;
            },
            handleAvatarSuccess(res, file) {
                console.log(res);
                this.imageUrl = URL.createObjectURL(file.raw);
                this.imageId = res.data.accId;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            companyInfoLoad:function(){
                if(this.companyInfoList.length==0){
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
                        console.log(result);
                        this.companyInfoList=result.data.data;
                    }, function(response) {
                        // 这里是处理错误的回调
                        console.log(response);
                    });
                }
            },
            professionInfoLoad:function () {
                if(this.professionInfoList.length ==  0){
                    this.$http.post(zyfUrl + '/profession/lookTree', {
                        userId:userId,
                        projectId:projectId,
                        jwt:jwt,
                    }, {
                        headers: {
                        },
                        emulateJSON: true
                    }).then(function(result) {
                        // 这里是处理正确的回调
                        console.log(result);
                        this.professionInfoList=result.data.data;
                    }, function(response) {
                        // 这里是处理错误的回调
                        console.log(response);
                    });
                }
            },
            insertUser:function (formName) {
                var that=this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post(zyfUrl + '/user/create', {
                            userId:userId,
                            projectId:projectId,
                            jwt:jwt,
                            loginName:that.ruleForm.name,
                            password:that.ruleForm.secret,
                            realName:that.ruleForm.actName,
                            phone:that.ruleForm.contact,
                            jobTypeId:that.ruleForm.major,
                            headPortrait:that.imageId,
                            companyId:that.ruleForm.region
                        }, {
                            headers: {
                            },
                            emulateJSON: true
                        }).then(function(result) {
                            // 这里是处理正确的回调
                            if(result.data.code == 10000){
                                that.dialogVisible = false;
                                if(that.isSearch){
                                    that.isSearch=false;
                                    that.searchData='';
                                }
                                that.userListInit();
                            }else{
                                this.$alert('<strong>'+result.data.message+'</strong>', '消息', {
                                    dangerouslyUseHTMLString: true
                                });
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
            insertUserAndAgain:function(formName){
                var that=this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post(zyfUrl + '/user/create', {
                            userId:userId,
                            projectId:projectId,
                            jwt:jwt,
                            loginName:that.ruleForm.name,
                            password:that.ruleForm.secret,
                            realName:that.ruleForm.actName,
                            phone:that.ruleForm.contact,
                            jobTypeId:that.ruleForm.major,
                            headPortrait:that.imageId,
                            companyId:that.ruleForm.region
                        }, {
                            headers: {
                            },
                            emulateJSON: true
                        }).then(function(result) {
                            // 这里是处理正确的回调
                            if(result.data.code == 10000){
                                // that.dialogVisible = false;
                                if(this.$refs[formName] != undefined ){
                                    this.$refs[formName].resetFields();
                                }
                                if(this.imageUrl!=''){
                                    this.imageUrl='';
                                    this.imageId='';
                                }
                                if(that.isSearch){
                                    that.isSearch=false;
                                    that.searchData='';
                                }
                                that.userListInit();
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
            cancledialog:function(formRule){
                this.dialogVisible = false;
                this.$refs[formRule].resetFields();
            },
            //列表查看
            hrefParam:function (headId) {
                return this.photoUrl+headId+"?projectId="+projectId+"&userId="+userId+"&jwt="+jwt;
            },
            isAdmin:function (auserId) {
                var that=this;
                for (var i = 0; i < that.projectIdAdmin.length; i++){
                    if (that.projectIdAdmin[i] == auserId)//如果要求数据类型也一致，这里可使用恒等号===
                        return true;
                }
                return false;
            },
            userListInit:function () {
                var that=this;
                this.$http.post(zyfUrl + '/user/look', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    index:this.current,
                    pageSize:that.showItem

                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    if(result.data.code == 10000){
                        console.log(result.data.data);
                        that.userList=result.data.data.result;
                        that.projectIdAdmin=result.data.data.admin;
                        that.allNum=result.data.data.count;
                        that.allpage=Math.ceil(that.allNum/that.showItem);
                    }

                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            //编辑
            editDialog:function (auserId,formRule) {
                this.$http.post(zyfUrl + '/user/detail', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    actionUserId:auserId
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    if(result.data.code == 10000){
                        this.updateRuleForm.uid =result.data.data.id;
                        this.updateRuleForm.name =result.data.data.loginName;
                        this.updateRuleForm.actName =result.data.data.userName;
                        this.updateRuleForm.contact =result.data.data.phone;
                        this.updateRuleForm.region =result.data.data.companyName;
                        this.updateRuleForm.major =result.data.data.professionName;
                        this.editCompany.companyId=result.data.data.companyId;
                        this.editCompany.companyName =result.data.data.companyName;
                        this.editProfession.professionId=result.data.data.professionId;
                        this.editProfession.professionName=result.data.data.professionName;
                        if(result.data.data.headPortrait!=''){
                            this.imageId = result.data.data.headPortrait;
                            this.imageUrl = this.hrefParam(result.data.data.headPortrait);
                        }else{
                            if(this.imageId!=''){
                                this.imageId = '';
                                this.imageUrl='';
                            }
                        }
                        this.updateTitle='编辑用户';
                        if(this.$refs[formRule] != undefined ){
                            this.$refs[formRule].clearValidate();
                        }
                        this.updateDialogVisible=true;
                    }
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            changeRegionId:function(){
                // console.log('促发j');
                console.log(this.updateRuleForm.region);
                // this.updateRuleForm.regionId=this.updateRuleForm.region;
                // companyId                companyName
                this.editCompany.companyId=this.updateRuleForm.region.companyId;
                this.editCompany.companyName =this.updateRuleForm.region.companyName;
            },
            changeMajorId:function(){
                // console.log('促发j');
                console.log(this.updateRuleForm.major);
                // professionId
                // professionName
                // this.updateRuleForm.majorId =this.updateRuleForm.major;
                this.editProfession.professionId=this.updateRuleForm.major.professionId;
                this.editProfession.professionName=this.updateRuleForm.major.professionName;
            },
            updateCancledialog:function(formRule){
                this.updateDialogVisible = false;
                this.$refs[formRule].clearValidate();
            },
            updateUserInfo:function () {
                this.$http.post(zyfUrl + '/user/update', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    actionUserId:this.updateRuleForm.uid,
                    loginName:this.updateRuleForm.name,
                    realName:this.updateRuleForm.actName,
                    phone:this.updateRuleForm.contact,
                    companyId:this.editCompany.companyId,
                    jobTypeId:this.editProfession.professionId,
                    headPortrait:this.imageId
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    if(result.data.code == 10000){
                        for(var i = 0;i<this.userList.length;i++){
                            if(this.userList[i].id == this.updateRuleForm.uid){
                                this.userList[i].companyNameJson=this.editCompany;
                                this.userList[i].headPortrait = this.imageId;
                                this.userList[i].loginName = this.updateRuleForm.name;
                                this.userList[i].phone=this.updateRuleForm.contact;
                                this.userList[i].professionNameJson=this.editProfession;
                                this.userList[i].userName=this.updateRuleForm.actName;
                                this.updateDialogVisible=false;
                                return;
                            }
                        }
                    }
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            //搜索
            searchListInit:function () {
                var that=this;
                that.isSearch = true;
                this.$http.post(zyfUrl + '/user/chose', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    index:this.current,
                    pageSize:that.showItem,
                    search:that.searchData
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    if(result.data.code == 10000){
                        console.log(result.data.data);
                        that.userList=result.data.data.result;
                        that.projectIdAdmin=result.data.data.admin;
                        that.allNum=result.data.data.count;
                        that.allpage=Math.ceil(that.allNum/that.showItem);
                    }else if(result.data.code == 20000){
                        that.userList=result.data.data.result;
                        that.projectIdAdmin=result.data.data.admin;
                        that.allNum=result.data.data.count;
                        that.allpage=Math.ceil(that.allNum/that.showItem);
                    }
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            searchListLoad:function(){
              this.searchData='';
              this.isSearch=false;
              this.current=1;
              this.userListInit();
            },
            //分页
            goto:function(index){
                if(index == this.current) return;
                this.current = index;
                if(this.isSearch){
                   //搜索
                    this.searchListInit();
                }else{
                    this. userListInit();
                }
                // var that=this;
                // that.allNum=that.qualityList.length;
                // that.allpage=Math.ceil(that.qualityList.length/this.showItem);
            },
            upgoto:function (index) {
                //上一页面
                this.current=index-1;
                if(this.isSearch){
                    //搜索
                    this.searchListInit();
                }else{
                    this. userListInit();
                }

            },
            downgoto:function (index) {
                //下一页面
                this.current=index+1;
                if(this.isSearch){
                    //搜索
                    this.searchListInit();
                }else{
                    this. userListInit();
                }
            },
            //添加权限
            settingDialog:function(auserId){
                var that=this;
                if(auserId ==userId){
                    that.canSetProjectRole = false;
                }else{
                    that.canSetProjectRole = true;
                }
                that.actionUserId=auserId;
                this.settingDialogVisible=true;
                this.$http.post(zyfUrl + '/user/projectRoleInfo', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    actionUserId:auserId
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    if(result.data.code == 10000){
                        console.log(result.data.data);
                        that.projectRoleInfo = result.data.data.hasRole;
                        that.hasProject = result.data.data.ownProject;
                        that.editHasProject = that.coppyArray(result.data.data.ownProject);
                    }
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            isEditProjectRole:function (aprojectId) {
                var that=this;
                if(aprojectId==''){
                    return true;
                }else{
                    for(var i=0;i<that.editHasProject.length;i++){
                        if(that.editHasProject[i].projectId == aprojectId){
                            return true;
                        }
                    }
                    return false;
                }
            },
            addProjectRoleInfo:function () {
                var that=this;
               var newProjectRoleInfo={
                   projectInfo:{projectId:'',projectName:''},
                   roleInfo:{roleId:'',roleName:''}
               }
               that.projectRoleInfo.push(newProjectRoleInfo);

            },
            deleteProjectRole:function (index) {
                var that=this;
                that.projectRoleInfo.splice(index,1);
            },
            updateProjectRoleInfo:function () {
                var that=this;
                var roles=[];
                for(var i=0;i<that.projectRoleInfo.length;i++){
                    // console.log(that.projectRoleInfo[i].roleInfo.roleId);
                    if(that.projectRoleInfo[i].projectInfo.projectId == ''){
                        this.$alert('<strong>请选择项目</strong>', '消息', {
                            dangerouslyUseHTMLString: true
                        });
                        return;
                    }
                    if(that.projectRoleInfo[i].roleInfo.roleId ==''){
                        this.$alert('<strong>请选择项目角色</strong>', '消息', {
                            dangerouslyUseHTMLString: true
                        });
                        return;
                    }
                    roles.push(that.projectRoleInfo[i].roleInfo.roleId)
                }
                this.$http.post(zyfUrl + '/user/updateProjectRoleInfo', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    actionUserId:that.actionUserId,
                    roles:JSON.stringify(roles)
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    if(result.data.code == 10000){
                        console.log(result);
                        that.settingDialogVisible=false;
                    }
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            projectListFilter:function () {
                // var that=this;
                for(var j = 0;j<this.projectRoleInfo.length;j++){
                    for(var i = 0;i< this.hasProject.length;i++){
                        if(this.projectRoleInfo[j].projectInfo.projectId == this.hasProject[i].projectId){
                            this.hasProject.splice(i,1);
                            break;
                        }
                    }
                }
            },
            projectIdChange:function (index) {
                var that=this;
                that.projectRoleInfo[index].projectInfo.projectId=that.projectRoleInfo[index].projectInfo.projectName.projectId;

            },
            roleInfoLoad:function(index){
                var that=this;
                this.$http.post(zyfUrl + '/role/roleTree', {
                    userId:userId,
                    projectId:that.projectRoleInfo[index].projectInfo.projectId,
                    jwt:jwt,
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    if(result.data.code == 10000){
                        // console.log(result.data.data);
                        that.projectRoleList=result.data.data
                    }
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });

                // console.log(that.projectRoleInfo[index].projectInfo.projectId);
                // console.log(that.projectRoleInfo[index].projectInfo.projectName.projectId);
            },
            coppyArray:function (arr){
            return arr.map((e)=>{
                if(typeof e==='object'){
                    return Object.assign({},e);
                }else{
                    return e;
                }
            });
            },
            roleIdChange:function (index) {
                var that=this;
                that.projectRoleInfo[index].roleInfo.roleId=that.projectRoleInfo[index].roleInfo.roleName.roleId;
            }
            },
        computed: {
            // 分页的
            pages: function () {
                var pag = [];
                if (this.current < this.showItem) { //如果当前的激活的项 小于要显示的条数
                    //总页数和要显示的条数那个大就显示多少条
                    var i = Math.min(this.showItem, this.allpage);
                    while (i) {
                        pag.unshift(i--);
                    }
                } else { //当前页数大于显示页数了
                    var middle = this.current - Math.floor(this.showItem / 2),//从哪里开始
                        i = this.showItem;
                    if (middle > (this.allpage - this.showItem)) {
                        middle = (this.allpage - this.showItem) + 1
                    }
                    while (i--) {
                        pag.push(middle++);
                    }
                }
                return pag
            },
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
                                            <input class="theaderSel" placeholder="请输入查询用户姓名" v-model="searchData">
                                        </div>
                                        <div class="col-xs-2">
                                            <button type="button" class="btn primary backg-color top-select" @click="searchListInit()">筛选</button>
                                            <button type="button" class="btn btn-default" @click="searchListLoad()">重置</button>
                                        </div>
                                        <div class="position-btn">
                                            <button type="button" class="btn primary backg-color" @click="openDialog('ruleForm')">添加用户</button>
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
                                                <th class="center">头像</th>
                                                <th>用户名</th>
                                                <th>实际姓名</th>
                                                <th>联系方式</th>
                                                <th>所属企业</th>
                                                <th>专业</th>
                                                <!--<th>角色</th>-->
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="user in userList">
                                                <td>
                                                    <div class=" avatar avatar-sm avatar-circle" v-if="user.headPortrait == ''">
                                                        <!--<a href="#">-->
                                                        <img src="../../../image/default-img.png" alt="sender photo">
                                                        <!--</a>-->
                                                    </div>
                                                    <div class=" avatar avatar-sm avatar-circle" v-else>
                                                        <!--<a href="#">-->
                                                        <img :src="hrefParam(user.headPortrait)" alt="sender photo">
                                                        <!--</a>-->
                                                    </div>
                                                </td>
                                                <td>{{user.loginName}}</td>
                                                <td><span>{{user.userName}}<sup class="manger-limit" v-if="isAdmin(user.id)">管理员</sup></span></td>
                                                <td>{{user.phone}}</td>
                                                <td class="td-content td-title">{{user.companyNameJson.companyName}}</td>
                                                <td>{{user.professionNameJson.professionName}}</td>
                                                <!--<td></td>-->
                                                <td class="td-handles">
                                                    <span class="c-pointer"  @click="settingDialog(user.id)">权限设置</span>
                                                    <!--<div v-else class="c-pointer" disabled style="display: inline-block;margin-right: 10px;">权限设置</div>-->
                                                    <i class="fa fa-edit fa-2 td-edit" aria-hidden="true" @click="editDialog(user.id,'updateRuleForm')"></i>
                                                    <!--<i class="fa fa-search fa-2 td-search" aria-hidden="true"></i>-->
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
        </div><!-- .wrap -->
        <!--新增用户-->
        <el-dialog :visible.sync="dialogVisible" width="40%">
            <div class="modal-header primary backg-color">
         <div class="modal-title">{{title}}</div>         
      </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="ruleForm.name" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="secret">
                    <el-input type="password" v-model="ruleForm.secret"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmSecret">
                    <el-input type="password" v-model="ruleForm.confirmSecret"></el-input>
                </el-form-item>
                <el-form-item label="实际姓名" prop="actName">
                    <el-input v-model="ruleForm.actName"></el-input>
                </el-form-item>
                <el-form-item label="上传头像" prop="">
                    <el-col :span="8">
                        <el-upload
                                class="avatar-uploader"
                                :data="up_data"
                                :action="photoUpUrl"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-col>
                </el-form-item>
                <el-form-item label="手机号" prop="contact">
                    <el-input v-model="ruleForm.contact"></el-input>
                </el-form-item>
                <el-form-item label="所属企业" prop="region">
                    <el-select v-model="ruleForm.region" placeholder="请选择所属企业" @focus="companyInfoLoad()">
                        <el-option v-for="company in companyInfoList" :key="company.companyId" :label="company.companyName" :value="company.companyId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业" prop="major">
                    <el-select v-model="ruleForm.major" placeholder="请选择专业" @focus="professionInfoLoad()">
                        <el-option v-for="profession in professionInfoList" :key="profession.professionId" :label="profession.professionName" :value="profession.professionId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="cancledialog('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="insertUserAndAgain('ruleForm')">保存并继续添加</el-button>
            <el-button type="primary"  @click="insertUser('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑用户-->
        <el-dialog :visible.sync="updateDialogVisible" width="40%">
            <div class="modal-header primary backg-color">
           <div class="modal-title">{{updateTitle}}</div>       
      </div>
            <el-form :model="updateRuleForm" :rules="updateRules" ref="updateRuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="updateRuleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="实际姓名" prop="actName">
                    <el-input v-model="updateRuleForm.actName"></el-input>
                </el-form-item>
                <el-form-item label="上传头像" prop="">
                    <el-col :span="8">
                        <el-upload
                                class="avatar-uploader"
                                :data="up_data"
                                :action="photoUpUrl"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-col>
                </el-form-item>
                <el-form-item label="手机号" prop="contact">
                    <el-input v-model="updateRuleForm.contact"></el-input>
                </el-form-item>
                <el-form-item label="所属企业" prop="region">
                    <el-select v-model="updateRuleForm.region" value-key="companyName" placeholder="请选择所属企业" @focus="companyInfoLoad()" @change="changeRegionId()">
                        <el-option v-for="company in companyInfoList" :key="company.companyName" :label="company.companyName" :value="company"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业" prop="major">
                    <el-select v-model="updateRuleForm.major" value-key="professionName" placeholder="请选择专业" @focus="professionInfoLoad()" @change="changeMajorId()">
                        <el-option v-for="profession in professionInfoList" :key="profession.professionName" :label="profession.professionName" :value="profession"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateCancledialog('updateRuleForm')">取 消</el-button>
                <el-button type="primary"  @click="updateUserInfo()">确 定</el-button>
            </span>
        </el-dialog>
        <!--添加权限-->
        <el-dialog :visible.sync="settingDialogVisible" width="40%">
      <div class="modal-header primary backg-color">
                       <div class="modal-title">项目权限</div>          
                    </div>
                    <div class="setting-center">
                       <div class="row">
                         <div class="col-xs-12">
                            <div class="ones">
                              <div class="row" v-for="(projectRole,index) in projectRoleInfo">
                                 <div class="col-xs-1">
                                   <span>项目:</span>
                                 </div>
                                 <div class="col-xs-4">
                                                        <el-select v-model="projectRole.projectInfo.projectName" placeholder="请选择项目" value-key="projectName" :disabled="!isEditProjectRole(projectRole.projectInfo.projectId) || !canSetProjectRole" @change="projectIdChange(index)" @focus="projectListFilter()">
                                                            <el-option v-for="project in hasProject" :key="project.projectName" :label="project.projectName" :value="project"></el-option>
                                                        </el-select>
                                 </div>
                                 <div class="col-xs-1">
                                   <span>角色:</span>
                                 </div>
                                 <div class="col-xs-4">
                                                        <el-select v-model="projectRole.roleInfo.roleName" placeholder="请选择角色"  value-key="roleName" :disabled="!isEditProjectRole(projectRole.projectInfo.projectId) || !canSetProjectRole" @focus="roleInfoLoad(index)" @change="roleIdChange(index)">
                                                            <el-option v-for="role in projectRoleList" :key="role.roleName" :label="role.roleName" :value="role"></el-option>
                                                        </el-select>
                                 </div>
                                                      <div class="col-xs-2">
                                                          <i v-if="isEditProjectRole(projectRole.projectInfo.projectId) == true && canSetProjectRole" class="el-icon-close" @click="deleteProjectRole(index)"></i>
                                                      </div>
                              </div>
                                 <div class="add-one" v-if="canSetProjectRole == true && editHasProject.length > 0 " @click="addProjectRoleInfo()">
                                   <i class="fa fa-plus"></i>
                                     +添加项目角色
                                 </div>
                              </div>
                         </div>
                       </div>
                    </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="settingDialogVisible=false">取 消</el-button>
                    <el-button type="primary" @click="updateProjectRoleInfo()">确 定</el-button>
                </span>  
        </el-dialog>
             
    </main>
    <!--</div>-->
</template>

<style scoped>
    .app-main{
        margin-top: 60px;
        margin-bottom: 15px;
    }
    .avatar-circle img{
        border: 1px solid #e6e6e6;
    }
</style>


