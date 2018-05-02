<!--<script src="../../../common/list-common.js" ></script>-->

<script>
$(document).ready(function() {
    //table 高度设置
    var thisH = $(window).height();
    var centerH=thisH -260 + 'px';
    $(".table-responsive").css("height", centerH);
})
window.onresize = function() {
    var thisH = $(window).height();
    var centerH=thisH -265 + 'px';
    $(".table-responsive").css("height", centerH);
}
//    import common from '../../../components/common.vue';
    export default {
//        extends: common,
//    name:'system-profession',
    data(){
        return{
            //apis
//            urls:[
//                "/profession/pageLook",//list
//                "/profession/create"//insert
//            ],
//            //api index
//            url_idx:{
//                init:0,
//                insert:1
//            },
//            //api parameters
//            params:[
//                {userId:window.userId,projectId:window.projectId,pageIndex:1,pageSize:5},
//                {userId:window.userId,projectId:window.projectId,professionName:"",professionType:""}
//            ],
            resultParam:{},
            dialogVisible:false,
            flag:1,
            title:'添加专业',
            list:[
            ],
            rules: {
                name: [
                    { required: true, message: '请输入专业名', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                code: [
                    { type: 'date', required: false, message: '请输入分类编码', trigger: 'change' }
                ]
            },
            // insertForm:{professionName:"",professionType:0},
            search_name:"",
            professionId:"",
            professionName:"",
            professionCode:"",
            proList:[],


            // pageIndex:1,
            // pageSize:10,



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
        // var idx = this.url_idx.init;//api index
        // //alert("before ajax in created of projectManage");
//        this.ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
            this.init();    
    },
    created:function () {
    },
    methods:{
        search:function(){
            this.init();
        },
        editDialog:function (index) {
            console.log("haha")
            this.dialogVisible=true;
            this.title="编辑专业";
            this.flag=0;
            this.professionId=this.proList[index].professionId;
            this.professionName=this.proList[index].professionName;
            this.professionCode=this.proList[index].professionCode;
        },
        init_cb:function (result) {
            //alert(result.data.message);
            this.list = result.data.data.result;
        },
        insert_cb:function (result) {
            //alert(result.data.message);
            this.dialogVisible = false;
        },
        update_cb:function (result) {
            //alert(result.data.message);
            this.dialogVisible = false;
        },
        insert:function () {
            this.dialogVisible=true;
            this.title='添加专业';
            this.flag=1;
            this.professionId="";
            this.professionName="";
            this.professionCode="";
        },
        insertSubmit:function () {
//            var idx = this.url_idx.insert;//api index
//            //prepare params
//            var param = this.params[idx];
//            param.professionName = this.insertForm.professionName;
//            param.professionType = this.insertForm.professionType;
//            ajax(this,zyfUrl + this.urls[idx],param,0,this.insert_cb);
        },
        update:function () {
            this.dialogVisible=true;
            this.title='编辑专业';
            this.flag=0;
           
    
        },
        updateSubmit:function () {
            
              var that=this;
                if(that.professionName==""){
                  this.$alert('<strong>'+'请输入专业名称'+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
                 return;
             }
              this.$http.post(zyfUrl + '/profession/update', {
                  professionId:that.professionId,
                  professionName:that.professionName,
                professionType:that.professionCode,
                userId:userId,
                 projectId:projectId,
                 jwt:jwt
              }, {
                headers: {},
               emulateJSON: true
            }).then(function (result) {
                // 这里是处理正确的回调
                if (result.data.code == 10000) {
                     that.dialogVisible = false;
                for(var i=0;i<that.proList.length;i++){
                    if(that.professionId==that.proList[i].professionId){
                        var data={
                            professionId:that.professionId,
                            professionName:that.professionName,
                            professionCode:that.professionCode,

                        };
                        that.proList.splice(i,1,data);

                    }
                }
                 that.professionName="";
                that.professionCode="";

                }
                 this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
            
            
       }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        init:function(){
             
              var that=this;
              this.$http.post(zyfUrl + '/profession/searchByName', {
                userId:userId,
                 projectId:projectId,
                 jwt:jwt,
                //  pageIndex:that.pageIndex,
                //  pageSize:that.pageSize,
                 searchData:that.search_name
              }, {
                headers: {},
               emulateJSON: true
            }).then(function (result) {
                // 这里是处理正确的回调
                if (result.data.code == 10000) {
                    that.proList=result.data.data;
                     that.allNum=result.data.data.length;
                        that.allpage=Math.ceil(that.allNum/that.showItem);
                   
                
                }else if (result.data.code == 20000){
                        that.proList=[];
                        that.allNum=0;
                        that.allpage=0;
                   
                }


            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });
           
        },
        addNewPro:function(){
             var that=this;
             if(that.professionName==""){
                  this.$alert('<strong>'+'请输入专业名称'+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
                 return;
             }
              this.$http.post(zyfUrl + '/profession/create', {
                  professionName:that.professionName,
                professionType:that.professionCode,
                userId:userId,
                 projectId:projectId,
                 jwt:jwt
              }, {
                headers: {},
               emulateJSON: true
            }).then(function (result) {
                // 这里是处理正确的回调
                if (result.data.code == 10000) {
                     that.dialogVisible = false;
                that.init();
                 that.professionName="";
                that.professionCode="";

                }
                 this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });



            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
          addNewProAndContinueAdd:function(){
                var that=this;
            //   that.dialogVisible = false;
              if(that.professionName==""){
                  this.$alert('<strong>'+'请输入专业名称'+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });
                 return;
             }
           
              this.$http.post(zyfUrl + '/profession/create', {
                  professionName:that.professionName,
                professionType:that.professionCode,
                userId:userId,
                 projectId:projectId,
                 jwt:jwt
              }, {
                headers: {},
               emulateJSON: true
            }).then(function (result) {
                // 这里是处理正确的回调
                if (result.data.code == 10000) {
                    //  that.dialogVisible = false;
                that.init();
                that.professionName="";
                that.professionCode="";

                }
                 this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                    dangerouslyUseHTMLString: true
                });



            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });
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
                                        <div class="col-xs-3">
                                        
                                            <input class="theaderSel" placeholder="请输入查询专业名称" v-model="search_name">
                                        </div>
                                        <div class="col-xs-2">
                                            <button class="btn primary backg-color" @click="search()">查询</button>
                                        </div>
                                        <div class="position-btn">
                                            <button type="button" class="btn primary backg-color" @click="insert()">添加专业</button>
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
                                                <th>专业名称</th>
                                                <th>分类编码</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(pro,index) in proList.slice((current-1)*showItem,current*showItem)">
                                                <td></td>
                                                <td>{{pro.professionName}}</td>
                                                <td>{{pro.professionCode}}</td>
                                                <td class="td-handles">
                                                    <i class="fa fa-edit fa-2 td-edit" @click="editDialog(index)"></i>
                                                    <!--<i class="fa fa-search fa-2 td-search" aria-hidden="true"></i>-->
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                         </div>
                                      <div class="pages text-center">
                                    <span class="allNum">共&nbsp;
                                        <span class="theme-color">{{allNum}}</span>
                                        &nbsp;专业问题</span>
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
        <el-dialog :visible.sync="dialogVisible" width="40%">
            <div class="modal-header primary backg-color">
                <div class="modal-title">
                    {{title}}
                </div>
            </div>
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="专业名" prop="name">
                    <el-input v-model.trim="professionName"></el-input>
                </el-form-item>
                <el-form-item label="分类编码" prop="secret">
                    <el-input v-model="professionCode"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" v-if="flag==1" @click="addNewProAndContinueAdd()">保存并继续添加</el-button>
            <el-button type="primary" v-if="flag==1" @click="addNewPro()">确 定</el-button>
            <el-button type="primary" v-else="flag==0" @click="updateSubmit()">确 定</el-button>
            </span>
        </el-dialog>
    </main>
<!--</div>-->
</template>

<style scoped>
    .app-main{
        margin-top: 60px;
        margin-bottom: 15px;
    }
</style>


