<script>
    //import common from '../../../components/common.vue';
    export default {
        //extends:common,
        name: '',
        data() {
            return {
                urls: [
                    "/sysMemberType/selectSysMemberTypeBypro",//pc list
                    "/sysMemberType/addSysMemberType"//pc type insert
                ],
                url_idx: {
                    init: 0,
                    insert: 1,
                },
                params: [
                    {userId: window.userId, projectId: window.projectId},
                    {
                        userId: window.userId, projectId: window.projectId, memberTypeName: "", professionalId: "",
                        memberTypeNo: '', memberTypeTag: '', memberTypeFamily: '', memberTypeDescribe: '', isPrecast: ''
                    }
                ],
                //==============
                //当前页
                current: 1,
                //每页数据
                showItem: 20,
                //页数
                allpage: "",
                //总个数
                allNum: 0,
                //==================
                m_list: [],
                temp_list: [],
                professionList: [],
                dialogVisible: false,
                title: '',
                flag: 1,
                value2: true,
                ruleForm: {
                    id: '',
                    name: '',
                    cricble: '',
                    belong: '',
                    remark: '',
                    groupName: '',
                    des: '',
                    value: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入类型名称', trigger: 'blur'}
                    ],
                    cricble: [
                        {required: false, message: '请输入分组描述', trigger: 'blur'}
                    ],
                    belong: [
                        {required: true, message: '请选择类型名称', trigger: 'change'}
                    ],
                    remark: [
                        {required: false, message: '请输入标记', trigger: 'blur'}
                    ],
                    groupName: [
                        {required: false, message: '请输入族名称', trigger: 'blur'}
                    ],
                    des: [
                        {required: false, message: '请输入描述', trigger: 'blur'}
                    ],
                },
                typeValue: ""
            }
        },
        mounted: function () {
        },
        created: function () {
            //发送ajax请求。请求那个模型的楼层的方法
            this.$http.post(zyfUrl + '/sysMemberType/selectSysMemberTypeBypro', {
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
                    console.log(result.body.data);
                    this.m_list = result.body.data;
                    this.temp_list = result.body.data;
                    this.allNum = this.m_list.length;
                    this.allpage = Math.ceil(this.allNum / this.showItem);
                }
            }, function (response) {
                // 这里是处理错误的回调
                console.log(response);
            });

        },
        methods: {
            insert_cb: function (result) {
                //alert(result.data.message);
                this.dialogVisible = false;
            },
            insert: function () {
                this.dialogVisible = true;
                this.title = '添加类型';
                this.flag = 1;
                //===============================
                this.ruleForm.id ="";
                this.ruleForm.name ="";
                this.ruleForm.belong ="";
                this.ruleForm.cricble ="";
                this.ruleForm.remark ="";
                this.ruleForm.groupName ="";
                this.ruleForm.des ="";
                this.ruleForm.value ="";
                //======================================
                this.$options.methods.selectProfesstion(this);
            },
            insertSubmit: function () {
                //var idx = this.url_idx.insert;
                //var param = this.params[idx];
                //param.memberTypeName = this.ruleForm.name;
                //param.professionalId = this.ruleForm.belong;
                //param.memberTypeNo = this.ruleForm.code;
                //this.ajax(this, zyfUrl + this.urls[idx], param, 0, this.insert_cb);
                //====================================================================
                //获取表单上面的所有数据
                var memberTypeName = this.ruleForm.name;
                var professionalId = this.ruleForm.belong;
                var memberTypeNo = this.ruleForm.cricble;
                var memberTypeTag = this.ruleForm.remark;
                var memberTypeFamily = this.ruleForm.groupName;
                var memberTypeDescribe = this.ruleForm.des;
                var isPrecast = this.ruleForm.value;
                /*console.log(memberTypeName);
                console.log(professionalId);
                console.log(code);
                console.log(remark);
                console.log(groupName);
                console.log(des);
                console.log(isValue);*/
                this.$http.post(zyfUrl + '/sysMemberType/addSysMemberType', {
                        userId: userId,
                        projectId: projectId,
                        jwt: jwt,
                        memberTypeName: memberTypeName,
                        professionalId: professionalId,
                        memberTypeNo: memberTypeNo,
                        memberTypeTag: memberTypeTag,
                        memberTypeFamily: memberTypeFamily,
                        memberTypeDescribe: memberTypeDescribe,
                        isPrecast: isPrecast
                    },
                    {
                        headers: {},
                        emulateJSON: true
                    }).then(function (result) {
                    //request success
                    //process the result list
                    console.log(result);
                    if (result.body.code == 10000) {
                        this.professionList = result.body.data;
                        this.dialogVisible = false;
                        this.$http.post(zyfUrl + '/sysMemberType/selectSysMemberTypeBypro', {
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
                                console.log(result.body.data);
                                this.m_list = result.body.data;
                                this.temp_list = result.body.data;
                                this.allNum = this.m_list.length;
                                this.allpage = Math.ceil(this.allNum / this.showItem);
                                //======================================
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
            editDialog: function (index) {
                this.dialogVisible = true;
                this.title = '编辑类型';
                this.flag = 0;
                //=========================
                var pc = this.m_list[index];
                console.log(pc);
                //将数据放在表单上面
                this.ruleForm.id = pc.memberTypeId;
                this.ruleForm.name = pc.memberTypeName;
                this.ruleForm.belong = pc.professionalId;
                this.ruleForm.cricble = pc.memberTypeNo;
                this.ruleForm.remark = pc.memberTypeTag;
                this.ruleForm.groupName = pc.memberTypeFamily;
                this.ruleForm.des = pc.memberTypeDescribe;
                if (pc.isPrecast == 'true') {
                    this.ruleForm.value = true;
                } else {
                    this.ruleForm.value = false;
                }
                //===============================================
                this.$options.methods.selectProfesstion(this);
            },
            updateSysMember: function () {
                console.log("编辑的保存");
                var memberTypeId = this.ruleForm.id;
                var memberTypeName = this.ruleForm.name;
                var professionalId = this.ruleForm.belong;
                var memberTypeNo = this.ruleForm.cricble;
                var memberTypeTag = this.ruleForm.remark;
                var memberTypeFamily = this.ruleForm.groupName;
                var memberTypeDescribe = this.ruleForm.des;
                var isPrecast = this.ruleForm.value;
                /*  console.log(memberTypeId);
                  console.log(memberTypeName);
                  console.log(professionalId);
                  console.log(memberTypeNo);
                  console.log(memberTypeTag);
                  console.log(memberTypeFamily);
                  console.log(memberTypeDescribe);
                  console.log(isPrecast);*/
                this.$http.post(zyfUrl + '/sysMemberType/updateSysMemberType', {
                        userId: userId,
                        projectId: projectId,
                        jwt: jwt,
                        memberTypeId: memberTypeId,
                        memberTypeName: memberTypeName,
                        professionalId: professionalId,
                        memberTypeNo: memberTypeNo,
                        memberTypeTag: memberTypeTag,
                        memberTypeFamily: memberTypeFamily,
                        memberTypeDescribe: memberTypeDescribe,
                        isPrecast: isPrecast
                    },
                    {
                        headers: {},
                        emulateJSON: true
                    }).then(function (result) {
                    //request success
                    //process the result list
                    console.log(result);
                    if (result.body.code == 10000) {
                        this.professionList = result.body.data;
                        this.dialogVisible = false;
                        this.$http.post(zyfUrl + '/sysMemberType/selectSysMemberTypeBypro', {
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
                                console.log(result.body.data);
                                this.m_list = result.body.data;
                                this.temp_list = result.body.data;
                                this.allNum = this.m_list.length;
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

            },
            handleChange(value) {
                console.log(value);
            },
            selectProfesstion:function (vue) {
                 console.log("获取专业的信息!");
                //发送获取专业的请求
                vue.$http.post(zyfUrl + '/profession/getAllProfession', {
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
                    console.log(result);
                    if (result.body.code == 10000) {
                        //console.log("数据访问成功!");
                        //console.log(result.body.data);
                        this.professionList = result.body.data;
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
            selectType: function () {
                var type = this.typeValue.trim();
                console.log(type);
                if (type == "" || type == "请输入查询类型的名字") {
                    //说明没有输入值
                    this.current = 1;
                    this.m_list = this.temp_list;
                    this.allNum = this.m_list.length;
                    this.allpage = Math.ceil(this.allNum / this.showItem);
                } else {
                    //复制一个副本信息
                    var tempDate = this.temp_list.slice(0);
                    var date = [];
                    for (var i = 0; i < tempDate.length; i++) {
                        if (tempDate[i].memberTypeName.indexOf(type) != -1) {
                            //说明包含
                            date.push(tempDate[i]);
                        }
                    }
                    this.m_list = date;
                    this.current = 1;
                    this.allNum = this.m_list.length;
                    this.allpage = Math.ceil(this.allNum / this.showItem);
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
                <!--相应内容-->
                <div class="list-content">
                    <div class="row">
                        <div class="col-md-12" style="padding-right: 0;">
                            <div class="widget">
                                <header class="widget-header">
                                    <div class="row">
                                        <div class="col-xs-2">
                                            <input type="text" placeholder="请输入查询类型的名字" v-model="typeValue">
                                        </div>
                                        <div class="col-xs-1">
                                            <el-button @click="selectType">查询</el-button>
                                        </div>
                                        <div class="pull-right">
                                            <button type="button" class="btn primary backg-color top-add"
                                                    @click="insert()">添加类型
                                            </button>
                                            <!--<button type="button" class="btn btn-default">导出</button>-->
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
                                                <th></th>
                                                <th>类型名称</th>
                                                <th>专业</th>
                                                <th>是否预制</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(i,index) in m_list.slice((current-1)*showItem,current*showItem)">
                                                <td></td>
                                                <td class="td-content td-title">
                                                    {{i.memberTypeName}}
                                                </td>
                                                <td>{{i.professionalName}}</td>
                                                <td v-if="i.isPrecast =='true'">
                                                    是
                                                </td>
                                                <td v-else>否</td>
                                                <td class="td-handles">
                                                    <i class="fa fa-edit fa-2" @click="editDialog(index)"></i>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
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
                                </div><!-- .widget-body -->
                            </div>
                        </div>
                    </div>
                </div>

            </section><!-- #dash-content -->
            <el-dialog :visible.sync="dialogVisible" width="40%">
                <div class="modal-header primary backg-color">
                    <div class="modal-title">
                        {{title}}
                    </div>
                </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="类型名称" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="选择专业" prop="belong">
                        <el-select v-model="ruleForm.belong" placeholder="请选择">
                            <!-- <el-option label="未施工" value="shanghai"></el-option>
                             <el-option label="施工完成" value="beijing"></el-option>-->
                            <el-option v-for="p in professionList" :label="p.professionName"
                                       :value="p.professionId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分类编码" prop="cricble">
                        <el-input v-model="ruleForm.cricble"></el-input>
                    </el-form-item>
                    <el-form-item label="标记" prop="remark">
                        <el-input v-model="ruleForm.remark"></el-input>
                    </el-form-item>
                    <el-form-item label="族名称" prop="groupName">
                        <el-input v-model="ruleForm.groupName"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="des">
                        <el-input v-model="ruleForm.des"></el-input>
                    </el-form-item>
                    <el-form-item label="是否预制" prop="value">
                        <el-switch
                                v-model="ruleForm.value"
                                active-color="#13ce66">
                        </el-switch>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" v-if="flag==0" @click="updateSysMember">保 存</el-button>
            <el-button type="primary" v-else="flag==1" @click="insertSubmit()">添 加</el-button>
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


