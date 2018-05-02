<script>

export default {
    name:"plan-progress",
    data(){
        return{
            list:[],

//            模型构件信息
            componentMes:componentMes,
            showStyleFlag:1
        }
    },
    mounted: function() {
        this.$nextTick(function(){
            this.iframe();
        });
        this.init();
    },
    methods: {
        init:function () {
            var that = this;
            this.$http.post(zyfUrl + '/taskPcMap/getAll', {
                userId: userId,
                projectId: projectId,
                jwt: jwt,
                modelId:modelId,

            }, {
                headers: {},
                emulateJSON: true
            }).then(function (result) {
                // 这里是处理正确的回调
                var tempdata = result.data.data
                that.list=tempdata;


            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        startSimulation:function () {
            var that=this;
            console.log("开始模拟")
            //4.隐藏/显示所有构件
            //参数1：固定为[0],参数:2：true：显示，false：隐藏
            hwv.getModel().setNodesVisibility([0], false);

            for(var i=0;i<that.list.length;i++){
                console.log("开始模拟循环1")
                if(that.list[i].pcIdList!=""){
                    console.log("开始模拟22")
                    //5.隐藏/显示列表中的构件
                    //参数1：uuid列表,参数2：true：显示，false：隐藏
//                    hwv.getModel().setNodesVisibility(that.list[i].pcIdList, true);
                    for(var k=0;k<that.list[i].pcIdList.length;k++){
                        var _that=that.list[i];
                        (function (_that,k) {
                            setTimeout(function () {
                                console.log(_that);
//                            console.log(_that.pcIdList[1]);
                                console.log("开始模拟33")
                                var temp=[];
                                temp.push(_that.pcIdList[k])
                                hwv.getModel().setNodesVisibility(temp, true);
                                console.log("延迟渲染")

                            },3000)
                        })(_that,k);




                    }

                }

            }
        },
        startSimulation2:function () {

            var allBodyIDS=[];
            getAllChildNodes(hwv.getModel(),0,allBodyIDS);
            hwv.getModel().setNodesVisibility([0], false);

            for(var i=0;i<allBodyIDS.length;i++){
                    var that=allBodyIDS[i];
                (function(that) {
                    setTimeout(function () {
                        console.log("渲染了")

                        var temp = [];
                        temp.push(that)
                        hwv.getModel().setNodesVisibility(temp, true);


                    }, 50)
                })(that);
                }


            },

        iframe:function () {
            console.log($("iframe").contents().find(".ganttButtonBar").length);
            $("iframe").contents().find(".ganttButtonBar").hide();
        },
         modelPlayView:function () {
            var that=this;
            if(window.modelPlay==true){
                that.startSimulation2()
            }else{
                this.$message({message: '模型加载中', type: 'warning'});
            }
        },
        //      构件属性
        showStyle:function () {
            if(this.showStyleFlag==0){
                this.showStyleFlag=1;
            }else{
                this.showStyleFlag=0;
            }

        },
        closeModel:function () {
            $('.modelOpenMes').hide();
        }

    },
    computed: {

    },
    watch:{
    }
}
</script>

<template>
    <main id="root" class="app-main">
        <div class="wrap">
            <planProgress></planProgress>
        </div><!-- .wrap -->
    </main>
</template>
<template>
  <section class="app-content layout-center" id="problem-list">
        <!-- search results -->
        <!--相应内容-->
        <div class="row">
            <div class="col-md-8">
                <div class="md8-left">
                    <!--<div class="model-content">-->
                        <!--&lt;!&ndash;模型嵌入&ndash;&gt;-->
                    <!--</div>-->
                    <div id="content">
                        <div id="viewerContainer"></div>
                        <div id="dockingPanelTip" class="dockPane react-draggable" style="display: none; max-height: 617px; max-width: 837.641px;">
                            <div class="dockingPanelScroll right" id="5b34-1807-67c6-9b88-scroll-container" style="height: calc(100% - 25px);">
                                <div class="pbwell-simaple">
                                    <div>
                                        <label value="完成" style="border-radius: 14px;margin-right: 5px;width:14px;height:14px;vertical-align: middle;background-color:#1aff00;opacity: 0.70;" onmouseover="this.title=this.innerText" title=""></label>完成
                                    </div>
                                    <div>
                                        <label value="未施工" style="border-radius: 14px;margin-right: 5px;width:14px;height:14px;vertical-align: middle;background-color:#FF0000;opacity: 0.70;" onmouseover="this.title=this.innerText"></label>未施工
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="toolBar">
                            <div class="toolbar-tools">
                                <div id="view-button" title="切换视图" data-operatorclass="toolbar-camera" data-submenu="view-submenu" class="BimViewer-tool toolbar-menu">
                                    <div class="tool-icon"></div>
                                </div>

                                <div class="tool-seperator "></div>

                                <div id="snapshot-button" title="变换颜色" data-operatorclass="toolbar-snapshot" class="BimViewer-tool">
                                    <div class="tool-icon"></div>
                                </div>

                                <div id="showtree-button" title="空间结构树" data-operatorclass="toolbar-showtree" class="BimViewer-tool">
                                    <div class="tool-icon"></div>
                                </div>
                            </div>
                            <div id="submenus">
                                <div id="view-submenu" data-button="view-button" class="toolbar-submenu submenus">
                                    <table>
                                        <tr>
                                            <td>
                                                <div id="view-left" title="左视图" data-operatorclass="toolbar-left" class="submenu-icon"></div>
                                            </td>
                                            <td>
                                                <div id="view-right" title="右视图" data-operatorclass="toolbar-right" class="submenu-icon"></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div id="view-top" title="顶视图" data-operatorclass="toolbar-top" class="submenu-icon"></div>
                                            </td>
                                            <td>
                                                <div id="view-bottom" title="底视图" data-operatorclass="toolbar-bottom" class="submenu-icon"></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div id="view-front" title="前视图" data-operatorclass="toolbar-front" class="submenu-icon"></div>
                                            </td>
                                            <td>
                                                <div id="view-back" title="后视图" data-operatorclass="toolbar-back" class="submenu-icon"></div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <el-button class="modelPlay" @click="modelPlayView()">开始播放</el-button>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="md4-right space-frame">
                    <div class="widget">
                        <header class="widget-header">
                            <h4 class="widget-title right-title">空间结构</h4>
                        </header><!-- .widget-header -->
                        <hr class="widget-separator">
                        <div class="widget-body">
                            <!--结构树-->
                            <!--<ul class="ztree" id="treeDemo"></ul>-->
                            <div id="modleTree" class="modelTree react-draggable" style="touch-action: none; transform: translate(0px, 0px);">
                                <div id="treeHeader" class="settings-header draggable-tree-header">
                                    <span>空间结构</span>
                                </div>
                                <div id="ztreeContainer" class="ztree ps-container ps-theme-default" data-ps-id="54c6af3e-d5b2-ec9a-a3d0-db5452695b26" style="padding-right:4px">
                                    <ul id="treeControl" class="ztree"></ul>
                                </div>
                            </div>

                        </div><!-- .widget-body -->
                    </div>
                </div>
            </div>
        </div>
        <div class="list-content">
            <div class="row">
                <div class="col-md-12" style="padding-right: 0;">
                <!--下面的内容-->
                <div class="widget">
                    <div class="widget-body" style="padding: 0;">
                        <div class="plan-center">
                            <iframe src="http://116.62.203.181/gantt/process-managerView.html"></iframe>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      <!--模型预览-->
      <div class="modelOpenMes" id="modelOpenMes" v-show="componentMes!=''">
          <div class="container">
              <div class="row modelHeader">
                  <div class="col-xs-4">
                      <span>表面</span>
                  </div>
                  <div class="pull-right iconPosition" @click="closeModel()"><i class="el-icon-close"></i></div>
              </div>
              <div class="row modelHeader mesDetails" @click="showStyle()">
                  <div class="col-xs-4">构件属性</div>
                  <div class="pull-right iconPosition" v-show="showStyleFlag==1"><i class="el-icon-arrow-down"></i></div><!--down-->
                  <div class="pull-right iconPosition" v-show="showStyleFlag==0"><i class="el-icon-arrow-up"></i></div><!--up-->
              </div>
              <div class="row modelMes" v-show="showStyleFlag==1">
                  <div class="col-xs-12" v-for="item in componentMes">
                      <div class="col-xs-4" :title="item.name">{{item.name}}</div>
                      <div class="col-xs-8" :title="item.value">{{item.value}}</div>
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
    iframe{
        width: 100%;
        border: 0;
        height: 118%;
    }
    iframe .ganttButtonBar{
        display: none;
    }
    #toolBar{
        display: none!important;
    }
    .modelPlay{
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 2%;
        left: 2%;
        z-index: 8;
        border-radius: 3px;
        opacity: 0.8;
        -webkit-box-sizing: content-box !important;
        -moz-box-sizing: content-box !important;
        box-sizing: content-box !important;
    }
    /*构件属性*/
    .modelOpenMes{
        display: block;
        width: 263px;
        height: 400px;
        position: absolute;
        top: 80px;
        right: 122px;
        background: #2f2f2f;
        color: #fff;
        opacity: 0.8;
    }
    .modelOpenMes .container{
        width: 100%;
    }
    .modelHeader{
        padding: 4px 0;
        cursor: pointer;
        background: #414141;
    }
    .iconPosition{
        margin-right: 12px;
    }
    .container .row{
        margin-left: -15px;
        margin-right: -15px;
    }
    .modelMes{
        height: 344px;
        overflow-y: auto;
    }
    .modelMes .col-xs-12{
        border-top: 1px solid #797979;
    }
    .modelMes div{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .modelMes .col-xs-12:nth-last-child(1){
        border-bottom: 1px solid #797979;
    }
    .modelMes .col-xs-12 div:nth-child(1){
        border-right: 1px solid #797979;
    }
    .modelOpenMes .modelMes:nth-child(1){
        background: unset;
        padding: 8px 0;
    }
</style>


