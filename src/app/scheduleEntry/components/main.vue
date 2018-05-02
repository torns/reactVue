<script>
var zNodes;
//$(document).ready(function() {
//    var totleHeight=window.screen.height-240 +'px';
//    $('.widget').css('height',totleHeight);
//});
//window.onresize = function() {
//    var totleHeight=window.screen.height-240 +'px';
//    $('.widget').css('height',totleHeight);
//};
export default {
    name:'',
    data(){
        return {
            // 日期选择
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            // 表单验证与取值
            ruleForm:{
                ucid:'',
                status:'',
                workNumber:'1',
                desc:'',
                dateTime:'',
                actionUrl:zyfUrl+'/scheduleProcess/insertProcessAccessory'+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt
//                ground:''
            },
            rules:{
                ucid:[
                    { required: true, message: '请输入元素编号', trigger: 'blur' }
                ],
                status:[
                    {required: true, message: '请选择状态', trigger: 'change' }
                ],
                workNumber:[
                    {required: false, message: '请输入完成工作量', trigger: 'blur'}
                ],
                desc:[
                     {required: false, message: '请输入完成工作量', trigger: 'blur'}
                ],
                dateTime:[
                    {required: true, message: '请选择录入时间', trigger: 'change'} 
                ]
//                ground:[
//                    {required: true, message: '请选择场地仓位', trigger: 'change'}
//                ]
            },
            relatedVisible:false,
            ucode:'',
            // 文件上传
            uploadId:'',
            fileList:[],
            upLoadData:{
                scheduleProcessId:'',
                userId:userId,
                jwt:jwt,
                projectId:projectId,
            }
        }
    },
    mounted:function () {
        $.ajax({
            type: 'POST',
            data: {
                modelId:"1",
                projectId:"1",
                userId:userId,
                jwt:jwt
            },
            url: zyfUrl+'/model/getTreeHeader',
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

    },
    methods:{
        // 上传前对文件的判断
        beforeUpload:function(file) {
            const isLt500M = file.size / 1024 / 1024 < 500
            this.fileNum++;
            if (!isLt500M) {
                return this.$confirm('文件大小不能超过 500MB!');
            }
            return isLt500M
        },
        // 文件上传功能
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleChange(value) {
            console.log(value);
        },
//        成功回调
        uploadSuccess(response, file, fileList){
            console.log('上传文件', response);
        },
        // 上传错误
        uploadError:function(response, file, fileList) {
            console.log('上传失败，请重试！')
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
//        添加关联元素
        oppRelatedVisible:function () {
            var that=this;
            this.relatedVisible=true;
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
                        idKey: "id",
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
//                    autoCheckTrigger: true,
//                    nocheckInherit: true,
//                    chkDisabledInherit: true,
                    chkStyle: 'radio',
                    radioType:'all',
                    chkboxType: {
                        "Y": "",
                        "N": ""
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
                that.ucode=treeNode.id;
//                console.log(that.ruleForm.ucid);
//                console.log(treeNode.id);

            }
            function filter(treeId, parentNode, childNodes) {
                childNodes=childNodes.data;
                console.log(childNodes);
                return childNodes;
            }
            function onAsyncSuccess(event, treeId, treeNode, msg) {
                console.log(event);
                console.log(msg);
                var zTree = $.fn.zTree.getZTreeObj("treeDemos");
                zTree.updateNode(treeNode);
            }

            setTimeout(function () {
                $(document).ready(function () {
                    $.fn.zTree.init($("#treeDemos"), settingAdd, zNodes);/*空间结构*/
                });
            },1500);

        },
//      添加附件
        addFile:function () {
            var that = this;
            that.$http.post(zyfUrl+'/scheduleProcess/insertProcessAccessory',{
                userId:userId,
                jwt:jwt,
                projectId:projectId,
            },{
                headers:{

                },
                emulateJSON: true
            }).then(function (result) {
                this.uploadId=result.body.data;
            },function (responsive) {
                console.log(responsive);
            })
        },

    //   表单提交
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  var that = this;
                  that.$http.post(zyfUrl+'/scheduleProcess/insertProcess',{
                      userId:userId,
                      jwt:jwt,
                      projectId:projectId,
                      scheduleProcessTime:this.ruleForm.dateTime,
                      scheduleProcess:JSON.stringify({
                          structureId:this.ruleForm.ucid,
                          structureStatu:this.ruleForm.status,
                          structureScale:this.ruleForm.workNumber,
                          remark:this.ruleForm.desc
                      })
                  },{
                      headers:{},
                      emulateJSON: true
                  }).then(function (result) {
                      if(result.body.code==10000){
                          this.$message({message: '添加成功', type: 'success'});
                          this.upLoadData.scheduleProcessId=result.body.data;
                          this.submitUpload();
                      }else{
                          responsive(result.body.code,that)
                      }
                  },function (responsive) {
                      console.log(responsive);
                  })
              } else {
                  return false;
              }
          });
      },
        submitRelated:function(){
            var that=this;
            that.ruleForm.ucid=that.ucode;
            that.relatedVisible = false;
        },
        //时间格式化
        dateChange:function(val){
            new Date(val);
            this.ruleForm.dateTime =Date.parse(new Date(val));
        },
    }
}
</script>

<template>
<!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap">
            <section class="app-content">
                <!--相应内容-->
                <div class="entry-progress">
                    <div class="row">
                        <div class="col-md-12" style="padding-right: 0;">
                            <div class="widget">
                                <header class="widget-header">
                                    <div>录入进度</div>
                                    <hr class="widget-separator">
                                </header>
                                <div class="widget-body" style="padding: 0;">
                                    <div class="row">
                                        <div class="col-md-6 col-xs-offset-3 modal-body">
                                            <div class="addProblem c_6">
                                            
                                                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                                    <el-form-item label="元素编号" prop="ucid">
                                                        <el-input v-model="ruleForm.ucid" disabled>元素编号:
                                                            <el-button slot="append" @click="oppRelatedVisible()">选择元素</el-button>
                                                        </el-input>
                                                    </el-form-item>
                                                    <el-form-item label="选择状态" prop="status">
                                                        <el-select v-model="ruleForm.status" placeholder="请选择状态">
                                                            <el-option label="轻微" value="0"></el-option>
                                                            <el-option label="一般" value="1"></el-option>
                                                            <el-option label="严重" value="2"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item label='完成工作量' prop='workNumber'>
                                                        <el-input-number v-model="ruleForm.workNumber" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
                                                    </el-form-item>
                                                     <el-form-item label="上传附件">
                                                        <el-upload
                                                                ref="upload"
                                                                class="upload-demo"
                                                                :action="ruleForm.actionUrl"
                                                                :on-preview="handlePreview"
                                                                :on-remove="handleRemove"
                                                                :on-success="uploadSuccess"
                                                                :on-error="uploadError"
                                                                :before-upload="beforeUpload"
                                                                :data="upLoadData"
                                                                :auto-upload="false"
                                                                multiple
                                                                :limit="3"
                                                                :on-exceed="handleExceed"
                                                                :file-list="fileList">
                                                            <el-button size="small" type="primary">点击上传</el-button>
                                                            <div slot="tip" class="el-upload__tip">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
                                                        </el-upload>
                                                    </el-form-item>
                                                    <el-form-item label="活动形式" prop="desc">
                                                        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="录入时间" prop="dateTime">
                                                        <el-date-picker
                                                            v-model="ruleForm.dateTime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            default-value="2010-10-01" @change="dateChange">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                    <!--<el-form-item label="场地仓位" prop="ground">-->
                                                        <!--<el-select v-model="ruleForm.ground" placeholder="请选择状态">-->
                                                            <!--<el-option label="11" value="33"></el-option>-->
                                                            <!--<el-option label="22" value="22"></el-option>-->
                                                            <!--<el-option label="33" value="11"></el-option>-->
                                                        <!--</el-select>-->
                                                    <!--</el-form-item>-->
                                                    <el-form-item>
                                                         <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                                                        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </div>
                                    </div>
                                </div><!-- .widget-body -->
                            </div>
                        </div>
                    </div>
                </div>
            </section><!-- .app-content -->
        </div><!-- .wrap -->
        <!--关联弹窗-->
        <el-dialog class="look-modal related-center" :visible.sync="relatedVisible" width="40%">
            <div class="modal-header primary backg-color">
                <h4 class="modal-title">选择关联元素</h4>
            </div>
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <ul class="nav nav-tabs">
                            <li role="presentation" class="related-element"><a href="javascript:void(0)">构件</a></li>
                            <!--<li role="presentation" class="related-room" @click="relatedTree()"><a href="javascript:void(0)">空间结构</a></li>-->
                            <!--<li role="presentation" class="related-task" v-bind:class="{ active: isActive2}"  @click="relatedTask()"><a href="javascript:void(0)">任务</a></li>-->
                        </ul>
                    </div>
                    <div class="row">
                        <!--左侧-->
                        <div class="col-sm-12">
                            <!--<el-input placeholder="输入关键字进行查找" v-model="filterText"></el-input>-->
                            <div class="borderStyle">
                                <!--结构树-->
                                <ul class="ztree modal-ztree" id="treeDemos" style="height: 218px;"></ul>
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
    </main>
<!--</div>-->
</template>

<style scoped>
    .app-main{
        margin-top: 60px;
        margin-bottom: 25px;
    }
    .widget{
        height: 640px;
    }
</style>


