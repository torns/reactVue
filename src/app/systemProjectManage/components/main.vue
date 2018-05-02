<script>
    import {ajax} from '../../../common/list-common.js'

    export default {
        name: '',
        data() {
            return {
                urls: [
                    "/project/getAllProject",//list
                    "/project/search",//search
                    "/project/editInfo",//update
                    "/project/create",   //insert
                    "/project/edit" //update submit
                ],
                url_idx: {
                    init: 0,
                    search: 1,
                    update: 2,
                    insert: 3,
                    update_submit: 4
                },
                params: [
                    {userId: window.userId, startIndex: 1, pageSize: 5, jwt: jwt},
                    {userId: window.userId, startIndex: 0, pageSize: 0, searchData: "", jwt: jwt},
                    {userId: window.userId, actionProjectId: '', jwt: jwt},
                    {
                        userId: window.userId,
                        jwt: jwt,
                        projectName: "",
                        projectAddress: "",
                        projectSize: 0,
                        projectMoney: 0,
                        projectType: 0
                    },
                    {
                        userId: window.userId,
                        projectId: window.projectId,
                        actionProjectId: '',
                        projectName: '',
                        projectAddress: '',
                        projectSize: '',
                        projectMoney: '',
                        projectType: ''
                    }
                ],
                list: [],//list from server
                temp_list: [],
                m_curIdx: 0,
                m_actionProjectId: '',
                dialogVisible: false,
                dialogVisibleSecond: false,
                dialogUpdateVisible: false,
                flag: 1,
                title: '创建项目',
                //创建&编辑
                ruleForm: {
                    projectId: '',
                    projectName: '',
                    projectAddress: '',
                    projectSize: '',
                    projectMoney: '',
                    projectType: ''
                },
                updateForm: {
                    userId: window.userId,
                    actionProjectId: window.projectId,
                    projectName: '',
                    projectAddress: '',
                    projectSize: '',
                    projectMoney: '',
                    projectType: ''
                },
                rules: {
                    projectName: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    projectAddress: [
                        {required: true, message: '请输入项目地址', trigger: 'blur'},
                    ],
                    // area:[
                    //     {  required: false, message: '请输入建筑面积', trigger: 'blur' }
                    // ],
                    // price:[
                    //     {  required: false, message: '请输入工程造价', trigger: 'blur' }
                    // ],
                    // type:[
                    //     {  required: false, message: '请输入工程类型', trigger: 'blur' }
                    // ]
                },
                //设置
                setForm: {
                    projectId: '',
                    projectManager: '',
                    engineer: '',
                    economist: '',
                    productionManager: '',
                    buildUnit: '',
                    constructionUnit: '',
                    controlUnit: ''
                },
                setFormRules: {
                    projectManager: [
                        {required: true, message: '请选择项目经理', trigger: 'change'},
                    ],
                    engineer: [
                        {required: false, message: '请选择工程师', trigger: 'change'},
                    ],
                    economist: [
                        {required: false, message: '请选择经济师', trigger: 'change'},
                    ],
                    productionManager: [
                        {required: false, message: '请选择生产经理', trigger: 'change'},
                    ],
                    buildUnit: [
                        {required: false, message: '请选择建设单位', trigger: 'change'},
                    ],
                    constructionUnit: [
                        {required: false, message: '请选择施工单位', trigger: 'change'},
                    ],
                    controlUnit: [
                        {required: false, message: '请选择监理单位', trigger: 'change'},
                    ]
                },
                //==============
                //当前页
                current: 1,
                //每页数据
                showItem: 12,
                //页数
                allpage: "",
                //总个数
                allNum: 0,
                //==================
                typeValue: "",
                peopleList: [],
                departmentList: []
            }
        },
        mounted: function () {

        },

        created: function () {
            //var idx = this.url_idx.init;//api index
            //alert("before ajax in created of projectManage");
            //ajax(this, zyfUrl + this.urls[idx], this.params[idx], 0, this.init_cb);
            this.$http.post(zyfUrl + '/project/getAllProject', {
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
                    this.list = result.body.data;
                    this.temp_list = result.body.data;
                    this.allNum = this.list.length;
                    this.allpage = Math.ceil(this.allNum / this.showItem);
                }
            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });

        },
        methods: {
            init_cb: function (result) {
                //alert(result.data.message);
                this.list = result.data.data.list;
            },
            insert_cb: function (result) {
                //alert(result.data.message);
                this.dialogVisible = false;
                //refresh page
                var idx = this.url_idx.init;//api index
                //alert("before ajax in created of projectManage");
                ajax(this, zyfUrl + this.urls[idx], this.params[idx], 0, this.init_cb);
            },
            update_cb: function (result) {
                //alert(result.data.message);
                this.dialogUpdateVisible = false;

                //refresh page
                var idx = this.url_idx.init;//api index
                //alert("before ajax in created of projectManage");
                ajax(this, zyfUrl + this.urls[idx], this.params[idx], 0, this.init_cb);
            },
            insert: function () {
                this.dialogUpdateVisible = true;
                this.title = '创建项目';
                this.flag = 0;
                //将表单里面的数据清空
                //创建&编辑
                this.ruleForm.projectName = "";
                this.ruleForm.projectAddress = "";
                this.ruleForm.projectSize = "";
                this.ruleForm.projectMoney = "";
                this.ruleForm.projectType = "";
            },
            insertSubmit: function () {
                var idx = this.url_idx.insert;//api index
                //prepare params
                var param = this.params[idx];
                param.projectName = this.ruleForm.projectName;
                param.projectAddress = this.ruleForm.projectAddress;
                param.projectSize = this.ruleForm.projectSize;
                param.projectMoney = this.ruleForm.projectMoney;
                param.projectType = this.ruleForm.projectType;
                ajax(this, zyfUrl + this.urls[idx], param, 0, this.insert_cb);
            },
            editinfo_cb: function (result) {
                //alert(result.data.message);
                var data = result.data.data;
                this.updateForm.projectName = data.projectName;
                this.updateForm.projectAddress = data.projectPath;
                this.updateForm.projectSize = data.projectSize;
                this.updateForm.projectMoney = data.projectMoney;
                this.updateForm.projectType = data.projectType;
            },
            update: function (index) {
                this.dialogUpdateVisible = true;
                this.title = '编辑项目';
                this.flag = 1;
                //============================================
                var project = this.list[index];
                this.ruleForm.projectId = project.projectId;
                this.ruleForm.projectName = project.projectName;
                this.ruleForm.projectAddress = project.projectPath;
                this.ruleForm.projectSize = project.projectSize;
                this.ruleForm.projectMoney = project.projectMoney;
                this.ruleForm.projectType = project.projectType;

            },
            updateSubmit: function () {
                //var idx = this.url_idx.update_submit;//api index
                //this.updateForm.actionProjectId = this.m_actionProjectId;
                //ajax(this, zyfUrl + this.urls[idx], this.updateForm, 0, this.update_cb);
                var size = this.ruleForm.projectSize;
                if (size != "") {
                    size = parseFloat(size);
                    if (isNaN(size)) {
                        //alert("建筑面积必须是数字!");
                        this.$message({ message: '建筑面积必须是数字!', type: 'warning' });
                        return;
                    }
                }
                var monery = this.ruleForm.projectMoney;
                if (monery != "") {
                    monery = parseFloat(monery);
                    if (isNaN(monery)) {
                        //alert("工程造价必须是数字!");
                        this.$message({ message: '工程造价必须是数字!', type: 'warning' });
                        return;
                    }
                }
                //修改的ajax请求
                this.$http.post(zyfUrl + '/project/edit', {
                        userId: userId,
                        projectId: projectId,
                        jwt: jwt,
                        actionProjectId: this.ruleForm.projectId,
                        projectName: this.ruleForm.projectName,
                        projectAddress: this.ruleForm.projectAddress,
                        projectSize:size ,
                        projectMoney: monery,
                        projectType: this.ruleForm.projectType
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
                        this.dialogUpdateVisible = false;
                        this.$http.post(zyfUrl + '/project/getAllProject', {
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
                                this.list = result.body.data;
                                this.temp_list = result.body.data;
                                this.current = 1;
                                this.allNum = this.list.length;
                                this.allpage = Math.ceil(this.allNum / this.showItem);
                            }
                        }, function (response) {
                            // 这里是处理错误的回调
                            console.log(response);
                        });

                    } else {
                        //alert("修改失败!");
                        this.$message({ message: '修改失败!', type: 'warning' });
                    }
                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            filter: function () {

            },
            setDialog: function (index) {
                this.dialogVisibleSecond = true;
                //获取当前的项目的设置的信息
                var project = this.list[index];
                //赋值给设置表单上面
                this.setForm.projectId = project.projectId;
                this.setForm.projectManager = project.projectManager;
                this.setForm.engineer = project.projectEngineer;
                this.setForm.economist = project.projectEconomist;
                this.setForm.productionManager = project.projectProductionManager;
                this.setForm.buildUnit = project.developmentOrganization;
                this.setForm.constructionUnit = project.constructionOrganization;
                this.setForm.controlUnit = project.supervisingOrganization;
                //获取项目下的所有人的ajax
                this.$http.post(zyfUrl + '/user/allUser', {
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
                        //console.log("获取项目下的所有人!");
                        //console.log(result.body.data);
                        this.peopleList = result.body.data;
                    }
                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });


                //获取项目下的所有单位
                this.$http.post(zyfUrl + '/company/lookTree', {
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
                        //console.log("获取项目下的所有单位!");
                        //console.log(result.body.data);
                        this.departmentList = result.body.data;
                    }
                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });


            },
            insertProject: function () {
                //console.log("先添加项目!");
                var projectName = this.ruleForm.projectName;
                var projectAddress = this.ruleForm.projectAddress;
                var projectSize = this.ruleForm.projectSize;
                var projectMoney = this.ruleForm.projectMoney;
                var projectType = this.ruleForm.projectType;
                /* console.log(projectName);
                 console.log(projectAddress);
                 console.log(projectSize);
                 console.log(projectMoney);
                 console.log(projectType);*/
                if (projectName == "" || projectAddress == "") {
                    //alert("项目名和项目地址不能为空!");
                    this.$message({ message: '项目名和项目地址不能为空!!', type: 'warning' });
                    return;
                }
                this.$http.post(zyfUrl + '/project/create', {
                        userId: userId,
                        projectId: projectId,
                        jwt: jwt,
                        projectName: projectName,
                        projectAddress: projectAddress,
                        projectSize: projectSize,
                        projectMoney: projectMoney,
                        projectType: projectType
                    },
                    {
                        headers: {},
                        emulateJSON: true
                    }).then(function (result) {
                    //request success
                    //process the result list
                    console.log(result);
                    if (result.body.code == 10000) {
                        //console.log("数据访问成功!");
                        //console.log(result.body.data);
                        //this.m_list = result.body.data;
                        this.$http.post(zyfUrl + '/project/getAllProject', {
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
                                this.list = result.body.data
                                this.temp_list = result.body.data;
                                this.current = 1;
                                this.allNum = this.list.length;
                                this.allpage = Math.ceil(this.allNum / this.showItem);
                            }
                        }, function (response) {
                            // 这里是处理错误的回调
                            console.log(response);
                        });
                        this.dialogUpdateVisible = false;
                    }
                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            //分页
            goto: function (index) {
                //console.log(index);
                if (index == this.current) return;
                this.current = index;
            },
            selectProject: function () {
                var value = this.typeValue.trim();
                if (value == "") {
                    //不需要过滤
                    //说明没有输入值
                    this.current = 1;
                    this.list = this.temp_list;
                    this.allNum = this.list.length;
                    this.allpage = Math.ceil(this.allNum / this.showItem);
                } else {
                    //需要过滤
                    //复制一个副本信息
                    var tempDate = this.temp_list.slice(0);
                    var date = [];
                    for (var i = 0; i < tempDate.length; i++) {
                        if (tempDate[i].projectName.indexOf(value) != -1) {
                            //说明包含
                            date.push(tempDate[i]);
                        }
                    }
                    this.list = date;
                    this.current = 1;
                    this.allNum = this.list.length;
                    this.allpage = Math.ceil(this.allNum / this.showItem);
                }
            },
            updateSetting: function () {
                //更新设置信息
                console.log("更新设置的信息");
                /* console.log(this.setForm.projectId);
                 console.log(this.setForm.projectManager);
                 console.log(this.setForm.engineer);
                 console.log(this.setForm.economist);
                 console.log(this.setForm.productionManager);
                 console.log(this.setForm.buildUnit);
                 console.log(this.setForm.constructionUnit);
                 console.log(this.setForm.controlUnit);*/
                if (this.setForm.projectManager == "") {
//                    alert("请选择项目经理!");
                } else {
                    //发送保存设置的请求
                    this.$http.post(zyfUrl + '/project/set', {
                            userId: userId,
                            projectId: projectId,
                            jwt: jwt,
                            actionProjectId: this.setForm.projectId,
                            projectManager: this.setForm.projectManager,
                            projectEngineer: this.setForm.engineer,
                            projectEconomist: this.setForm.economist,
                            projectProductionManager: this.setForm.productionManager,
                            developmentOrganization: this.setForm.buildUnit,
                            constructionOrganization: this.setForm.constructionUnit,
                            supervisingOrganization: this.setForm.controlUnit
                        },
                        {
                            headers: {},
                            emulateJSON: true
                        }).then(function (result) {
                        //request success
                        //process the result list
                        //console.log(result);
                        if (result.body.code == 10000) {
                            this.dialogVisibleSecond = false;
                            this.$http.post(zyfUrl + '/project/getAllProject', {
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
                                    this.list = result.body.data;
                                    this.temp_list = result.body.data;
                                    this.current = 1;
                                    this.allNum = this.list.length;
                                    this.allpage = Math.ceil(this.allNum / this.showItem);
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
                }

            }
        },
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
    }
</script>

<template>
    <!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap">
            <section class="app-content">
                <div class="list-header">
                    <div class="row">
                        <div class="col-md-12 widget">
                            <header class="widget-header">
                                <div class="row">
                                    <div class="col-xs-2">
                                        <input type="text" placeholder="请输入查询类型的名字" v-model="typeValue">
                                    </div>
                                    <div class="col-xs-1">
                                        <el-button @click="selectProject">查询</el-button>
                                    </div>
                                    <div class="position-btn">
                                        <button type="button" class="btn primary backg-color" @click="insert()">创建项目
                                        </button>
                                    </div>
                                </div>
                            </header>
                        </div>
                    </div>
                </div>
                <div class="list-content">
                    <div class="row widget">
                        <div class="col-md-3" v-for="(i,index) in list.slice((current-1)*showItem,current*showItem)">
                            <div class="row widget">
                                <div class="col-md-12 margin-top content">
                                    <div class="float">
                                        <div class="avatar avatar-sm avatar-circle margin-left">
                                            <a href="#"><img src="./images/208.jpg" alt="sender photo"></a>
                                        </div>
                                    </div>
                                    <div class="float">
                                        <div class="span-header">{{i.projectName}}</div>
                                        <div class="span-content">{{i.projectAddress}}</div>
                                        <div class="span-footer">
                                            <span>{{i.userName}}</span>
                                            <span class="pull-right">{{i.time}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12  footer-edit margin-top">
                                    <div class="row text-center">
                                        <div class="col-md-6 col-sm-6" @click="update(index)">
                                            <div>修改</div>
                                        </div>
                                        <div class="col-md-6 col-sm-6" @click="setDialog(index)">
                                            <div>设置</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pages text-center">
                                    <span class="allNum">共&nbsp;
                                        <span class="theme-color">{{allNum}}</span>
                                        &nbsp;条</span>
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
            </section><!-- #dash-content -->

            <el-dialog :visible.sync="dialogUpdateVisible" width="40%">
                <div class="modal-header primary backg-color">
                    <div class="modal-title">
                        {{title}}
                    </div>
                </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="项目名称" prop="name">
                        <el-input v-model="ruleForm.projectName"></el-input>
                    </el-form-item>
                    <el-form-item label="项目地址" prop="desc">
                        <el-input v-model="ruleForm.projectAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="建筑面积" prop="area">
                        <el-input v-model="ruleForm.projectSize"></el-input>
                    </el-form-item>
                    <el-form-item label="工程造价" prop="price">
                        <el-input v-model="ruleForm.projectMoney"></el-input>
                    </el-form-item>
                    <el-form-item label="工程类型" prop="type">
                        <el-input v-model="ruleForm.projectType"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
            <el-button @click="dialogUpdateVisible = false">取 消</el-button>
            <el-button type="primary" v-if="flag==1" @click="updateSubmit()">保存</el-button>
            <el-button type="primary" v-else="flag==0" @click="insertProject">添加</el-button>
            </span>
            </el-dialog>

            <el-dialog :visible.sync="dialogVisibleSecond" width="40%">
                <div class="modal-header primary backg-color">
                    <div class="modal-title">
                        {{title}}
                    </div>
                </div>
                <el-form :model="setForm" :rules="setFormRules" ref="setForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="项目经理" prop="projectManager">
                        <el-select v-model="setForm.projectManager" placeholder="请选择项目经理">
                            <input type='search'>
                            <el-option v-for="p in peopleList" :label="p.userName" :value="p.userId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="工程师" prop="engineer">
                        <el-select v-model="ruleForm.engineer" placeholder="请选择工程师">
                            <input type='search'>
                            <el-option v-for="p in peopleList" :label="p.userName" :value="p.userId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="经济师" prop="economist">
                        <el-select v-model="setForm.economist" placeholder="请选择经济师">
                            <input type='search'>
                            <el-option v-for="p in peopleList" :label="p.userName" :value="p.userId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生产经理" prop="productionManager">
                        <el-select v-model="setForm.productionManager" placeholder="请选择生产经理">
                            <input type='search'>
                            <el-option v-for="p in peopleList" :label="p.userName" :value="p.userId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="建设单位" prop="buildUnit">
                        <el-select v-model="setForm.buildUnit" placeholder="请选择建设单位">
                            <input type='search'>
                            <el-option v-for="d in departmentList" :label="d.companyName"
                                       :value="d.companyId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="施工单位" prop="constructionUnit">
                        <el-select v-model="setForm.constructionUnit" placeholder="请选择施工单位">
                            <input type='search'>
                            <el-option v-for="d in departmentList" :label="d.companyName"
                                       :value="d.companyId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="监理单位" prop="controlUnit">
                        <el-select v-model="setForm.controlUnit" placeholder="请选择施工单位">
                            <input type='search'>
                            <el-option v-for="d in departmentList" :label="d.companyName"
                                       :value="d.companyId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleSecond = false">取 消</el-button>
            <el-button type="primary" @click="updateSetting">保 存</el-button>
            </span>
            </el-dialog>


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


