
<script>
var demoEvents = [
]
// 请求列表
export default {
    name:"meeting-calendar",
    data(){
        return{
            //当前页
            current:1,
            //每页数据
            showItem:10,
            //页数
            allpage:"",
            //总个数
            allNum:0,
            //switch开关
            switchValue:true,
            // 日历事件
            fcEvents:demoEvents,
            //添加弹框
            dialogVisible: false,
            title:"添加会议",
            lookDisabled:false,
            //提交按钮
            btnsVisible:true,
            //提交按钮
            sbmBtn:"",
            //文件的携带参数
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
            //会议Id
            meetingId:"",
            //添加form
            form: {
                //传参
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                meetingName:'',
                meetingType:'',
                meetingContent:'',
                meetingAddress:'',
                meetingDate:'',
                meetingTime: '',
                startTime:'',
                endTime:'',
                //参会人员
                meetingUserList:'',
                //附件
                meetingFileList:'',
                //用到的
                array:[],
                fileList:[],
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
                meetingType: [
                    { required: true, message: '请选择会议类型', trigger: 'change' }
                ],
                meetingAddress: [
                    { required: false, message: '请输入会议地址', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                meetingDate:[
                    {type: 'date',required: true, message: '请选择日期', trigger: 'change' }
                ],
                meetingTime: [
                    {type: 'date',required: true, message: '请选择时间', trigger: 'change' }
                ],
            },
            count: 1,
        }
    },
    mounted: function() {
        //请求
        this.getList();
        // $(".more-link").html("+");
        // console.log("------------"+$(".more-link").text())
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
        //获取列表请求
        getList:function() {
            var that=this;
            //获取会议模板
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
                var lists=result.bodyText.data;
                var showList=[];
                result.data.data.forEach(function(item,index){
                    if(item.meetingStatus==1){
                        showList.push(item);
                    }
                })
                console.log(showList);
                showList.forEach(function(item,index){
                    //追加事件
                    var one={
                        id:item.id,
                        title : item.meetingName,
                        start : item.meetingStartTime,
                        end : item.meetingEndTime,
                        backgroundColor:"#f00" 
                    };
                    demoEvents.push(one);

                })
            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
            //获取会议
            this.$http.post(zyfUrl + '/meeting/selectMeetingByAll', {
                userId:userId,
                projectId:projectId,
                jwt:jwt,
            }, {
                headers: {
                },
                emulateJSON: true
            }).then(function(result) {
                // 这里是处理正确的回调
                result.bodyText=JSON.parse(result.bodyText);
                console.log(result.bodyText.data);
                var lists=result.bodyText.data;
                lists.forEach(function(item,index){
                    //追加事件
                    var one={
                        id:item.id,
                        title : item.meetingName,
                        start : item.meetingStartTime,
                        end : item.meetingEndTime,
                        backgroundColor:"#f00" 
                    };
                    demoEvents.push(one);

                })

            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        //添加
        add:function(){
            var _this=this;
            var that=this.form;
            _this.dialogVisible=true;
            _this.title="添加会议";
            _this.lookDisabled=false;
            _this.btnsVisible=true;
            _this.sbmBtn=1;
            //清空内容
            that.meetingName='';
            that.meetingType='';
            that.meetingContent='';
            that.meetingAddress='';
            that.meetingDate='';
            that.meetingTime='';
            that.startTime='';
            that.endTime='';
            that.hasFiles=false;
            this.fileShow=true;
            //清空文件
            if(that.array.length!=0){
                _this.$refs.upload.clearFiles();
                that.array.splice(0,that.array.length);
            }
            //清空人员 清空tree
            if( _this.checkedTrees.length!=0){
                this.$refs.tree.setCheckedKeys([]);
            }
            this.getPerson();
        },
        //分页
        goto:function(index){
            if(index == this.current) return;
            this.current = index;
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
        //添加提交
        addSubmit:function(){
            var _this=this;
            var that=this.form;
            that.startTime=that.meetingDate[0]+" "+that.meetingTime[0];
            console.log(that.startTime);
            that.endTime=that.meetingDate[1]+" "+that.meetingTime[1];
            //提交的文件ID
            that.meetingFileList=that.array.join(",");
            console.log(that.meetingFileList);
            //获取选取节点
            //this.checkedTrees=this.$refs.tree.getCheckedKeys();
            that.meetingUserList=this.checkedTrees.join(",");
            console.log(that.meetingUserList);
            console.log(that);
            if(that.meetingName==""||that.meetingType==""||that.meetingContent==""||that.meetingDate==""||that.meetingTime==""){
//                alert("请完善信息再提交！");
                return false;
            }else{
                $.ajax({
                    type: 'POST',
                    data: that,
                    url: zyfUrl+'/meeting/insertMeerting',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        console.log(data);
                        if(data.code==0){
                            _this.dialogVisible=false;
                            //清空
                            if(demoEvents.length!=0){
                                demoEvents.splice(0,demoEvents.length);
                            }
                            //刷新数据
                            _this.getList();
                        // _this.$refs.upload.clearFiles();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error ' + textStatus + ' ' + errorThrown);
                    }
                });
            }
        },
        //more
        // 'moreClick' (event, jsEvent, pos) {
        //     console.log(event)
        // },
        //点击事件
        'eventClick' (event, jsEvent, pos) {
            var _this=this;
            var that=this.form;
            _this.dialogVisible=true;
            _this.title="查看会议";
            _this.lookDisabled=true;
           _this.btnsVisible=false;
           that.hasFiles=true;
           this.fileShow=false;
            console.log('eventClick', event, jsEvent, pos);
            _this.meetingId=event.id;
            //通过id获取数据
            this.$http.post(zyfUrl + '/meeting/selectMeeting',
                {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    meetingId:event.id
                }, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                // 这里是处理正确的回调
                //console.log(result.bodyText);
                result.bodyText=JSON.parse(result.bodyText);
                var lookList=result.bodyText.data;
                console.log(lookList);
                that.meetingName=lookList.meetingName;
                that.meetingType=lookList.meetingType;
                that.meetingContent=lookList.meetingContent;
                that.meetingAddress=lookList.meetingAddress;
                var start=lookList.meetingStartTime.split(" ");
                var end=lookList.meetingEndTime.split(" ");
                that.meetingDate=[start[0], end[0]];
                that.meetingTime=[start[1], end[1]];
                that.accessoryList=lookList.accessoryList;
                //渲染已有的人员
                var arr=[];
                lookList.userList.forEach(function(item,index){
                   arr.push(Number(item.userId));
                })
                this.$refs.tree.setCheckedKeys(arr);
                this.trees.data=lookList.userList;
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
                this.$http.post(zyfUrl + '/meeting/deleteMeetingById',{
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    meetingId:this.meetingId
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
                    this.dialogVisible=false;
                    //清空
                    if(demoEvents.length!=0){
                        demoEvents.splice(0,demoEvents.length);
                    }
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
        //trees
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
            if(checked){
                this.checkedTrees.push(data.userId);
            }else{
                this.checkedTrees.pop(data.userId);
            }
        },
        handleNodeClick(data) {
            console.log(data);
        },
        //时间格式化
        dateChange:function(val){
            this.form.meetingDate = val; 
        },
        timeChange:function(val){
            this.form.meetingTime = val; 
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
    components : {
        //'full-calendar': require('../js/vue-fullcalendar.js')	
        'full-calendar': require('vue-fullcalendar')	
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
            <meetingCalendar></meetingCalendar>
        </div><!-- .wrap -->
    </main>
</template>
<template>
<section class="app-content layout-center" id="meeting-calendar">
		<div class="row">
			<div class="col-md-1">
				<div class="app-action-panel" id="calendar-action-panel">
					<div class="action-panel-toggle" data-toggle="class" data-target="#calendar-action-panel" data-class="open">
						<i class="fa fa-chevron-right"></i>
						<i class="fa fa-chevron-left"></i>
					</div><!-- .app-action-panel -->
					
					<div class="m-b-lg">
                        <el-button type="text" @click="add()" class="el-button--primary primary backg-color btn-block" style="width:80px;">添加会议</el-button>
						<!--<a href="#" data-toggle="modal" data-target="#new_event_cat_modal" class="btn primary backg-color btn-block">添加会议</a>-->
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
                            <div class="sel-persons">
                                <div class="borderStyle">
                                    <!--人员tree-->
                                    <el-tree :props="trees" ref="tree" :filter-node-method="filterNode"
                                    show-checkbox  @check-change="handleCheckChange" :data="trees.data" 
                                    :default-checked-keys="defaultChecks" node-key="userId">
                                    </el-tree>
                                </div>
                            </div>
                            <el-form-item label="参会日期:" prop="meetingDate">
                                <el-date-picker v-model="form.meetingDate"
                                    type="daterange"  format="yyyy-MM-dd" value-format="yyyy-MM-dd"  @change="dateChange" 
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"  :disabled="lookDisabled">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="参会时间:" prop="meetingTime">
                                <el-time-picker  type="fixed-time" is-range arrow-control
                                    v-model="form.meetingTime"   format="HH:mm" value-format="HH:mm"
                                    range-separator="-"   @change="timeChange"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    placeholder="选择时间范围" :disabled="lookDisabled">
                                </el-time-picker>
                                <!--<el-time-picker  type="fixed-time" is-range 
                                    v-model="form.meetingTime"
                                    range-separator="-" value-format="HH:mm"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    placeholder="选择时间范围" :disabled="lookDisabled">
                                </el-time-picker>-->
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
                                    <li tabindex="0" class="el-upload-list__item is-success"  v-for="(file,index) in form.accessoryList" :id="file.accId">
                                        <a class="el-upload-list__item-name c-pointer"  @click="download(file.accId)" v-show="!fileShow">
                                            <i class="el-icon-document"></i>
                                            {{file.accName}}
                                        </a>
                                        <!--<i class="el-icon-download down_img" aria-hidden="true" @click="download(file.accId)" v-show="!fileShow"></i>-->
                                        <!--<i class="el-icon-close" disabled></i>-->
                                    </li>
                                </ul>
                            </el-form-item>
                            <!--<el-form-item class="pull-right">
                                <el-button @click="deleteMeeting()" type="primary" v-show="!btnsVisible" class="pb_20">删除会议</el-button>
                            </el-form-item>-->
                        </el-form>
                        <span slot="footer" class="dialog-footer" v-show="!btnsVisible">
                            <el-button type="primary" @click="deleteMeeting()">删除会议</el-button>
                        </span>
                        <span slot="footer" class="dialog-footer" v-show="btnsVisible">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="addSubmit()" v-if="sbmBtn==1">添加提交</el-button>
                            <!--编辑-->
                            <!--<el-button type="primary" @click="editSubmit()" v-else="sbmBtn==2">提交</el-button>-->
                        </span>
                    </el-dialog>
					<div class="app-actions-list scrollable-container">
						<!--<div id="external-events" class="m-b-lg">
							<div data-class="warning" class="warning external-event">质量例会</div>
							<div data-class="danger" class="danger external-event">安全例会</div>
							<div data-class="success" class="success external-event">工程例会</div>
							<div data-class="info" class="info external-event">其他例会</div>-->
							<!--<div data-class="pink" class="pink external-event">My Event 4</div>-->

						<!--</div>-->
						<!--<div class="checkbox checkbox-primary">-->
							<!--<input type="checkbox" id="drop-remove"/>-->
							<!--<label for="drop-remove">remove after drop ?</label>-->
						<!--</div>-->
					</div><!-- .app-actions-list -->
				</div><!-- .app-action-panel -->
			</div><!-- END column -->

			<div class="col-md-12">
                <full-calendar :events="fcEvents" @eventClick="eventClick" lang='zh' eventLimit='true' eventLimitText='Something'></full-calendar>
			</div><!-- END column -->
		</div><!-- .row -->
	</section><!-- .app-content -->

 </template>


<style scoped>
    .app-main{
        margin-top: 60px;
        margin-bottom: 15px;
    }
    .app-footer{
        padding: 0;
    }
</style>

