<script>
export default {
    name:'',
    data(){
        return{
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
            value6: '',
//            value7: '',
            lists:'',
//           筛选
            workDiaryName:'',
            createUserId:'',
            startTime:'',
            endTime:'',
//            当前页
            current:1,
//            每页数据
            showItem:20,
//            页数
            allpage:"",
//            总个数
            allNum:0,
//            下拉菜单
            options:'',
//            url传参

        }
    },
    mounted:function () {
//        下拉菜单-选择添加人
        var that = this;
        that.$http.post(zyfUrl+'/user/tree',{
            userId:userId,
            projectId:projectId,
            jwt:jwt,
        },{headers:{}, emulateJSON: true}).then(function (result) {
            this.options=result.body.data;
        },function (responsive) {
            console.log(responsive);
        })
//        获取施工日记数据
        that.$http.post(zyfUrl+'/workDiary/getDiaryBySelect',{
            userId:userId,
            projectId:projectId,
            jwt:jwt,
            workDiaryName:this.workDiaryName,
            createUserId:this.createUserId,
            startTime:'',
            endTime:'',
        },{
            headers:{

            },
            emulateJSON: true
        }).then(function (result) {
            this.lists=result.body.data;
            this.allNum=this.lists.length;
            this.allpage=Math.ceil(this.allNum/this.showItem);
            console.log(result);
        },function (responsive) {

        })
    },
    methods:{
        //分页
        goto:function(index){
            if(index == this.current) return;
            this.current = index;
        },
//        筛选
        selectedDate:function () {
            var that = this;
            console.log(this.value6);
            if(this.value6!=null && this.value6!=''){
                this.startTime=this.value6[0].getTime();
                this.endTime=this.value6[1].getTime();
            }else {
                this.startTime=this.startTime;
                this.endTime=this.endTime;
            }
            that.$http.post(zyfUrl+'/workDiary/getDiaryBySelect',{
                userId:userId,
                projectId:projectId,
                jwt:jwt,
                workDiaryName:this.workDiaryName,
                createUserId:this.createUserId,
                startTime:this.startTime,
                endTime:this.endTime,
            },{
                headers:{

                },
                emulateJSON: true
            }).then(function (result) {
                this.lists=result.body.data;
                this.allNum=this.lists.length;
                this.allpage=Math.ceil(this.allNum/this.showItem);
                console.log(result);
            },function (responsive) {

            })
        },
        //重置
        resetDate:function () {
            var _this=this;
            _this.workDiaryName="";
            _this.createUserId='';
            _this.value6='';
            _this.startTime='';
            _this.endTime='';
        },
        //跳转编辑器
        urlHtml:function(index){
//            console.log(index);
            var toUrl;
            if(index==undefined){
                toUrl=zyfUrl+"/editors.html?block=scheduleDiary&type=add";
                window.open(toUrl);
            }else{
                var sessionId=this.lists[index].workDiaryId;
                toUrl=zyfUrl+"/editors.html?block=scheduleDiary&type=edit&sessionId="+sessionId+'&userId='+userId+'&projectId='+projectId+'&jwt='+jwt;
                window.open(toUrl);
            }
        },
        lookHtml:function (index) {
            var toUrl;
            var sessionId=this.lists[index].workDiaryId;
            toUrl=zyfUrl+"/editors.html?block=scheduleDiary&type=look&sessionId="+sessionId+'&userId='+userId+'&projectId='+projectId+'&jwt='+jwt;
            window.open(toUrl);
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
    filters:{
        dateType:function (date) {
            var date =  new Date(date);
            var y = 1900+date.getYear();
            var m = "0"+(date.getMonth()+1);
            var d = "0"+date.getDate();
            return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
        }
    }
}
</script>

<template>
<!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap">
            <section class="app-content">
                <!--相应内容-->
                <div class="list-content">
                    <div class="row">
                        <div class="col-md-12" style="padding-right: 0;">
                            <div class="widget">
                                <header class="widget-header">
                                    <div class="row">
                                        <div class="col-xs-2">
                                            <el-input  v-model="workDiaryName" placeholder="请输入日记名称查找"></el-input>
                                        </div>
                                        <div class="col-xs-2">
                                            <el-select v-model="createUserId" placeholder="请选择">
                                                <el-option
                                                        v-for="item in options"
                                                        :key="item.userId"
                                                        :label="item.userName"
                                                        :value="item.userId">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="col-xs-3">
                                                <el-date-picker
                                                        v-model="value6"
                                                        type="daterange"
                                                        range-separator="至"
                                                        start-placeholder="开始日期"
                                                        end-placeholder="结束日期">
                                                </el-date-picker>
                                            <!--<button type="button" class="btn btn-primary top-select">筛选</button>-->
                                            <!--<button type="button" class="btn btn-default">重置</button>-->
                                        </div>
                                        <div class="col-xs-2">
                                            <button type="button" class="btn primary backg-color top-select" @click="selectedDate()">筛选</button>
                                            <button type="button" class="btn btn-default" @click="resetDate()">重置</button>
                                        </div>
                                        <div class="pull-right">
                                            <a type="button" class="btn btn-default" @click="urlHtml()">添加日志</a>
                                        </div>
                                    </div>
                                </header>
                                <hr class="widget-separator">
                                <div class="widget-body" style="padding: 0;">
                                    <div class="table-responsive">
                                        <table data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">
                                            <thead>
                                            <tr>
                                                <th>序号</th>
                                                <th>日记名称</th>
                                                <th>添加时间</th>
                                                <th>添加人</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(item,index) in lists.slice((current-1)*showItem,current*showItem)" :trd="item.workDiaryId">
                                                <td>{{index+1}}</td>
                                                <td class="td-content td-title">
                                                    {{item.workDiaryName}}
                                                </td>
                                                <td>{{item.createTime|dateType}}</td>
                                                <td>
                                                    <img src="./images/user.png">
                                                    {{item.createUser}}
                                                </td>
                                                <td class="td-handles">
                                                    <a @click="urlHtml(index)" class="c_3"><i class="fa fa-edit fa-2 td-edit" aria-hidden="true"></i></a>
                                                    <a @click="lookHtml(index)" class="c_3">
                                                        <i class="fa fa-search fa-2 td-search"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
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


