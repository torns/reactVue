<script>
// $(document).ready(function() {
//     //table 高度设置
//     var thisH = $(window).height();
//     var centerH=thisH -195 + 'px';
//      $(".table-responsive").css("height", centerH);
// })
// window.onresize = function() {
//     var thisH = $(window).height();
//     var centerH=thisH -195 + 'px';
//     $(".table-responsive").css("height", centerH);
// }
var zNodes=[];
// 请求列表
var thisH=$(".menubar").height();
//高度
// $("#quality-check .widget").css("height", thisH-125+'px');
// console.log($(".menubar").height());
export default {
    name:"quality-check",
    data(){
        return{
            id:"",
            qualityList:"",
            //当前页
            current:1,
            //每页数据
            showItem:20,
            //页数
            allpage:"",
            //总个数
            allNum:0,
            //class变化
            isActive1: true,
            isActive2:false,
            //添加弹框
            dialogVisible: false,
            title:"添加质量关键节点",
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
            allTree:[],
            filterText:"",
            //任务选择
            checkedTrees:[],
            //上传文件时的参数
            upLoadData: {
                userId:userId,
                projectId:projectId,
                jwt:jwt,
            },
            fileList:[],
            //添加form
            form: {
                //传的参数
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                opinion:'',
                endTime: '',
                formId:'1',
                //关联模型ID
                qualityVerifyModels:'1',
                //关联任务ID
                qualityVerifyTasks:"1",
                qualityVerifyTaskList:"",
                //文件ID
                saveFileIds:"",
                qualityVerifyId:"",
                //用到的字段
                action:zyfUrl+'/acc/upload',
                //?userId='+userId+'&projectId='+projectId+'&jwt='+jwt,
                formName:'',
                fileName:"",
                fileNum: 0 ,
                array:[],
                fileList:[],
                //关联id
                elementsId:"",
                //已有文件
                accessoryList:[],
                hasFiles:false,
            },
            rules: {
                elementsId: [
                    { required: true, message: '请选择关联元素', trigger: 'change' }
                ],
                opinion: [
                    { required: true, message: '请输入验收意见', trigger: 'blur' },
                    { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
                ],
                endTime: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
            },
            //查看弹框
            lookVisible: false,
            lookBox:"",
            //关联元素
            relatedVisible:false,
            checkId:"",
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
            this.$http.post(zyfUrl + '/qualityVerify/selectQualityVerifyByAll', {
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
        },
        //筛选
        topSelect:function(){
            var _this=this;
            var that=this.select;
            console.log(that.time);
            that.startTime=that.time[0];
            that.endTime=that.time[1];
            $.ajax({
                type: 'POST',
                data: that,
                url: zyfUrl+'/qualityVerify/selectQualityVerifyByCondition',
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
        topReset:function(){
            var _this=this;
            var that=this.select;
            that.createUser="";
            that.time="";
            _this.getList();
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
                //file.uid,
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
        //关联模型
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
                        url: zyfUrl+"/model/getTreeNodeByPid",//异步加载时的请求地址
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
        //关联任务
        relatedTask:function(){
            var _this=this;
            _this.relatedEle=2;
            _this.isActive2= true;
            _this.isActive1=false;
            //已有的任务
            // _this.editList.qualityVerifyTaskList.forEach(function(item,index){
            //     _this.defaultChecks.push(item.taskId);
            // })
            $.ajax({
                    type: 'POST',
                    data: {
                        userId:userId,
                        projectId:projectId,
                        jwt:jwt,
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
        //任务trees
        handleCheckChange(data, checked, indeterminate) {
            var _this=this;
            console.log(data, checked, indeterminate);
        },
        handleNodeClick(data) {
            console.log(data);
        },
        //关联确认
        submitRelated:function(){
            this.relatedVisible=false;
            //获取选取节点
            this.checkedTrees=this.$refs.tree.getCheckedKeys();
            console.log(this.checkedTrees);
            //选择的带过去
            //this.defaultChecks=this.checkedTrees;
            if(this.checkedTrees.length!=0){
                this.eleTexts="已有关联元素";
            }else{
                this.eleTexts="+添加关联元素";
            }
        },
        //关联
        related:function(){
            this.relatedVisible=true;
             //tree请求
            //this.relatedTree();
            //this.relatedEle=1;
            this.relatedTask();
        },
        //添加
        add:function(){
            var that=this;
            that.dialogVisible=true;
            that.title="添加质量关键节点";
            that.qNoVisible=false;
            that.sbmBtn=1;
            //this.relatedTree();
            this.relatedTask();
            that.form.opinion='';
            that.form.endTime= '';
            that.form.formId='';
            that.eleTexts="+添加关联元素";
            that.form.formName='填写质量验收单';
            window.localStorage.removeItem("addformId");
            //清空文件
            if(that.form.array.length!=0){
                that.$refs.upload.clearFiles();
                that.form.fileNum=0;
                that.form.array.splice(0,that.form.array.length);
            }
            //清空任务
            if( that.checkedTrees.length!=0){
                that.checkedTrees.splice(0,that.checkedTrees.length);
            }
            if(that.defaultChecks.length!=0){
                that.defaultChecks.splice(0,that.defaultChecks.length);
            }
            that.form.hasFiles=false;
        },
        //添加提交
        addSubmit:function(){
            var _this=this;
            var that=this.form;
            //通过local获取
            that.formId=window.localStorage.getItem("addformId");
            //提交的文件ID
            console.log(that.array)
            that.saveFileIds=that.array.join(",");
            console.log(that.saveFileIds);
            //任务ID
            that.qualityVerifyTasks=_this.checkedTrees.join(",");
            console.log(that.qualityVerifyTasks);
            //判断是否选了元素
            // this.elementsId=this.qualityVerifyTasks;
            console.log(that);
            //格式转换
            console.log(that.endTime);
            if(that.qualityVerifyTasks==""||that.opinion==""||that.endTime==""){
                //警告 
                this.$message({
                    message: "请完善信息再提交！",
                    type: 'warning'
                });
                return false;
            }
            $.ajax({
                type: 'POST',
                data: that,
                url: zyfUrl+'/qualityVerify/insertQualityVerify',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                    if(data.code==0){
                        _this.dialogVisible=false;
                        //刷新数据
                        _this.getList();
                        window.localStorage.removeItem("addformId");
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
            that.title="编辑质量关键节点";
            that.qNoVisible=true;
            that.sbmBtn=2;
            //this.relatedTree();
            this.relatedTask();
            var id=that.qualityList[index].id;
            that.form.qualityVerifyId=id;
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
            //文件展示
            that.form.hasFiles=true;
            //通过id获取数据
            this.$http.post(zyfUrl + '/qualityVerify/selectQualityVerifyById',
                {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    qualityVerifyId:id
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
                that.form.opinion=that.editList.verifyOpinion;
                that.form.endTime=that.editList.endTime;
                that.form.formId=that.editList.qualityForm.id;
                if(that.editList.qualityForm==""){
                    that.form.formName="填写质量验收单";
                }else{
                    that.form.formName=that.editList.qualityForm.formName;
                }
                that.form.accessoryList=that.editList.accessoryList;
                if(that.editList.processTaskList==""){
                    that.eleTexts="+添加关联元素";
                }else{
                    that.eleTexts="已有关联元素";
                }
                that.editList.processTaskList.forEach(function(item,index){
                    that.defaultChecks.push(item.processTaskId);
                })
                 console.log(that.defaultChecks);
                 that.$refs.tree.setCheckedKeys(that.defaultChecks);
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
//            alert('确定移除'+name+'？');
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
            //that.qualityIssueTasks=_this.checkedTrees.join(",");
            that.qualityVerifyTasks=_this.checkedTrees.join(",");
             if(that.qualityVerifyTasks==""||that.opinion==""||that.endTime==""){
//                alert("请完善信息再提交！");
                return false;
            }
            $.ajax({
                type: 'POST',
                data: that,
                url: zyfUrl+'/qualityVerify/updateQualityVerifyById',
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
            _this.lookVisible=true;
            // _this.lookBox.topName="问题查看";
            // _this.lookBox.handleShow=0;
            var id=_this.qualityList[index].id;
            //通过id获取数据
            this.$http.post(zyfUrl + '/qualityVerify/selectQualityVerifyById',
                {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    qualityVerifyId:id
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                var that=this;
                // 这里是处理正确的回调
                console.log(result.data.data);
                this.lookBox=result.data.data;
                console.log(this.lookBox);
                this.lookBox.createUser=this.lookBox.user.userName;
                // console.log(this.lookBox.createUser);
                //查看传值
                // that.form.accessoryList=that.editList.accessoryList;
                // that.editList.qualityVerifyTaskList.forEach(function(item,index){
                //     that.defaultChecks.push(item.taskId);
                // })
                //  console.log(that.defaultChecks);
            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
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
                toUrl=zyfUrl+"/editors.html?block=qualityCheck&type=add&userId="+userId+"&projectId="+projectId+"&jwt="+jwt;
                window.open(toUrl);
            }else if(thisId=="undefined"){
                toUrl=zyfUrl+"/editors.html?block=qualityCheck&type=add&userId="+userId+"&projectId="+projectId+"&jwt="+jwt;
                window.open(toUrl);
            }else{
//                toUrl=zyfUrl+"/editors.html?userId='+userId+'&projectId='+projectId+'&jwt='+jwt+'&block=qualityCheck&type=edit&sessionId='+thisId;
                toUrl=zyfUrl+"/editors.html?block=qualityCheck&type=edit&sessionId="+thisId+'&userId='+userId+'&projectId='+projectId+'&jwt='+jwt;
                //?block=qualityCheck&type=edit&sessionId="+thisId;
                window.open(toUrl);
            }
        },
        //查看表单
        lookUrlHtml:function(thisId){
            var toUrl;
            if(thisId!=""){
//                toUrl=zyfUrl+"/editors.html?userId='+userId+'&projectId='+projectId+'&jwt='+jwt+'&block=qualityCheck&type=look&sessionId='+thisId;
                toUrl=zyfUrl+"/editors.html?block=qualityCheck&type=edit&sessionId="+thisId+'&userId='+userId+'&projectId='+projectId+'&jwt='+jwt;
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
      }
    },
}
</script>

<template>
    <main id="root" class="app-main">
        <div class="wrap">
            <qualityCheck></qualityCheck>
        </div><!-- .wrap -->
    </main>
</template>
<template>
  <section class="app-content layout-center" id="quality-check">
        <!--相应内容-->
        <div class="list-content">
            <div class="row">
                <div class="col-md-12" style="padding-right: 0;">
                    <div class="widget">
                        <header class="widget-header">
                            <div class="row">
                                <div class="col-xs-2">
                                    <el-select v-model="select.createUser" placeholder="选择添加人">
                                        <el-option v-for="person in addPerson" :label="person.userName" :value="person.userId"></el-option>
                                    </el-select>
                                </div>
                                <div class="col-xs-3">
                                    <el-date-picker v-model="select.time" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  @change="selectChange"
                                        type="daterange" 
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期" clearable>
                                    </el-date-picker>
                                </div>
                                <div class="col-xs-7">
                                    <button type="button" class="btn primary backg-color top-select" @click="topSelect()">筛选</button>
                                    <button type="button" class="btn btn-default" @click="topReset()">重置</button>
                                    <div class="pull-right">
                                        <el-button type="text" @click="add()" class="el-button--primary">添加质量关键节点</el-button>
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
                                                    <!--<li role="presentation" class="related-element" v-bind:class="{ active: isActive1 }" @click="relatedTree()"><a href="javascript:void(0)">模型</a></li>-->
                                                <!--<li role="presentation" class="related-room" @click="relatedTree()"><a href="javascript:void(0)">空间结构</a></li>-->
                                                    <li role="presentation" class="related-task" v-bind:class="{ active: isActive2 }" @click="relatedTask()"><a href="javascript:void(0)">任务</a></li>
                                                </ul>
                                            </div>
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <!--<el-input placeholder="输入关键字进行查找" v-model="filterText">
                                                    </el-input>-->
                                                    <div class="borderStyle">
                                                        <!--结构树-->
                                                        <!--<ul v-show="relatedEle==1" class="ztree modal-ztree" id="treeDemos" style="height: 218px;"></ul>-->
                                                        <!--任务-->
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
                                <el-form :model="form" :rules="rules" ref="form">
                                    <el-form-item label="关联元素:"  prop="elementsId">
                                        <el-button type="button" @click="relatedVisible = true" class="innerBtn theme-color"  v-text="eleTexts">+增加关联元素</el-button>
                                    </el-form-item>
                                    <el-form-item label="验收日期:" prop="endTime">
                                        <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  @change="dateChange"  v-model="form.endTime" style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="验收意见:" prop="opinion">
                                        <el-input type="textarea" v-model="form.opinion" placeholder="请输入验收意见"></el-input>
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
                                            <li tabindex="0" class="el-upload-list__item is-success"  v-for="(file,index) in form.accessoryList" :id="file.accId">
                                                <a class="el-upload-list__item-name">
                                                    <i class="el-icon-document"></i>
                                                    {{file.accName}}
                                                </a>
                                                <i class="el-icon-close" @click="deleteFile(index)"></i>
                                            </li>
                                        </ul>
                                    </el-form-item>
                                    <el-form-item label="表单:">
                                        <el-button type="button" @click="urlHtml(form.formId)" :id="form.formId" class="innerBtn theme-color h_30">{{form.formName}}</el-button>
                                        <!--<el-input :id="form.formId" v-model="form.formName" class="theme-color" readonly></el-input>-->
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
                        <div class="widget-body security-body" style="padding: 0;">
                            <div class="table-responsive">
                                <!--表格-->
                                <table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">
                                    <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>验收意见</th>
                                        <th>时间</th>
                                        <th>提交人</th>
                                        <th>附件</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(item,index) in qualityList.slice((current-1)*showItem,current*showItem)" :id="item.id">
                                        <td> {{index+1}}</td>
                                        <td class="td-content td-title">
                                            {{item.verifyOpinion}}
                                            <!--<span v-for="element in item.processTaskList">{{element.taskName}}</span>-->
                                        </td>
                                        <td>{{item.createTime}}</td>
                                        <td>
                                            <img src="../images/user.png">
                                            {{item.user.userName}}
                                        </td>
                                        <td class="td-files td-title file_name" v-if="item.accessoryList==''">
                                            未上传
                                        </td>
                                        <td class="td-files" v-else>
                                            <el-popover trigger="click" placement="bottom">
                                                <p v-for="(file,index) in item.accessoryList" :id="file.accId" class="c-pointer" @click="download(file.accId)">{{file.accName}}</p>
                                                <div slot="reference" class="name-wrapper">
                                                    <el-tag size="small">{{item.accessoryList.length}}个附件</el-tag>
                                                </div>
                                            </el-popover>
                                        </td>
                                        <td class="td-handles">
                                            <i class="fa fa-edit fa-2 td-edit"  @click="edit(index)"></i>
                                            <i class="fa fa-search fa-2 td-search" @click="look(index)"></i>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <!--分页-->
                                <div class="pages text-center">
                                    <span class="allNum">共&nbsp;
                                        <span class="theme-color">{{allNum}}</span>
                                        &nbsp;条验收内容</span>
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
                                                <!--<span class="title-name">{{lookBox.qualityNo}}</span>-->
                                                &nbsp;&nbsp;
                                                <span>查看质量关键节点</span>&nbsp;&nbsp;
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
                                                    <div class="col-xs-12">
                                                        表单:<span class="theme-color c-pointer" @click="lookUrlHtml(lookBox.formId)">
                                                            {{lookBox.formName}}
                                                        </span>
                                                        &nbsp;&nbsp;<img src="../images/file.png">
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                         关联元素:
                                                        <!--<span class="related pr_10"  v-for="element in lookBox.modelTreeList">{{element.nodeName}}</span>-->
                                                        <span class="related pr_10"  v-for="element in lookBox.processTaskList">{{element.taskName}}</span>
                                                    </div>
                                                </div>
                                                <div class="line"></div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        验收意见:
                                                        <div class="questions">
                                                            {{lookBox.verifyOpinion}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <br>
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
