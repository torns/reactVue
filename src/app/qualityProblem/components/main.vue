<script>
// $(document).ready(function() {
//     //table 高度设置
//     var thisH = $(window).height();
//     var centerH=thisH -195 + 'px';
//     $(".table-responsive").css("height", centerH);
// })
// window.onresize = function() {
//     var thisH = $(window).height();
//     var centerH=thisH -195 + 'px';
//     $(".table-responsive").css("height", centerH);
// }
 var zNodes=[];
export default {
    name:"problem-list",
    data(){
        return{
            id:"",
            qualityList:"",
            //当前页
            current:1,
            //每页数据
            showItem:10,
            //页数
            allpage:"",
            //总个数
            allNum:0,
            //class变化
            isActive1: true,
            isActive2:false,
            editList:"",
            lookList:"",
            //添加弹框
            dialogVisible: false,
            title:"添加质量问题",
            //编号
            qNoVisible:false,
            //提交按钮
            sbmBtn:"",
            //select
            addPerson:"",
            select:{
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                status:"",
                priority:"",
                createUser:"",
                time:"",
                startTime:"",
                endTime:"",
            },
            //关联button内容
            eleTexts:"+添加关联元素",
            //默认选中的
            defaultChecks:[],
            //绑定
            unbind:false,
            //tree
            relatedEle:1,
            trees: {
                data:[],
                label: 'name',
                //children: 'zones'
            },
            props1: {
                label: 'name',
                children: 'children',
                isLeaf: 'leaf'
            },
            allTree1:[],
            checkedTrees:[],
            allTree:[],
            filterText:"",
            //上传文件时的参数
            upLoadData: {
                userId:userId,
                projectId:projectId,
                jwt:jwt,
            },
            fileList:[],
            //得到的表单Id
            getFormId:"",
            //添加form
            form: {
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                //上传的字段
                content:'',
                processId: '',
                priority:'',
                endTime: '',
                formId:'',
                //文件ID
                saveFileIds:"",
                //关联模型ID
                qualityIssueModels:"",
                //关联任务ID
                qualityIssueTasks:"",
                //项目ID
                //projectId:"1",
                //用到的字段
                action:zyfUrl+'/acc/upload',
                qualityIssueId:'',
                qualityNo:'',
                status:'',
                isOverdue:'',
                //processId: '',
                formName:'',
                fileName:"",
                fileNum: 0 ,
                array:[],
                modelArray:[],
                fileList:[],
                processList:[],
                //已有文件
                accessoryList:[],
                hasFiles:false,
            },
            rules: {
                content: [
                    { required: true, message: '请输入问题内容', trigger: 'blur' },
                    { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
                ],
                 processId: [
                    { required: true, message: '请选择处理流程', trigger: 'change' }
                ],
                 priority: [
                    { required: true, message: '请选择优先级', trigger: 'change' }
                ],
                endTime: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
            },
            //查看弹框
            lookVisible: false,
            // 不需要
            lookBox:{
                topName:"",
                handleShow:"",
                id:"",
                qualityNo:"",
                status:"",
                isOverdue:"",
                content:"",
                priority:"",
                createTime:"",
                endTime:"",
                createUser:"",
                disposeList:"",
                formId:"",
                formName:"",
                //当前步骤
                processStage:"",
                //模型元素
                modelTreeList:"",
                //任务元素
                processTaskList:"",
            },
            //处理
            handles:{
                qualityIssueId:'',
                content:'',
                //文件ID
                saveFileIds:'',
                array:[],
            },
            //关联元素
            relatedVisible:false,
//            模型构件信息
            componentMes:componentMes,
            showStyleFlag:1
            
        }  
    },
     mounted: function() {
        //请求数据调用
         this.getList();
         //请求添加人
        this.$http.post(zyfUrl+'/user/tree',{
            userId:userId,
            projectId:projectId,
            jwt:jwt,
        },{
            headers:{}, emulateJSON: true
        }).then(function (result) {
            console.log(result);
            this.addPerson=result.body.data;
        },function (responsive) {
            console.log(responsive);
        })
         //请求流程数据
        this.$http.post(zyfUrl + '/Process/getProcessList', {
            userId:userId,
            projectId:projectId,
            jwt:jwt,
            processType:0
        }, {
            headers: {
            },
            emulateJSON: true
        }).then(function(result) {
            var that=this.form;
            // 这里是处理正确的回调
            console.log(result.bodyText);
            result.bodyText=JSON.parse(result.bodyText);
            that.processList=result.bodyText.data;
            console.log(that.processList);
        }, function(response) {
            // 这里是处理错误的回调
            console.log(response);
        });
        //this.relatedTree();
        //window.afterModelReady();
         //tree请求
            $.ajax({
                type: 'POST',
                data: {
                    modelId:"1",
                    //projectId:"1",
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
        //获取列表请求
        getList:function() {
            var that=this;
            this.$http.post(zyfUrl + '/qualityIssue/selectQualityIssueByAll', {
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
                that.qualityList = result.data.data;
                that.allNum=result.data.data.length;
                that.allpage=Math.ceil(that.allNum/that.showItem);

            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        //分页
        goto:function(index){
            if(index == this.current) return;
            this.current = index;
            // var that=this;
            // that.allNum=that.qualityList.length;
            // that.allpage=Math.ceil(that.qualityList.length/this.showItem);
        },
        //筛选
        problemSelect:function(){
            var _this=this;
            var that=this.select;
            console.log(that.time);
            that.startTime=that.time[0];
            that.endTime=that.time[1];
            $.ajax({
                type: 'POST',
                data: that,
                url: zyfUrl+'/qualityIssue/selectQualityIssueByCondition',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data.data);
                    _this.qualityList=data.data;
                    _this.current=1,
                    _this.allNum=data.data.length;
                    _this.allpage=Math.ceil(data.data.length/_this.showItem);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
        },
        //重置
        problemReset:function(){
            var _this=this;
            var that=this.select;
            that.status="";
            that.priority="";
            that.createUser="";
            that.time="";
            _this.getList();
        },
        //模型
        relatedTree:function(){
            var _this=this;
            _this.relatedEle=1;
            _this.isActive1= true;
            _this.isActive2=false;
            //console.log(zNodes);
           setTimeout(function () {
                console.log(zNodes);
                var settingAdd = {
                    async:{
                        enable: true,
                        url: zyfUrl+'/model/getTreeNodeByPid',
                        //?userId='+userId+'&projectId='+projectId+'&jwt='+jwt,//异步加载时的请求地址
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
                            "Y": " ",
                            "N": " "
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
                    for (var i=0;i< _this.form.modelArray.length;i++){
                        if(_this.form.modelArray[i]==treeNode.priId){
                            _this.form.modelArray.splice(i,1);
                            flag=true;
                            break;
                        }
                    }
                    if(flag==false){
                        _this.form.modelArray.push(treeNode.priId);
                    }
                }
               function filter(treeId, parentNode, childNodes) {
                   var treeObj = $.fn.zTree.getZTreeObj("treeDemos");
                   childNodes=childNodes.data;
                   var flag=false;
                   for (var i=0;i< childNodes.length;i++){
                       for(var j=0;j<_this.form.modelArray.length;j++){
                           if(childNodes[i].priId==_this.form.modelArray[j]){
                               treeObj.checkNode(childNodes[i], true, true);
                               break;
                           }else{

                           }
                       }
                   }
                   if(flag==false){
//                       _this.form.modelArray.push(treeNode.priId);
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
            this.relatedVisible=false;
            //获取选取节点
            this.checkedTrees=this.$refs.tree.getCheckedKeys();
            console.log(this.checkedTrees);
            //选择的带过去
            this.defaultChecks=this.checkedTrees;
            console.log(this.defaultChecks.length);
            console.log(this.form.modelArray.length);
            if(this.defaultChecks.length!=0||this.form.modelArray.length!=0){
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
        //添加
        add:function(){
            var that=this;
            that.dialogVisible=true;
            that.title="添加质量问题";
            that.qNoVisible=false;
            that.sbmBtn=1;
            that.form.qualityIssueId='';
            that.form.qualityNo='';
            that.form.content='';
            that.form.processId= '';
            that.form.priority='';
            that.form.endTime= '';
            that.form.status='';
            that.form.isOverdue='';
            that.form.formId='';
            that.eleTexts="+添加关联元素";
            that.form.formName='填写质量整改单';
            window.localStorage.removeItem("addformId");
            //window.localStorage.removeItem("formName");
            //清空文件
            if(that.form.array.length!=0){
                that.$refs.upload.clearFiles();
                that.form.fileNum=0;
                that.form.array.splice(0,that.form.array.length);
            }
            if( that.checkedTrees.length!=0){
                that.checkedTrees.splice(0,that.checkedTrees.length);
            }
            that.form.hasFiles=false;
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
            var that=this.form;
            console.log('上传文件', response);
            file.uid=response.data.accId;
            console.log(file.uid);
            that.fileName=response.data.accName;
            //追加文件Id
            that.array.push(file.uid);
            //处理问题的Id
            this.handles.array.push(file.uid);
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
            that.array.pop(file.uid);
            console.log(that.array);
            //处理问题的Id
            this.handles.array.pop(file.uid);
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
        //添加提交
        addSubmit:function(){
            var _this=this;
            var that=this.form;
            //通过local获取
            that.formId=window.localStorage.getItem("addformId");
            that.formName=window.localStorage.getItem("formName");
            //提交的文件ID
            that.saveFileIds=that.array.join(",");
            //模型ID
            that.qualityIssueModels=that.modelArray.join(",");
            console.log(that.qualityIssueModels);
            //任务ID
            that.qualityIssueTasks=_this.checkedTrees.join(",");
            console.log(that.qualityIssueTasks);
            console.log(that);
            if(that.content==""||that.processId==""||that.priority==""||that.endTime==""){
                _this.$message({
                    message: "请完善信息再提交！",
                    type: 'warning'
                });
                return false;
            }
            $.ajax({
                type: 'POST',
                data: that,
                url: zyfUrl+'/qualityIssue/insertQualityIssue',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                    if(data.code==0){
                        _this.dialogVisible=false;
                        //刷新数据
                        _this.getList();
                        //window.localStorage.removeItem("addformId");
                      // _this.$refs.upload.clearFiles();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
        },
        //编辑
        edit:function (index) {
            var that=this;
            that.dialogVisible=true;
            that.title="编辑质量问题";
            that.qNoVisible=true;
            that.sbmBtn=2;
            var id=that.qualityList[index].id;
            window.localStorage.removeItem("addformId");
            //清空文件
            if(that.form.array.length!=0){
                that.$refs.upload.clearFiles();
                that.form.fileNum=0;
                that.form.array.splice(0,that.form.array.length);
            }
            if( that.checkedTrees.length!=0){
                that.checkedTrees.splice(0,that.checkedTrees.length);
            }
            if(that.defaultChecks.length!=0){
                that.defaultChecks.splice(0,that.defaultChecks.length);
            }
            console.log(that.checkedTrees)
            //文件展示
            that.form.hasFiles=true;
            this.$http.post(zyfUrl + '/qualityIssue/selectQualityIssueById',
                {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    qualityIssueId:id
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                var that=this;
                // 这里是处理正确的回调
                console.log(result.data.data);
                that.editList=result.data.data;
                //查看传值
                that.form.qualityIssueId=that.editList.id;
                that.form.qualityNo=that.editList.qualityNo;
                that.form.content=that.editList.content;
                that.form.processId=that.editList.process.processId;//name
                that.form.priority=that.editList.priority;
                that.form.endTime=that.editList.endtime;
                that.form.status=that.editList.status;
                that.form.isOverdue=that.editList.isOverdue;
                that.form.formId=that.editList.qualityForm.id;
               if(that.editList.qualityForm==""){
                   this.eleTexts="+添加关联元素";
                }else{
                    this.eleTexts="已有关联元素";
                }
                if(that.editList.qualityForm==""){
                    that.form.formName="填写质量整改单";
                }else{
                    that.form.formName=that.editList.qualityForm.formName;
                }
                that.form.accessoryList=that.editList.accessoryList;
                that.editList.processTaskList.forEach(function(item,index){
                    that.defaultChecks.push(item.processTaskId);
                })
                console.log(that.defaultChecks);
                
            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        //删除文件
        deleteFile:function(index){
            var _this=this;
            var name=_this.form.accessoryList[index].accName;
            var saveId=_this.form.accessoryList[index].accId;
            this.$confirm('确定移除'+name+'？');
            //删除
            this.form.accessoryList.splice(index, 1);
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
            this.downloadFun(zyfUrl + '/acc/download?userId='+userId+'&projectId='+projectId+'&jwt='+jwt, param, 'get');
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
        //编辑提交
        editSubmit:function(){
            var _this=this;
            var that=this.form;
            //提交的文件ID
            //追加上已有文件的Id
            that.accessoryList.forEach(function(item,index){
                console.log(item.accId);
                that.array.push(item.accId);
            })
            that.saveFileIds=that.array.join(",");
            console.log(that.saveFileIds);
             //任务ID
            that.qualityIssueTasks=_this.checkedTrees.join(",");
            if(that.content==""||that.priority==""||that.endTime==""||that.processId==""){
                _this.$message({
                    message: "请完善信息再提交！",
                    type: 'warning'
                });
                return false;
            }
            $.ajax({
                type: 'POST',
                data: that,
                url: zyfUrl+'/qualityIssue/updateQualityIssueById',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                    if(data.code==0){
                        _this.dialogVisible=false;
                        window.localStorage.removeItem("addformId");
                        //刷新数据
                        _this.getList();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
            // });
        },
         //查看
        look:function(index){
            var _this=this;
            var that=this.lookBox;
            _this.lookVisible=true;
            _this.lookBox.topName="问题查看";
            _this.lookBox.handleShow=0;
            var id=_this.qualityList[index].id;
            this.$http.post(zyfUrl + '/qualityIssue/selectQualityIssueById',
                {
                    qualityIssueId:id,
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                // 这里是处理正确的回调
                console.log(result.data.data);
                _this.lookList=result.data.data;
                //查看传值
                that.id=_this.lookList.id;
                that.qualityNo=_this.lookList.qualityNo;
                that.status=_this.lookList.status;
                that.content=_this.lookList.content;
                that.priority=_this.lookList.priority;
                that.createTime=_this.lookList.createTime;
                that.endTime=_this.lookList.endtime;
                that.isOverdue=_this.lookList.isOverdue;
                that.processId=_this.lookList.process.processId;
                that.processStage=_this.lookList.processStage;
                that.createUser=_this.lookList.user.userName;
                that.formId=_this.lookList.qualityForm.id;
                that.formName=_this.lookList.qualityForm.formName;
                that.disposeList=_this.lookList.qualityIssueDisposeList;
                that.qualityIssueProcess=_this.lookList.qualityIssueProcess;
                that.modelTreeList=_this.lookList.modelTreeList;
                that.processTaskList=_this.lookList.processTaskList;
                //formId
                _this.getFormId=_this.lookList.qualityForm.id;
                console.log(_this.getFormId);
            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        //处理
        handle:function(index){
            var _this=this;
            //_this.look();
            //var that=this.handles;
            var that=this.lookBox;
            _this.lookVisible=true;
            _this.lookBox.topName="问题处理";
            _this.lookBox.handleShow=1;
            var id=_this.qualityList[index].id;
            _this.handles.qualityIssueId=_this.qualityList[index].id;
            _this.handles.content="";
            //清空文件
            if(_this.handles.array.length!=0){
                _this.$refs.upload.clearFiles();
                _this.handles.array.splice(0,_this.handles.array.length);
            }
            //_this.handles=_this.lookList;
            this.$http.post(zyfUrl + '/qualityIssue/selectQualityIssueById',
                {
                    qualityIssueId:id,
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                // 这里是处理正确的回调
                console.log(result.data.data);
                _this.lookList=result.data.data;
                //查看传值
                that.id=_this.lookList.id;
                that.qualityNo=_this.lookList.qualityNo;
                that.status=_this.lookList.status;
                that.content=_this.lookList.content;
                that.priority=_this.lookList.priority;
                that.createTime=_this.lookList.createTime;
                that.endTime=_this.lookList.endtime;
                that.isOverdue=_this.lookList.isOverdue;
                that.processId=_this.lookList.process.processId;
                that.processStage=_this.lookList.processStage;
                that.createUser=_this.lookList.user.userName;
                that.formId=_this.lookList.qualityForm.id;
                that.formName=_this.lookList.qualityForm.formName;
                that.disposeList=_this.lookList.qualityIssueDisposeList;
                that.qualityIssueProcess=_this.lookList.qualityIssueProcess;
                that.modelTreeList=_this.lookList.modelTreeList;
                that.processTaskList=_this.lookList.processTaskList;
                //formId
                _this.getFormId=_this.lookList.qualityForm.id;
                console.log(_this.getFormId);
            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
            //判断查询当前登录人是否有权限处理问题
            $.ajax({
                type: 'POST',
                data: {
                    qualityIssueId:id,
                    //userId:'11111111111111',
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                },
                url: zyfUrl+'/qualityIssue/disposeUser',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                    //处理判断
                    if(data.message=="可以处理"){
                         _this.unbind=false;
                    }else{
                        _this.unbind=true;
                       // _this.lookVisible=false;
                       _this.$message({
                            message: data.message,
                            type: 'warning'
                        });
                    }
                   
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
        },
        //处理提交
        handleSubmit:function(index){
            var _this=this;
            var that=this.handles;
            var id=that.qualityIssueId;
            //提交的文件ID
            that.saveFileIds=that.array.join(",");
            $.ajax({
                type: 'POST',
                data: {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    qualityIssueId:id,
                    content:that.content,
                    fileIds:that.saveFileIds,
                },
                url: zyfUrl+'/qualityIssue/qualityIssueDispose',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                    _this.lookVisible=false;
                    //刷新数据
                    _this.getList();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
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
            this.form.endTime = val; 
        },
        //过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        //跳转编辑器
        urlHtml:function(thisId){
            var toUrl;
            console.log(thisId);
            if(thisId==""){
                toUrl=zyfUrl+"/editors.html?block=qualityProblem&type=add&userId="+userId+"&projectId="+projectId+"&jwt="+jwt;
                 window.open(toUrl);
            }else if(thisId=="undefined"){
                toUrl=zyfUrl+"/editors.html?block=qualityProblem&type=add&userId="+userId+"&projectId="+projectId+"&jwt="+jwt;
                 window.open(toUrl);
            }else{
                toUrl=zyfUrl+'/editors.html?userId='+userId+'&projectId='+projectId+'&jwt='+jwt+'&block=qualityProblem&type=edit&sessionId='+thisId;
                window.open(toUrl);
            }
        },
        lookUrlHtml:function(thisId){
            console.log(thisId);
            var toUrl;
            if(thisId!=""){
                toUrl=zyfUrl+'/editors.html?userId='+userId+'&projectId='+projectId+'&jwt='+jwt+'&block=qualityProblem&type=look&sessionId='+thisId;
                 window.open(toUrl);
            }
        },
//      构件属性
        showStyle:function () {
            if(this.showStyleFlag==0){
                this.showStyleFlag=1;
            }else{
                this.showStyleFlag=0;
            }

        },
        closeModel:function () {
            $('.modelOpenMes').hide();
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
<template>
  <section class="app-content layout-center" id="problem-list">
        <!-- search results -->
        <!--相应内容-->
        <div class="row">
            <div class="col-md-8">
                <div class="md8-left">
                    <!--<div class="model-content">-->
                        <!--&lt;!&ndash;模型嵌入&ndash;&gt;-->
                    <!--</div>-->
                    <div id="content">
                        <div id="viewerContainer"></div>
                        <div id="dockingPanelTip" class="dockPane react-draggable" style="display: block; max-height: 617px; max-width: 837.641px;">
                            <div class="dockingPanelScroll right" id="5b34-1807-67c6-9b88-scroll-container" style="height: calc(100% - 25px);">
                                <div class="pbwell-simaple">
                                    <div>
                                        <label value="已处理" style="border-radius: 14px;margin-right: 5px;width:14px;height:14px;vertical-align: middle;background-color:#1aff00;opacity: 0.70;" onmouseover="this.title=this.innerText" title=""></label>已处理
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
                                <div id="treeHeader" class="settings-header draggable-tree-header">
                                    <span>空间结构</span>
                                </div>
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
                        <header class="widget-header" id="select_list">
                        <div class="row">
                            <div class="col-xs-2">
                                <el-select v-model="select.status" placeholder="选择当前阶段" id="sel_status">
                                    <el-option label="未处理" value="0"></el-option>
                                    <el-option label="处理中" value="1"></el-option>
                                    <el-option label="已处理" value="2"></el-option>
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
                                    <el-option v-for="person in addPerson" :label="person.userName" :value="person.userId"></el-option>
                                </el-select>
                            </div>
                            <div class="col-xs-3">
                                <el-date-picker  format="yyyy-MM-dd" value-format="yyyy-MM-dd"  @change="selectChange"
                                    v-model="select.time"
                                    type="daterange"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期" clearable>
                                </el-date-picker>
                            </div>
                            <div class="col-xs-3">
                                <button type="button" class="btn primary backg-color top-select" @click="problemSelect()">筛选</button>
                                <button type="button" class="btn btn-default" @click="problemReset()">重置</button>
                                <div class="pull-right">
                                    <el-button type="text" @click="add()" class="el-button--primary">添加问题</el-button>
                                    <!--<button type="button" class="btn primary backg-color top-add"  data-toggle="modal" data-target="#myModal_1">添加问题</button>-->
                                    <button type="button" class="btn btn-default">导出</button>
                                </div>
                            </div>
                        </div>
                        <!--弹窗-->
                        <el-dialog class="my-modal" :visible.sync="dialogVisible" width="40%">
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
                                            <div class="col-sm-12">
                                                <!--<el-input placeholder="输入关键字进行查找" v-model="filterText">
                                                </el-input>-->
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
                                            <!--中间-->
                                            <!--<div class="col-sm-1 center">
                                                <img src="../images/RIGHT_ICON.png" class="addright">
                                                <img src="../images/RIGHT_ICON_hover.png" class="addright2" style="display: none;">

                                            </div>-->
                                            <!--右侧-->
                                            <!--<div class="col-sm-7 right">
                                                <div class="col-sm-12 borderStyle">
                                                    <div class="row contentHeader">
                                                        <div class="col-sm-10">已选</div>
                                                        <div class="col-sm-2"><img src="../images/DELETE_ICON.png" id="delete-all"></div>
                                                    </div>
                                                    <div class="right-content">
                                                        <div class="row contentCenter">
                                                            <div class="col-sm-10 element-name" >施工单位</div>
                                                            <div class="col-sm-2"><img src="../assets/images/quality/DELETE_ICON.png" class="delete-icon"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>-->
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
                                <el-form-item label="问题编号:" prop="qualityNo" v-show="qNoVisible">
                                    <el-input v-model="form.qualityNo" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="问题描述:" prop="content">
                                    <el-input type="textarea" v-model="form.content" placeholder="请输入问题内容"></el-input>
                                </el-form-item>
                                <el-form-item label="上传附件:" prop="files">
                                    <!--文件上传-->
                                    <el-upload  ref="upload"
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
                                        :file-list="form.fileList">
                                        <el-button size="small">
                                            <img src="../images/up.png" class="up_img">
                                            上传文件
                                        </el-button>
                                        <div slot="tip" class="el-upload__tip c_9">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
                                    </el-upload>
                                    <!--编辑时已有的文件-->
                                    <ul class="el-upload-list el-upload-list--text" v-show="form.hasFiles">
                                        <li tabindex="0" class="el-upload-list__item is-success"  v-for="(file,index) in form.accessoryList" :id="file.accId"><!---->
                                            <a class="el-upload-list__item-name">
                                                <i class="el-icon-document"></i>
                                                {{file.accName}}
                                            </a>
                                            <i class="el-icon-close" @click="deleteFile(index)"></i>
                                        </li>
                                    </ul>
                                </el-form-item>
                                <el-form-item label="处理流程:" prop="processId">
                                    <el-select v-model="form.processId" placeholder="请选择">
                                        <el-option :label="process.processName" :value="process.processId"  v-for="process in form.processList"></el-option>
                                        <!--<el-option label="2" value="2"></el-option>-->
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="优先级:" prop="priority">
                                    <el-select v-model="form.priority" placeholder="请选择">
                                        <el-option label="轻微" value="1"></el-option>
                                        <el-option label="一般" value="2"></el-option>
                                        <el-option label="严重" value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="截止日期:" prop="endTime">
                                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd"  @change="dateChange" type="date" v-model="form.endTime" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="关联元素:">
                                    <!--@click="relatedVisible = true"-->
                                    <el-button type="button" @click="related()" class="innerBtn theme-color" v-text="eleTexts">+增加关联元素</el-button>
                                    <!--<el-input auto-complete="off" value="+增加关联元素" readonly></el-input>-->
                                </el-form-item>
                                <el-form-item label="表单:">
                                    <!-- v-model="form.formName"-->
                                    <div class="a-href">
                                        <!--<el-button type="button" @click="urlHtml()" :id="form.formId" class="innerBtn theme-color h_30" v-model="form.formName"></el-button>-->
                                         <el-button type="button" @click="urlHtml(form.formId)" :id="form.formId" class="innerBtn theme-color h_30">{{form.formName}}</el-button>
                                        <!--<a type="button" :id="form.formId" href="http://192.168.3.31:10091/zyfbim/editors.html?jwt=1"  target="_blank" class="theme-color c_blue" readonly>
                                        {{form.formName}}
                                        </el-button>-->
                                    </div>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="addSubmit()" v-if="sbmBtn==1">添加提交</el-button>
                                <!--编辑-->
                                <el-button type="primary" @click="editSubmit()" v-else="sbmBtn==2">提交</el-button>
                            </span>
                        </el-dialog>
                        </header>
                        <hr class="widget-separator">

                        <!--table-->
                        <div class="widget-body" style="padding: 0;">
                            <div class="table-responsive">
                                <!--<table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">-->
                                <table class="table table-striped" cellspacing="0" width="100%">
                                    <thead>
                                    <tr>
                                        <th>编号</th>
                                        <th>内容</th>
                                        <th>模型定位</th>
                                        <th>时间</th>
                                        <th>提交人</th>
                                        <th>状态</th>
                                        <th>附件</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in qualityList.slice((current-1)*showItem,current*showItem)" :id="item.id">
                                        <td>{{item.qualityNo}}</td>
                                        <td class="td-content td-title">
                                            <span :title="item.content">{{item.content}}</span>
                                        </td>
                                        <td>
                                            <img src="../images/posiiton.png" class="position-png">
                                        </td>
                                        <td>{{item.createTime}}</td>
                                        <td>
                                            <img src="../images/user.png">
                                            {{item.user.userName}}
                                        </td>
                                        <td>
                                            <!--0 未处理 1 处理中 已处理-->
                                            <span class="label label-danger td-status" v-if="item.status==0 && item.isOverdue==1">逾期未处理</span>
                                            <span class="label label-danger td-status" v-if="item.status==0 && item.isOverdue== '' ">未处理</span>
                                            <span class="label label-success td-status" v-if="item.status==1">处理中</span>
                                            <span class="label label-success td-status" v-if="item.status==2">已处理</span>
                                        </td>
                                        <td class="td-files td-title file_name" v-if="item.accessoryList==''">
                                            未上传
                                        </td>
                                        <td class="td-files" v-else>
                                            <el-popover trigger="click" placement="bottom">
                                                <p v-for="(file,index) in item.accessoryList" :id="file.accId" @click="download(file.accId)" class="c-pointer">
                                                    {{file.accName}}
                                                </p>
                                                <div slot="reference" class="name-wrapper">
                                                    <el-tag size="small">{{item.accessoryList.length}}个附件</el-tag>
                                                </div>
                                            </el-popover>
                                        </td>
                                        <td class="td-handles">
                                            <!--<el-button type="text" @click="dialogVisible = true" class="el-button--primary">添加问题</el-button>-->
                                            <i class="fa fa-edit fa-2 td-edit"  @click="edit(index)"></i>
                                            <i class="fa fa-search fa-2 td-search" @click="look(index)"></i>
                                            <i class="fa fa-th-large fa-2" @click="handle(index)"></i>
                                            
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
                                <!--查看弹窗-->
                                <el-dialog :visible.sync="lookVisible" width="45%" class="look-modal" :id="lookBox.id">
                                        <div class="modal-header primary backg-color">
                                            <div class="modal-title">
                                                <span class="title-name">{{lookBox.qualityNo}}</span>
                                                &nbsp;&nbsp;
                                                <span>{{lookBox.topName}}</span>&nbsp;&nbsp;
                                                <span class="label label-danger td-status" v-if="lookBox.status==0 && lookBox.isOverdue==1">逾期未处理</span>
                                                <span class="label label-danger td-status" v-else-if="lookBox.status==0&& lookBox.isOverdue== ''">未处理</span>
                                                <span class="label label-success td-status" v-else-if="lookBox.status==1">处理中</span>
                                                <span class="label label-success td-status" v-if="lookBox.status==2">已处理</span>
                                            </div>
                                        </div>
                                        <div class="modal-body">
                                            <div class="look-top">
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <i class="fa fa-user" aria-hidden="true"></i>
                                                        发起人:
                                                        <span class="primary-user">{{lookBox.createUser}}</span>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        发起时间:
                                                        <span class="start-time">{{lookBox.createTime}}</span>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        截止时间:
                                                        <span class="end-time">{{lookBox.endTime}}</span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        优先级:
                                                        <span class="priority" v-if="lookBox.priority==1">轻微</span>
                                                        <span class="priority" v-if="lookBox.priority==2">一般</span>
                                                        <span class="priority" v-if="lookBox.priority==3">严重</span>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        当前步骤:
                                                        <span class="step">{{lookBox.processStage.processStageName}}</span>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        表单:<span class="theme-color c-pointer" @click="lookUrlHtml(lookBox.formId)">
                                                            {{lookBox.formName}}</span>
                                                        &nbsp;&nbsp;<img src="../images/file.png">
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        关联元素:
                                                        <span class="related pr_10"  v-for="element in lookBox.modelTreeList">{{element.nodeName}}</span>
                                                        <span class="related pr_10"  v-for="element in lookBox.processTaskList">{{element.taskName}}</span>
                                                    </div>
                                                </div>
                                                <div class="line"></div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        问题描述:
                                                        <div class="questions">
                                                            {{lookBox.content}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="more-part" v-show="lookBox.handleShow==1">
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        问题反馈:
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <textarea type="text" placeholder="请输入问题内容" class="question" v-model="handles.content"></textarea>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <span class="left_text">上传附件:</span>
                                                    </div>
                                                    <div class="col-xs-12">
                                                        <!--文件上传-->
                                                        <el-upload ref="upload"
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
                                                            <div slot="tip" class="el-upload__tip c_9">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
                                                        </el-upload>
                                                    </div>
                                                </div>
                                                <div class="look-btns text-center pb_20">
                                                    <button class="btn btn-default" @click="lookVisible = false">取消</button>
                                                    <button class="btn btn-primary primary backg-color" v-if="!unbind" @click="handleSubmit(index)">处理问题</button>
                                                    <button class="btn btn-primary primary backg-color" v-else  disabled>处理问题</button>
                                                </div>
                                            </div>
                                            <div class="look-center">
                                                <div class="row" v-for="one in lookBox.disposeList">
                                                    <div class="col-xs-1">
                                                        <div class="circle bg-blue">
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-11">
                                                        <div class="one-part" :id="one.id">
                                                            <img src="../images/left.png" class="left-icon">
                                                            <div class="row">
                                                                <div class="col-xs-6">
                                                                    人员:<span class="part-name">{{one.user.userName}}</span>
                                                                </div>
                                                                <div class="pull-right">
                                                                    <span class="part-time">{{one.createTime}}</span>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-xs-12">
                                                                    操作:<span>{{one.status}}</span>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-xs-12">
                                                                    反馈:<span>{{one.content}}</span>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-xs-12">
                                                                    附件:
                                                                    <span class="theme-color pr_10" v-if="one.accessoryList==''">未上传</span>
                                                                    <span class="theme-color pr_10 c-pointer" v-for="file in one.accessoryList" @click="download(file.accId)">{{file.accName}} </span>
                                                                    <!--&nbsp;&nbsp;
                                                                    <span class="theme-color"> 现场.MP4</span>-->
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
      <!--模型预览-->
      <div class="modelOpenMes" id="modelOpenMes" v-show="componentMes!=''">
          <div class="container">
              <div class="row modelHeader">
                  <div class="col-xs-4">
                      <span>表面</span>
                  </div>
                  <div class="pull-right iconPosition" @click="closeModel()"><i class="el-icon-close"></i></div>
              </div>
              <div class="row modelHeader mesDetails" @click="showStyle()">
                  <div class="col-xs-4">构件属性</div>
                  <div class="pull-right iconPosition" v-show="showStyleFlag==1"><i class="el-icon-arrow-down"></i></div><!--down-->
                  <div class="pull-right iconPosition" v-show="showStyleFlag==0"><i class="el-icon-arrow-up"></i></div><!--up-->
              </div>
              <div class="row modelMes" v-show="showStyleFlag==1">
                    <div class="col-xs-12" v-for="item in componentMes">
                      <div class="col-xs-4" :title="item.name">{{item.name}}</div>
                      <div class="col-xs-8" :title="item.value">{{item.value}}</div>
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
    /*构件属性*/
    .modelOpenMes{
        display: block;
        width: 263px;
        height: 400px;
        position: absolute;
        top: 80px;
        right: 122px;
        background: #2f2f2f;
        color: #fff;
        opacity: 0.8;
    }
    .modelOpenMes .container{
        width: 100%;
    }
    .modelHeader{
        padding: 4px 0;
        cursor: pointer;
        background: #414141;
    }
    .iconPosition{
        margin-right: 12px;
    }
    .container .row{
        margin-left: -15px;
        margin-right: -15px;
    }
    .modelMes{
        height: 344px;
        overflow-y: auto;
    }
    .modelMes .col-xs-12{
        border-top: 1px solid #797979;
    }
    .modelMes div{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .modelMes .col-xs-12:nth-last-child(1){
        border-bottom: 1px solid #797979;
    }
    .modelMes .col-xs-12 div:nth-child(1){
        border-right: 1px solid #797979;
    }
    .modelOpenMes .modelMes:nth-child(1){
        background: unset;
        padding: 8px 0;
    }
</style>


