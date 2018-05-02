<script>
    // import { ajax } from '../../../common/list-common.js'
export default {
    name:'',
    data(){
        return{
            
            //apis
            // urls:[
            //     "/Process/getAllProcess",//list
            //     "/Process/saveProcess",//insert
            // ],
            // //api index
            // url_idx:{
            //     init:0,
            //     insert:1
            // },
            // //api params
            // params:[
            //     {userId:window.userId,projectId:window.projectId},
            //     {userId:window.userId,projectId:window.projectId,processJson:"",processBrowseJson:"",
            //         processStageJson:""},
            // ],
            // list:[],//list from server

            prolist:[],
            processList:[],
            processName:"",
            processType:"0",
            major:"0",   
            
            
                       //            当前页
            current:1,
//            每页数据
            showItem:20,
//            页数
            allpage:"",
//            总个数
            allNum:0,

        }
    },
    mounted:function () {
        this.init();
        this.getPro();

    },

    created:function () {
        // var idx = this.url_idx.init;//api index
        // ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
    },
    methods:{
        // init_cb:function (result) {
        //     //alert(result.data.message);
        //     this.list = result.data.data;
        // },
        // insert_cb:function (result) {
        //     alert(result.data.message);
        //     this.dialogVisible = false;
        // },
        // update_cb:function (result) {
        //     alert(result.data.message);
        // },
        init:function(){
              var that=this;
             this.$http.post(zyfUrl+'/Process/selectProcess',{
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                 processName:that.processName,
            processType:that.processType,
            major:that.major 

            },{
                headers:{}, emulateJSON: true
            }).then(function (result) {
                console.log(result)
               if(result.data.code==10000&&result.data.data!=""){

                   that.processList=result.data.data;
                    this.allNum=result.data.data.length;
                    this.allpage=Math.ceil(this.allNum/this.showItem);

               }else if(result.data.code==20000){
                        that.processList = [];
                        this.allNum=0;
                        this.allpage=0;
               }

            },function (responsive) {
                console.log(responsive);
            })

        },
        searchByContion:function(){
                this.init();
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
        reset:function(){
             this.processName="";
            this.processType="0";
            this.major="0"; 

        },
        deleteProcess:function(index){
        var that=this;
            var id=that.processList[index].processId;
             this.$http.post(zyfUrl+'/Process/deleteProcess',{
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                processId:id   
            },{
                headers:{}, emulateJSON: true
            }).then(function (result) {
                console.log(result)
               if(result.data.code==10000){

                 that.processList.splice(index,1);
                 this.allNum--;
                this.allpage=Math.ceil(this.allNum/this.showItem);
               }

         this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
        return;


            },function (responsive) {
                console.log(responsive);
            })
        },
        edit:function(index){
              var that=this;
            var id=that.processList[index].processId;
           window.location.href=zyfUrl+'/systemAddFlow?type=1?id='+id+'&userId='+userId+'&projectId='+projectId+'&jwt='+jwt;

        },
        insert:function () {
            this.dialogVisible=true;
            this.title='添加流程';
            this.flag=1;
            window.location.href=zyfUrl+'/systemAddFlow?type=0'+'&userId='+userId+'&projectId='+projectId+'&jwt='+jwt;

        },
        insertSubmit:function () {
            // var idx = this.url_idx.insert;//api index
            //prepare params
            // var param = this.params[idx];
            // param.projectName = this.ruleForm.name;
            // ajax(this,zyfUrl + this.urls[idx],param,0,this.insert_cb);
        },
         goto:function(index){
            if(index == this.current) return;
            this.current = index;
        }
        
    },
     computed:{
        // 分页
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
        <div class="wrap">
            <section class="app-content">
                <div class="system-profession">
                    <div class="list-header">
                        <div class="row">
                            <div class="col-md-12 widget">
                                <header class="widget-header">
                                    <div class="row">
                                        <div class="col-xs-2">
                                            <input class="theaderSel" placeholder="请输入查询专业名称" v-model="processName">
                                        </div>
                                        <div class="col-xs-2">
                                            <select name="type" class="theaderSel" v-model="processType">
                                                <option value="0" checked="">选择流程类型</option>
                                                <option label="质量问题" value="1"></option>
                                                <option label="安全问题" value="2"></option>
                                                <option label="协调事宜" value="3"></option>
                                            </select>
                                        </div>
                                        <div class="col-xs-2">
                                            <select name="type" class="theaderSel" v-model="major">
                                                <option value="0" checked="">选择专业</option>
                                                <!-- <option value="1">1</option>
                                                <option value="2">2</option> -->
                                                <option  v-for="pro in  prolist"  :value=pro.professionId>{{pro.professionName }}</option>
                                            </select>
                                        </div>
                                        <div class="col-xs-2">
                                            <button type="button" class="btn primary backg-color top-select" @click="searchByContion">筛选</button>
                                            <button type="button" class="btn btn-default" @click="reset">重置</button>
                                        </div>
                                        <div class="position-btn">
                                            <button type="button" class="btn primary backg-color" @click="insert()">添加流程</button>
                                        </div>
                                    </div>
                                </header>
                            </div>
                        </div>
                    </div>
                    <div class="list-content">
                        <div class="row">
                            <div class="col-md-12 widget">
                                <div class="widget-body" style="padding: 0;">
                                    <div class="table-responsive">

                                        <!--<table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">-->
                                        <table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">
                                            <thead>
                                            <tr>
                                                <th></th>
                                                <th>序号</th>
                                                <th>流程名称</th>
                                                <th>专业</th>
                                                <th>流程类型</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(process,index) in processList.slice((current-1)*showItem,current*showItem)">
                                                <td></td>
                                                <td>{{index+1}}</td>
                                                <td>{{process.processName}}</td>
                                                <td>{{process.major}}</td>
                                                <td v-if="process.processType=='0'"></td>
                                                 <td v-else-if="process.processType=='1'">质量问题</td>
                                                  <td v-else-if="process.processType=='2'">安全问题</td>
                                                   <td v-else="process.processType=='3'">协调事宜</td>
                                                <td class="td-handles">
                                                    <i class="fa fa-edit fa-2 td-edit" aria-hidden="true" @click="edit(index)"></i>
                                                    <i class="fa fa-trash fa-2" aria-hidden="true" @click="deleteProcess(index)"></i>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <!--原有的行-->
                                      </div>
                                    <div class="pages text-center">
                                    <span class="allNum">共&nbsp;
                                        <span class="theme-color">{{allNum}}</span>
                                        &nbsp;流程</span>
                                        <ul class="pagination" >
                                            <li v-show="current != 1" @click="current-- && goto(current)" ><a href="#">上一页</a></li>
                                            <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
                                                <a href="#" >{{index}}</a>
                                            </li>
                                            <li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)"><a href="#" >下一页</a></li>
                                        </ul>
                                    </div>
                                </div><!-- .widget-body -->
                            </div>
                        </div>
                    </div>
                </div>
            </section><!-- #dash-content -->
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


