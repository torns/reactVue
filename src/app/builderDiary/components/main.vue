/*<script>
// 请求列表
export default {
    name:"builder-diary",
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
            //select
            select:{
                name:"",
                createUser:"",
                time:"",
            },
            fileList:[],
        }
    },
    mounted: function() {
        //请求数据调用
    },
    methods: {
        //分页
        goto:function(index){
            if(index == this.current) return;
            this.current = index;
            // var that=this;
            // that.allNum=that.qualityList.length;
            // that.allpage=Math.ceil(that.qualityList.length/this.showItem);
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

    }
}
</script>

<template>
    <main id="root" class="app-main">
        <div class="wrap">
            <builderDiary></builderDiary>
        </div><!-- .wrap -->
    </main>
</template>
<template>
  <section class="app-content layout-center" id="builder-diary">
        <!--相应内容-->
        <div class="list-content">
            <div class="row">
                <div class="col-md-12" style="padding-right: 0;">
                    <div class="widget">
                        <header class="widget-header">
                            <div class="row">
                                <div class="col-xs-3">
                                    <el-input type="text" v-model="select.name" placeholder="请输入日记名称查找"></el-input>
                                </div>
                                <div class="col-xs-2">
                                    <el-select v-model="select.createUser" placeholder="选择添加人" id="sel_user">
                                        <el-option label="1" value="1"></el-option>
                                        <el-option label="2" value="2"></el-option>
                                        <el-option label="3" value="3"></el-option>
                                    </el-select>
                                </div>
                                <div class="col-xs-3">
                                    <el-date-picker v-model="select.time"
                                        type="daterange" 
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期" clearable>
                                    </el-date-picker>
                                </div>
                                <div class="col-xs-4">
                                    <button type="button" class="btn primary backg-color top-select">筛选</button>
                                    <button type="button" class="btn btn-default">重置</button>
                                    <div class="pull-right">
                                        <button type="button" class="btn btn-default">添加日记</button>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <hr class="widget-separator">
                        <div class="widget-body security-body" style="padding: 0;">
                            <div class="table-responsive">
                                <!--表格-->
                                <table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">
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
                                        <tr>
                                            <td>3</td>
                                            <td class="td-content td-title">
                                                钢筋间距调整问题钢筋间距调整问题钢筋间距调整问题123
                                            </td>
                                            <td>2018-01-01</td>
                                            <td>
                                                <img src="../images/user.png">
                                                沈超
                                            </td>
                                            <td class="td-handles">
                                                <a href="./edit-diary.html" class="c_3"><i class="fa fa-edit fa-2 td-edit" aria-hidden="true"></i></a>
                                                <a href="./look-diary.html" class="c_3">
                                                    <i class="fa fa-search fa-2 td-search" aria-hidden="true" data-toggle="modal" data-target="#myModal_3"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!--分页-->
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
