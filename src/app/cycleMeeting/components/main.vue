<script>
// $(document).ready(function() {
//     //table 高度设置
//     var thisH = $(window).height();
//     var centerH=thisH -185 + 'px';
//     $(".table-responsive").css("height", centerH);
// })
// window.onresize = function() {
//     var thisH = $(window).height();
//     var centerH=thisH -195 + 'px';
//     $(".table-responsive").css("height", centerH);
// }
// 请求列表
export default {
    name:"cycle-meeting",
    data(){
        return{
            meetingList:"",
            //当前页
            current:1,
            //每页数据
            showItem:20,
            //页数
            allpage:"",
            //总个数
            allNum:0,
            //switch开关
            switchValue:false,
            //添加弹框
            dialogVisible: false,
            title:"添加会议模板",
            lookDisabled:false,
            //提交按钮
            btnsVisible:true,
            //提交按钮
            sbmBtn:"",
            upLoadData: {
                userId:userId,
                projectId:projectId,
                jwt:jwt,
            },
            // 文件的路径
            action:zyfUrl+'/acc/upload',
            fileList:[],
            //参会人员
            addPerson:"",
            filterText:"",
            //tree
            trees: {
                data: [],
                label: 'userName'
            },
            //默认选中的
            defaultChecks:[],
            //选中的tree
            checkedTrees:[],
            fileShow:true,
            //添加form
            form: {
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                meetingTemplate:'',
                meetingTemplateDate:'',
                meetingName:'',
                meetingType:'',
                meetingContent:'',
                meetingAddress:'',
                meetingTime:"",
                //defaultTime:[new Date('00:00'),new Date('23:59')],
                //meetingTimg:[new Date('00:00'),new Date('23:59')],
                startTime: '',
                endTime:'',
                //参会人员
                meetingUserList:'',
                //附件
                meetingFileList:"",
                //
                meetingTemplateList:'',
                meetingTemplateId:'',
                array:[],
                fileList:[],
                fileNum:0,
                //已有文件
                accessoryList:[],
                hasFiles:false,
            },
            rules: {
                meetingName: [
                    { required: true, message: '请输入会议名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                meetingContent: [
                    { required: true, message: '请输入会议内容', trigger: 'blur' },
                    { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
                ],
                meetingTemplate: [
                    { required: true, message: '请选择模板类型', trigger: 'change' }
                ],
                meetingType: [
                    { required: true, message: '请选择会议类型', trigger: 'change' }
                ],
                meetingTemplateDate:[
                    { required: true, message: '请选择创建时间', trigger: 'change' }
                ],
                meetingAddress: [
                    { required: false, message: '请输入会议地址', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                meetingTime: [
                    {type: 'date',required: true, message: '请选择时间', trigger: 'change' }
                ],
            },
            count: 1,
        }
    },
    mounted: function() {
        //请求数据调用
        this.getList();
    },
    methods: {
        getPerson:function(){
            //请求参会人员
            this.$http.post(zyfUrl+'/user/allUser',{
                userId:userId,
                projectId:projectId,
                jwt:jwt,
            },{
                headers:{}, emulateJSON: true
            }).then(function (result) {
                result.bodyText=JSON.parse(result.bodyText);
                this.trees.data=result.bodyText.data;
            },function (responsive) {
                console.log(responsive);
            })
        },
        //添加
        add:function(){
            var that=this;
            that.dialogVisible=true;
            that.title="添加会议模板";
            that.lookDisabled=false;
            that.btnsVisible=true;
            that.sbmBtn=1;
            that.form.meetingTemplate='';
            that.form.meetingTemplateDate='';
            that.form.meetingName='';
            that.form.meetingType='';
            that.form.meetingContent='';
            that.form.meetingAddress='';
            that.form.meetingTime='';
            //文件展示
            that.form.hasFiles=false;
            this.fileShow=true;
            //清空文件
            if(that.form.array.length!=0){
                that.$refs.upload.clearFiles();
                that.form.fileNum=0;
                that.form.array.splice(0,that.form.array.length);
            }
            //清空人员 清空tree
            if( that.checkedTrees.length!=0){
                that.$refs.tree.setCheckedKeys([]);
            }
            //调用人员
            that.getPerson();
        },
        addSubmit:function(){
            var _this=this;
            var that=this.form;
            that.startTime = that.meetingTime[0];
            that.endTime = that.meetingTime[1];
             //提交的文件ID
            that.meetingFileList=that.array.join(",");
            console.log(that.meetingFileList);
            //获取选取节点
            this.checkedTrees=this.$refs.tree.getCheckedKeys();
            that.meetingUserList=this.checkedTrees.join(",");
            console.log(that.meetingUserList);
            if(that.meetingTemplate==1){
                if(that.meetingName==""||that.meetingContent==""||that.meetingTemplate==""||that.meetingType==""||that.meetingTime==""){
//                    alert("请完善信息再提交！");
                    return false;
                }
            }else{
                if(that.meetingName==""||that.meetingContent==""||that.meetingTemplate==""||that.meetingType==""||that.meetingTemplateDate==""||that.meetingTime==""){
//                    alert("请完善信息再提交！");
                    return false;
                }
            }
            $.ajax({
                type: 'POST',
                data: that,
                url: zyfUrl+'/meetingTemplate/insertMeetingTemplate',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                    if(data.code==0){
                        _this.dialogVisible=false;
                        //刷新数据
                        _this.getList();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
        },
        //获取列表请求
        getList:function() {
            var that=this;
            this.$http.post(zyfUrl + '/meetingTemplate/selectMeetingTemplateByAll', {
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
                that.allNum=result.data.data.length;
                that.allpage=Math.ceil(that.allNum/that.showItem);
                result.data.data.forEach(function(item,index){
                    if(item.meetingStatus==0){
                        item.meetingStatus=false;
                    }else{
                        item.meetingStatus=true;
                    }
                })
                that.meetingList = result.data.data;
            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        //时间格式化
        timeChange:function(val){
            this.form.meetingTime = val;
            console.log(this.form.meetingTime);
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
        //编辑
        edit:function (index) {
            var that=this;
            that.dialogVisible=true;
            that.title="编辑会议模板";
            that.lookDisabled=false;
            that.btnsVisible=true;
            that.sbmBtn=2;
            this.fileShow=true;
            var id=that.meetingList[index].id;
            that.meetingTemplateId=id;
            //文件展示
            that.form.hasFiles=true;
            //清空文件
            if(that.form.array.length!=0){
                that.$refs.upload.clearFiles();
                that.form.fileNum=0;
                that.form.array.splice(0,that.form.array.length);
            }
            //清空人员 清空tree
            if( this.checkedTrees.length!=0){
                this.$refs.tree.setCheckedKeys([]);
            }
            //通过id获取数据
            this.$http.post(zyfUrl + '/meetingTemplate/selectMeetingTemplateById',
                {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    meetingTemplateId:id
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
                that.form.meetingTemplateId=that.editList.id;
                that.form.meetingTemplate=that.editList.meetingTemplate;
                that.form.meetingTemplateDate=that.editList.meetingTemplateDate;
                that.form.meetingName=that.editList.meetingName;
                that.form.meetingType=that.editList.meetingType;
                that.form.meetingContent=that.editList.meetingContent;
                that.form.meetingAddress=that.editList.meetingAddress;
                that.form.meetingTime=[that.editList.meetingStartTime,that.editList.meetingEndTime];
                that.form.accessoryList=that.editList.accessoryList;
                //渲染已有的人员
                var arr=[];
                that.editList.userList.forEach(function(item,index){
                   arr.push(Number(item.userId));
                })
                this.$refs.tree.setCheckedKeys(arr);
                //this.trees.data=that.editList.userList;
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
            that.startTime = that.meetingTime[0];
            that.endTime = that.meetingTime[1];
            //提交的文件ID
            //追加上已有文件的Id
            that.accessoryList.forEach(function(item,index){
                that.array.push(item.accId);
            })
            that.meetingFileList=that.array.join(",");
            console.log(that.meetingFileList);
            //获取选取节点
            this.checkedTrees=this.$refs.tree.getCheckedKeys();
            that.meetingUserList=this.checkedTrees.join(",");
            console.log(that.meetingUserList);
            if(that.meetingTemplate==1){
                if(that.meetingName==""||that.meetingContent==""||that.meetingTemplate==""||that.meetingType==""||that.meetingTime==""){
//                    alert("请完善信息再提交！");
                    return false;
                }
            }else{
                if(that.meetingName==""||that.meetingContent==""||that.meetingTemplate==""||that.meetingType==""||that.meetingTemplateDate==""||that.meetingTime==""){
//                    alert("请完善信息再提交！");
                    return false;
                }
            }
            $.ajax({
                type: 'POST',
                data: that,
                url: zyfUrl+'/meetingTemplate/updateMeetingTemplateById',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                    if(data.code==0){
                        _this.dialogVisible=false;
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
            var that=this;
            that.dialogVisible=true;
            that.title="查看会议";
            that.lookDisabled=true;
            that.btnsVisible=false;
            this.fileShow=false;
            var id=that.meetingList[index].id;
            that.meetingTemplateId=id;
            //文件展示
            that.form.hasFiles=true;
            //通过id获取数据
            this.$http.post(zyfUrl + '/meetingTemplate/selectMeetingTemplateById',
                {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    meetingTemplateId:id
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
                that.form.meetingTemplateId=that.editList.id;
                that.form.meetingTemplate=that.editList.meetingTemplate;
                that.form.meetingTemplateDate=that.editList.meetingTemplateDate;
                that.form.meetingName=that.editList.meetingName;
                that.form.meetingType=that.editList.meetingType;
                that.form.meetingContent=that.editList.meetingContent;
                that.form.meetingAddress=that.editList.meetingAddress;
                that.form.meetingTime=[that.editList.meetingStartTime,that.editList.meetingEndTime];
                that.form.accessoryList=that.editList.accessoryList;
                //渲染已有的人员
                var arr=[];
                that.editList.userList.forEach(function(item,index){
                   arr.push(Number(item.userId));
                })
                //设置选择的
                this.$refs.tree.setCheckedKeys(arr);
                this.trees.data=that.editList.userList;
            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        //删除会议
        deleteMeeting:function(index){
            this.$confirm('将永久删除该会议模板, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认调用
                this.$http.post(zyfUrl + '/meetingTemplate/deleteMeetingTemplateById',{
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    meetingTemplateId:index
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                // 这里是处理正确的回调
                result.bodyText=JSON.parse(result.bodyText);
                console.log(result.bodyText.code);
                if(result.bodyText.code==0){
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //刷新数据
                    this.getList();
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
        //启用请求
        switchTest:function(index){
            var that=this;
            console.log(that.meetingList[index].meetingStatus)
            if(that.meetingList[index].meetingStatus==false){
                that.meetingList[index].meetingStatus=0;
            }else{
                 that.meetingList[index].meetingStatus=1;
            }
            $.ajax({
                type: 'POST',
                data: {
                    meetingTemplateId:that.meetingList[index].id,
                    status:that.meetingList[index].meetingStatus
                },
                url: zyfUrl+'/meetingTemplate/updateMeetingTemplateById',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                    if(data.code==0){
                        //刷新数据
                        that.getList();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
        },
        //trees
        //checked改变事件
        handleCheckChange(data, checked, indeterminate) {
            //console.log(data, checked, indeterminate);
            // if(checked){
            //     this.checkedTrees.push(data.userId);
            // }else{
            //     this.checkedTrees.pop(data.userId);
            // }
        },
        handleNodeClick(data) {
            console.log(data);
        },
        //过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.userName.indexOf(value) !== -1;
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
      }
    }
}
</script>

<template>
    <main id="root" class="app-main">
        <div class="wrap">
            <cycleMeeting></cycleMeeting>
        </div><!-- .wrap -->
    </main>
</template>
<template>
  <section class="app-content layout-center" id="cycle-meeting">
        <!--相应内容-->
        <div class="list-content">
            <div class="row">
                <div class="col-md-12" style="padding-right: 0;">
                    <div class="widget">
                        <header class="widget-header">
                            <div class="row">
                                <div class="col-xs12">
                                    <div class="pull-right">
                                        <el-button type="text" @click="add()" class="el-button--primary">添加会议模板</el-button>
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
                                <!--内容-->
                                <el-form :model="form" :rules="rules" ref="form">
                                    <el-form-item label="模板类型:" prop="meetingTemplate">
                                        <el-select v-model="form.meetingTemplate" placeholder="请选择模板类型" :disabled="lookDisabled">
                                            <el-option label="每天会议" value="1"></el-option>
                                            <el-option label="每周会议" value="2"></el-option>
                                            <el-option label="每月会议" value="3"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="创建时间:" prop="meetingTemplateDate" v-show="form.meetingTemplate==2">
                                        <el-select v-model="form.meetingTemplateDate" placeholder="请选择创建时间" :disabled="lookDisabled">
                                            <el-option label="星期一" value="1"></el-option>
                                            <el-option label="星期二" value="2"></el-option>
                                            <el-option label="星期三" value="3"></el-option>
                                            <el-option label="星期四" value="4"></el-option>
                                            <el-option label="星期五" value="5"></el-option>
                                            <el-option label="星期六" value="6"></el-option>
                                            <el-option label="星期日" value="7"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="创建时间:" prop="meetingTemplateDate" v-show="form.meetingTemplate==3">
                                        <el-select v-model="form.meetingTemplateDate" placeholder="请选择创建时间" :disabled="lookDisabled">
                                            <el-option label="1" value="1"></el-option>
                                            <el-option label="2" value="2"></el-option>
                                            <el-option label="3" value="3"></el-option>
                                            <el-option label="4" value="4"></el-option>
                                            <el-option label="5" value="5"></el-option>
                                            <el-option label="6" value="6"></el-option>
                                            <el-option label="7" value="7"></el-option>
                                            <el-option label="8" value="8"></el-option>
                                            <el-option label="9" value="9"></el-option>
                                            <el-option label="10" value="10"></el-option>
                                            <el-option label="11" value="11"></el-option>
                                            <el-option label="12" value="12"></el-option>
                                            <el-option label="13" value="13"></el-option>
                                            <el-option label="14" value="14"></el-option>
                                            <el-option label="15" value="15"></el-option>
                                            <el-option label="16" value="16"></el-option>
                                            <el-option label="17" value="17"></el-option>
                                            <el-option label="18" value="18"></el-option>
                                            <el-option label="19" value="19"></el-option>
                                            <el-option label="20" value="20"></el-option>
                                            <el-option label="21" value="21"></el-option>
                                            <el-option label="22" value="22"></el-option>
                                            <el-option label="23" value="23"></el-option>
                                            <el-option label="24" value="24"></el-option>
                                            <el-option label="25" value="25"></el-option>
                                            <el-option label="26" value="26"></el-option>
                                            <el-option label="27" value="27"></el-option>
                                            <el-option label="28" value="28"></el-option>
                                            <el-option label="29" value="29"></el-option>
                                            <el-option label="30" value="30"></el-option>
                                            <el-option label="31" value="31"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="会议名称:" prop="meetingName">
                                        <el-input type="text" v-model="form.meetingName" placeholder="请输入会议名称" :disabled="lookDisabled"></el-input>
                                    </el-form-item>
                                    <el-form-item label="会议类型:" prop="meetingType">
                                        <el-select v-model="form.meetingType" placeholder="请选择会议类型" :disabled="lookDisabled">
                                            <el-option label="质量例会" value="1"></el-option>
                                            <el-option label="安全例会" value="2"></el-option>
                                            <el-option label="工程例会" value="3"></el-option>
                                            <el-option label="业主例会" value="4"></el-option>
                                            <el-option label="三同步例会" value="5"></el-option>
                                            <el-option label="设计协调会" value="6"></el-option>
                                            <el-option label="项目部例会" value="7"></el-option>
                                            <el-option label="项目部临时会议" value="8"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="会议内容:" prop="meetingContent">
                                        <el-input type="textarea" v-model="form.meetingContent" placeholder="请输入会议内容" :disabled="lookDisabled"></el-input>
                                    </el-form-item>
                                    <el-form-item label="会议地址:" prop="meetingAddress">
                                        <el-input type="text" v-model="form.meetingAddress" placeholder="请输入会议地址" :disabled="lookDisabled"></el-input>
                                    </el-form-item>
                                    <el-form-item label="参会人员:" prop="meetingUserList" class="sel-input">
                                        <el-input type="text" placeholder="请输入人员名称查找" v-model="filterText"></el-input>
                                    </el-form-item>
                                    <!--<el-form-item label="参会人员:" prop="person">
                                        <el-input type="text" v-model="form.person" placeholder="请输入人员名称"></el-input>
                                    </el-form-item>-->
                                    <div class="sel-persons">
                                        <div class="borderStyle">
                                            <!--人员tree-->
                                            <el-tree :props="trees" ref="tree" :filter-node-method="filterNode"
                                            show-checkbox  @check-change="handleCheckChange" :data="trees.data" 
                                            :default-checked-keys="defaultChecks" node-key="userId">
                                            </el-tree>
                                        </div>
                                    </div>
                                    <!-- arrow-control-->
                                    <el-form-item label="参会时间:" prop="meetingTime">
                                        <el-time-picker arrow-control
                                            is-range  format="HH:mm" value-format="HH:mm"  @change="timeChange"
                                            v-model="form.meetingTime"
                                            range-separator="-"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            placeholder="选择时间范围">
                                        </el-time-picker>
                                    </el-form-item>
                                    <el-form-item label="上传附件:" prop="files">
                                        <!--文件上传-->
                                        <el-upload  ref="upload"
                                            class="upload-demo"
                                            :action="action"
                                            :data="upLoadData"
                                            :on-change="handleChange"
                                            :on-success="uploadSuccess"
                                            :on-error="uploadError"
                                            :on-remove="handleRemove"
                                            :before-remove="beforeRemove"
                                            :before-upload="beforeUpload"
                                            multiple v-show="fileShow"
                                            :file-list="form.fileList">
                                            <el-button size="small">
                                                <img src="../images/up.png" class="up_img">
                                                上传文件
                                            </el-button>
                                            <div slot="tip" class="el-upload__tip c_9">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
                                        </el-upload>
                                        <!--编辑时已有的文件-->
                                        <ul class="el-upload-list el-upload-list--text" v-show="form.hasFiles">
                                            <li tabindex="0" class="el-upload-list__item is-success"  v-for="(file,index) in form.accessoryList" :id="file.accId" @click="download(file.accId)">
                                                <a class="el-upload-list__item-name">
                                                    <i class="el-icon-document"></i>
                                                    {{file.accName}}
                                                </a>
                                                <i class="el-icon-close" @click="deleteFile(index)"  v-show="fileShow"></i>
                                            </li>
                                        </ul>
                                    </el-form-item>
                                </el-form>
                                <span slot="footer" class="dialog-footer" v-show="btnsVisible">
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
                                        <th>会议名称</th>
                                        <th>会议地点</th>
                                        <th>会议类型</th>
                                        <th>模板类型</th>
                                        <th>发起人</th>
                                        <th>时间</th>
                                        <th>会议附件</th>
                                        <th>启用</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(item,index) in meetingList.slice((current-1)*showItem,current*showItem)" :id="item.id">
                                        <td> {{index+1}}</td>
                                        <td class="td-content td-title">
                                            {{item.meetingName}}
                                        </td>
                                        <td>{{item.meetingAddress}}</td>
                                        <td v-if="item.meetingType=='1'">质量例会</td>
                                        <td v-else-if="item.meetingType=='2'">安全例会</td>
                                        <td v-else-if="item.meetingType=='3'">工程例会</td>
                                        <td v-else-if="item.meetingType=='4'">业主例会</td>
                                        <td v-else-if="item.meetingType=='5'">三同步例会</td>
                                        <td v-else-if="item.meetingType=='6'">设计协调会</td>
                                        <td v-else-if="item.meetingType=='7'">项目部例会</td>
                                        <td v-else-if="item.meetingType=='8'">项目部临时会议</td>
                                        <td v-if="item.meetingTemplate=='1'">每天会议</td>
                                        <td v-else-if="item.meetingTemplate=='2'">每周会议</td>
                                        <td v-else-if="item.meetingTemplate=='3'">每月会议</td>
                                        <td>
                                            <img src="../images/user.png">
                                            {{item.meetingCreateUser}}
                                        </td>
                                        <td>{{item.meetingStartTime}}~{{item.meetingEndTime}}</td>
                                        <td class="td-files td-title file_name" v-if="item.accessoryList==''">
                                            未上传
                                        </td>
                                        <td class="td-files" v-else>
                                            <el-popover trigger="click" placement="bottom">
                                                <p v-for="(file,index) in item.accessoryList" @click="download(file.accId)" class="c-pointer">{{file.accName}}</p>
                                                <div slot="reference" class="name-wrapper">
                                                    <el-tag size="small">{{item.accessoryList.length}}个附件</el-tag>
                                                </div>
                                            </el-popover>
                                        </td>
                                        <td>
                                            <div class="inline-block">
                                                <!--<el-switch v-model="switchValue"></el-switch>-->
                                                    <el-switch @change="switchTest(index)" v-model="item.meetingStatus"></el-switch>
                                                
                                                <!--<template slot-scope="scope">
                                                    <el-switch v-model="scope.row.on"
                                                        on-value="1" off-value="0"
                                                        @change="changeSwitch(scope.row)">
                                                    </el-switch>
                                                </template>-->
                                                <!--<input id="switch-1" type="checkbox" data-switchery data-size="small" checked />-->
                                            </div>
                                        </td>
                                        <td class="td-handles">
                                            <i class="fa fa-edit fa-2 td-edit"  @click="edit(index)"></i>
                                            <i class="fa fa-search fa-2 td-search" @click="look(index)"></i>
                                            <i class="fa fa-trash-o fa-2 fa-fw" @click="deleteMeeting(item.id)"></i>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <!--分页-->
                                <div class="pages text-center">
                                    <span class="allNum">共&nbsp;
                                        <span class="theme-color">{{allNum}}</span>
                                        &nbsp;条内容</span>
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

*/
