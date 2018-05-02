<script>
    import common from '../../../components/common.vue';

    export default {
        extends: common,
        name: '',
        data() {
            return {
                //apis
                urls: [
                    "/model/listAllPcInfo",//list
                ],
                //api index
                url_idx: {
                    init: 0,
                },
                //api parameters
                params: [
                    {userId: window.userId, projectId: window.projectId, jwt: window.jwt, modelId: 1}
                ],
                m_list: [],
                temp_list: [],
                trust: 1,
                dialogVisibleSecond: false,
                modify: {
                    date: '',
                },
                //当前页
                current: 1,
                //每页数据
                showItem: 20,
                //页数
                allpage: "",
                //总个数
                allNum: 0,
                pcLevel: ["请选择模型的层次"],
                value1: "请选择模型的层次",
                pcType: ["请选择构建的类型"],
                value2: "请选择构建的类型",
                uuidValue: "",
                pcProcess: [],
                pcProcessName: "",
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                pc: "",
                pcId: "",
                pcindex: "",
                imagePcProcess:""
            }
        },
        mounted: function () {

        },
        methods: {
            init_cb: function (result) {
                //alert(result.data.message);
                //console.log(result.data);
                //console.log(result.data.data);
                this.m_list = result.data.data;
                this.temp_list = result.data.data;
                this.allNum = this.m_list.length;
                this.allpage = Math.ceil(this.allNum / this.showItem);
            },
            track: function () {
                this.trust = 0;
            },
            modifyDate: function (pc) {
                this.dialogVisibleSecond = true;
                //console.log(priId);
                this.pc = pc;
            },
            //分页
            goto: function (index) {
                //console.log(index);
                if (index == this.current) return;
                this.current = index;
            },
            //选择模型的层次
            selectPcLevel: function () {
                //console.log("哈哈，模型的楼层信息");
                //发送ajax请求。
                this.$http.post(zyfUrl + '/model/getAllLevel', {
                        userId: userId,
                        projectId: projectId,
                        jwt: jwt
                    },
                    {
                        headers: {},
                        emulateJSON: true
                    }).then(function (result) {
                    //request success
                    //process the result list
                    if (result.body.code == 10000) {
                        console.log("数据访问成功!");
                        //console.log(result.body.data);
                        this.pcLevel = this.pcLevel.concat(result.body.data);
                        console.log(this.pcLevel);
                    }
                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response)
                });
            },
            reset: function () {
                this.uuidValue = "";
                this.value1 = "请选择模型的层次";
                this.value2 = "请选择构建的类型";
            },
            selectPcInformation: function () {
                var uuid = "";
                var pcLevel = "";
                var pcType = "";
                if (this.uuidValue != "") {
                    uuid = this.uuidValue.trim();
                }
                if (this.value1 != "请选择模型的层次") {
                    pcLevel = this.value1;
                }
                if (this.value2 != "请选择构建的类型") {
                    pcType = this.value2;
                }
                //console.log(uuid);
                //console.log(pcLevel);
                //console.log(pcType);
                //判断是否要重新筛选
                if (uuid == "" && pcLevel == "" && pcType == "") {
                    //说明不需要过滤了
                    //console.log("不需要筛选!");
                    this.current = 1;
                    this.m_list = this.temp_list;
                    this.allNum = this.m_list.length;
                    this.allpage = Math.ceil(this.allNum / this.showItem);
                }
                else {
                    //console.log("需要筛选!");
                    //需要过滤数据
                    //复制一个数组
                    var tempDate = this.temp_list.slice(0);
                    //console.log(tempDate);
                    var date = [];
                    //console.log(tempDate[i]);
                    if (uuid != "" && pcLevel == "" && pcType == "") {
                        for (var i = 0; i < tempDate.length; i++) {
                            if (tempDate[i].uuid == uuid) {
                                //保存下来。
                                date.push(tempDate[i]);
                            }
                        }
                    } else if (uuid != "" && pcLevel != "" && pcType == "") {
                        for (var i = 0; i < tempDate.length; i++) {
                            if (tempDate[i].uuid == uuid && tempDate[i].pcLevel == pcLevel) {
                                //保存下来。
                                date.push(tempDate[i]);
                            }
                        }
                    } else if (uuid != "" && pcLevel == "" && pcType != "") {
                        for (var i = 0; i < tempDate.length; i++) {
                            if (tempDate[i].uuid == uuid && tempDate[i].pcType == pcType) {
                                //保存下来。
                                date.push(tempDate[i]);
                            }
                        }
                    } else if (uuid == "" && pcLevel != "" && pcType == "") {
                        for (var i = 0; i < tempDate.length; i++) {
                            if (tempDate[i].pcLevel == pcLevel) {
                                //保存下来。
                                date.push(tempDate[i]);
                            }
                        }
                    } else if (uuid == "" && pcLevel != "" && pcType != "") {
                        for (var i = 0; i < tempDate.length; i++) {
                            if (tempDate[i].pcLevel == pcLevel && tempDate[i].pcType == pcType) {
                                //保存下来。
                                date.push(tempDate[i]);
                            }
                        }
                    } else if (uuid == "" && pcLevel == "" && pcType != "") {
                        for (var i = 0; i < tempDate.length; i++) {
                            if (tempDate[i].pcType == pcType) {
                                //保存下来。
                                date.push(tempDate[i]);
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < tempDate.length; i++) {
                            if (tempDate[i].uuid == uuid && tempDate[i].pcLevel == pcLevel && tempDate[i].pcType == pcType) {
                                //保存下来。
                                date.push(tempDate[i]);
                            }
                        }
                    }
                    //循环完，重新赋值就好了
                    //console.log(date);
                    this.m_list = date;
                    //console.log(this.m_list);
                    this.current = 1;
                    this.allNum = this.m_list.length;
                    this.allpage = Math.ceil(this.allNum / this.showItem);
                }
            },
            printMa: function (index) {
                console.log("打印二维码!");
                var pcInfoId = this.m_list[index].priId;
                console.log(pcInfoId);
                this.$http.get(zyfUrl + '/model/generate2Code/' + pcInfoId, {
                        userId: userId,
                        projectId: projectId,
                        jwt: jwt
                    },
                    {
                        headers: {},
                        emulateJSON: true
                    }).then(function (result) {
                    //request success
                    //process the result list
                    //console.log(result.body);
                    //打开二维码的弹出框
                    this.imagePcProcess = result.body;
                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });

            },
            getPcProcess: function (index) {
                var pcId = this.m_list[index].priId;
                this.pcId = pcId;
                this.pcindex = index;
                //console.log("构建追踪!");
                //console.log(pcId);
                //发送ajax请求
                this.$http.post(zyfUrl + '/scheduleProcess/getAllProcessInfos', {
                        userId: userId,
                        projectId: projectId,
                        jwt: jwt,
                        structureId: pcId
                    },
                    {
                        headers: {},
                        emulateJSON: true
                    }).then(function (result) {
                    //process the result list
                    console.log(result);
                    if (result.body.code == 10000) {
                        //console.log("数据访问成功!");
                        //console.log(result.body.data);
                        this.trust = 2;
                        this.pcProcess = result.body.data;
                        this.pcProcessName = this.m_list[index].pcName;
                        //console.log(this.pcProcess);
                    } else if (result.body.code == 20000) {
                        //alert("暂无数据!");
                        this.$message({ message: '暂无数据', type: 'warning' });
                    }
                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            updatepcPrcess: function () {
                var pc = this.pc;
                //console.log(pc);
                //console.log(pc.processId);
                //console.log("修改后的录入时间");
                //console.log(this.modify.date);
                //发送ajax请求。修改录入时间
                this.$http.post(zyfUrl + '/scheduleProcess/updateProcessTime', {
                        userId: userId,
                        projectId: projectId,
                        jwt: jwt,
                        processId: pc.processId,
                        time: this.modify.date.getTime()
                    },
                    {
                        headers: {},
                        emulateJSON: true
                    }).then(function (result) {
                    //request success
                    //process the result list
                    if (result.body.code == 10000) {
                        //console.log(this.pcLevel);
                        console.log("修改录入时间成功!");
                        this.dialogVisibleSecond = false;
                        //发送ajax请求
                        this.$http.post(zyfUrl + '/scheduleProcess/getAllProcessInfos', {
                                userId: userId,
                                projectId: projectId,
                                jwt: jwt,
                                structureId: this.pcId
                            },
                            {
                                headers: {},
                                emulateJSON: true
                            }).then(function (result) {
                            //process the result list
                            console.log(result);
                            if (result.body.code == 10000) {
                                //console.log("数据访问成功!");
                                //console.log(result.body.data);
                                this.trust = 2;
                                this.pcProcess = result.body.data;
                                this.pcProcessName = this.m_list[this.pcindex].pcName;
                                //console.log(this.pcProcess);
                            } else if (result.body.code == 20000) {
                                alert("暂无数据!");
                            }
                        }, function (response) {
                            // 这里是处理错误的回调
                            console.log(response);
                        });
                    }
                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });

            },
            deletepcProcess: function (pcName) {
                //console.log(pcName);
                var pcInfo = this.pcProcess[pcName];
                console.log(pcInfo);
                var structureStatu = pcInfo[0].structureStatu;
                console.log(structureStatu);
                //发送ajax请求
                this.$http.post(zyfUrl + '/scheduleProcess/deletepcProcess', {
                        userId: userId,
                        projectId: projectId,
                        jwt: jwt,
                        structureStatu: structureStatu
                    },
                    {
                        headers: {},
                        emulateJSON: true
                    }).then(function (result) {
                    //process the result list
                    console.log(result);
                    if (result.body.code == 10000) {
                        console.log("删除成功!");
                        //发送ajax请求
                        this.$http.post(zyfUrl + '/scheduleProcess/getAllProcessInfos', {
                                userId: userId,
                                projectId: projectId,
                                jwt: jwt,
                                structureId: this.pcId
                            },
                            {
                                headers: {},
                                emulateJSON: true
                            }).then(function (result) {
                            //process the result list
                            console.log(result);
                            if (result.body.code == 10000) {
                                //console.log("数据访问成功!");
                                //console.log(result.body.data);
                                this.trust = 2;
                                this.pcProcess = result.body.data;
                                this.pcProcessName = this.m_list[this.pcindex].pcName;
                                //console.log(this.pcProcess);
                            } else if (result.body.code == 20000) {
                                alert("暂无数据!");
                            }
                        }, function (response) {
                            // 这里是处理错误的回调
                            console.log(response);
                        });
                    } else if (result.body.code == 20000) {
                        alert("暂无数据!");
                    }
                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            open4(index) {
                //var src = this.imagePcProcess;
                var pcInfoId = this.m_list[index].priId;
                this.$alert('<img src='+zyfUrl+'/model/generate2Code/' + pcInfoId+'?projectId='+projectId+'&userId='+userId+'&jwt='+jwt+'>', '二维码', {
                    dangerouslyUseHTMLString: true
                });
            }
        }
        ,
        computed: {
            // 分页
            pages: function () {
                var pag = [];
                if (this.current < this.showItem) { //如果当前的激活的项 小于要显示的条数
                    //总页数和要显示的条数那个大就显示多少条
                    var i = Math.min(this.showItem, this.allpage);
                    while (i) {
                        pag.unshift(i--);
                    }
                } else { //当前页数大于显示页数了
                    var middle = this.current - Math.floor(this.showItem / 2),//从哪里开始
                        i = this.showItem;
                    if (middle > (this.allpage - this.showItem)) {
                        middle = (this.allpage - this.showItem) + 1
                    }
                    while (i--) {
                        pag.push(middle++);
                    }
                }
                return pag
            }
            ,
        }
        ,
        created: function () {
            //发送ajax请求。请求那个模型的楼层的方法
            this.$http.post(zyfUrl + '/model/getAllLevel', {
                    userId: userId,
                    projectId: projectId,
                    jwt: jwt
                },
                {
                    headers: {},
                    emulateJSON: true
                }).then(function (result) {
                //request success
                //process the result list
                if (result.body.code == 10000) {
                    //console.log("数据访问成功!");
                    //console.log(result.body.data);
                    this.pcLevel = this.pcLevel.concat(result.body.data);
                    //console.log(this.pcLevel);
                }
            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });

            //发送ajax请求。请求那个模型的构建的类型
            this.$http.post(zyfUrl + '/model/getAllPcOwnType', {
                    userId: userId,
                    projectId: projectId,
                    jwt: jwt
                },
                {
                    headers: {},
                    emulateJSON: true
                }).then(function (result) {
                //request success
                //process the result list
                if (result.body.code == 10000) {
                    //console.log("模型构建数据访问成功!");
                    //console.log(result.body.data);
                    this.pcType = this.pcType.concat(result.body.data);
                    //console.log(this.pcType);
                }
            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        },
        filters: {
            dateType: function (date) {
                var date = new Date(date);
                var y = 1900 + date.getYear();
                var m = "0" + (date.getMonth() + 1);
                var d = "0" + date.getDate();
                return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
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
                <div class="list-content" v-if="trust == 1">
                    <div class="row">
                        <div class="col-md-12" style="padding-right: 0;">
                            <div class="widget">
                                <header class="widget-header">
                                    <div class="row">
                                        <div class="col-xs-2">
                                            <input type="text" v-model="uuidValue" placeholder="请输入查询构件编号">
                                        </div>
                                        <div class="col-xs-2">
                                            <!--<select name="type" class="theaderSel" @click="selectPcLevel">
                                                &lt;!&ndash;<option value="0" checked="">选择标高</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>&ndash;&gt;
                                                <option v-for="pc in pcLevel">{{pc}}</option>
                                            </select>-->
                                            <el-select v-model="value1" placeholder="请选择">
                                                <el-option
                                                        v-for="item in pcLevel"
                                                        :label="item"
                                                        :value="item">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="col-xs-2">
                                            <!--<select name="type" class="theaderSel">
                                                <option value="0" checked="">选择构件类型</option>
                                                <option value="1">未施工</option>
                                                <option value="2">施工完成</option>
                                            </select>-->
                                            <el-select v-model="value2" placeholder="请选择">
                                                <el-option
                                                        v-for="item in pcType"
                                                        :label="item"
                                                        :value="item">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="col-xs-2">
                                            <button type="button" class="btn primary backg-color top-select"
                                                    @click="selectPcInformation">筛选
                                            </button>
                                            <button type="button" class="btn btn-default" @click="reset">重置</button>
                                        </div>
                                        <div class="pull-right">
                                            <!--<button type="button" class="btn primary backg-color top-add"
                                                    data-toggle="modal" data-target="#myModal_11">打印二维码
                                            </button>-->
                                           <!-- <button type="button" class="btn btn-default" @click="open4">导出</button>-->
                                        </div>
                                    </div>
                                </header>
                                <hr class="widget-separator">
                                <div class="widget-body" style="padding: 0;">
                                    <div class="table-responsive">

                                        <!--<table id="default-datatable" data-plugin="DataTable" class="table table-striped" cellspacing="0" width="100%">-->
                                        <table id="default-datatable" data-plugin="DataTable"
                                               class="table table-striped" cellspacing="0" width="100%">
                                            <thead>
                                            <tr>
                                                <th>构建编号</th>
                                                <th>构建类型</th>
                                                <th>当前状态</th>
                                                <th>楼层</th>
                                                <th>重量</th>
                                                <th>体积</th>
                                                <th>宽度</th>
                                                <th>高度</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(r,index) in m_list.slice((current-1)*showItem,current*showItem)">
                                                <td>{{r.uuid}}</td>
                                                <td class="td-content td-title">
                                                    {{r.pcType}}
                                                </td>
                                                <td>{{r.relateStatus}}</td>
                                                <td>
                                                    {{r.pcLevel}}
                                                </td>
                                                <td>
                                                    {{r.weight}}
                                                </td>
                                                <td>
                                                    {{r.volume}}
                                                </td>
                                                <td>
                                                    {{r.width}}
                                                </td>
                                                <td>
                                                    {{r.height}}
                                                </td>
                                                <td class="td-handles">
                                                    <span class="processing theme-color" @click="getPcProcess(index)">[过程追踪]</span>
                                                    <!--<span class="print2 theme-color">[打印二维码]</span>-->
                                                    <!--<i class="print2" aria-hidden="true" data-toggle="modal" data-target="#myModal_21"></i>-->
                                                    <!--<a href="./qrCode.html">打印二维码</a>-->
                                                    <span @click="open4(index)">打印二维码</span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <div class="all-num">
                                            <span class="allNum">共&nbsp;
                                                <span class="theme-color">{{allNum}}</span>&nbsp;条
                                            </span>
                                        </div>
                                        <div class="pages text-center">
                                            <ul class="pagination">
                                                <li v-show="current != 1" @click="current-- && goto(current)"><a
                                                        href="#">上一页</a></li>
                                                <li v-for="index in pages" @click="goto(index)"
                                                    :class="{'active':current == index}" :key="index">
                                                    <a href="#">{{index}}</a>
                                                </li>
                                                <li v-show="allpage != current && allpage != 0 "
                                                    @click="current++ && goto(current++)"><a href="#">下一页</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div><!-- .widget-body -->
                            </div>
                        </div>
                    </div>
                </div>
                <!--过程追踪-->
                <div class="process-track" v-else>
                    <div class="row">
                        <div class="col-md-12" style="padding-right: 0;">
                            <div class="widget">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div class="task-title theme-color">
                                            <i class="fa fa-truck theme-color" aria-hidden="true"></i>
                                            <span class="name">{{pcProcessName}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="track-center">
                                    <div class="row" v-for="(item,index) in pcProcess">
                                        <div class="col-xs-1">
                                            <div class="circle bg-blue">
                                            </div>
                                        </div>
                                        <div class="col-xs-11">
                                            <div class="one-part">
                                                <img src="./images/left.png" class="left-icon">
                                                <div class="row part-top">
                                                    <div class="col-xs-3">
                                                        <span>{{index}}</span>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <!--<span>累计完成百分比%</span>-->
                                                    </div>
                                                    <div class="pull-right">
                                                        <span class="theme-color delete-icon"
                                                              @click="deletepcProcess(index)">删除记录</span>
                                                    </div>
                                                </div>
                                                <div class="row part-center" v-for="(pc,index) in item">
                                                    <div class="col-xs-10">
                                                        人员：<span class="user-name">{{pc.createUserName}}</span>
                                                        时间：<span class="time">{{pc.time|dateType}} </span>
                                                        完成百分比：<span>{{pc.structureScale}}%</span>
                                                        备注：<span>{{pc.remark}}</span>
                                                    </div>
                                                    <div class="pull-right">
                                                        <button type="button" class="btn primary backg-color track-edit"
                                                                @click="modifyDate(pc)">
                                                            修改记录
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <div class="row">
                                         <div class="col-xs-1">
                                             <div class="circle bg-blue">
                                             </div>
                                         </div>
                                         <div class="col-xs-11">
                                             <div class="one-part">
                                                 <img src="./images/left.png" class="left-icon">
                                                 <div class="row part-top">
                                                     <div class="col-xs-3">
                                                         <span>施工完成</span>
                                                     </div>
                                                     <div class="col-xs-3">
                                                         <span>累计完成百分比100%</span>
                                                     </div>
                                                     <div class="pull-right">
                                                         <span class="theme-color delete-icon">删除记录</span>
                                                     </div>
                                                 </div>
                                                 <div class="row part-center">
                                                     <div class="col-xs-10">
                                                         人员：<span class="user-name">邹胜</span>
                                                         时间：<span class="time">2017-09-01 17:30 </span>
                                                         完成百分比：<span>100.0%</span>
                                                         备注：<span>123</span>
                                                     </div>
                                                     <div class="pull-right">
                                                         <button type="button" class="btn primary backg-color track-edit"
                                                                 @click="modifyDate()">
                                                             修改记录
                                                         </button>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>-->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <el-dialog :visible.sync="dialogVisibleSecond" width="40%">
                    <div class="modal-header primary backg-color">
                        <div class="modal-title">
                            修改状态记录
                        </div>
                    </div>
                    <el-form :model="modify" ref="modify" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="状态扫码时间">
                            <!--<el-input v-model=""></el-input>-->
                            <el-date-picker
                                    v-model="modify.date"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>

                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisibleSecond = false">取 消</el-button>
                        <el-button type="primary" @click="updatepcPrcess">保 存</el-button>
                    </span>
                </el-dialog>
            </section><!-- #dash-content -->
        </div><!-- .wrap -->
    </main>
    <!--</div>-->
</template>


<style scoped>
    .app-main {
        margin-top: 60px;
        margin-bottom: 15px;
    }
</style>
