<script>
    export default {
        name:"security-overview",
        data(){
            return{
                zyfUrl:zyfUrl,
                isActive1:false,
                isActive2:false,
                isActive3:false,
                isActive4:true,
                noData:false,
                //根据时间选择
                select:{
                    time:""
                    // endTime:"",
                },
                //log数据
                logData:"",
                headerId:"",
                //次数数据
                timesData:[],
                chartData1: {
                    rows: [],
                    columns: []
                },
                chartSettings1: {
                    labelMap: {
                        count: '次数'
                    },
                    //xAxisType:'category',
                    //yAxisType: 'KMB'
                    //barWidth : 30,//柱图宽度
                },
                chartColors1:["rgba(24, 144, 255, 0.847058823529412)"],
                width1:'700px',
                minWidth:'20px',
                //   chart2
                chartData2 : {
                    rows:[],
                    columns:[]
                },
                chartColors2 : ['#5ab1ef', '#fa6e86','#ffb980'],
                //this.width2 = '100%'
                width2 : '350px',
                chartSettings2 : {
                    dimension: '等级',
                    // radius: [100, 80],
                    // offsetY: 200
                    dataType: 'KMB'
                }
            }
        },
        created() {

        },
        methods: {
// 　　　　selectStyle: function (item, index) {
// 　　　　　　this.$nextTick(function () {
// 　　　　　　　　this.selItems.forEach(function (item) {
// 　　　　　　　　　　Vue.set(item,'active',false);
// 　　　　　　　　});
// 　　　　　　　　Vue.set(item,'active',true);
// 　　　　　　});
// 　　　　},
            //选择今年
            selYear:function(){
                this.isActive4=true;
                this.isActive1=false;
                this.isActive2=false;
                this.isActive3=false;
                //请求数据
                this.selTime('/safeProblem/selectYear');
            },
            //选择今天
            selDay:function(){
                this.isActive1=true;
                this.isActive2=false;
                this.isActive3=false;
                this.isActive4=false;
                //请求数据
                this.selTime('/safeProblem/selectToday');
            },
            //选择本周
            selWeek:function(){
                this.isActive2=true;
                this.isActive1=false;
                this.isActive3=false;
                this.isActive4=false;
                //请求数据
                this.selTime('/safeProblem/selectWeek');
            },
            selMonth:function(){
                this.isActive3=true;
                this.isActive1=false;
                this.isActive2=false;
                this.isActive4=false;
                //请求数据
                this.selTime('/safeProblem/selectMonth');
            },
            selTime:function(url){
                var _this=this;
                //请求数据
                this.$http.post(zyfUrl + url,
                    {
                        userId:userId,
                        projectId:projectId,
                        jwt:jwt,
                    }, {
                        headers: {
                        },
                        emulateJSON: true
                    }).then(function(result){
                    // 这里是处理正确的回调
                    console.log(result);
                    var temp=JSON.parse(result.bodyText);//string object
                    console.log(temp.data.dataList);
                    //第一个图表
                    if(temp.data.dataList==""){
                        var nulldata={
                            rows:[],
                            columns: []
                        }
                        this.chartData1=nulldata;
                        _this.noData=true;
                    }else{
                        _this.noData=false;
                        var tempdata={
                            rows: temp.data.dataList,
                            columns: ["time", "count"]
                        }
                        this.chartData1=tempdata;
                    }
                    console.log(temp.data);
                    //第二个图标
                    var level={
                        columns: ['等级', '占比'],
                        rows: [
                            { '等级': '轻微','占比': temp.data.slight },
                            { '等级': '一般', '占比': temp.data.common},
                            { '等级': '严重',  '占比': temp.data.severity },
                        ]
                    }
                    this.chartData2=level;

                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            urlHtml:function(){
                window.location.href=zyfUrl+"/securityProblem.html";
            }
        },
        mounted: function() {
            var _this=this;
            _this.selYear();
            //请求数据调用
            this.$http.post(zyfUrl + '/safeProblem/getSafeProblemOperatorLog', {
                    userId:userId,
                    projectId:projectId,
                    jwt:jwt,
                    //projectId:"1",
                    logType:"安全问题"
                },
                {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                var that=this.form;
                // 这里是处理正确的回调
                //console.log(result.bodyText);
                result.bodyText=JSON.parse(result.bodyText);
                _this.logData=result.bodyText.data;
                // this.headerId=user.headPortrait;
            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },



    }
</script>

<template>
    <!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap">
            <section class="app-content" id="security-overview">
                <!-- search results -->
                <!--相应内容-->
                <div class="row">
                    <!--chart left-->
                    <div class="col-md-8">
                        <div class="widget">
                            <div class="widget-header dateTime">
                                <!--<h4 class="widget-title">问题次数统计</h4>-->
                                <!--<div class="col-xs-1 sel-times" v-for="(item,$index) in selItems"
                                  @click="selectStyle (item, $index) " :class="{'active':item.active,'unactive':!item.active}" >
                                    {{item.select}}
                                </div>-->
                                <div class="col-xs-1 sel-times" @click="selDay()" v-bind:class="{ active: isActive1}">今日</div>
                                <div class="col-xs-1 sel-times" @click="selWeek()" v-bind:class="{ active: isActive2}">本周</div>
                                <div class="col-xs-1 sel-times" @click="selMonth()" v-bind:class="{ active: isActive3}">本月</div>
                                <div class="col-xs-1 sel-times" @click="selYear()" v-bind:class="{ active: isActive4}">全年</div>
                                <div class="col-xs-6">
                                    <el-date-picker
                                            v-model="select.time"
                                            type="daterange"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期" clearable>
                                    </el-date-picker>
                                </div>
                            </div><!-- .widget-header -->
                            <hr class="widget-separator">
                            <h4 class="widget-title widget-header btn-group">问题次数统计</h4>
                            <div class="chart-body">
                                <template>
                                    <div class="no-data text-center" v-show="noData">暂无数据</div>
                                    <ve-histogram id="chart1" :data="chartData1" :colors="chartColors1" :width="width1" :min-width="minWidth" :settings="chartSettings1"></ve-histogram>
                                </template>
                            </div><!-- .widget-body -->
                        </div><!-- .widget -->

                    </div><!-- END column -->

                    <div class="col-md-4">
                        <div class="widget">
                            <h4 class="widget-header dateTime widget-title btn-group">
                                问题等级统计
                            </h4><!-- .widget-header -->
                            <hr class="widget-separator">
                            <h4 class="widget-title widget-header btn-group">
                            </h4>
                            <div class="chart-body text-center">
                                <div class="no-data text-center" v-show="noData" style="height:422px;">暂无数据</div>
                                <ve-ring :data="chartData2" v-show="!noData" :colors="chartColors2" :width="width2" :settings="chartSettings2"></ve-ring>
                            </div><!-- .widget-body -->
                        </div><!-- .widget -->
                    </div><!-- END column -->

                    <div class="col-md-12">

                        <div class="table-responsive">
                            <div class="tabel-header">
                                <div class="widget-title">问题处理状态</div>
                                <hr class="widget-separator">
                            </div>
                            <table class="table mail-list">
                                <tr v-for="item in logData">
                                    <td>
                                        <!-- a single mail -->
                                        <div class="mail-item">
                                            <table class="mail-container">
                                                <tr>
                                                    <td class="mail-left">
                                                        <div class="avatar avatar-sm avatar-circle">
                                                            <!--人员头像-->
                                                            <!--this.headerId=user.headPortrait;-->
                                                            <!--this.headerSrc=zyfUrl+'/acc/getPicBy/'+user.headPortrait;-->
                                                            <img class="img-responsive" v-if="item.headPortrait==''" src="./images/default-img.png" alt="avatar"/>
                                                            <img class="img-responsive" v-else :src="zyfUrl+'/acc/getPicBy/'+item.headPortrait" alt="avatar"/>

                                                            <!--<a href="#"><img src="./images/208.jpg" alt="sender photo"></a>-->
                                                        </div>
                                                    </td>
                                                    <td class="mail-center">
                                                        <div class="mail-item-header">
                                                            <span class="td-name">{{item.operatorUser}}</span>
                                                            &nbsp;&nbsp;在
                                                            <span class="theme-color" href="#">{{item.logType}}</span>
                                                            &nbsp;&nbsp;
                                                            <span class="td-status">发布了</span>
                                                            <a class="theme-color" href="#" @click="urlHtml()">{{item.content}}</a>
                                                        </div>
                                                        <p class="mail-item-excerpt">{{item.createTime}}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                            <hr class="widget-separator">
                                        </div><!-- END mail-item -->

                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div><!-- END column -->
                </div><!-- END row -->

            </section><!-- #dash-content -->
        </div><!-- .wrap -->
    </main>
    <!--</div>-->
</template>

<style scoped>
    .app-main{
        margin-top: 60px;
        padding-bottom: 15px;
    }
    .sel-times.active{
        color:#188ae2;
    }
    .sel-times.unactive{
        color:#6a6c6f;
    }
</style>


