<script>

import common from '../../../components/common.vue';

var zNodes=[];
export default {
    extends: common,
    name:"security-list",
    data(){
        return{
            //apis
            urls:[
                "/safeProblem/selectSafeProblemFormByProId",//list
                "/safeProblem/addSafeProblem",//insert
                "/safeProblem/getsafeProblemNo",//max security problem code
                "/safeProblem/selectSafeProblemFormByConditions",
                "/user/tree",
                "/model/getTreeHeader",
                "/safeProblem/handlingSafeProblemForm",//handle problem,
                "/Process/getProcessList",//get processs
                "/safeProblem/updateSafeProblem"

            ],
            //api index
            url_idx:{
                init:0,
                insert:1,
                maxseccode:2,
                sel:3,
                userlist:4,
                ztreeheader:5,
                handleProblem:6,
                getProcesses:7,
                update:8
            },
            //api parameters
            params:[
                {userId:window.userId,projectId:window.projectId,jwt:window.jwt},
                {userId:window.userId,
            projectId:window.projectId,
            safeProblemNo:"123",
            safeProblemDescribe:'',
            processId:"123",
            priority:"0",
            endDate:"0",
            safeRectificationForm:"0",
            hazardsManagementIds:["1","2","3"],
            projectIds:[],
            attachments:["2","3"],
                    jwt:window.jwt
                },
                {userId:window.userId,projectId:window.projectId,jwt:window.jwt},
                {userId:window.userId,projectId:window.projectId,safeProblemSatus:0,priority:0,createMan:'',startDate:'',endDate:'',jwt:window.jwt},
                {userId:userId, projectId:projectId, jwt:jwt},
                {userId:window.userId,projectId:window.projectId,jwt:window.jwt},
                {userId:userId,safeProblemId:0,problemFeedback:'',attachments:[],jwt:window.jwt},
                {userId:window.userId,projectId:window.projectId,processType:1,jwt:window.jwt}
            ],
            list:[],
            m_maxcode:0,
            //默认选中的
            defaultChecks:[],//associated danger
            //绑定
            unbind:false,
            eleTexts:"+添加关联元素",
            //tree
            relatedEle:1,
            trees: {
                data:[],
                label: 'hazardsName',
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
            title:"添加安全问题",
            //编号
            qNoVisible:false,
            //提交按钮
            sbmBtn:1,
            //select
            select:{
                status:"",
                priority:"",
                createUser:"",
                time:"",
            },//上传文件时的参数
            upLoadData: {
                userId:window.userId,
                projectId:window.projectId,
                jwt:window.jwt
            },
            fileList:[],
            m_userlist:[],
            m_processList:[],
            //添加form
            form: {
                userId:window.userId,
                projectId:window.projectId,
                jwt:window.jwt,
                safeProblemId:0,
                safeProblemNo:'',
                safeProblemDescribe:'',
                processId: '',
                priority:'',
                endDate: '',
                safeRectificationForm:'',
                hazardsManagementIds:'',
                hazardsManagementlist:[],
                projectIds:[],
                attachments:[],
                action:zyfUrl+'/acc/upload',
                //文件ID
                saveFileIds:"",
                fileName:"",
                fileNum: 0 ,
                //关联模型ID
                relatedModels:"1",
                //关联任务ID
                relatedTasks:"1",
                //项目ID
                // projectId:"1",
                modelArray:[],
                fileList:[],
                fileIds:[],
                hasFiles:false,
                action:zyfUrl+'/acc/upload',
                formId:'',
                formName:'',
                accessorylist:[]
            },
            rules: {
                safeProblemDescribe: [
                    { required: true, message: '请输入问题内容', trigger: 'blur' },
                    { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
                ],
                processId: [
                    { required: true, message: '请选择处理流程', trigger: 'change' }
                ],
                 priority: [
                    { required: true, message: '请选择优先级', trigger: 'change' }
                ],
                endDate: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
            },
            //查看弹框
            lookVisible: false,
            m_lookHandleTitle:'',
            lookForm:{
                userId:window.userId,
                projectId:window.projectId,
                jwt:window.jwt,
                safeProblemId:0,
                safeProblemNo:'',
                problemFeedback:'',
                createMan:'',
                createDate:'',
                endDate:'',
                priority:'',
                hazardsManagementlist:'',
                safeProblemDescribe:'',
                safeProblemProcessingList:[],
                proaccessorylist:[],
                attachments:[],
                fileName:'',
                fileNum:0,
                fileIds:[]
            },
            m_handleShow:0,
            m_canHandle:0,
            isEdit:0,
            rows:[],
            m_rcdidx:0,
            m_curRcd:{},
            //关联元素
            relatedVisible:false,
            checkedTrees:[],//associated hazards
        }
    },
    mounted: function() {
        //请求数据调用
        //get ztree
        //tree请求
        // var idx = this.url_idx.ztreeheader;
        // this.ajax(this,zyfUrl+this.urls[idx],{
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
    created:function () {
        var idx=this.url_idx.init;
        this.ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
    },
    methods: {
        init_cb:function (result) {
            //alert(result.data.message);
            var problem_list = result.data.data;
            this.list = problem_list;
            this.allNum=this.list.length;
            this.allpage=Math.ceil(this.allNum/this.showItem);
            this.userlist();
        },
        processList_cb:function (result) {
            this.m_processList = result.data.data;
        },
        processList:function () {
            var idx = this.url_idx.getProcesses;
            var param = this.params[idx];
            this.ajax(this,zyfUrl+this.urls[idx],param,0,this.processList_cb);
        },
        userlist_cb:function (result) {
          //alert(result.data.message);
          this.m_userlist = result.data.data;

          this.processList();
        },
        userlist:function () {
          var idx = this.url_idx.userlist;
          var param = this.params[idx];
          this.ajax(this,zyfUrl+this.urls[idx],param,0,this.userlist_cb);
        },
        insert_cb:function (result) {
            //alert(result.data.message);
            this.insertDlgVisible = false;
            var idx=this.url_idx.init;
            this.ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
        },
        filter_cb:function (result) {
          // alert(result.data.message);
        },
        maxcode_cb:function (result) {
            this.form.safeProblemNo = result.data.data;
        },
        getTreeHeader_cb:function (result) {
            console.log(result.data);
            zNodes=result.data;
            console.log(zNodes);
        },
        maxcode:function () {
            var idx = this.url_idx.maxseccode;
            var param = this.params[idx];
            this.ajax(this,zyfUrl + this.urls[idx],param,0,this.maxcode_cb);
        },
        //添加
        add:function(){
            var that=this;
            that.insertDlgVisible=true;
            that.title="添加安全问题";
            that.sbmBtn = 1;
            var form = this.form;
            form.safeProblemNo="";
            form.safeProblemDescribe="";
            form.processId="";
            form.priority= "";
            form.endDate = "";
            this.eleTexts="+添加关联元素";
            this.isEdit=0;

            //清空文件
            if(that.form.fileIds.length!=0){
                that.$refs.upload.clearFiles();
                that.form.fileNum=0;
                that.form.fileIds.splice(0,that.form.fileIds.length);
            }
            if( that.checkedTrees.length!=0){
                that.checkedTrees.splice(0,that.checkedTrees.length);
            }

            this.maxcode();
        },
        insertSubmit:function () {
            var form = this.form;
            if(form.safeProblemDescribe==""||form.processId==""||form.priority==""||form.endDate==""){
                this.$message({
                    message: "请完善信息再提交！",
                    type: 'warning'
                });
                return false;
            }

            var idx = this.url_idx.insert;//api index
            var l = [];
            for(var i=0;i<this.checkedTrees.length;i++)
                l.push(this.checkedTrees[i]);
            form.hazardsManagementIds = JSON.stringify(l);

            form.attachments = JSON.stringify(form.fileIds);
            //form.modelId = JSON.stringify(form.modelId);
            form.projectIds = JSON.stringify(form.projectIds);

            this.ajax(this,zyfUrl + this.urls[idx],form,0,this.insert_cb);
        },
        updateSubmit_cb:function (result) {
            // alert(result.data.message);
            this.insertDlgVisible = false;
            var idx=this.url_idx.init;
            this.ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
        },
        updateSubmit:function () {
            var idx = this.url_idx.update;
            var form = this.form;

            form.projectIds = JSON.stringify(form.projectIds);
            var l = [];
            for(var i=0;i<this.checkedTrees.length;i++)
                l.push(this.checkedTrees[i]);
            form.hazardsManagementIds = JSON.stringify(l);
            //form.modelId = JSON.stringify(l)
            form.attachments = JSON.stringify(form.fileIds);
            this.ajax(this,zyfUrl + this.urls[idx],form,0,this.updateSubmit_cb);
        },
        //编辑
        update:function (rcd) {
            var that=this;
            that.insertDlgVisible=true;
            that.title="编辑安全问题";
            that.qNoVisible=true;
            that.sbmBtn=2;
            that.isEdit = true;
            //var id=that.qualityList[index].id;


            var form = this.form;
            form.safeProblemId = rcd.safeProblemId;
            form.safeProblemNo = rcd.safeProblemNo;
            form.safeProblemDescribe = rcd.safeProblemDescribe;
            form.processId = rcd.process.processId;
            form.priority = rcd.priority;
            form.endDate = rcd.endDate;
            form.accessorylist = rcd.accessorylist;
            form.hazardsManagementlist = rcd.hazardsManagementlist;

            if(form.projectIds.length==0&&form.hazardsManagementlist.length==0){
                this.eleTexts="+添加关联元素";
            }else{
                this.eleTexts="已有关联元素";
            }
            form.hasFiles=true;
            for(var i=0;i<form.accessorylist.length;i++)
                form.fileIds.push(form.accessorylist[i].accId);

            form.hazardsManagementlist.forEach(function(item,index){
                that.defaultChecks.push(item.hazardsManagementId);
            })
        },
        //查看
        look:function(rcd){
            //this.m_rcdidx = index;
            var _this=this;
            _this.lookVisible=true;
            this.m_lookHandleTitle = "问题查看";
            this.m_handleShow = 0;
            // _this.lookBox.topName="问题查看";
            // _this.lookBox.handleShow=0;
            // this.lookBox.no = this.list[index].safeProblemNo;
            // this.lookBox.startMan=this.list[index].createMan;
            // this.lookBox.priority = this.list[index].priority;
            // this.lookBox.desc = this.list[index].safeProblemDescribe;

            var form = this.lookForm;
            form.createMan = rcd.user.userName;
            form.safeProblemNo = rcd.safeProblemNo;
            form.safeProblemDescribe = rcd.safeProblemDescribe;
            form.processId = rcd.process.processId;
            form.safeProblemSatus = rcd.safeProblemSatus;
            switch(rcd.priority){
                case '1':
                    form.priority = "轻微";
                    break;
                case '2':
                    form.priority = "一般";
                    break;
                case '3':
                    form.priority = "严重";
                    break;
            }
            form.createDate = rcd.createDate;
            form.endDate = rcd.endDate;

            form.hazardsManagementlist = rcd.hazardsManagementlist;
            form.safeProblemProcessingList = rcd.safeProblemProcessingList;

        },
        //处理
        handle:function(rcd){
            var _this=this;
            _this.lookVisible=true;
            this.m_lookHandleTitle="问题处理";
            this.m_handleShow = 1;
            this.m_rcdidx = rcd;
            this.m_curRcd = rcd;
            this.m_canHandle = 0;

            var found = false;
            var l = rcd.processDesignaterlist;
            for(var i=0;i<l.length;i++){
                if(l[i].userId==window.userId){
                    found = true;
                    break;
                }
            }
            if(found)
                this.m_canHandle = 1;


            var form = this.lookForm;
            form.createMan = rcd.user.userName;
            form.safeProblemNo = rcd.safeProblemNo;
            form.safeProblemDescribe = rcd.safeProblemDescribe;
            form.processId = rcd.process.processId;
            form.safeProblemSatus = rcd.safeProblemSatus;
            switch(rcd.priority){
                case '1':
                    form.priority = "轻微";
                    break;
                case '2':
                    form.priority = "一般";
                    break;
                case '3':
                    form.priority = "严重";
                    break;
            }
            form.createDate = rcd.createDate;
            form.endDate = rcd.endDate;

            form.hazardsManagementlist = rcd.hazardsManagementlist;
            form.safeProblemProcessingList = rcd.safeProblemProcessingList;
        },
        handleProblem_cb:function (result) {
            // alert(result.data.message);
            this.lookVisible = false;
        },
        handleSubmit:function () {
            var idx = this.url_idx.handleProblem;

            var form = this.lookForm;
            form.safeProblemId = this.m_curRcd.safeProblemId;
            form.attachments = JSON.stringify(form.fileIds);
            //form.proaccessorylist

            this.ajax(this,zyfUrl+this.urls[idx],form,0,this.handleProblem_cb);
        },
        filter_cb:function (result) {
            // alert(result.data.message);
            this.init_cb(result);
        },
        filter:function () {
            // alert("in filter");
            var idx = this.url_idx.sel;
            var param = this.params[idx];

            param.priority = this.select.priority;
            param.createMan = this.select.createUser;
            param.safeProblemSatus = this.select.status;
            param.startDate = this.select.time[0];
            param.endDate = this.select.time[1];
            // param.priority = 1;
            // param.createMan = 1;
            // param.status = 1;
            // param.startDate = 1;
            // param.endDate = 1;
            this.ajax(this,zyfUrl + this.urls[idx],param,0,this.filter_cb);
        },
        reset:function () {
            var idx=this.url_idx.init;
            this.ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
            this.select.status="";
            this.select.priority="";
            this.select.createUser="";
            this.select.time="";
        },
        //过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.hazardsName.indexOf(value) !== -1;
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
                    for (var i=0;i< _this.form.projectIds.length;i++){
                        if(_this.form.projectIds[i]==treeNode.priId){
                            _this.form.projectIds.splice(i,1);
                            flag=true;
                            break;
                        }
                    }
                    if(flag==false){
                        _this.form.projectIds.push(treeNode.priId);
                    }
                }
                function filter(treeId, parentNode, childNodes) {
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemos");
                    childNodes=childNodes.data;
                    var flag=false;
                    for (var i=0;i< childNodes.length;i++){
                        for(var j=0;j<_this.form.projectIds.length;j++){
                            if(childNodes[i].priId==_this.form.projectIds[j]){
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
                url: zyfUrl+'/hazardsManagement/selectHazardsManagementByProId',
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
            //
            // $.ajax({
            //     type: 'POST',
            //     data: {
            //         userId:userId,
            //         projectId:11,
            //         jwt:jwt,
            //         //"projectId":"123456789",
            //     },
            //     url: zyfUrl+'/TaskProcess/getAll',
            //     dataType: 'json',
            //     cache: false,
            //     success: function(data) {
            //         console.log(data.data);
            //         _this.trees.data=data.data;
            //     },
            //     error: function(jqXHR, textStatus, errorThrown) {
            //         console.log('error ' + textStatus + ' ' + errorThrown);
            //     }
            // });
        },
        //关联确认
        submitRelated:function(){
            this.relatedVisible=false;
            //获取选取节点
            this.checkedTrees=this.$refs.tree.getCheckedKeys();
            console.log(this.checkedTrees);
            //选择的带过去
            this.defaultChecks=this.checkedTrees;
            console.log(this.defaultChecks.length);//associated hazards
            console.log(this.form.projectIds.length);//associated model
            if(this.defaultChecks.length!=0||this.form.projectIds.length!=0){
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
        beforeUploadHandle:function(file) {
            const isLt500M = file.size / 1024 / 1024 < 500
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
            var that=this.form;
            console.log('上传文件', response);
            file.uid=response.data.accId;
            console.log(file.uid);
            that.fileName=response.data.accName;
            //追加文件Id
            that.fileIds.push(file.uid);
        },
        uploadSuccessHandle:function(response, file, fileList) {
            var that=this.lookForm;
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
            var that=this.form;
            that.fileNum--;
            //删除Id
            that.fileIds.pop(file.uid);
            console.log(that.fileIds);
            //删除请求
            $.ajax({
                type: 'POST',
                data: file.uid,
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
        handleRemoveHandle:function(file, fileList) {
            console.log(file.uid);
            var that=this.lookForm;
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
            var name=_this.form.accessorylist[index].accName;
            var saveId=_this.form.accessorylist[index].accId;
            this.$confirm('确定移除'+name+'？');
            //删除
            this.form.accessorylist.splice(index, 1);
            this.form.fileIds.pop(saveId);
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

        //关联
        related:function(){
            this.relatedVisible=true;
            //tree请求
            this.relatedTree();
            this.relatedEle=1;
        },
        //时间转换
        selectChange:function(val){
            this.select.time=val;
            console.log(val)
        },
        //时间格式化
        dateChange:function(val){
            this.form.endDate = val;
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
            <problemList></problemList>
        </div><!-- .wrap -->
    </main>
</template>
<<template>
  <section class="app-content layout-center" id="security-list">
        <!-- search results -->
        <!--相应内容-->
        <div class="row">
                <div class="col-md-8">
                    <div class="md8-left">
                        <!--<div class="model-content">-->
                            <!--&lt;!&ndash;模型嵌入&ndash;&gt;-->

                        <div id="content">
                            <div id="viewerContainer"></div>
                            <div id="dockingPanelTip" class="dockPane react-draggable" style="display: block; max-height: 617px; max-width: 837.641px;">
                                <div class="dockingPanelScroll right" id="5b34-1807-67c6-9b88-scroll-container" style="height: calc(100% - 25px);">
                                    <div class="pbwell-simaple">
                                        <div>
                                            <label value="处理" style="border-radius: 14px;margin-right: 5px;width:14px;height:14px;vertical-align: middle;background-color:#1aff00;opacity: 0.70;" onmouseover="this.title=this.innerText" title=""></label>处理
                                        </div>
                                        <div>
                                            <label value="未处理" style="border-radius: 14px;margin-right: 5px;width:14px;height:14px;vertical-align: middle;background-color:#FF0000;opacity: 0.70;" onmouseover="this.title=this.innerText"></label>未处理
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="toolBar">
                                <div class="toolbar-tools">
                                    <div id="view-button" title="切换视图" data-operatorclass="toolbar-camera" data-submenu="view-submenu" class="BimViewer-tool toolbar-menu">
                                        <div class="tool-icon"></div>
                                    </div>

                                    <div class="tool-seperator "></div>

                                    <div id="snapshot-button" title="变换颜色" data-operatorclass="toolbar-snapshot" class="BimViewer-tool">
                                        <div class="tool-icon"></div>
                                    </div>

                                    <div id="showtree-button" title="空间结构树" data-operatorclass="toolbar-showtree" class="BimViewer-tool">
                                        <div class="tool-icon"></div>
                                    </div>
                                </div>
                                <div id="submenus">
                                    <div id="view-submenu" data-button="view-button" class="toolbar-submenu submenus">
                                        <table>
                                            <tr>
                                                <td>
                                                    <div id="view-left" title="左视图" data-operatorclass="toolbar-left" class="submenu-icon"></div>
                                                </td>
                                                <td>
                                                    <div id="view-right" title="右视图" data-operatorclass="toolbar-right" class="submenu-icon"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div id="view-top" title="顶视图" data-operatorclass="toolbar-top" class="submenu-icon"></div>
                                                </td>
                                                <td>
                                                    <div id="view-bottom" title="底视图" data-operatorclass="toolbar-bottom" class="submenu-icon"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div id="view-front" title="前视图" data-operatorclass="toolbar-front" class="submenu-icon"></div>
                                                </td>
                                                <td>
                                                    <div id="view-back" title="后视图" data-operatorclass="toolbar-back" class="submenu-icon"></div>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <!--</div>-->
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="md4-right space-frame">
                        <div class="widget">
                            <header class="widget-header">
                                <h4 class="widget-title right-title">空间结构</h4>
                            </header><!-- .widget-header -->
                            <hr class="widget-separator">
                            <div class="widget-body">
                                <!--结构树-->
                                <!--<ul class="ztree" id="treeDemo"></ul>-->
                                <div id="modleTree" class="modelTree react-draggable" style="touch-action: none; transform: translate(0px, 0px);">
                                    <!--<div id="treeHeader" class="settings-header draggable-tree-header">
                                        <span>空间结构</span>
                                    </div>-->
                                    <div id="ztreeContainer" class="ztree ps-container ps-theme-default" data-ps-id="54c6af3e-d5b2-ec9a-a3d0-db5452695b26" style="padding-right:4px">
                                        <ul id="treeControl" class="ztree"></ul>
                                    </div>
                                </div>
                            </div><!-- .widget-body -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="list-content">
                <div class="row">
                    <div class="col-md-12" style="padding-right: 0;">
                        <div class="widget">
                            <header class="widget-header">
                                <div class="row">
                                    <div class="col-xs-2">
                                        <el-select v-model="select.status" placeholder="选择当前阶段" id="sel_status">
                                            <el-option label="未处理" value="1"></el-option>
                                            <el-option label="处理" value="2"></el-option>
                                            <el-option label="逾期未处理" value="3"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-xs-2">
                                        <el-select v-model="select.priority" placeholder="选择优先级" id="sel_priority">
                                            <el-option label="轻微" value="1"></el-option>
                                            <el-option label="一般" value="2"></el-option>
                                            <el-option label="严重" value="3"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-xs-2">
                                        <el-select v-model="select.createUser" placeholder="选择创建人" id="sel_user">
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
                                        <el-button type="text" class="el-button--primary" @click="filter()">筛选</el-button>
                                        <button type="button" class="btn btn-default" @click="reset()">重置</button>
                                        <div class="pull-right">
                                            <el-button type="text" @click="add()" class="el-button--primary">添加问题</el-button>
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
                                                                     :default-checked-keys="defaultChecks" node-key="hazardsManagementId">
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
                                    <el-form :model="form" :rules="rules" ref="form">
                                        <el-form-item label="问题编号:" prop="safeProblemNo" :aria-disabled="true">
                                            <el-input v-model="form.safeProblemNo" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="问题描述:" prop="safeProblemDescribe">
                                            <el-input type="textarea" v-model="form.safeProblemDescribe" placeholder="请输入问题内容"></el-input>
                                        </el-form-item>
                                        <el-form-item label="上传附件:" prop="files">
                                            <!--文件上传-->
                                            <el-upload
                                                class="upload-demo"
                                                :action="form.action"
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
                                            <ul class="el-upload-list el-upload-list--text" v-show="form.hasFiles">
                                                <li tabindex="0" class="el-upload-list__item is-success"  v-for="(file,index) in form.accessorylist" :id="file.accId"><!---->
                                                    <a class="el-upload-list__item-name">
                                                        <i class="el-icon-document"></i>
                                                        {{file.accName}}
                                                    </a>
                                                    <i class="el-icon-close" @click="deleteFile(index)"></i>
                                                </li>
                                            </ul>
                                        </el-form-item>
                                        <el-form-item label="处理流程:" prop="processId" >
                                            <el-select v-model="form.processId" placeholder="请选择" v-if="isEdit==1" disabled>
                                                <el-option :label="i.processName" :value="i.processId" v-for="i in m_processList"></el-option>
                                            </el-select>
                                            <el-select v-model="form.processId" placeholder="请选择" v-else>
                                                <el-option :label="i.processName" :value="i.processId" v-for="i in m_processList"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="优先级:" prop="priority">
                                            <el-select v-model="form.priority" placeholder="请选择">
                                                <el-option label="轻微" value="1"></el-option>
                                                <el-option label="一般" value="2"></el-option>
                                                <el-option label="严重" value="3"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="截止日期:" prop="endDate">
                                            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" v-model="form.endDate" @change="dateChange" style="width: 100%;"></el-date-picker>
                                        </el-form-item>
                                        <el-form-item label="关联元素:">
                                            <el-button type="button" @click="related()" class="innerBtn theme-color" v-text="eleTexts">+增加关联元素</el-button>
                                            <!--<el-input type="button" auto-complete="off" value="+增加关联元素"  @click="relatedVisible=true"></el-input>-->
                                        </el-form-item> 
                                        <!--<el-form-item label="表单:">
                                            <el-input :id="form.formId" v-model="form.formName" class="theme-color" readonly></el-input>
                                        </el-form-item>-->
                                        
                                    </el-form>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="insertDlgVisible=false">取 消</el-button>
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
                                            <th>内容</th>
                                            <th>危险源关联</th>
                                            <th>模型定位</th>
                                            <th>时间</th>
                                            <th>提交人</th>
                                            <th>状态</th>
                                            <th>附件</th>
                                            <th>操作</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(r,index) in list">
                                            <td> {{r.safeProblemNo}}</td>
                                            <td class="td-content">
                                                {{r.safeProblemDescribe}}
                                            </td>
                                            <td v-if="r.hazardsManagementlist===[]">
                                                空
                                            </td>
                                            <td v-else>
                                                <el-popover trigger="click" placement="bottom">
                                                    <p v-for="(i,index) in r.hazardsManagementlist" :id="r.hazardsManagementId" class="c-pointer">
                                                        {{i.hazardsNo}}
                                                    </p>
                                                    <div slot="reference" class="name-wrapper">
                                                        <el-tag size="small">已关联{{r.hazardsManagementlist.length}}个危险源</el-tag>
                                                    </div>
                                                </el-popover>
                                            </td>
                                            <td>
                                                <img src="../images/posiiton.png" class="position-png">
                                            </td>
                                            <td>{{r.endDate}}</td>
                                            <td>
                                                <img src="../images/user.png">
                                                {{r.user.userName}}
                                            </td>
                                            <td>
                                                <span class="label label-success td-status" v-if="r.safeProblemSatus==1">处理中</span>
                                                <span class="label label-success td-status" v-if="r.safeProblemSatus==2">处理完成</span>
                                                <span class="label label-danger td-status" v-if="r.safeProblemSatus==3">逾期未处理</span>
                                            </td>
                                            <td class="td-files td-title file_name" v-if="r.accessorylist==''">
                                                未上传
                                            </td>
                                            <td class="td-files" v-else>
                                                <el-popover trigger="click" placement="bottom">
                                                    <p v-for="(file,index) in r.accessorylist" :id="file.accId" @click="download(file.accId)" class="c-pointer">
                                                        {{file.accName}}
                                                    </p>
                                                    <div slot="reference" class="name-wrapper">
                                                        <el-tag size="small">{{r.accessorylist.length}}个附件</el-tag>
                                                    </div>
                                                </el-popover>
                                            </td>
                                            <td class="td-handles">
                                                <i class="fa fa-edit fa-2 td-edit"  @click="update(r)"></i>
                                                <i class="fa fa-search fa-2 td-search" @click="look(r)"></i>
                                                <i class="fa fa-th-large fa-2" @click="handle(r)"></i>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <!--分页-->
                                    <div class="pages text-center">
                                        <span class="allNum">共&nbsp;
                                            <span class="theme-color">{{allNum}}</span>
                                            &nbsp;条安全问题</span>
                                        <ul class="pagination" >
                                            <li v-show="current != 1" @click="current-- && goto(current)" ><a href="#">上一页</a></li>
                                            <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
                                                <a href="#" >{{index}}</a>
                                            </li>
                                            <li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)"><a href="#" >下一页</a></li>
                                        </ul>
                                    </div>
                                    <!--查看弹窗-->
                                    <el-dialog :visible.sync="lookVisible" width="45%" class="look-modal">
                                            <div class="modal-header primary backg-color">
                                                <div class="modal-title">
                                                    <span class="title-name">{{lookForm.safeProblemNo}}</span>
                                                    &nbsp;&nbsp;
                                                    <span>problem look</span>&nbsp;&nbsp;
                                                    <span class="label label-danger td-status">逾期未处理</span>
                                                </div>
                                            </div>
                                            <div class="modal-body">
                                                <div class="look-top">
                                                    <div class="row">
                                                        <div class="col-xs-4">
                                                            <i class="fa fa-user" aria-hidden="true"></i>
                                                            发起人:
                                                            <span class="primary-user">{{lookForm.createMan}}</span>
                                                        </div>
                                                        <div class="col-xs-4">
                                                            发起时间:
                                                            <span class="start-time">{{lookForm.createDate}}</span>
                                                        </div>
                                                        <div class="col-xs-4">
                                                            截止时间:
                                                            <span class="end-time">{{lookForm.endDate}}</span>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-4">
                                                            优先级:
                                                            <span class="priority">{{lookForm.priority}}</span>
                                                        </div>
                                                        <div class="col-xs-4">
                                                            当前步骤:
                                                            <span class="step" v-if="lookForm.safeProblemSatus==1">process problem1</span>
                                                            <span class="step" v-if="lookForm.safeProblemSatus==2">process problem2</span>
                                                            <span class="step" v-if="lookForm.safeProblemSatus==3">process problem3</span>
                                                        </div>
                                                        <!--<div class="col-xs-4">
                                                            表单:<span class="theme-color">质量整改</span>
                                                            &nbsp;&nbsp;<img src="../images/file.png">
                                                        </div>-->
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-4">
                                                            关联元素:
                                                            <p class="related" v-for="n in lookForm.hazardsManagementlist">
                                                                {{n.hazardsName}}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div class="line"></div>
                                                    <div class="row">
                                                        <div class="col-xs-12">
                                                            问题描述:
                                                            <div class="questions">
                                                                {{lookForm.safeProblemDescribe}}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="more-part" v-show="m_handleShow==1">
                                                <!--<div class="more-part">-->
                                                    <div class="row">
                                                        <div class="col-xs-12">
                                                            问题反馈:
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-12">
                                                            <textarea type="text" v-model="lookForm.problemFeedback" placeholder="请输入问题内容" class="question"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-12">
                                                            <span class="left_text">上传附件:</span>
                                                        </div>
                                                        <div class="col-xs-12">
                                                            <!--文件上传-->
                                                            <el-upload
                                                                class="upload-demo"
                                                                action="form.action"
                                                                :data="upLoadData"
                                                                :on-change="handleChange"
                                                                :on-success="uploadSuccessHandle"
                                                                :on-error="uploadError"
                                                                :on-remove="handleRemoveHandle"
                                                                :before-remove="beforeRemove"
                                                                :before-upload="beforeUploadHandle"
                                                                multiple
                                                                :file-list="fileList">
                                                                <el-button size="small">
                                                                    <img src="../images/up.png" class="up_img">
                                                                    上传文件
                                                                </el-button>
                                                                <div slot="tip" class="el-upload__tip c_9">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
                                                            </el-upload>
                                                        </div>
                                                    </div>
                                                    <div class="look-btns text-center">
                                                        <button class="btn btn-default">取消</button>
                                                        <button class="btn btn-primary primary backg-color" v-if="m_canHandle==1" @click="handleSubmit()">处理问题</button>
                                                        <button class="btn btn-primary primary backg-color" v-if="m_canHandle==0" disabled @click="handleSubmit()">处理问题</button>
                                                    </div>
                                                </div>
                                                <div class="look-center">
                                                    <div class="row" v-for="i in lookForm.safeProblemProcessingList">
                                                        <div class="col-xs-1">
                                                            <div class="circle bg-blue">
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-11">
                                                            <div class="one-part">
                                                                <img src="../images/left.png" class="left-icon">
                                                                <div class="row">
                                                                    <div class="col-xs-6">
                                                                        人员:<span class="part-name">{{i.user.userName}}</span>
                                                                    </div>
                                                                    <!--<div class="pull-right">-->
                                                                        <!--<span class="part-time">{{i}}</span>-->
                                                                    <!--</div>-->
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-xs-12">
                                                                        操作:<span>{{i.operationContent}}</span>
                                                                    </div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-xs-12">
                                                                        反馈:<span>{{i.problemFeedback}}</span>
                                                                    </div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-xs-12">
                                                                        附件:
                                                                        <span class="theme-color" v-for="j in i.proaccessorylist" :id="j.accId" @click="download(j.accId)">{{j.accName}} </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        <!--</div>-->
                                    </el-dialog>
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


