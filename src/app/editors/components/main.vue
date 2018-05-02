<script>
// import Editor from './editor';
// let parent = new Vue({
//       el: '#editor-container'
//     })
//     let editor = parent.$children[0]
//     editor.setContent(`fill your content here`);
//     editor.getContent();
//     console.log(editor.getContent());
$(document).ready(function() {
    var totleHeight=window.screen.height-240-60-20 +'px';
    $('.edit-center').css('height',totleHeight);
});
window.onresize = function() {
    var totleHeight=window.screen.height-240-60-20 +'px';
    $('.edit-center').css('height',totleHeight);
};
var addformId;
var formName;
// 请求列表
export default {
    name:"editors",
    data(){
        return{
            form: {
                name:"质量整改单",
                type:"质量整改单",
                content:""
            },
            flag:0,
            block:'',
            type:'',
            sessionId:'',
            //类型disable
            typeDis:0,//0 可选 1 编辑
            typeUnable:0
        }
    },
    mounted:function () {
//        $('div[title="Source Code"]').trigger("click");
//        url截取字符串
        var getUrlParam = function(name)
        {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r!=null) return unescape(r[2]); return null;
        };
        getUrlParam();
//        url传参数 板块、类型（添加还是编辑）、编辑ID
        this.block=getUrlParam('block');
        this.type=getUrlParam('type');
        this.sessionId=getUrlParam('sessionId');
        console.log(this.block);
        switch (this.block){
            case 'qualityProblem':
                this.form.name="质量整改单";
                this.form.type="质量整改单";
                this.typeDis=1;
                if(this.type =='add'){
                    this.flag=1;
                    var addContent='<p style="margin: 5px 0px; text-align:center;font-family: sans-serif; font-size: 16px; line-height: 23px;"><span style="font-size: 14px;"><span style="font-size: 24px;">&nbsp;<span style="font-family: 黑体;">质量检查整改单</span></span></span></p><p style="margin: 5px 0px; font-family: sans-serif; font-size: 16px; line-height: 20px;"><span style="font-size: 14px;"><span style="font-family: 宋体;">检查</span></span><span style="font-family: 宋体; font-size: 14px;">部门</span><span style="font-family: &quot;Times New Roman&quot;; font-size: 14px;"><span style="font-family: 宋体;">：</span>&nbsp;&nbsp;</span><span style="font-family: 宋体; font-size: 14px;"></span><span style="font-size: 14px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="font-family: 宋体; font-size: 14px;">&nbsp;</span><span style="font-size: 14px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<span style="font-family: 宋体;" class="pull-right">检查日期：</span></span></p><p style="margin: 5px 0px; font-family: sans-serif; font-size: 16px; line-height: 20px;"><span style="font-family: 宋体; font-size: 14px;">检查人（签字）：</span></p><table width="100%" style="margin-bottom: 10px; border-collapse: collapse; color: rgb(0, 0, 0); font-family: sans-serif; font-size: 16px;"><tbody><tr class="firstRow" style="height: 51px;"><td width="100" valign="top" style="padding: 10px 7px; border: 1px solid windowtext;"><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-family: 宋体; font-size: 14px;">整改单位</span></p></td><td width="606" valign="center" colspan="3" style="padding: 0px 7px; border: 1px solid windowtext;"></td></tr><tr style="height: 248px;"><td width="47" valign="center" style="padding: 0px 7px; border: 1px solid windowtext;"><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-family: 宋体; font-size: 14px;">存</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-family: 宋体; font-size: 14px;">在</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-family: 宋体; font-size: 14px;">问</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-family: 宋体; font-size: 14px;">题</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p></td><td width="606" valign="top" colspan="3" style="padding: 0px 7px; border: 1px solid windowtext;"></td></tr><tr style="height: 41px; break-inside: avoid;"><td width="47" valign="center" rowspan="2" style="padding: 0px 7px; border: 1px solid windowtext;"><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">整</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">改</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">计</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">划</span></p></td><td width="357" valign="center" style="padding: 0px 7px; border: 1px solid windowtext;"><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">整改措施</span></p></td><td width="87" valign="center" style="padding: 0px 7px; border: 1px solid windowtext;"><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">完成时间</span></p></td><td width="163" valign="center" style="padding: 0px 7px; border: 1px solid windowtext;"><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">责任人</span></p></td></tr><tr style="height: 122px; break-inside: avoid;"><td width="357" valign="top" style="padding: 0px 7px; border: 1px solid windowtext;"></td><td width="87" valign="top" style="padding: 0px 7px; border: 1px solid windowtext;"></td><td width="163" valign="top" style="padding: 0px 7px; border: 1px solid windowtext;"></td></tr><tr style="height: 214px;"><td width="47" valign="center" style="padding: 0px 7px; border: 1px solid windowtext;"><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">复</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">查</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">情</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">况</span></p></td><td width="606" valign="top" colspan="3" style="padding: 0px 7px; border: 1px solid windowtext;"><p style="margin: 0px; padding: 0px; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p><p style="margin: 0px; padding: 0px; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p><p style="margin: 0px; padding: 0px; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p><p style="margin: 0px; padding: 0px; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p><p style="margin: 0px; padding: 0px; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p><p style="margin: 0px; padding: 0px; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p><p style="margin: 0px; padding: 0px; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p><p style="margin: 0px; padding: 0px; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p><p style="margin: 0px; padding: 0px; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p><p style="margin: 0px; padding: 0px; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p><p style="margin: 0px; padding: 0px; line-height: 23px;"><span style="font-size: 14px;">&nbsp;</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-size: 14px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;复查人：&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 日期：</span></p><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><br></p></td></tr></tbody></table>'
                    $("iframe").contents().find("body").append(addContent);
                    //this.typeDis=0;
                }else if(this.type =='edit'){
                    this.flag=2;
                    this.getQualityForm();
                }else{
                    //查看
                    this.typeUnable=1;
                    this.flag=21;
                    this.getQualityForm();
                    $('section').css('position','relative').css('width','100%').css('height','100%');
                    $('#edit-container').append('<div style="width: 100%;height: 100%;position: absolute;z-index:999;top: 0;left: 0"></div>')
                }
                break;
            case 'qualityCheck':
                this.form.name="质量验收单";
                this.form.type="质量验收单";
                this.typeDis=1;
                if(this.type =='add'){
                    this.flag=1;
                    var addContent='<p style="margin: 5px 0px;text-align:center; font-family: sans-serif; font-size: 16px; line-height: 23px;"><span style="font-size: 14px;"><span style="font-size: 24px;">&nbsp;<span style="font-family: 黑体;">质量验收单</span></span></span></p><p style="margin: 5px 10px; font-family: sans-serif; font-size: 16px; line-height: 20px;"><span style="font-size: 14px;"><span style="font-family: 宋体;">验收</span></span><span style="font-family: 宋体; font-size: 14px;">部门</span><span style=" font-size: 14px;"><span style="font-family: 宋体;">：</span>&nbsp;&nbsp;</span><span style="font-family: 宋体; font-size: 14px;"></span><span style="font-size: 14px;"></span><span style="font-family: 宋体; font-size: 14px;">&nbsp;</span><span style="font-size: 14px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span style="font-family: 宋体;" class="pull-right">验收日期：</span></span></p><p style="margin: 5px 10px; font-family: sans-serif; font-size: 16px; line-height: 20px;"><span style="font-family: 宋体; font-size: 14px;">验收人（签字）：</span></p><table style="width:100%;margin-bottom: 10px;margin:0 auto; border-collapse: collapse; color: rgb(0, 0, 0); font-family: sans-serif; font-size: 16px;"><tbody><tr class="firstRow" style="height: 51px;"><td width="60px" valign="top" style="padding: 10px; border: 1px solid windowtext;"><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><span style="font-family: 宋体; font-size: 14px;">验收单位</span></span></p></td><td width="606" valign="center" colspan="3" style="padding: 0px 7px; border: 1px solid windowtext;"></td></tr><tr style="height: 248px;"><td width="47" valign="center" style="padding: 0px 7px; border: 1px solid windowtext;"><p style="margin: 0px; padding: 0px; text-align: center; line-height: 23px;"><font face="宋体"><span style="font-size: 14px;">验收内容</span></font></p></td><td width="606" valign="top" colspan="3" style="padding: 0px 7px; border: 1px solid windowtext;"></td></tr></tbody></table>';
                    $("iframe").contents().find("body").append(addContent);
                    //this.typeDis=0;
                }else if(this.type =='edit'){
                    this.flag=2;
                    this.getQualityForm();
                }else{
                    this.typeUnable=1;
                    this.flag=21;
                    this.getQualityForm();
                    $('section').css('position','relative').css('width','100%').css('height','100%');
                    $('#edit-container').append('<div style="width: 100%;height: 100%;position: absolute;z-index:999;top: 0;left: 0"></div>')
                }
                break;
            case 'scheduleDiary':
                if(this.type =='add'){           /*添加*/
                    this.flag=3;
                    this.typeDis=0;
                    this.form.name='施工日记';
                    this.form.type='施工整改单';
                    this.getTemplate();
                }else if(this.type =='edit'){   /*编辑*/
                    this.flag=4;
                    this.typeDis=1;
                    this.form.name='施工日记';
                    this.form.type='施工整改单';
                    this.scheduleDiaryEdit();
//                    this.scheduleSaveEdit();
                }else{                            /*查看*/
                    this.flag=5;
                    this.typeDis=1;
                    this.typeUnable=1;
                    this.form.name='施工日记';
                    this.form.type='施工整改单';
                    this.scheduleDiaryEdit();
                    $('section').css('position','relative').css('width','100%').css('height','100%');
//                    $('#edit-container').append('<div style="width: 100%;height: 100%;position: absolute;z-index:999;top: 0;left: 0"></div>')
                    $('iframe').contents().find('body').attr('style','position:relative');
                    $('iframe').contents().find('body').append('<div style="width: 100%;height: 100%;position: absolute;z-index:999;top: 0;left: 0"></div>')
                    $('.ve-toolbar').append('<div class="backColor" style="width: 100%;height: 100%;position: absolute;z-index:999;top: 0;left: 0"></div>')
                }
                break;

        }



    },
    methods: {
//        添加质量表单
        saveForm:function(){
            //window.close();
            var _this=this;
            var that=this.form;
            console.log(this.form.content);
            var editor=$("iframe").contents().find("body").html();
            console.log(editor);
            //请求添加
            $.ajax({
            type: 'POST',
            data: {
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                formName:that.name,
                formType:that.type,
                formContent:editor
            },
            url: zyfUrl+'/qualityForm/insertQualityForm',
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log(data);
                if(data.code==0){
                    _this.$message({
                        message: data.message,
                        type: 'success'
                    });
                    //window.open("about:blank","_self").close();   
                    addformId=data.data;
                    console.log(addformId);
                    window.localStorage.setItem('addformId', addformId);
                    window.localStorage.setItem('formName', that.name);
                    //得到的表单名
                    getformName=formName;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + ' ' + errorThrown);
            }
        });

    },
//        修改质量表单
    editQualityForm:function(){
        var _this=this;
        var that=this.form;
        //console.log(this.form.content);
        var editor=$("iframe").contents().find("body").html();
        console.log(editor);
        //修改添加
        $.ajax({
            type: 'POST',
            data: {
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                formId:this.sessionId,
                formName:that.name,
                formType:that.type,
                formContent:editor
            },
            url: zyfUrl+'/qualityForm/updateQualityForm',
            dataType: 'json',
            cache: false,
            success: function(data) {
                _this.$message({
                        message: data.message,
                        type: 'success'
                    });
                window.localStorage.setItem('formName', that.name);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + ' ' + errorThrown);
            }
        });

    },
//        获取质量整改单
        getQualityForm:function () {
            this.$http.post(zyfUrl+'/qualityForm/selectQualityFormById',{
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                formId:this.sessionId,
            },{
                headers:{

                },
                emulateJSON: true
            }).then(function (result) {
//                console.log(result.body.data);
                var data=result.body.data;
                this.form.name=data.formName;
                this.form.type=data.formType;
                $("iframe").contents().find("body").html(data.formContent);
            },function (responsive) {
                console.log(responsive);
            });
        },
//        获取模板
        getTemplate:function () {
            var that = this;
            that.$http.post(zyfUrl+'/sysFormsSetting/selectSysFormsSettingByPro',{
                projectId:projectId,
            },{
                headers:{

                },
                emulateJSON: true
            }).then(function (result) {
                if(result.body.code==10000){
                    $("iframe").contents().find("body").append(result.body.data[0].formContent);
                }else{
                    responsive(result.body.code,that);
                }

//            this.items=result.body.data;
            },function (responsive) {
                console.log(responsive);
            })
        },
//        添加进度
        scheduleAdd:function () {
            var that = this;
            var editor=$("iframe").contents().find("body").html();
            that.$http.post(zyfUrl+'/workDiary/insertWorkDiary',{
                workDiaryName:this.form.name,  //施工日记
                formDiary:editor,
                userId:userId, //当前的登入的用户id
                projectId:projectId,
                jwt:jwt,
            },{
                headers:{

                },
                emulateJSON: true
            }).then(function (result) {
//                this.items=result.body.data;
                if(result.body.code==10000){
                    window.location.href=zyfUrl+'/scheduleDiary'+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt;
                }else{
                    responsive(result.body.code,that);
                }
            },function (responsive) {
//                console.log(responsive);
            })
        },
//        编辑进度获取信息
        scheduleDiaryEdit:function () {
            //        获取施工日志类型
            var that = this;
            this.$http.post(zyfUrl+'/workDiary/getDiaryById',{
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                workDiaryId:this.sessionId,
            },{headers:{}, emulateJSON: true
            }).then(function (result) {
                if(result.body.code==10000){
                    var data=result.body.data;
                    this.form.name=data.workDiaryName;
                    this.form.type=data.formType;
                    $("iframe").contents().find("body").append(data.formDiary);
                }else{
                    responsive(result.body.code,that);
                }

            },function (responsive) {
                console.log(responsive);
            })
        },
//        保存编辑施工日记信息
        scheduleSaveEdit:function () {
            var that=this;
            var editor=$("iframe").contents().find("body").html();
            console.log(editor);
            this.$http.post(zyfUrl+'/workDiary/saveWorkDiary',{
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                workDiaryId:this.sessionId,
                workDiaryName:this.form.name,
                formDiary:editor,
            },{headers:{}, emulateJSON: true
            }).then(function (result) {
                if(result.body.code==10000){
                    window.location.href=zyfUrl+'/scheduleDiary'+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt;
                }else{
                    responsive(result.body.code,that);
                }
            },function (responsive) {
                console.log(responsive);
            })
        }
    }
}
</script>
<template>
    <main id="root" class="app-main">
        <div class="wrap">
            <editors></editors>
        </div><!-- .wrap -->
    </main>
</template>
<template>
  <section class="app-content layout-center" id="editors">
        <!--相应内容-->
        <div class="list-content">
            <div class="row">
                <div class="col-md-12" style="padding-right: 0;">
                    <div class="widget">
                        <header class="widget-header">
                            <div class="row">
                                <div class="col-xs-1" style="padding-right: 0;width:7%;line-height: 32px">
                                    <label>表单名称:</label>
                                </div>
                                <div class="col-xs-4">
                                    <el-input type="text" v-model="form.name" placeholder="请输入名称" :disabled="typeUnable==1"></el-input>
                                </div>
                                <div class="col-xs-1" style="padding-right: 0;width:7%;line-height: 32px">
                                    <label>类型:</label>
                                </div>
                                <div class="col-xs-4">
                                    <!--<el-input type="text" v-model="form.type" placeholder="请输入危险源名称" disabled></el-input>-->
                                    <el-select v-model="form.type" placeholder="请选择表单类型"  :disabled="typeDis==1">
                                        <el-option label="区域一" value="1"></el-option>
                                        <el-option label="区域一" value="2"></el-option>
                                    </el-select>
                                </div>
                                <div class="col-xs-2">
                                    <el-button type="text" v-if="flag==0" class="el-button--primary">保存表单</el-button>
                                    <el-button type="text" v-else-if="flag==1" class="el-button--primary" @click="saveForm()">保存表单</el-button>
                                    <el-button type="text" v-else-if="flag==2" class="el-button--primary" @click="editQualityForm()">保存表单</el-button>
                                    <el-button type="text" v-else-if="flag==21" class="el-button--primary" disabled>保存表单</el-button>
                                    <el-button type="text" v-else-if="flag==3" class="el-button--primary" @click="scheduleAdd()">保存表单</el-button><!--添加日志表单-->
                                    <el-button type="text" v-else-if="flag==4" class="el-button--primary" @click="scheduleSaveEdit()">保存表单</el-button><!--保存编辑施工日记-->
                                    <el-button type="text" v-else-if="flag==5"></el-button><!--查看施工日记-->
                                </div>
                            </div>
                        </header>
                        <div class="edit-center" id="edit-container">
                        <!--编辑器-->
                            <!--<Editor></Editor>-->
                             <Vueditor></Vueditor>
                        </div>
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
    .body{
        text-center:center;
    }
</style>


