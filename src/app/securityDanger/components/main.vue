<script>
    //import common from '../../../components/common.vue';
    import { ajax } from '../../../common/list-common.js'
// 请求列表
    var zNodes=[];
export default {
   // extends: common,
    name:"security-danger",
    data(){
        return{
            //apis
            urls:[
                "/hazardsManagement/selectHazardsManagementByProId",//list
                "/hazardsManagement/addHazards",//insert
                "/hazardsManagement/getHazardsNo",//max danger code
                "/hazardsManagement/selectHazardsManagementByConditions",
                "/user/tree",
                "/hazardsManagement/updateHazards"
            ],
            //api index
            url_idx:{
                init:0,
                insert:1,
                maxcode:2,
                filter:3,
                userlist:4,
                update:5
            },
            //api parameters
            params:[
                {userId:window.userId,projectId:window.projectId,jwt:window.jwt},
                {userId:window.userId,
                    projectId:window.projectId,
                    hazardsName:"",
                    hazardsNo:'',
                    hazardsLevel:"",
                    lastDays:0,
                    hazardsStatus:"",
                    happenDate:'',
                    fileIds:[],
                    modelId:[],
                    HazardsprojectIds:[],
                    jwt:window.jwt
                },
                {userId:window.userId,projectId:window.projectId,jwt:window.jwt},
                {userId:window.userId,projectId:window.projectId,
                    hazardsLevel:0,hazardsStatus:0,createMan:'',startDate:''
                    ,endDate:'',jwt:window.jwt},
                {userId:window.userId, projectId:window.projectId, jwt:jwt},
            ],
            m_urlIdx:0,//current api index
            list:[],
            //默认选中的
            defaultChecks:[],
            //绑定
            unbind:false,
            eleTexts:"+添加关联元素",
            //tree
            relatedEle:1,
            trees: {
                data:[],
                label: 'name',
                //children: 'zones'
            },
            isActive1: true,
            isActive2:false,
            //当前页
            current:1,
            //每页数据
            showItem:10,
            //页数
            allpage:"",
            //总个数
            allNum:0,
            //添加弹框
            insertDlgVisible: false,
            updateDlgVisible:false,
            title:"添加危险源",
            //编号
            qNoVisible:false,
            //提交按钮
            sbmBtn:"",
            //select
            select:{
                hazardsLevel:"",
                hazardsStatus:"",
                createMan:"",
                startDate:"",
                endDate:"",
                time:"",
            },//上传文件时的参数
            upLoadData: {
                userId:window.userId,
                projectId:window.projectId,
                jwt:window.jwt
            },
            fileList:[],
            m_userlist:[],
            //添加form
            insertForm:{userId:window.userId,
                projectId:window.projectId,
                hazardsManagementId:'',
                hazardsName:"",
                hazardsNo:'',
                hazardsLevel:"",
                lastDays:0,
                hazardsStatus:"",
                happenDate:'',
                fileIds:[],
                solvePlanUrls:[],
                action:zyfUrl+'/acc/upload',
                modelId:[],
                HazardsprojectIds:[],
                processTasklist:[],
                jwt:window.jwt,
                fileName:"",
                fileNum: 0 ,
                hasFiles:false,
                accessorylist:[]},
            rules: {
                hazardsName: [
                    { required: true, message: '请输入危险源名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                hazardsStatus: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
                hazardsLevel: [
                    { required: true, message: '请选择等级', trigger: 'change' }
                ],
                happenDate: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
            },
            //关联元素
            relatedVisible:false,
            checkedTrees:[],//associated task
        }
    },
    mounted: function() {
        var idx=this.url_idx.init;
        ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
    },
    created:function () {
        // //tree请求
        // this.ajax(this,zyfUrl+'/model/getTreeHeader',{
        //     modelId:"1",
        //     projectId:"1",
        //     userId:userId,
        //     //projectId:projectId,
        //     jwt:jwt
        // },0,this.getTreeHeader_cb);

        //tree请求
        $.ajax({
            type: 'POST',
            data: {
                modelId:"1",
                // projectId:"1",
                userId:userId,
                projectId:projectId,
                jwt:jwt
            },
            url: zyfUrl+'/model/getTreeHeader',
            //url:zyfUrl+'/model/getTree',
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log(data.data);
                zNodes=data.data;
                console.log(zNodes);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + ' ' + errorThrown);
            }
        });
    },
    methods: {
        init_cb:function (result) {
            console.log(result);
            this.list = result.data.data;
            this.userlist();
        },
        getTreeHeader_cb:function (result) {
            console.log(result.data);
            zNodes=result.data;
            console.log(zNodes);
        },
        userlist_cb:function (result) {
            //alert(result.data.message);
            this.m_userlist = result.data.data;
        },
        userlist:function () {
            var idx = this.url_idx.userlist;
            var param = this.params[idx];
            ajax(this,zyfUrl+this.urls[idx],param,0,this.userlist_cb);
        },
        danger_record_editclick:function () {

        },
        maxcode_cb:function (result) {
            this.insertForm.hazardsNo = result.data.data;
        },
        maxcode:function () {
            var idx = this.url_idx.maxcode;
            var param = this.params[idx];
            ajax(this,zyfUrl + this.urls[idx],param,0,this.maxcode_cb);
        },
        insert_cb:function (result) {
            // alert(result.data.message);
            this.insertDlgVisible = false;
            var idx=this.url_idx.init;
            ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
        },
        //添加
        add:function(){
            var that=this;
            var form = this.insertForm;
            that.insertDlgVisible=true;
            that.title="添加危险源";
            that.qNoVisible=false;
            that.sbmBtn=1;
            form.hazardsNo="";
            form.hazardsName="";
            form.hazardsLevel="";
            form.lastDays="";
            form.hazardsStatus="";
            form.happenDate = "";
            this.eleTexts="+添加关联元素";
            //清空文件
            if(that.insertForm.fileIds.length!=0){
                that.$refs.upload.clearFiles();
                that.insertForm.fileNum=0;
                that.insertForm.fileIds.splice(0,that.insertForm.fileIds.length);
            }
            if( that.checkedTrees.length!=0){
                that.checkedTrees.splice(0,that.checkedTrees.length);
            }
            this.maxcode();
        },
        insertSubmit:function () {
            var form = this.insertForm;
            if(form.hazardsName==""||form.hazardsLevel==""||form.hazardsStatus==""||form.happenDate==""){
                this.$message({
                    message: "请完善信息再提交！",
                    type: 'warning'
                });
                return false;
            }

            //提交的文件ID
            //form.fileIds.join(",");
            //模型ID
            // form.HazardsprojectIds=form.HazardsprojectIds.join(",");
            //任务ID
            //form.modelId =this.checkedTrees;
            var l = [];
            for(var i=0;i<this.checkedTrees.length;i++){
                l.push(this.checkedTrees[i]);
                form.modelId = JSON.stringify(l);
            }
            form.solvePlanUrls = JSON.stringify(form.fileIds);
            //form.modelId = JSON.stringify(form.modelId);
            console.log(form.modelId);
            form.HazardsprojectIds = JSON.stringify(form.HazardsprojectIds);
            //form.happenDate = JSON.stringify(form.happenDate);
            var idx=this.url_idx.insert;
            ajax(this,zyfUrl + this.urls[idx],form,0,this.insert_cb);
        },
        reset:function () {
            // alert();
            this.select.hazardsLevel="";
            this.select.hazardsStatus="";
            this.select.createMan="";
            this.select.time="";
            // alert(1);
            var idx=this.url_idx.init;
            ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
            // alert(2);
        },
        filter_cb:function (result) {
            // alert(result.data.message);
            this.init_cb(result);
        },
        filter:function () {
            //alert("in filter");
            var idx = this.url_idx.filter;
            var param = this.params[idx];

            param.hazardsLevel = this.select.hazardsLevel;
            param.hazardsStatus = this.select.hazardsStatus;
            param.createMan = this.select.createMan;
            param.startDate=this.select.time[0];
            param.endDate=this.select.time[1];
            ajax(this,zyfUrl + this.urls[idx],param,0,this.filter_cb);
        },
        //过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        //模型
        relatedTree:function(){
            var _this=this;
            _this.relatedEle=1;
            _this.isActive1= true;
            _this.isActive2=false;
            //console.log(zNodes);
            setTimeout(function () {
                //alert("in related tree");
                var settingAdd = {
                    async:{
                        enable: true,
                        url: zyfUrl+"/model/getTreeNodeByPid"+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt,//异步加载时的请求地址
                        autoParam: ["id",'modelId','1'],//提交参数
                        type: 'post',
                        dataType: 'json',
                        dataFilter: filter
                    },
                    data: {
                        key: {
                            children: "",
                            name: "nodeName",
                            title: "",
                            url: "url",
                            icon: "icon",
                            pathname: "nodePath"
                        },
                        simpleData: {
                            enable: true,
                            idKey: "nodeId",
//                            pIdKey: "parentId",
//                            rootPId: null
                        },
                        keep: {
                            parent: false,
                            leaf: false
                        },
                    },
                    check: {
                        enable: true,
                        autoCheckTrigger: true,
                        nocheckInherit: true,
                        chkDisabledInherit: true,
                        chkboxType: {
                            "Y": "s",
                            "N": "s"
                        }
                    },
                    expandSpeed: "",
                    callback: {
//                        beforeExpand:zTreeBeforeExpand,
                        onCheck:zTreeOnClick,
                        onAsyncSuccess: onAsyncSuccess,
                    }
                };
                function zTreeOnClick(event, treeId, treeNode) {
                    //console.log(treeNode.id);

                    var flag=false;
                    for (var i=0;i< _this.insertForm.HazardsprojectIds.length;i++){
                        if(_this.insertForm.HazardsprojectIds[i]==treeNode.priId){
                            _this.insertForm.HazardsprojectIds.splice(i,1);
                            flag=true;
                            break;
                        }
                    }
                    if(flag==false){
                        _this.insertForm.HazardsprojectIds.push(treeNode.priId);
                    }
                }
                function filter(treeId, parentNode, childNodes) {
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemos");
                    childNodes=childNodes.data;
                    var flag=false;
                    for (var i=0;i< childNodes.length;i++){
                        for(var j=0;j<_this.insertForm.HazardsprojectIds.length;j++){
                            if(childNodes[i].priId==_this.insertForm.HazardsprojectIds[j]){
                                treeObj.checkNode(childNodes[i], true, true);
                                break;
                            }else{

                            }
                        }
                    }
                    if(flag==false){
//                       _this.form.HazardsprojectIds.push(treeNode.priId);
                    }
//                   console.log(childNodes);
                    return childNodes;
                }
                function onAsyncSuccess(event, treeId, treeNode, msg) {
                    console.log(event);
                    console.log(msg);
                    var zTree = $.fn.zTree.getZTreeObj("treeDemos");
                    zTree.updateNode(treeNode);
                }

                $(document).ready(function () {
                    $.fn.zTree.init($("#treeDemos"), settingAdd, zNodes);/*空间结构*/
                });
            },1000)
        },
        //任务
        relatedTask:function(){
            var _this=this;
            _this.relatedEle=2;
            _this.isActive2= true;
            _this.isActive1=false;
            $.ajax({
                type: 'POST',
                data: {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    //"projectId":"123456789",
                },
                url: zyfUrl+'/TaskProcess/getAll',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data.data);
                    _this.trees.data=data.data;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
        },
        //关联确认
        submitRelated:function(){
            // this.relatedVisible=false;
            // //获取选取节点
            // this.checkedTrees=this.$refs.tree.getCheckedKeys();
            // console.log(this.checkedTrees);
            // //选择的带过去
            // this.defaultChecks=this.checkedTrees;

            this.relatedVisible=false;
            //获取选取节点
            this.checkedTrees=this.$refs.tree.getCheckedKeys();
            console.log(this.checkedTrees);
            //选择的带过去
            this.defaultChecks=this.checkedTrees;
            console.log(this.defaultChecks.length);
            console.log(this.insertForm.HazardsprojectIds.length);
            if(this.defaultChecks.length!=0||this.insertForm.HazardsprojectIds.length!=0){
                this.eleTexts="已有关联元素";
            }else{
                this.eleTexts="+添加关联元素";
            }
        },
        //trees
        handleCheckChange(data, checked, indeterminate) {
            var _this=this;
            console.log(data, checked, indeterminate);
        },
        handleNodeClick(data) {
            console.log(data);
        },
        //分页
        goto:function(index){
            if(index == this.current) return;
            this.current = index;
            // var that=this;
            // that.allNum=that.qualityList.length;
            // that.allpage=Math.ceil(that.qualityList.length/this.showItem);
        },
        // 添加方法
        // 上传前对文件的判断
        beforeUpload:function(file) {
            const isLt500M = file.size / 1024 / 1024 < 500
            this.fileNum++;
            if (!isLt500M) {
                return this.$confirm('文件大小不能超过 500MB!');
            }
            return isLt500M
        },
        //对列表进行控制
        handleChange:function(file, fileList) {
            var that=this;
            console.log(fileList);
        },
        // 上传成功后的回调
        uploadSuccess:function(response, file, fileList) {
            var that=this.insertForm;
            console.log('上传文件', response);
            file.uid=response.data.accId;
            console.log(file.uid);
            that.fileName=response.data.accName;
            //追加文件Id
            that.fileIds.push(file.uid);
        },
        // 上传错误
        uploadError:function(response, file, fileList) {
            console.log('上传失败，请重试！')
        },
        //文件删除提醒
        beforeRemove:function(file, fileList) {
            return this.$confirm('确定移除'+file.name+'？');
        },
        //文件删除操作
        handleRemove:function(file, fileList) {
            console.log(file.uid);
            var that=this.insertForm;
            that.fileNum--;
            //删除Id
            that.fileIds.pop(file.uid);
            console.log(that.fileIds);
            //删除请求
            $.ajax({
                type: 'POST',
                data:{
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    accId:file.uid
                },
                url: zyfUrl+'/acc/delete',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
        },

        //删除文件
        deleteFile:function(index){
            var _this=this;
            var name=_this.insertForm.accessorylist[index].accName;
            var saveId=_this.insertForm.accessorylist[index].accId;
            this.$confirm('确定移除'+name+'？');
            //删除
            this.insertForm.accessorylist.splice(index, 1);
            this.insertForm.fileIds.pop(saveId);
            //删除请求
            $.ajax({
                type: 'POST',
                data: {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    accId:saveId
                },
                url: zyfUrl+'/acc/delete',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
        },
        //下载文件
        download:function(index){
            console.log(index);
            var param = '&accessoryId=' + index;
            this.downloadFun(zyfUrl + "/acc/download", param, 'get');
        },
        //下载文件方法
        downloadFun:function (url, data, method) {
            // 获取url和data
            if (url && data) {
                // data 是 string 或者 array/object
                data = typeof data == 'string' ? data : jQuery.param(data);
                // 把参数组装成 form的  input
                var inputs = '';
                jQuery.each(data.split('&'), function () {
                    var pair = this.split('=');
                    inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
                });
                // request发送请求
                jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
                    .appendTo('body').submit().remove();
            };
        },
        update_select_cb:function () {
            var that=this;
            // 这里是处理正确的回调
            // console.log(result.data.data);
            // that.editList=result.data.data;
            //
            // if(that.editList.qualityForm==""){
            //     this.eleTexts="+添加关联元素";
            // }else{
            //     this.eleTexts="已有关联元素";
            // }
            // if(that.editList.qualityForm==""){
            //     that.form.formName="填写质量整改单";
            // }else{
            //     that.form.formName=that.editList.qualityForm.formName;
            // }
            // that.form.accessoryList=that.editList.accessoryList;
            // that.editList.processTaskList.forEach(function(item,index){
            //     that.defaultChecks.push(item.processTaskId);
            // })
            // console.log(that.defaultChecks);
        },
        //编辑
        update:function (rcd) {
            var that=this;
            that.insertDlgVisible=true;
            that.title="编辑危险源";
            this.sbmBtn = 2;
            //var id=that.qualityList[index].id;

            // //清空文件
            // if(that.insertForm.fileIds.length!=0){
            //     that.$refs.upload.clearFiles();
            //     that.insertForm.fileNum=0;
            //     that.insertForm.fileIds.splice(0,that.insertForm.fileIds.length);
            // }
            // if( that.checkedTrees.length!=0){
            //     that.checkedTrees.splice(0,that.checkedTrees.length);
            // }
            // if(that.defaultChecks.length!=0){
            //     that.defaultChecks.splice(0,that.defaultChecks.length);
            // }
            // console.log(that.checkedTrees);
            // var idx=this.url_idx.init;
            // var param = this.params[idx];
            // param.hazardsNo = rcd.hazardsNo;
            // ajax(this,zyfUrl+this.urls[idx],param,0,this.update_select_cb);
            //
            // //文件展示
            // that.form.hasFiles=true;


            var form = this.insertForm;
            form.hazardsManagementId = rcd.hazardsManagementId;
            form.hazardsNo = rcd.hazardsNo;
            form.hazardsName = rcd.hazardsName;
            form.hazardsLevel = rcd.hazardsLevel;
            form.lastDays = rcd.lastDays;
            form.hazardsStatus = rcd.hazardsStatus;
            form.happenDate = rcd.happenDate;
            form.HazardsprojectIds = rcd.modelTreelist;
            form.processTasklist = rcd.processTasklist;
            form.accessorylist = rcd.accessorylist;

            if(form.HazardsprojectIds.length==0&&form.processTasklist.length==0){
                this.eleTexts="+添加关联元素";
            }else{
                this.eleTexts="已有关联元素";
            }
            form.hasFiles=true;
            for(var i=0;i<form.accessorylist.length;i++)
                form.fileIds.push(form.accessorylist[i].accId);

            form.processTasklist.forEach(function(item,index){
                that.defaultChecks.push(item.processTaskId);
            })
        },
        updateSubmit_cb:function (result) {
            // alert(result.data.message);
            this.insertDlgVisible = false;
            var idx=this.url_idx.init;
            ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
        },
        updateSubmit:function () {
            var idx = this.url_idx.update;
            var form = this.insertForm;

            form.HazardsprojectIds = JSON.stringify(form.HazardsprojectIds);
            var l = [];
            for(var i=0;i<this.checkedTrees.length;i++)
                l.push(this.checkedTrees[i]);
            form.modelId = JSON.stringify(l);
            //form.modelId = JSON.stringify(l)
            form.solvePlanUrls = JSON.stringify(form.fileIds);
            ajax(this,zyfUrl + this.urls[idx],form,0,this.updateSubmit_cb);
        },
        //时间转换
        selectChange:function(val){
            this.select.time=val;
            console.log(val)
        },
        //时间格式化
        dateChange:function(val){
            this.insertForm.happenDate = val;
        },
        //关联
        related:function(){
            this.relatedVisible=true;
            //tree请求
            this.relatedTree();
            this.relatedEle=1;
        },
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
        // filteredItems: function () {
        //     return this.qualityList.slice(this.current, this.current+4);
        // }

    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
        addListen(event){

        }
    },
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
                                <div class="col-xs-2">
                                    <el-select v-model="select.hazardsLevel" placeholder="选择等级" id="sel_priority">
                                        <el-option label="轻微" value="1"></el-option>
                                        <el-option label="一般" value="2"></el-option>
                                        <el-option label="重大" value="3"></el-option>
                                    </el-select>
                                </div>
                                <div class="col-xs-2">
                                    <el-select v-model="select.hazardsStatus" placeholder="选择状态" id="sel_status">
                                        <el-option label="可控" value="0"></el-option>
                                        <el-option label="不可控" value="1"></el-option>
                                        <el-option label="关闭" value="2"></el-option>
                                    </el-select>
                                </div>
                                <div class="col-xs-2">
                                    <el-select v-model="select.createMan" placeholder="选择创建人" id="sel_user">
                                        <el-option :label="i.userName" :value="i.userId" v-for="i in m_userlist"></el-option>
                                    </el-select>
                                </div>
                                <div class="col-xs-3">
                                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="select.time" @change="selectChange"
                                        type="daterange"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期" clearable>
                                    </el-date-picker>
                                </div>
                                <div class="col-xs-3">
                                    <button type="button" class="btn primary backg-color top-select" @click="filter()">筛选</button>
                                    <button type="button" class="btn btn-default" @click="reset()">重置</button>
                                    <div class="pull-right">
                                        <el-button type="text" @click="add()" class="el-button--primary">添加危险源</el-button>
                                        <button type="button" class="btn btn-default">导出</button>
                                    </div>
                                </div>
                            </div>
                            <!--弹窗-->
                            <el-dialog class="my-modal" :visible.sync="insertDlgVisible" width="40%">
                                <div class="modal-header primary backg-color">
                                    <div class="modal-title">
                                        {{title}}
                                    </div>
                                </div>
                                <!--关联弹窗-->
                                <el-dialog class="look-modal related-center" :visible.sync="relatedVisible" width="40%" append-to-body>
                                    <div class="modal-header primary backg-color">
                                        <h4 class="modal-title">选择关联元素</h4>
                                    </div>
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <div class="row">
                                                <ul class="nav nav-tabs">
                                                    <li role="presentation" class="related-element" v-bind:class="{ active: isActive1}"  @click="relatedTree()"><a href="javascript:void(0)">模型</a></li>
                                                    <!--<li role="presentation" class="related-room" @click="relatedTree()"><a href="javascript:void(0)">空间结构</a></li>-->
                                                    <li role="presentation" class="related-task" v-bind:class="{ active: isActive2}"  @click="relatedTask()"><a href="javascript:void(0)">任务</a></li>
                                                </ul>
                                            </div>
                                            <div class="row">
                                                <!--左侧-->
                                                <div class="col-sm-12 left">
                                                    <div class="borderStyle">
                                                        <!--结构树-->
                                                        <!--<ul class="ztree" id="add-treeDemo" style="height: 218px;"></ul>-->
                                                        <ul v-show="relatedEle==1" class="ztree modal-ztree" id="treeDemos" style="height: 218px;"></ul>
                                                        <!--<el-tree v-show="relatedEle==1" :props="props1" ref="tree" :filter-node-method="filterNode"
                                                         show-checkbox  @check-change="handleCheckChange" lazy
                                                        :default-checked-keys="defaultChecks" node-key="id" :load="loadNode1">
                                                        </el-tree>-->
                                                        <el-tree v-show="relatedEle==2" :props="trees" ref="tree" :filter-node-method="filterNode"
                                                                 show-checkbox  @check-change="handleCheckChange" :data="trees.data"
                                                                 :default-checked-keys="defaultChecks" node-key="id">
                                                        </el-tree>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="relatedVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="submitRelated()">确认</el-button>
                                    </span>
                                </el-dialog>
                                <!--内容-->
                                <el-form :model="insertForm" :rules="rules" ref="insertForm">
                                    <el-form-item label="问题编号:" prop="hazardsNo" :aria-disabled="true">
                                        <el-input v-model="insertForm.hazardsNo" disabled></el-input>
                                    </el-form-item>
                                    <el-form-item label="危险源名称:" prop="hazardsName">
                                        <el-input type="text" v-model="insertForm.hazardsName" placeholder="请输入危险源名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="等级:" prop="hazardsLevel">
                                        <el-select v-model="insertForm.hazardsLevel" placeholder="请选择">
                                            <el-option label="轻微" value="1"></el-option>
                                            <el-option label="一般" value="2"></el-option>
                                            <el-option label="重大" value="3"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="持续天数:">
                                        <el-input-number class="text-left" v-model="insertForm.lastDays" controls-position="right" :min="0" :max="10"></el-input-number>
                                    </el-form-item>
                                    <el-form-item label="关联元素:">
                                        <el-button type="button" @click="related()" class="innerBtn theme-color" v-text="eleTexts">+增加关联元素</el-button>
                                    </el-form-item>
                                    <el-form-item label="状态:" prop="hazardsStatus">
                                        <el-select v-model="insertForm.hazardsStatus" placeholder="请选择">
                                            <el-option label="可控" value="0"></el-option>
                                            <el-option label="不可控" value="1"></el-option>
                                            <el-option label="关闭" value="2"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="发生日期:" prop="happenDate">
                                        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" v-model="insertForm.happenDate" @change="dateChange" style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="上传附件:" prop="files">
                                        <!--文件上传-->
                                        <el-upload
                                            class="upload-demo"
                                            :action="insertForm.action"
                                            :data="upLoadData"
                                            :on-change="handleChange"
                                            :on-success="uploadSuccess"
                                            :on-error="uploadError"
                                            :on-remove="handleRemove"
                                            :before-remove="beforeRemove"
                                            :before-upload="beforeUpload"
                                            multiple
                                            :file-list="fileList">
                                            <el-button size="small">
                                                <img src="../images/up.png" class="up_img">
                                                上传文件
                                            </el-button>
                                            <!--<div slot="tip" class="el-upload__tip c_9">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>-->
                                        </el-upload>

                                        <!--编辑时已有的文件-->
                                        <ul class="el-upload-list el-upload-list--text" v-show="insertForm.hasFiles">
                                            <li tabindex="0" class="el-upload-list__item is-success"  v-for="(file,index) in insertForm.accessorylist" :id="file.accId"><!---->
                                                <a class="el-upload-list__item-name">
                                                    <i class="el-icon-document"></i>
                                                    {{file.accName}}
                                                </a>
                                                <i class="el-icon-close" @click="deleteFile(index)"></i>
                                            </li>
                                        </ul>
                                    </el-form-item>

                                </el-form>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="insertDlgVisible = false">取 消</el-button>
                                    <el-button type="primary" @click="insertSubmit()" v-if="sbmBtn==1">添加提交</el-button>
                                    <!--编辑-->
                                    <el-button type="primary" @click="updateSubmit()" v-else="sbmBtn==2">提交</el-button>
                                </span>
                            </el-dialog>


                        </header>
                        <hr class="widget-separator">
                        <div class="widget-body security-body" style="padding: 0;">
                            <div class="table-responsive">
                                <!--表格-->
                                <table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">
                                    <thead>
                                    <tr>
                                        <th>编号</th>
                                        <th>名称</th>
                                        <th>等级</th>
                                        <th>持续天数</th>
                                        <th>关联任务</th>
                                        <th>关联空间</th>
                                        <th>发生时间</th>
                                        <th>提交人</th>
                                        <th>状态</th>
                                        <th>附件</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(item,idx) in list">
                                        <td>{{item.hazardsNo}}</td>
                                        <td class="td-content td-title">
                                            {{item.hazardsName}}
                                        </td>
                                        <td>
                                            <span v-if="item.hazardsLevel==1">轻微</span>
                                            <span v-if="item.hazardsLevel==2">一般</span>
                                            <span v-if="item.hazardsLevel==3">重大</span>
                                        </td>
                                        <td>{{item.lastDays}}</td>
                                        <!--<td class="w_m">空</td>-->
                                        <td class="td-files td-title file_name" v-if="item.processTasklist===[]">
                                            空
                                        </td>
                                        <td class="td-files" v-else>
                                            <el-popover trigger="click" placement="bottom">
                                                <p v-for="(i,index) in item.processTasklist" :id="i.processTaskId" class="c-pointer">
                                                    {{i.taskName}}
                                                </p>
                                                <div slot="reference" class="name-wrapper">
                                                    <el-tag size="small">已关联{{item.processTasklist.length}}任务</el-tag>
                                                </div>
                                            </el-popover>
                                        </td>
                                        <td class="td-files td-title file_name" v-if="item.modelTreelist===[]">
                                            空
                                        </td>
                                        <td class="td-files" v-else>
                                            <el-popover trigger="click" placement="bottom">
                                                <p v-for="(i,index) in item.modelTreelist" :id="i.priId" class="c-pointer">
                                                    {{i.nodeName}}
                                                </p>
                                                <div slot="reference" class="name-wrapper">
                                                    <el-tag size="small">已关联{{item.modelTreelist.length}}空间</el-tag>
                                                </div>
                                            </el-popover>
                                        </td>
                                        <td>{{item.happenDate}}</td>
                                        <td>
                                            <img src="../images/user.png">
                                            {{item.user.userName}}
                                        </td>
                                        <td>
                                            <span v-if="item.hazardsStatus==0">可控</span>
                                            <span v-if="item.hazardsStatus==1">不可控</span>
                                            <span v-if="item.hazardsStatus==2">关闭</span>
                                        </td>
                                        <td class="td-files td-title file_name" v-if="item.accessorylist==''">
                                            未上传
                                        </td>
                                        <td class="td-files" v-else>
                                            <el-popover trigger="click" placement="bottom">
                                                <p v-for="(file,index) in item.accessorylist" :id="file.accId" @click="download(file.accId)" class="c-pointer">
                                                    {{file.accName}}
                                                </p>
                                                <div slot="reference" class="name-wrapper">
                                                    <el-tag size="small">{{item.accessorylist.length}}个附件</el-tag>
                                                </div>
                                            </el-popover>
                                        </td>
                                        <td class="td-handles">
                                            <i class="fa fa-edit fa-2 td-edit" aria-hidden="true" data-toggle="modal" data-target="#danger_edit_modal" @click="update(item)"></i>
                                            <!--<i class="fa fa-search fa-2 td-search" aria-hidden="true"></i>-->
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <!--分页-->
                                <div class="pages text-center">
                                    <span class="allNum">共&nbsp;
                                        <span class="theme-color">{{allNum}}</span>
                                        &nbsp;条危险源</span>
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


