/**
 * Created by Administrator on 2017/12/31.
 */
//import Vue from 'vue';
//为空判断方法
function isnull(val) {
    var str = val.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
    if (str == '' || str == undefined || str == null) {
        //return true;
        // alert("请完善表单信息再提交！");
    } else {
        //return false;
        console.log('非空');
    }
}
$(function(){
    //添加请求
    // var array=[];
    // var fileList=[];
    var addVue = new Vue({
        el:'#add-modal',
        data:{
            qualityIssueId:"",
            content:"",
            processId:"1",
            priority:"",
            endTime:"",
            status:"1",
            //关联模型ID
            qualityIssueModels:"1",
            //关联任务ID
            qualityIssueTasks:"1",
            //项目ID
            projectId:"",
            //上传文件时的参数
            upLoadData: {
                createId:"1",
            },
            //文件ID
            saveFileIds:"",
            fileName:"",
            fileNum: 0 ,
            //表单Id
            formId:window.localStorage.getItem("addformId"),
            //文件内容
            formContent:"",
            processList:"",
            array:[],
            fileList:[]
            //fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
        },
        methods:{
            // handlePreview:function(file) {
            //     console.log(file);
            // },
            // 上传前对文件的判断
            beforeUpload:function(file) {
                // const extension = file.name.split('.')[1] === 'rar'
                // const extension2 = file.name.split('.')[1] === 'zip'
                // const extension3 = file.name.split('.')[1] === 'doc'
                // const extension4 = file.name.split('.')[1] === 'docx'
                // const extension5 = file.name.split('.')[1] === 'pdf'
                // const isJPG = file.type === 'image/jpeg';
                const isLt500M = file.size / 1024 / 1024 < 500
                // if (!extension && !extension2 && !extension3 && !extension4&& !extension5 && !isJPG) {
                //     return this.$confirm('只支持扩展名：.rar .zip .doc .docx .pdf .jpg...!');
                // }
                this.fileNum++;
                if (!isLt500M) {
                    return this.$confirm('文件大小不能超过 500MB!');
                }
                return isLt500M
            },
            //对列表进行控制
            handleChange:function(file, fileList) {
                var that=this;
                //that.fileList = fileList.slice(-3);
                console.log(fileList);
            },
            // 上传成功后的回调
            uploadSuccess:function(response, file, fileList) {
                var that=this;
                console.log('上传文件', response);
                file.uid=response.data.accId;
                console.log(file.uid);
                that.fileName=response.data.accName;
                //追加文件Id
                that.array.push(file.uid);
            },
            // 上传错误
            uploadError:function(response, file, fileList) {
                console.log('上传失败，请重试！')
            },
            //删除提醒
            beforeRemove:function(file, fileList) {
                return this.$confirm('确定移除'+file.name+'？');
            },
            //删除操作
            handleRemove:function(file, fileList) {
                console.log(file.uid);
                var that=this;
                this.fileNum--;
                //删除Id
                that.array.pop(file.uid);
                console.log(that.array);
                //删除请求
                $.ajax({
                    type: 'POST',
                    data: file.uid,
                    url: zyfUrl+'/acc/delete',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        console.log(data);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error ' + textStatus + ' ' + errorThrown);
                    }
                });
            },

            //添加提交
            add:function(){
                var that=this;
                //提交的文件ID
                that.saveFileIds=that.array.join(",");
                console.log(that.saveFileIds);
                console.log(that.$data);
                that.endTime=$('#modal_datetimeEnd').val();
                that.formId=window.localStorage.getItem("addformId");
                that.formContent=window.localStorage.getItem("addformId");
                console.log(that.formId);
                if(that.content==""||that.processId==""||that.priority==""||that.endTime==""){
                    // alert("请完善信息再提交！");
                    return false;
                }
                console.log(that.$data);
                $.ajax({
                    type: 'POST',
                    data: that.$data,
                    url: zyfUrl+'/qualityIssue/insertQualityIssue',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        console.log(data);
                        if(data.code==0){
                            $(".modal-backdrop.in").css("display", "none");
                            $('#myModal_1').modal('hide');
                            //刷新数据
                            listVue.getList();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error ' + textStatus + ' ' + errorThrown);
                    }
                });
                //发送get请求
                // this.$http.post('http://192.168.3.29:8080/qualityIssue/insertQualityIssue',
                //     that.$data,
                //     {
                //         emulateJSON:true//一定要写上这句话
                //     }).then(function(res){
                //     alert(res.body);
                // },function(){
                //     alert('请求失败处理');   //失败处理
                // });
            },
            cancel:function () {
                $(".modal-backdrop.in").css("display", "none");
                $('#myModal_1').modal('hide');
            }
        },
        mounted:function () {
        //请求流程数据
            this.$http.post(zyfUrl + '/Process/getProcessList?projectId=123456789&processType=0', {}, {
                headers: {
                },
                emulateJSON: true
            }).then(function(result) {
                var that=this;
                // 这里是处理正确的回调
                console.log(result.bodyText);
                result.bodyText=JSON.parse(result.bodyText);
                that.processList=result.bodyText.data;
                console.log(that.processList);
                editVue.processList=that.processList;

            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
        }
    });
    //获取列表
    var listVue = new Vue({
        el:'#problem_list',
        data:{
            qualityList:"",
            //当前页
            current:1,
            //每页数据
            showItem:10,
            //页数
            allpage:"",
            //总个数
            allNum:0,
            lookList:"",
            editList:""
        },
        watch: {
            cur: function(oldValue , newValue){
                console.log(arguments);
            }
        },
        mounted: function() {
            //请求数据调用
            this.getList();
        },
        methods: {
            //获取列表请求
            getList:function() {
                var that=this;
                this.$http.get(zyfUrl + '/qualityIssue/selectQualityIssueByAll', {}, {
                    headers: {
                    },
                    emulateJSON: true
                }).then(function(result) {
                    // 这里是处理正确的回调
                    console.log(result.data.data);
                    that.qualityList = result.data.data;
                    that.allNum=result.data.data.length;
                    that.allpage=Math.ceil(that.allNum/that.showItem);

                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            //编辑
            edit:function (index) {
                var that=this;
                var id=that.qualityList[index].id;
                this.$http.post(zyfUrl + '/qualityIssue/selectQualityIssueById',
                    {
                        qualityIssueId:id
                    }, {
                        headers: {
                        },
                        emulateJSON: true
                    }).then(function(result) {
                    var that=this;
                    // 这里是处理正确的回调
                    console.log(result.data.data);
                    that.editList=result.data.data;
                    //查看传值
                    editVue.qualityIssueId=that.editList.id;
                    editVue.qualityNo=that.editList.qualityNo;
                    editVue.status=that.editList.status;
                    editVue.isOverdue=that.editList.isOverdue;
                    editVue.content=that.editList.content;
                    editVue.priority=that.editList.priority;
                    editVue.endTime=that.editList.endtime;
                    editVue.processId=that.editList.qualityIssueProcess.processId;
                    editVue.formId=that.editList.qualityForm.id;
                    editVue.formName=that.editList.qualityForm.formName;
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            //查看
            look:function (index) {
                var that=this;
                var id=that.qualityList[index].id;
                this.$http.post(zyfUrl + '/qualityIssue/selectQualityIssueById',
                    {
                        qualityIssueId:id
                    }, {
                        headers: {
                        },
                        emulateJSON: true
                    }).then(function(result) {
                    var that=this;
                    // 这里是处理正确的回调
                    console.log(result.data.data);
                    that.lookList=result.data.data;
                    //查看传值
                    lookVue.id=that.lookList.id;
                    lookVue.qualityNo=that.lookList.qualityNo;
                    lookVue.status=that.lookList.status;
                    lookVue.content=that.lookList.content;
                    lookVue.priority=that.lookList.priority;
                    lookVue.createTime=that.lookList.createTime;
                    lookVue.endTime=that.lookList.endtime;
                    lookVue.isOverdue=that.lookList.isOverdue;
                    lookVue.processId=that.lookList.qualityIssueProcess.processId;
                    lookVue.createUser=that.lookList.createUser;
                    lookVue.formId=that.lookList.qualityForm.id;
                    lookVue.formName=that.lookList.qualityForm.formName;
                    //处理传值
                    handleVue.qualityIssueId=that.lookList.id;
                    handleVue.qualityNo=that.lookList.qualityNo;
                    handleVue.status=that.lookList.status;
                    handleVue.content1=that.lookList.content;
                    handleVue.priority=that.lookList.priority;
                    handleVue.createTime=that.lookList.createTime;
                    handleVue.endTime=that.lookList.endtime;
                    handleVue.isOverdue=that.lookList.isOverdue;
                    handleVue.processId=that.lookList.qualityIssueProcess.processId;
                    handleVue.createUser=that.lookList.createUser;
                    console.log(that.lookList.qualityIssueDisposeList);
                    handleVue.qualityIssueDisposeList=that.lookList.qualityIssueDisposeList;
                    lookVue.formId=that.lookList.qualityForm.id;
                    lookVue.formName=that.lookList.qualityForm.formName;
                }, function(response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
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
    });
    //提交处理请求
    var handleVue = new Vue({
        el:'#handle-modal',
        data:{
            "qualityNo":"",
            "status":"",
            "isOverdue":"",
            "content1":"",//内容
            "qualityIssueId":"",
            "content":"",
            "priority":"",
            "createUser":"",
            "createTime":"",
            "endTime":"",
            "processId":"",
            "qualityIssueDisposeList":"",
            "formId":"",
            "formName":""
        },
        methods:{
            handle_submit:function(){
                var that=this;
                console.log(that.$data);
                //that.endTime=$('#modal_datetimeEnd').val();
                $.ajax({
                    type: 'POST',
                    data: that.$data,
                    url: zyfUrl+'/qualityIssue/qualityIssueDispose',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        console.log(data);
                        if(data.code==0){
                            $(".modal-backdrop.in").css("display", "none");
                            $('#myModal_4').modal('hide');
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error ' + textStatus + ' ' + errorThrown);
                    }
                });
                // });
            },
            cancel:function () {
                $(".modal-backdrop.in").css("display", "none");
                $('#myModal_4').modal('hide');
            }
        },
        mounted:function () {
            console.log(this.qualityIssueDisposeList)
        }
    });
    //编辑请求
    var editVue = new Vue({
        el:'#edit-modal',
        data:{
            qualityIssueId:"",
            content:"",
            qualityNo:"",
            processId:"",
            priority:"",
            endTime:"",
            status:"1",
            //文件内容
            formContent:"文件内容",
            //关联模型ID
            qualityIssueModels:"1",
            //关联任务ID
            qualityIssueTasks:"1",
            //项目ID
            projectId:"1",
            createId:"1",
            //文件ID
            saveFileIds:"",
            //上传文件时的参数
            upLoadData: {
                createId:"1",
            },
            fileName:"",
            fileNum: 0 ,
            //表单Id
            formId:"",
            formName:"",
            processList:"",
            array:[],
            fileList:[]
        },
        methods:{
            // 上传前对文件的判断
            beforeUpload:function(file) {
                var that=this;
                const fd = new FormData();
                fd.append('createId', that.createId);
                console.log("上传前"+fd);
                const isLt500M = file.size / 1024 / 1024 < 500
                if (!isLt500M) {
                    return this.$confirm('文件大小不能超过 500MB!');
                }
                return isLt500M
            },
            //对列表进行控制
            handleChange:function(file, fileList) {
                console.log(fileList);
            },
            // 上传成功后的回调
            uploadSuccess:function(response, file, fileList) {
                var that=this;
                console.log('上传文件', response);
                file.uid=response.data.accId;
                console.log(file.uid);
                that.fileName=response.data.accName;
                //追加文件Id
                that.array.push(file.uid);
            },
            // 上传错误
            uploadError:function(response, file, fileList) {
                console.log('上传失败，请重试！')
            },
            //删除提醒
            beforeRemove:function(file, fileList) {
                return this.$confirm('确定移除'+file.name+'？');
            },
            //删除操作
            handleRemove:function(file, fileList) {
                console.log(file.uid);
                var that=this;
                this.fileNum--;
                //删除Id
                that.array.pop(file.uid);
                console.log(that.array);
                //删除请求
                $.ajax({
                    type: 'POST',
                    data: file.uid,
                    url: zyfUrl+'/acc/delete',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        console.log(data);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error ' + textStatus + ' ' + errorThrown);
                    }
                });
            },
            //跳转传参
            ulrHtml:function() {
                var toUrl = "./editQuality-form.html?id=" + this.formId;
                window.open(toUrl);
            },
            editSubmit:function(){
                var that=this;
                //提交的文件ID
                that.saveFileIds=that.array.join(",");
                console.log(that.saveFileIds);
                console.log(that.$data);
                that.endTime=$('#modal_datetimeEnd2').val();
                if(that.content==""||that.priority==""||that.endTime=="",that.processId==""){
                    // alert("请完善信息再提交！");
                    return false;
                }
                $.ajax({
                    type: 'POST',
                    data: that.$data,
                    url: zyfUrl+'/qualityIssue/updateQualityIssueById',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        console.log(data);
                        if(data.code==0){
                            $(".modal-backdrop.in").css("display", "none");
                            $('#myModal_2').modal('hide');
                            //刷新数据
                            listVue.getList();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error ' + textStatus + ' ' + errorThrown);
                    }
                });
                // });
            },
            cancel:function () {
                $(".modal-backdrop.in").css("display", "none");
                $('#myModal_2').modal('hide');
            }
        },
        mounted:function () {

        }
    });
    //查看
    var lookVue = new Vue({
        el: '#look_list',
        data:{
            "id":"",
            "qualityNo":"",
            "status":"",
            "isOverdue":"",
            "content":"",
            "priority":"",
            "createTime":"",
            "endTime":"",
            "createUser":"",
            "processId":"",
            "qualityIssueDisposeList":"",
            "formId":"",
            "formName":""

        },
        mounted:function () {
            //this.modal_lookList=listVue.lookList;
        },
        methods:function () {

        }
    })
    //筛选请求
    var selVue = new Vue({
        el:'#select_list',
        data:{
            status:"",
            priority:"",
            createUser:"",
            startTime:"",
            endTime:"",
        },
        methods:{
            problemSelect:function(){
                var that=this;
                that.status=$("#sel_status").val();
                that.startTime=$("#datetimeStart").val();
                that.endTime=$("#datetimeEnd").val();
                $.ajax({
                    type: 'POST',
                    data: that.$data,
                    url: zyfUrl+'/qualityIssue/selectQualityIssueByCondition',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        console.log(data.data);
                        listVue.qualityList=data.data;
                        listVue.current=1,
                        listVue.allNum=data.data.length;
                        listVue.allpage=Math.ceil(data.data.length/listVue.showItem);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error ' + textStatus + ' ' + errorThrown);
                    }
                });
            },
            problemReset:function () {
                var that=this;
                that.status=$("#sel_status").val("");
                //that.status="";
                that.priority="";
                that.createUser="";
                that.startTime="开始时间";
                that.endTime="结束时间";
            },
        },
        computed:{
        }
    });
    //选择关联请求
    var relatedVue = new Vue({
        el:'#related-modal',
        data:{
            "modelId":"1",
            "trees":"",
            "projectId":"18966ac025ea4f778e1889ca872652ed"
        },
        methods:{
            taskClick:function() {
                $.ajax({
                    type: 'POST',
                    data: {
                        "projectId":"123456789",
                    },
                    url: zyfUrl+'/TaskProcess/getAll',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        console.log(data.data);
                        if(data.code==0){
                            $(".modal-backdrop.in").css("display", "none");
                            $('#addModal_1').modal('hide');
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error ' + textStatus + ' ' + errorThrown);
                    }
                });
            },
            cancel:function () {
                $(".modal-backdrop.in").css("display", "none");
                $('#addModal_1').modal('hide');
            }
        },
        mounted:function () {
                var that=this;
                console.log(that.$data);
                //that.endTime=$('#modal_datetimeEnd').val();
                $.ajax({
                    type: 'POST',
                    data: that.$data,
                    url: zyfUrl+'/model/getTree',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        console.log(data.data);
                        that.trees=data.data;
                        if(data.code==0){
                            $(".modal-backdrop.in").css("display", "none");
                            $('#addModal_1').modal('hide');
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('error ' + textStatus + ' ' + errorThrown);
                    }
                });

        }
    });
    // 高度
    var thisH = $(window).height();
    var centerH = thisH - 320 + 'px';
    $(".note-editable.panel-body").css("min-height", centerH);
    window.onresize = function () {
        var thisH = $(window).height();
        var centerH = thisH - 320 + 'px';
        $(".note-editable.panel-body").css("min-height", centerH);
    }
})
$(document).ready(function () {
    //table 高度设置
    var thisH = $(window).height();
    var centerH = thisH - 200 + 'px';
    //    列表高度
    $(".dataTables_wrapper").css("height", centerH);

});
var index;
$(function () {
    //选择关联元素
    $(".related-center .nav.nav-tabs").on("click","li",function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        index=$(this).index();
        //判断关联元素index
        if(index == 1){
            // 空间结构
            $('#add-treeDemo').hide();
            $('#treeDemos').show();
        }else if(index == 2){
            //   任务
        }else{
            // 构件
            $('#add-treeDemo').show();
            $('#treeDemos').hide();
        }

        $(".right-content").empty();

        // var $element=$('<div class="row contentCenter"><div class="col-sm-10 element-name" >'+'施工单位'+'</div><div class="col-sm-2"><img src="../assets/images/quality/DELETE_ICON.png" class="delete-icon"></div>'+
        //     +'</div>');
        // $(".right-content").append($element);
        if($(this).hasClass("related-element")){

        }else if($(this).hasClass("related-room")){

        }else{
            $(".left>.col-sm-12").empty();
        }
    })
    // add_element();
    // function add_element() {
    //     $(".addright").click(function () {
    //         $("#add-treeDemo li").each(function () {
    //             var $this=$(this).children("a").hasClass("curSelectedNode");
    //             if($this){
    //                 $(this).remove();
    //                 var id=$(this).children("a").children("span").eq(1).attr("id");
    //                 var name=$(this).children("a").children("span").eq(1).html();
    //                 var $element=$('<div class="row contentCenter"><div class="col-sm-10 element-name" id='+id+'>'+name+'</div><div class="col-sm-2"><img src="../assets/images/quality/DELETE_ICON.png" class="delete-icon"></div>'+
    //                     +'</div>');
    //                 $(".right-content").append($element);
    //             }
    //         })
    //     })
    // }

    $("#add-treeDemo").on("click","li>a",function () {
        //console.log($(this).parent("li").children("ul"));
        // if($(this).siblings("ul")){
        //     alert(1)
        // }
    })

    $(".right").on("click",".delete-icon",function () {
        $(this).parents(".contentCenter").remove();
    })
    //内容项
    $(".td-title").each(function () {
        //console.log($(this).html());
        $(this).attr("title",$(this).html());
    })
    // //操作图片
    // $(".td-edit").on("mouseover",function () {
    //     $(this).hide();
    //     $(this).siblings(".td-editOver").show();
    // })
    // $(".td-editOver").on("mouseout",function () {
    //     $(this).hide();
    //     $(this).siblings(".td-edit").show();
    // })
    // $(".td-search").on("mouseover",function () {
    //     $(this).hide();
    //     $(this).siblings(".td-searchOver").show();
    // })
    $(".td-searchOver").on("mouseout",function () {
        $(this).hide();
        $(this).siblings(".td-search").show();
    })
    //下拉菜单
    $(".dropdown-menu>li").each(function () {
        $(this).click(function () {
            $(this).parents(".btn-group").find(".btn>span").html($(this).html());
            //alert($(this).html())
        })
    })

    //    质量问题time
    var nowTemp = new Date();
    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
    //开始时间
    var checkin1 = $('#datetimeStart').fdatepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        onRender: function (date) {
            return date.valueOf() < now.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function (ev) {
        if (ev.date.valueOf() > checkout1.date.valueOf()) {
            var newDate = new Date(ev.date)
            newDate.setDate(newDate.getDate() + 1);
            //newDate.setDate(newDate.getDate());
            checkout1.update(newDate);
        }
        checkin1.hide();
        //$('#datetimeEnd')[0].focus();
    }).data('datepicker');
    //结束时间
    var checkout1 = $('#datetimeEnd').fdatepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        onRender: function (date) {
            return date.valueOf() <= checkin1.date.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function (date) {
        checkout1.hide();
        return date.valueOf() <= checkin1.date.valueOf() ? 'disabled' : '';
    }).data('datepicker');
//    添加问题截止时间
    var checkout1 = $('#modal_datetimeEnd').fdatepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        onRender: function (date) {
        }
    }).on('changeDate', function (date) {
        checkout1.hide();
    }).data('datepicker');
    //  编辑问题截止时间
    var checkout1 = $('#modal_datetimeEnd2').fdatepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        onRender: function (date) {
        }
    }).on('changeDate', function (date) {
        checkout1.hide();
        //return date.valueOf() <= checkin1.date.valueOf() ? 'disabled' : '';
    }).data('datepicker');
})