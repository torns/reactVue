<script>
// $(document).ready(function() {
//     //table 高度设置
//     var thisH = $(window).height();
//     var centerH=thisH -215 + 'px';
//     $(".list-content").css("height", centerH);
// })
// window.onresize = function() {
//     var thisH = $(window).height();
//     var centerH=thisH -215 + 'px';
//     $(".list-content").css("height", centerH);
// }
export default {
    name:'announcement',
    data(){
        return {
        items:'',
        title:'发布公告',
        flag:1,
        dialogVisible: false,
        //当前页
        current:1,
        //每页数据
        showItem:8,
        //页数
        allpage:"",
        //总个数
        allNum:0,
        //头像
        headerSrc:"",
		headerId:"",
        headerSrc:"",
        //提交按钮
        sbmBtn:"",
        //提交按钮
        btnsVisible:true,
        //文件展示
        fileShow:true,
        upLoadData: {
            userId:userId,
            projectId:projectId,
            jwt:jwt,
        },
        // 文件的路径
        action:zyfUrl+'/acc/upload',
        //select
        addPerson:"",
        editList:"",
        select:{
            userId:userId,
            projectId:projectId,
            jwt:jwt,
            status:"",
            createUser:"",
            time:"",
            startTime:"",
            endTime:"",
            //文件Id
            noticeSaveFileList:""
        },
        /*模态框*/
        form: {
            userId:userId,
            projectId:projectId,
            jwt:jwt,
            noticeEndTime: '',
            noticeContent: '',
            //文件ID
            noticeId:'',
            //存放上传文件
            array:[],
            //已有文件
            accessoryList:[],
            hasFiles:false
        },
        rules: {
            noticeEndTime: [
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            ],
            noticeContent: [
                { required: true, message: '请输入公告内容', trigger: 'blur' },
                { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
            ]
        }
    }

    },
    mounted:function () {
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
        //请求数据调用
        this.getList();
    },
    methods:{
        //时间转换
        selectChange:function(val){
            this.select.time=val;
            console.log(val)
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
                url: zyfUrl+'/notice/selectNoticeByCondition',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data.data);
                    _this.items=data.data;
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
            that.status="",
            that.createUser="";
            that.time="";
            _this.getList();
        },
        //获取列表
        getList:function() {
            var that=this;
            this.$http.post(zyfUrl + '/notice/selectNoticeByAll', {
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
                this.items=result.data.data;
               // that.meetingList = result.data.data;
                that.allNum=result.data.data.length;
                that.allpage=Math.ceil(that.allNum/that.showItem);
                //头像
                //that.headerSrc=zyfUrl+'/acc/getPicBy/'+user.headPortrait;

            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        //删除
        del:function (index) {
            var that=this.form;
            var id=this.items[index].id;
            that.noticeId=id;
            this.$confirm('将永久删除该通知公告, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认调用
                this.$http.post(zyfUrl + '/notice/deleteNoticeById',{
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    noticeId:id
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
        //添加
        opendialog:function () {
            var _this=this;
            var that=this.form;
            this.dialogVisible=true;
            this.title='发布公告';
            this.flag=1;
            that.noticeContent='';
            that.noticeEndTime='';
           _this.sbmBtn=1;
           _this.btnsVisible=true;
           that.hasFiles=false;
           this.fileShow=false;
        },
        //添加提交
        addSubmit:function(){
            var _this=this;
            var that=this.form;
            that.startTime = that.meetingTime[0];
            that.endTime = that.meetingTime[1];
             //提交的文件ID
            that.noticeSaveFileList=that.array.join(",");
            console.log(that.noticeSaveFileList);
            if(that.noticeContent==""||that.noticeEndTime==""){
                 _this.$message({
                    message: "请完善信息再提交！",
                    type: 'warning'
                });
                return false;
            }
            $.ajax({
                type: 'POST',
                data: that,
                url: zyfUrl+'/notice/insertNotice',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.log(data);
                    if(data.code==0){
                        _this.dialogVisible=false;
//                        //刷新数据
                        _this.getList();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error ' + textStatus + ' ' + errorThrown);
                }
            });
        },
        //编辑
        edit:function (index) {
            var _this=this;
            var that=this.form;
            this.dialogVisible=true,
            this.title='编辑公告',
            this.flag=0;
            this.sbmBtn=2;
            this.btnsVisible=true;
            this.fileShow=true;
            var id=this.items[index].id;
            console.log(id);
            that.noticeId=id;
            //清空文件
            if(that.array.length!=0){
                this.$refs.upload.clearFiles();
                that.array.splice(0,that.array.length);
            }
            //文件展示
            that.hasFiles=true;
            //通过id获取数据
            this.$http.post(zyfUrl + '/notice/selectNoticeById',
                {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    noticeId:id
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                var that=this.form;
                // 这里是处理正确的回调
                console.log(result.data.data);
                _this.editList=result.data.data;
                //查看传值
                that.noticeId=_this.editList.id;
                that.noticeContent=_this.editList.noticeContent;
                that.noticeEndTime=_this.editList.noticeEndTime;
                that.accessoryList=_this.editList.accessoryList;
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
        //编辑提交
        editSubmit:function(){
            var _this=this;
            var that=this.form;
            //提交的文件ID
            //追加上已有文件的Id
            that.accessoryList.forEach(function(item,index){
                that.array.push(item.accId);
            })
            that.noticeSaveFileList=that.array.join(",");
            console.log(that.noticeSaveFileList);
            if(that.noticeContent==""||that.noticeEndTime==""){
                 _this.$message({
                    message: "请完善信息再提交！",
                    type: 'warning'
                });
                return false;
            }
            $.ajax({
                type: 'POST',
                data: that,
                url: zyfUrl+'/notice/updateNotice',
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
         //时间转换
        selectChange:function(val){
            this.select.time=val;
            console.log(val)
        },
        //时间格式化
        dateChange:function(val){
            this.form.meetingTime = val;
            console.log(this.form.meetingTime);
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

    },
}
</script>

<template>
<!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap" id="announcement">
            <section class="app-content">
                <div class="list-header">
                    <div class="row">
                        <div class="col-md-12 widget">
                            <header class="widget-header">
                                <div class="row">
                                    <div class="col-xs-2">
                                        <el-select v-model="select.status" placeholder="选择状态">
                                            <el-option value="0" label="生效中"></el-option>
                                            <el-option value="1" label="过期"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-xs-2">
                                        <el-select v-model="select.createUser" placeholder="选择发布人">
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
                                    <div class="col-xs-2">
                                        <button type="button" class="btn primary backg-color top-select" @click="topSelect()">筛选</button>
                                        <button type="button" class="btn btn-default" @click="topReset()">重置</button>
                                    </div>
                                    <div class="position-btn">
                                        <button type="button" class="btn primary backg-color" @click="opendialog">发布公告</button>
                                    </div>
                                </div>
                            </header>
                        </div>
                    </div>
                </div>
                <div class="list-content widget">
                    <div class="row">
                        <div class="col-lg-3 col-md-4 col-sm-6" v-for="(item,index) in items.slice((current-1)*showItem,current*showItem)">
                            <div class="row widget" v-bind:trd="item.id">
                                <div class="col-md-12 col-sm-12 primary backg-color" style="padding:0;">
                                    <div class="widget-body one-announce">
                                        <p>{{item.noticeContent}}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="row widget">
                                <div class="col-md-12 margin-top">
                                    <span class="avatar avatar-sm avatar-circle margin-left">
                                        <a href="#">
                                            <img class="img-responsive" v-if="item.user.headPortrait==''||item.user==''" src="./images/default-img.png"/>
							                <img class="img-responsive" v-else :src="zyfUrl+'/acc/getPicBy/'+item.user.headPortrait+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt"/>
                                        </a>
                                    </span>
                                    <!--user.userName-->
                                    <span class="position-span top-0 over-title" :title="item.user.userName">{{item.user.userName}}</span>
                                    <span class="position-span bottom-0" v-if="item.roleList.length==0"></span>
                                    <span class="position-span bottom-0" v-else>{{item.roleList[0].roleName}}</span>
                                    <span class="position-span bottom-0 right-rem theme-color">
                                        <!--附件文件.JPG-->
                                        <el-popover trigger="click" placement="bottom">
                                            <p v-for="(file,index) in item.accessoryList" @click="download(file.accId)" class="c-pointer">{{file.accName}}</p>
                                            <div slot="reference" class="name-wrapper">
                                                <el-tag size="small">{{item.accessoryList.length}}个附件</el-tag>
                                            </div>
                                        </el-popover>
                                    </span>
                                </div>
                                <div class="col-md-12 margin-top">
                                    <div class="row">
                                        <div class="col-xs-12 font-size12">
                                            <span class="margin-left pre-color b-color">●</span>
                                            <span class="pre-color">生效中</span>
                                            <span class="last-color">•</span>
                                            <span class="last-color">
                                                {{item.sustainTime}}
                                                <!--{{date | dateCount(item.noticeCreateTime,item.noticeEndTime)}}-->
                                                小时前
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12 margin-top">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <div class="position-span bottom-0 font-size12">
                                                <span class="pre-color margin-left">到期时间:  </span><span class="last-color">{{item.noticeEndTime}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12  footer-edit margin-top">
                                    <div class="row text-center">
                                        <div class="col-md-6 col-sm-6 col-xs-6" @click="del(index)"><div class="delete-icon">删除</div></div>
                                        <div class="col-md-6 col-sm-6 col-xs-6" @click="edit(index)">
                                            <div class="edit-icon">编辑</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--分页-->
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="pages text-center">
                                <span class="allNum">共&nbsp;
                                    <span class="theme-color">{{allNum}}</span>
                                    &nbsp;条通知公告</span>
                                <ul class="pagination" >
                                    <li v-show="current != 1" @click="current-- && goto(current)" ><a href="#">上一页</a></li>
                                    <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
                                        <a href="#" >{{index}}</a>
                                    </li>
                                    <li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)"><a href="#" >下一页</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <!--弹窗-->
            <el-dialog class="my-modal" :visible.sync="dialogVisible" width="40%">
                <div class="modal-header primary backg-color">
                    <div class="modal-title">
                        {{title}}
                    </div>
                </div>
                <!--内容-->
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item label="公告内容:" prop="noticeContent">
                        <el-input type="textarea" v-model="form.noticeContent" placeholder="请输入公告内容"></el-input>
                    </el-form-item>
                    <el-form-item label="截止日期:" prop="noticeEndTime">
                        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd"  @change="dateChange" type="date" v-model="form.noticeEndTime" style="width: 100%;"></el-date-picker>
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
                            multiple
                            :file-list="form.fileList">
                            <el-button size="small">
                                <img src="./images/up.png" class="up_img">
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
            <!--<el-dialog v-bind:title="title" :visible.sync="dialogVisible" width="40%">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="活动形式" prop="noticeContent">
                        <el-input type="textarea" v-model="ruleForm.noticeContent"></el-input>
                    </el-form-item>
                    <el-form-item label="截止日期"  prop="noticeEndTime">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.noticeEndTime" style="width: 100%;" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"  @change="selectChange"></el-date-picker>
                        
                    </el-form-item>
                    <el-form-item label="上传附件">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                                   :on-preview="handlePreview"
                                   :on-remove="handleRemove"
                                   :before-remove="beforeRemove"
                                   multiple
                                   :limit="3"
                                   :on-exceed="handleExceed"
                                   :file-list="fileList">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" v-if="flag==1" @click="addSubmit()">确 定1</el-button>
            <el-button type="primary" v-else="flag==0" @click="editSubmit()">确 定2</el-button>
            </span>
        </el-dialog>-->
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


