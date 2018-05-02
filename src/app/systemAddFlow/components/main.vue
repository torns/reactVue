<script>
//    import common from '../../../components/common.vue';
export default {
    // extends: common,
    name:'',
    data(){
        return{
            prolist:[],
            stageList:[],
            currentIndex:"",
            status:"0",
       



            //参会人员
            addPerson:"",
            filterText:"",
            filterText2:"",
            filterText3:"",
            //tree
            trees: {
                data: [],
                label: 'userName'
            },
            trees2: {
                data: [],
                label: 'userName'
            },
             trees3: {
                data: [],
                label: 'userName'
            },
            //默认选中的
            defaultChecks:[],
            //选中的tree
            checkedTrees:[],
             checkedTrees2:[],
               checkedTrees3:[],

            url_prefix:zyfUrl,
            //apis
            urls:[
                "/Process/getAllProcess",//list
                "/Process/saveProcess",//insert
            ],
            //api index
            url_idx:{
                init:0,
                insert:1
            },
            //api params
            params:[
                {userId:window.userId,projectId:window.projectId},
                {userId:window.userId,projectId:window.projectId,processJson:{},processBrowseJson:{},
                    processStageJson:""},
            ],
            insertStageDialogVisible:false,
            dialogVisibleSecond:false,  
            title:'',
            flag:1,
             flag2:0,
                 //基本信息
                    processId:"",
                     processName:'',
                     processType:'',
                     professionName:'',
                     browser:'',



            processStage:{
                processStageName:'',
            
                isStart:false,
                isEnd:false,
                associationForm:'',
                approvalOpinion:''
            },
            rules:{
                processStageName: [
                    { required: true, message: '请输入阶段名称', trigger: 'blur' }
                ],
                associationForm:[
                    { required: false, message: '请选择关联表单', trigger: 'change' }
                ]
            },
    
    
        }
    },
      created: function () {
        
        return;
    },
    beforeMount:function(){
        console.log("beforeMount")
         this.dialogVisibleSecond=true;
    },
   
    mounted:function () {
       
        var that=this;
         that.dialogVisibleSecond=false;
        this.init();
        //        url截取字符串
        var getUrlParam = function(name)
        {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r!=null) return unescape(r[2]); return null;
        };
        getUrlParam();
//        url传参数 板块、类型（添加还是编辑）、编辑ID
        // alert(getUrlParam('id'));
        console.log(getUrlParam('type'))
        if(getUrlParam('type')=="1"){
            that.processId=getUrlParam('id');
            that.getOneProcess();
            that.flag=1;
        
        }else{
             that.flag=0;
        }
        // that.flag=0;
       

    },
  
    methods:{
        init:function(){
                this.getPro();
                this.getPerson();
        },
        getOneProcess:function(){
              var that=this;
             this.$http.post(zyfUrl+'/Process/getProcess',{
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                processId:that.processId
            },{
                headers:{}, emulateJSON: true
            }).then(function (result) {
                console.log(result)
               if(result.data.code==10000){
                   var temp=result.data.data;
                        
                    
                    that.processId=temp.process.processId;
                      that.processName=temp.process.processName;
                      that.processType=temp.process.processType;
                      that.professionName=temp.process.professionName;
                      //todo
                    // that.checkedTrees=temp.processBrowseJson;
                         
                         if(temp.processBrowseList.length!=0){
                                 var browserPersons=[];
                                
                                 for(var x=0;x<temp.processBrowseList.length;x++){
                                browserPersons.push(temp.processBrowseList[x].userId)
                                  }
                                  
                             this.$refs.tree.setCheckedKeys(browserPersons);
                            }
                           
                          



                    that.stageList=temp.processStageShowList;

               }

            },function (responsive) {
                console.log(responsive);
            })

        },
        getPro:function(){
            var that=this;
             this.$http.post(zyfUrl+'/profession/lookTree',{
                userId:userId,
                projectId:projectId,
                jwt:jwt,
            },{
                headers:{}, emulateJSON: true
            }).then(function (result) {
                console.log(result)
               if(result.data.code==10000&&result.data.data!=""){

                   that.prolist=result.data.data
               }

            },function (responsive) {
                console.log(responsive);
            })

        },
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
                this.trees2.data=result.bodyText.data;
                this.trees3.data=result.bodyText.data;
            },function (responsive) {
                console.log(responsive);
            })
        },
          handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
            // if(checked){
            //     this.checkedTrees.push({"userId":data.userId,"userName":data.userName});
            // }else{
            //     this.checkedTrees.pop({"userId":data.userId,"userName":data.userName});
            // }
             if(checked){
                this.checkedTrees.push(data.userId);
            }else{
                this.checkedTrees.pop(data.userId);
            }
        },
        handleCheckChange2(data, checked, indeterminate) {
           console.log(data, checked, indeterminate);
           if(checked){
               this.checkedTrees2.push({"userId":data.userId,"userName":data.userName});
           }else{
               this.checkedTrees2.pop({"userId":data.userId,"userName":data.userName});
           }
           //  if(checked){
           //     this.checkedTrees.push(data.userId);
           // }else{
           //     this.checkedTrees.pop(data.userId);
           // }
       },
        handleCheckChange3(data, checked, indeterminate) {
           console.log(data, checked, indeterminate);
           if(checked){
               this.checkedTrees3.push({"userId":data.userId,"userName":data.userName});
           }else{
               this.checkedTrees3.pop({"userId":data.userId,"userName":data.userName});
           }
           //  if(checked){
           //     this.checkedTrees.push(data.userId);
           // }else{
           //     this.checkedTrees.pop(data.userId);
           // }
       },


        insertFlow_cb:function (result) {
            alert(result.data.message);
        },
        //添加
        insertStage:function () {
            var that=this;
            that.flag2=0;
            this.insertStageDialogVisible = true;
            this.title="添加流程";
                  that.processStage.processStageName="";
              that.processStage.isStart=false ;
                that.processStage.isEnd=false;
               that.processStage.associationForm="";
                that.processStage.approvalOpinion="";
        },
        newOrUpdate:function(){
            var that=this;
            if(that.processName==""){
                  this.$alert('<strong>'+'请输入流程名'+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
                return;

            }
             if(that.checkedTrees.length==0){
                this.$alert('<strong>'+'请选择浏览者'+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
                return;
            }
             if(that.professionName==""){
                this.$alert('<strong>'+'请选择专业'+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
                return;
            }
              var processJson =JSON.stringify({
                 
                "projectId": projectId,    //项目的id
                    "processName": that.processName,  //流程的名称
                    "processType": that.processType,  //流程的类型：0质量问题，1安全问题，2协调事宜
                    "major": that.professionName             //专业类型
            });

           var processBrowseJson =JSON.stringify(that.checkedTrees) ;

           for(var i=0;i<that.stageList.length;i++){
               var stage=that.stageList[i];
               var tempdata1=stage.processDesignaterJson;
               var temp=[];
               if(tempdata1.length>0){
                   for(var j=0;j<tempdata1.length;j++){
                       temp.push(tempdata1[j].userId);
                   }

               }

                var tempdata2=stage.processObserverJson;
               var temp2=[];
               if(tempdata2.length>0){
                   for(var j=0;j<tempdata2.length;j++){
                       temp2.push(tempdata2[j].userId);
                   }

               }

               stage.processDesignaterJson=temp;
                 stage.processObserverJson=temp2;


           }
            var  processStageJson=JSON.stringify(that.stageList);


            var resultData={
                 userId:userId,
                projectId:projectId,
                jwt:jwt,
                processJson:processJson,
                processBrowseJson:processBrowseJson,
                processStageJson:processStageJson
            };


            if(that.processId!=""){
               
                resultData.originalProcessId=that.processId;
                 this.$http.post(zyfUrl+'/Process/updateProcess',resultData,{
                headers:{}, emulateJSON: true
            }).then(function (result) {


                if(result.data.code==10000){
                    // window.close();
               window.location.href=zyfUrl+'/systemProcessSet'+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt;
                }
                this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });

               
            },function (responsive) {
                console.log(responsive);
            })
            }else{
                  this.$http.post(zyfUrl+'/Process/saveProcess',resultData,{
                headers:{}, emulateJSON: true
            }).then(function (result) {
             if(result.data.code==10000){
                 console.log("新建成功了")
                   
              window.location.href=zyfUrl+'/systemProcessSet'+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt;
                    // window.close();
                }

                  this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
               
            },function (responsive) {
                console.log(responsive);
            })
            }
            


           


        },
          //过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.userName.indexOf(value) !== -1;
        },
        editDialog:function(index){
            this.insertStageDialogVisible=true;
            this.title='编辑阶段';
            this.flag2=1;

            var that=this;
              that.currentIndex=index;
              that.processStage.processStageName=that.stageList[index].processStage.processStageName;


                 that.processStage.isStart=that.stageList[index].processStage.isStart;
                 that.processStage.isEnd=that.stageList[index].processStage.isEnd;
                 that.processStage.associationForm=that.stageList[index].processStage.associationForm;
                 that.processStage.approvalOpinion=that.stageList[index].processStage.approvalOpinion;




        },
        setDialog:function(index){
            var that=this;
            that.currentIndex=index;
         
           var current=that.stageList[index];
           if(current.processStageRule!=null&&current.processStageRule!=""){
                that.status= current.processStageRule.processStageRuleResult;
           }
         
           if(current.processDesignaterJson.length!=0){
                var temp2=[];
                for(var i=0;i<current.processDesignaterJson.length;i++){
                    temp2.push(current.processDesignaterJson[i].userId)
                  
                }

                
             this.$refs.tree2.setCheckedKeys(temp2);
           }
             if(current.processObserverJson.length!=0){
                var temp3=[];
                for(var j=0;j<current.processObserverJson.length;j++){
                    temp3.push(current.processObserverJson[j].userId)
                
                }
                 this.$refs.tree3.setCheckedKeys(temp3);
           }
            
           
          


                
                this.dialogVisibleSecond=true;
        },
        highSave:function(){
            var that=this;
            that.dialogVisibleSecond = false;
            var index=that.currentIndex;
             var current=that.stageList[index];
           current.processDesignaterJson=[];
            if(that.checkedTrees2.length>0){
                for(var i=0;i<that.checkedTrees2.length;i++){
                     current.processDesignaterJson.push(that.checkedTrees2[i]);
                }
                
            }
                current.processObserverJson=[];
             if(that.checkedTrees3.length>0){
                for(var j=0;j<that.checkedTrees3.length;j++){
                     current.processObserverJson.push(that.checkedTrees3[j]);
                }
                
            }
              if(that.checkedTrees2.length!=0){
                that.$refs.tree2.setCheckedKeys([]);
                 that.checkedTrees2=[];
             

            }
               if( that.checkedTrees3.length!=0){
                that.$refs.tree3.setCheckedKeys([]);
                 that.checkedTrees3=[];
                
            }
       
       
            
            if(current.processStageRule==null||current.processStageRule==""){
                 current.processStageRule={'processStageRuleResult':that.status};
            }else{
                 current.processStageRule.processStageRuleResult=that.status;
            }
            
         
            // current.processStageRule.processStageRuleResult=that.status;

        },
        highCancel:function(){
                 var that=this;
                that.dialogVisibleSecond = false;
            if(that.checkedTrees2.length!=0){
                that.$refs.tree2.setCheckedKeys([]);
                 that.checkedTrees2=[];
                 

            }
               if( that.checkedTrees3.length!=0){
                that.$refs.tree3.setCheckedKeys([]);
                 that.checkedTrees3=[];
               
            }



        },
        deleteStage:function(index){
        
            this.stageList.splice(index,1);
         

        },
        newStageBasicInfo:function(){
           
            var that=this;
            if(this.processStage.processStageName==""){
                this.$alert('<strong>'+'请输入流程名'+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
                return;
            }
             
             this.insertStageDialogVisible=false;
           this.dialogVisible = false
            var data={
                processStageName:that.processStage.processStageName,
                isStart:that.processStage.isStart,
                isEnd:that.processStage.isEnd,
                associationForm:that.processStage.associationForm,
                approvalOpinion:that.processStage.approvalOpinion
            }
            // that.stageList.push({"processStage":data,"processDesignaterJson":[],"processObserverJson":[],"processStageRule":""});
              that.stageList.push({"processStage":data,"processDesignaterJson":[],"processObserverJson":[],"processStageRule":null});
          
             that.processStage.processStageName="";
              that.processStage.isStart=false ;
                that.processStage.isEnd=false;
               that.processStage.associationForm="";
                that.processStage.approvalOpinion="";


        },
        saveStageInfo:function(){
             var that=this;

 
            var index=that.currentIndex;
             var current=that.stageList[index];
              var data={
                processStageName:that.processStage.processStageName,
                isStart:that.processStage.isStart,
                isEnd:that.processStage.isEnd,
                associationForm:that.processStage.associationForm,
                approvalOpinion:that.processStage.approvalOpinion
            }
             that.stageList[index].processStage=data;
              that.processStage.processStageName="";
              that.processStage.isStart=false;
                that.processStage.isEnd=false;
               that.processStage.associationForm="";
                that.processStage.approvalOpinion="";

             that.insertStageDialogVisible=false;
             
            
        }

    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      filterText2(val) {
        this.$refs.tree2.filter(val);
      },
      filterText3(val) {
        this.$refs.tree3.filter(val);
      }
    },
    
}
</script>

<template>
<!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap">
            <section class="app-content">
                <!--相应内容-->
                <div class="add-flow-content">
                    <div class="row">
                        <div class="col-md-12" style="padding-right: 0;">
                            <div class="widget">
                                <header class="widget-header">
                                    <div >添加流程：<span class="flow-name">一区质量问题</span></div>
                                    <hr class="widget-separator">
                                </header>
                                <div class="widget-body" style="padding: 0;">
                                    <div class="row">
                                        <div class="col-sm-5" style="padding-right:30px;">
                                            <div class="top-title text-center">
                                                第一步：填写基本信息
                                            </div>
                                            <el-form label-width="100px" class="demo-ruleForm">
                                                <el-form-item label="流程名称:" prop="name">
                                                    <el-input v-model.trim="processName"></el-input>
                                                </el-form-item>
                                                <el-form-item label="流程类型:" prop="secret">
                                                    <el-select v-model="processType" placeholder="请选择">
                                                        <el-option label="质量问题" value="1"></el-option>
                                                        <el-option label="安全问题" value="2"></el-option>
                                                        <el-option label="协调事宜" value="3"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="专业:" prop="name">
                                                    <el-select v-model="professionName" placeholder="请选择">
                                                        <!-- <el-option label="质量问题" value="1"></el-option>
                                                        <el-option label="安全问题" value="2"></el-option> -->
                                                        <el-option v-for="pro in  prolist" :label='pro.professionName' :value='pro.professionId'></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <!-- <el-form-item label="浏览人员:" prop="name"meetingUserList>
                                                    <el-input v-model="basicInfoForm.browser"></el-input>
                                                </el-form-item> -->
                                                <el-form-item label="浏览人员:" prop="name" class="sel-input">
                                                    <el-input type="text" placeholder="请输入人员名称查找" v-model="filterText"></el-input>
                                                    <div class="sel-persons">
                                                        <div class="borderStyle">
                                                            <el-tree :props="trees" ref="tree" :filter-node-method="filterNode"
                                                            show-checkbox  @check-change="handleCheckChange" :data="trees.data"
                                                            :default-checked-keys="defaultChecks" node-key="userId">
                                                            </el-tree>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-form>
                                        </div>
                                        <div class="col-sm-7 pb_20">
                                            <div class="top-title text-center">
                                                第二步：设置流程
                                            </div>
                                            <div class="setFlow-center">
                                                <!-- <div class="row">
                                                    <div class="col-xs-1">
                                                        <div class="circle bg-blue">
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-11">
                                                        <div class="one-part">
                                                            <img src="./images/left.png" class="left-icon">
                                                            <div class="row part-top">
                                                                <div class="col-xs-6">
                                                                    <span class="c_9 fw-700">发起质量问题</span>
                                                                </div>
                                                                <div class="pull-right">
                                                                    <button class="backg-color primary btn btn-sm">
                                                                        <i class="fa fa-remove" aria-hidden="true"></i>
                                                                    </button>
                                                                </div>
                                                                <div class="pull-right">
                                                                    <button class="backg-color primary btn btn-sm dropdown-toggle" data-toggle="dropdown">
                                                                        <i class="fa fa-list-ul c_f" aria-hidden="true"></i>
                                                                    </button>
                                                                    <div class="dropdown-menu animated flipInY top-menu">
                                                                <span class="media-group-item" @click="setDialog()">
                                                                    阶段高级设置
                                                                </span>
                                                                        <span class="media-group-item" @click="editDialog()">
                                                                    编辑阶段
                                                                </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row part-center">
                                                                <div class="col-xs-12">
                                                                    <span class="theme-color">已指派执行人</span>
                                                                </div>
                                                                <div class="col-xs-3">
                                                                    陈威为
                                                                </div>
                                                                <div class="col-xs-3">
                                                                    陈威为
                                                                </div>
                                                                <div class="col-xs-3">
                                                                    陈威为
                                                                </div>
                                                                <div class="col-xs-3">
                                                                    陈威为
                                                                </div>
                                                                <div class="col-xs-3">
                                                                    陈威为
                                                                </div>
                                                            </div>
                                                            <div class="row part-center">
                                                                <div class="col-xs-12">
                                                                    <span class="theme-color">已指派观察者</span>
                                                                </div>
                                                                <div class="col-xs-3">
                                                                    陈威为
                                                                </div>
                                                                <div class="col-xs-3">
                                                                    陈威为
                                                                </div>
                                                                <div class="col-xs-3">
                                                                    陈威为
                                                                </div>
                                                                <div class="col-xs-3">
                                                                    陈威为
                                                                </div>
                                                            </div>
                                                            <div class="row part-center">
                                                                <div class="col-xs-12">
                                                                    <span class="theme-color">步奏操作规则</span>
                                                                </div>
                                                                <div class="col-xs-12">
                                                                    <span class="fw-700">任一</span>
                                                                    执行者
                                                                    <span class="fw-700">发起质量问题</span>
                                                                    ，将移至
                                                                    <span class="fw-700">处理质量问题</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> -->
                                                <!--2-->
                                                <div class="row" v-for="(stage,index) in stageList">
                                                    <div class="col-xs-1">
                                                        <div class="circle bg-blue">
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-11">
                                                        <div class="one-part">
                                                            <img src="./images/left.png" class="left-icon">
                                                            <div class="row part-top">
                                                                <div class="col-xs-6">
                                                                    <span class="c_9 fw-700">{{stage.processStage.processStageName}}</span>
                                                                </div>
                                                                <div class="pull-right">
                                                                    <button class="backg-color primary btn btn-sm">
                                                                        <i class="fa fa-remove" aria-hidden="true" @click="deleteStage(index)"></i>
                                                                    </button>
                                                                </div>
                                                                <div class="pull-right">
                                                                    <button class="backg-color primary btn btn-sm dropdown-toggle" data-toggle="dropdown">
                                                                        <i class="fa fa-list-ul c_f" aria-hidden="true"></i>
                                                                    </button>
                                                                    <!--下拉菜单-->
                                                                    <div class="dropdown-menu animated flipInY top-menu">
                                                                <span class="media-group-item" @click="setDialog(index)">
                                                                    阶段高级设置
                                                                </span>
                                                                        <span class="media-group-item" @click="editDialog(index)">
                                                                    编辑阶段
                                                                </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row part-center">
                                                                <div class="col-xs-12">
                                                                    <span class="theme-color">已指派执行人</span>
                                                                </div>
                                                                <div class="col-xs-3" v-for="operator in  stage.processDesignaterJson">
                                                                  {{operator.userName}}
                                                                </div>
                                                            </div>
                                                            <div class="row part-center">
                                                                <div class="col-xs-12">
                                                                    <span class="theme-color">已指派观察者</span>
                                                                </div>
                                                                <div class="col-xs-3"v-for="operator in  stage.processObserverJson">
                                                                  {{operator.userName}}
                                                                </div>
                                                            </div>
                                                            <div class="row part-center">
                                                                <div class="col-xs-12">
                                                                    <span class="theme-color">步奏操作规则</span>
                                                                </div>
                                                                <div class="col-xs-12">
                                                                    <!-- <span class="fw-700">任一</span> -->
                                                                    <span v-if="stage.processStageRule!=null&&stage.processStageRule!=''">

                                                                    执行者 发起
                                                                    <span class="fw-700">{{stage.processStage.processStageName}}</span>
                                                                    ，将移至
                                                                    <span class="fw-700" v-if="stage.processStageRule.processStageRuleResult==0">关闭</span>
                                                                      <span class="fw-700" v-else-if="stage.processStageRule.processStageRuleResult==1">处理</span>
                                                                        <span class="fw-700" v-else-if="stage.processStageRule.processStageRuleResult==2">审核</span>
                                                                         <span class="fw-700">{{stage.processStage.processStageName}}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--添加阶段-->
                                                <div class="row addFlow-row">
                                                    <div class="col-xs-1">
                                                        <div class="circle bg-blue">
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-11">
                                                        <div class="one-part add-part">
                                                            <img src="./images/left.png" class="left-icon">
                                                            <div class="row">
                                                                <div class="col-xs-12 text-center add-btn" @click="insertStage()">
                                                            <span class="theme-color">
                                                                <i class="fa fa-plus" aria-hidden="true"></i>
                                                                添加阶段
                                                            </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row pages">
                                                    <div class="col-xs-12">
                                                        <el-button class="pull-right" type="primary"  @click="newOrUpdate()">保存</el-button>
                                                     <!-- <el-button class="pull-right" type="primary" v-if="flag==1" >保存2</el-button> -->
                                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div><!-- .widget-body -->
                            </div>
                        </div>
                    </div>
                </div>
            </section><!-- .app-content -->
            <el-dialog :visible.sync="insertStageDialogVisible" width="50%">
                <div class="modal-header primary backg-color">
                    <div class="modal-title">
                        {{title}}
                    </div>
                </div>
                <el-form :model="processStage" :rules="rules" ref="processStage" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="阶段名称" prop="processStageName">
                        <el-input v-model.trim="processStage.processStageName"></el-input>
                    </el-form-item>
                    <el-form-item label="是否起始步骤">
                        <el-checkbox v-model="processStage.isStart"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="是否结束步骤">
                        <el-checkbox v-model="processStage.isEnd"></el-checkbox>
                    </el-form-item>
                 
                    <el-form-item label="表单关联" prop="associationForm">
                        <el-select v-model="processStage.associationForm" placeholder="请选择关联表单">
                            <el-option label="质量例会" value="1"></el-option>
                            <el-option label="安全例会" value="2"></el-option>
                            <el-option label="工程例会" value="3"></el-option>
                            <el-option label="业主例会" value="4"></el-option>
                            <el-option label="三同步例会" value="5"></el-option>
                            <el-option label="设计协调会" value="6"></el-option>
                            <el-option label="项目部例会" value="7"></el-option>
                            <el-option label="项目部临时例会" value="8"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审批意见">
                        <el-input type="textarea" v-model="processStage.approvalOpinion"></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="insertStageDialogVisible = false">取 消</el-button>
                    <el-button type="primary" v-if="flag2==0"  @click="newStageBasicInfo()">保 存</el-button>
                    <el-button type="primary" v-else="flag2==1" @click="saveStageInfo()">保 存</el-button>
                </span>
            </el-dialog>

            <el-dialog :visible.sync="dialogVisibleSecond" width="50%">
                <div class="modal-header primary backg-color">
                    <div class="modal-title">
                        阶段高级设置
                    </div>
                </div>
                <div class="setting-center">
                    <div class="row">
                        <div class="col-xs-6">
                            <div class="setting-title">指派执行人：</div>
                            <input type="text" placeholder="请输入人员名称"  v-model="filterText2" class="select_person_input form-control">
                            <div class="sel-persons">
                                <div class="borderStyle">
                                    <el-tree :props="trees" ref="tree2" :filter-node-method="filterNode"
                                    show-checkbox  @check-change="handleCheckChange2" :data="trees.data"
                                    :default-checked-keys="defaultChecks" node-key="userId">
                                    </el-tree>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <div class="setting-title">指派观察者：</div>
                            <input type="text" placeholder="请输入人员名称"  v-model="filterText3" class="select_person_input form-control">
                            <div class="sel-persons">
                                <div class="borderStyle">
                                    <el-tree :props="trees" ref="tree3" :filter-node-method="filterNode"
                                    show-checkbox  @check-change="handleCheckChange3" :data="trees.data"
                                    :default-checked-keys="defaultChecks" node-key="userId">
                                    </el-tree>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="steps">
                                <!--<div class="add-step theme-color text-center">
                                    <i class="fa fa-plus"></i>
                                    新建步骤操作规则
                                </div>-->
                                <div class="row step-row">
                                    <div class="col-xs-1">
                                        <span>执行者</span>
                                    </div>
                                    <div class="col-xs-4">
                                        <input type="text" class="form-control" placeholder="发起问题">
                                    </div>
                                    <div class="col-xs-3">
                                        <span>该步骤自动移至</span>
                                    </div>
                                    <div class="col-xs-3">
                                        <select name="template_category" class="form-control" v-model="status">
                                            <option value="0" selected="">关闭</option>
                                            <option value="1">处理</option>
                                            <option value="2">审核</option>
                                        </select>
                                    </div>

                                </div>
                           </div>
                        </div>
                    </div>
                </div>

                <span slot="footer" class="dialog-footer">
            <el-button  @click="highCancel()">取 消</el-button>
            <!-- <el-button type="primary" v-if="flag2==0" @click="dialogVisibleSecond = false">保 存1</el-button> -->
             <el-button type="primary"   @click="highSave()">保 存</el-button>
            </span>
            </el-dialog>
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


