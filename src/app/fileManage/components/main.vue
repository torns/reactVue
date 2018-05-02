var zNodes;
<script>
    export default {
        name: 'fileController',
        data() {
            return {
                currentFiles: [],//当前文件
                leftFiles: [],//左侧文件树
                filetrees: [],//选择框下来数据
                search_value: "",//搜索内容
                currentFolder: projectId,//当前文件夹
                loadMoreFlag: true,//加载更多是否显示
                onceloadSize: 10,   //一次加载几个
                want2Name: "",
                currentEditFileOrFolderId: "",
                actionUrl: zyfUrl + "/file/upload"+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt,//上传地址
                fileName: "",//文件名称
                fileId: "",//文件编号
                fileList: [],
                //上传文件时的参数
                upLoadData: {
                    jwt: jwt,
                    userId: userId,
                    createId: userId,
                    parentId: projectId,
                    projectId: projectId
                },
                deleteUpfile: [],//要删除的上传文件

                checkAll: false, //是否全选
                checkedFiles: [],//已经选择的
                isIndeterminate: true,//是否全选
                addFileName:"",//新增文件夹名称
                addFileParentName:"",//新增文件夹父级名称
                addFileParentId:projectId, //新增父级编号
                localFileParentName:"全部文件",
                ztreeUl:false,
                createTreeObj:"",
                selectNode:""


                     
            }
        },
        mounted: function () {
            this.init();
        },
        methods: {
            //全选
        handleCheckAllChange(val) {
        var that=this;
        var allfilelist=[];
        for(var i in that.currentFiles){
            allfilelist.push(that.currentFiles[i].fileId);
        }
        that.checkedFiles = val ? allfilelist : [];
        that.isIndeterminate = false;
      },
      //选择
      handleCheckedFilesChange(value) {
        var that=this;
        let checkedCount = value.length;
        that.checkAll = checkedCount === that.currentFiles.length;
        that.isIndeterminate = checkedCount > 0 && checkedCount < that.currentFiles.length;
      },
      //新增文件夹初始化
      loadNewFolder:function(){
          var that=this;
          if( that.ztreeUl == true){
            that.ztreeUl = false;
          }
           that.addFileName="",//新增文件夹名称
           that.addFileParentName=that.localFileParentName//新增文件夹父级
      },
      //新增文件夹
      addNewFolder:function(){
          var that=this;
        //   alert(that.addFileName);
        //   alert(that.addFileParentId)
           if(that.addFileName.trim()==""){
                    this.$alert('<strong>请输入文件名称</strong>', '提示信息', {
                        dangerouslyUseHTMLString: true
                    });
                    return;
                }
                if (that.addFileName.trim().length > 20) {
                    this.$alert('<strong>文件名称过长</strong>', '提示信息', {
                        dangerouslyUseHTMLString: true
                    });
                    return;
                }
                this.$http.post(zyfUrl + '/file/createFolder'+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt, JSON.stringify({
                    userId: userId,
                    projectId: projectId,
                    jwt: jwt,
                    fileParentId: that.addFileParentId,
                    fileName: that.addFileName,
                    createUser:userId,
                    updateUser:userId
                }), {
                    headers: {},
                }).then(function (result) {
                    // 这里是处理正确的回调
                    // $set(currentFile,result.data)
                    console.log(result.data.data);
                    if (result.data.code == 10000) {

//                        that.filetrees.unshift(result.data.data);
//                        that.leftFiles.unshift(result.data.data);
//                        if(that.currentFolder == that.addFileParentId){
//                            that.currentFiles.push(result.data.data);
//                        }
//                        console.log(that.selectNode)
//                         that.createTreeObj.addNodes(that.createTreeObj.getNodeByTId(that.selectNode),result.data.data);

                        that.init();
                         $('#myModal').modal('hide');
                         $(".modal-backdrop.in").css("display", "none");
                    }else{
                        this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
                        dangerouslyUseHTMLString: true
                        }); 
                        return;
                    }


                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
      },
      //父级文件菜单加载
      allParentFileTree:function(){
        var that=this;
        if(that.ztreeUl==false){
            that.ztreeUl = true;
        }else{
            that.ztreeUl = false;
        }
      },
      
      //ajax文件下载转换方法
      download : function (url, data, method) {
            // 获取url和data
            if (url && data) {
                // data 是 string 或者 array/object
                data = typeof data == 'string' ? data : jQuery.param(data);
                // 把参数组装成 form的  input
                var inputs = '';
                jQuery.each(data.split('&'), function () {
                    var pair = this.split('=');
                    inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
                });
                console.log(inputs);
                // request发送请求
                jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
                    .appendTo('body').submit().remove();
            }
        },
            //头部下载
            allCheckDown: function () {
                var that = this;
                if(that.checkedFiles.length == 0){
                    this.$alert('<strong>请勾选要下载的文件</strong>', '提示信息', {
                        dangerouslyUseHTMLString: true
                    });
                    return;
                }
                var param="";
                for (var i = 0; i < that.checkedFiles.length; i++) {
                    if (i > 0) {
                        param = param + '&folders=' + that.checkedFiles[i];
                    } else {
                        param = param + 'folders=' + that.checkedFiles[i];
                    }
                }
                param = param+"&projectId="+projectId+"&userId="+userId+"&jwt="+jwt;
                that.download(zyfUrl+"/file/topDown",param,"get")
            },

            //单文件和文件夹下载
            fileDown:function(index){
                var that=this;
                var downFile=that.currentFiles[index];
                var param="fileId="+downFile.fileId+"&projectId="+projectId+"&userId="+userId+"&jwt="+jwt;
                if(downFile.isFile==false){
                    //下载文件夹
                    that.download(zyfUrl+"/file/downFolder"+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt,param,"get")
                }else{
                    //下载文件
                    that.download(zyfUrl+"/file/downFile"+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt,param,"get")
                }
            },

            //上传前
            beforeUpload: function (file) {
                const isLt500M = file.size / 1024 / 1024 < 500
                this.fileNum++;
                if (!isLt500M) {
                    return this.$confirm('文件大小不能超过 500MB!');
                }
                return isLt500M
            },
            //对列表进行控制
            handleChange: function (file, fileList) {
                var that = this;
                console.log("改变列表");
                console.log(fileList);
            },
            // 上传成功后的回调
            uploadSuccess: function (response, file, fileList) {
                var that = this;
                console.log('上传文件', response);
                console.log(file);
                console.log("正确列表");
                console.log(fileList);
                if (typeof(that.currentFiles) == "string"){
                    that.currentFiles = new Array();
                }
                that.currentFiles.push(response.data);
            },
            // 上传错误
            uploadError: function (response, file, fileList) {
                console.log('上传失败，请重试！')
                console.log("错误列表");
                console.log(fileList);
                //   fileList.push(file);
            },
            //文件删除提醒
            beforeRemove: function (file, fileList) {
                return this.$confirm('确定移除' + file.name + '？');
            },
            //文件删除操作
            handleRemove: function (file, fileList) {
                var that = this;
                console.log(file);
                console.log(file.response.data);
                var data = [];
                data.push(file.response.data)
                this.$http.post(zyfUrl + '/file/delete', {
                    userId: userId,
                    projectId: projectId,
                    jwt: jwt,
                    ulist: data

                }, {
                    headers: {}

                }).then(function (result) {
                    // 这里是处理正确的回调
                    // $set(currentFile,result.data)
//                    console.log(result.data.data);
                    if (result.data.code = 10000) {
                        for (var i = 0; i < that.currentFiles.length; i++) {
                            if (file.response.data.fileId == that.currentFiles[i].fileId) {
                                that.currentFiles.splice(i, 1)
                            }
                        }

                    }
                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
                console.log(file.uid);
                //删除请求
                // $.ajax({
                //     type: 'POST',
                //     data: {file.uid},
                //     url: zyfUrl+'/acc/delete',
                //     dataType: 'json',
                //     cache: false,
                //     success: function(data) {
                //         console.log(data);
                //     },
                //     error: function(jqXHR, textStatus, errorThrown) {
                //         console.log('error ' + textStatus + ' ' + errorThrown);
                //     }
                // });
            },
            init: function () {
                console.log("初始化")
                this.getCurrentAllFile();
                this.getAllFolder();

            },
            getCurrentAllFile: function () {
                var that = this;
                this.$http.post(zyfUrl + '/file/getlimitChildren', {
                    userId: userId,
                    projectId: projectId,
                    jwt: jwt,
                    parentId: that.currentFolder,
                    onceloadSize: that.onceloadSize

                }, {
                    headers: {},
                    emulateJSON: true
                }).then(function (result) {
                    // 这里是处理正确的回调
                    // $set(currentFile,result.data)
//                    console.log(result.data.data);
                    if (result.data.data.length < that.onceloadSize) {
                        that.loadMoreFlag = false
                    }
                    that.currentFiles = result.data.data;


                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            getAllFolder: function () {
                var that = this;
                this.$http.post(zyfUrl + '/file/getAllFolder', {
                    userId: userId,
                    projectId: projectId,
                    jwt: jwt

                }, {
                    headers: {},
                    emulateJSON: true
                }).then(function (result) {
                    // 这里是处理正确的回调
                    var tempdata = result.data.data
                    that.filetrees = tempdata;
                    for (var i = 0; i < tempdata.length; i++) {
                         if (tempdata[i].fileParentId == 0) {
                             tempdata[i].open=true;

                         }
                        that.leftFiles.push(tempdata[i]);

                    }

                    var setting = {
                        data: {
                            key: {
                                children: "childs",
                                name: "fileName",
                                title: "",
                                url: "url",
                                icon: "icon",
                                pathname: "nodePath"
                            },
                            simpleData: {
                                enable: true,
                                idKey: "fileId",
                                pIdKey: "fileParentId",
                                rootPId: '0'
                            },
                            keep: {
                                parent: false,
                                leaf: false
                            }
                        },
                        check: {
                            enable: false,

                        },
                        callback: {
                            beforeClick: beforeClick,    // zTreebeforeClick
                        },
                    };

                    function beforeClick(treeId, treeNode, clickFlag) {

                        // alert(treeNode.fileName);
                        //  alert(treeNode.fileId);
                        that.addFileParentName = treeNode.fileName;//新增文件夹父级名称
                        that.addFileParentId = treeNode.fileId; //新增父级编号
                        that.selectNode=treeNode.tId;

                        if (that.ztreeUl == true) {
                            that.ztreeUl = false;
                        }
                        //  console.log($("#createFolderTree"));
                        //   console.log($("#createFolderTree").css('display'));
                        //  if($("#createFolderTree").css('display')=='block'){
                        //       $("#createFolderTree").hide();
                        //       console.log($("#createFolderTree").css('display'));
                        //  }else{
                        //      alert(22);
                        //  }
                    };
                    setTimeout(function () {
                        $(document).ready(function () {
                            that.createTreeObj = $.fn.zTree.init($("#createFolderTree"), setting, that.filetrees);
                        });
                    }, 1500);


                //左边的树
                    var left_setting = {
                        data: {
                            key: {
                                children: "childs",
                                name: "fileName",
                                title: "",
                                url: "url",
                                icon: "icon",
                                pathname: "nodePath"
                            },
                            simpleData: {
                                enable: true,
                                idKey: "fileId",
                                pIdKey: "fileParentId",
                                rootPId: '0'
                            },
                            keep: {
                                parent: false,
                                leaf: false
                            }
                        },
                        check: {
                            enable: false,

                        },
                        callback: {
                            beforeClick:leftbeforeClick,    // zTreebeforeClick
                        },
                    };
                    function leftbeforeClick(treeId, treeNode, clickFlag) {
                        console.log("id:" + treeNode.fileId + "---Name:" + treeNode.fileName);
                        //todo


                        if (that.isIndeterminate == false) {
                            that.isIndeterminate = true;
                        }
                        if (that.checkedFiles.length > 0) {
                            that.checkedFiles.splice(0, that.checkedFiles.length);
                        }
                        that.loadMoreFlag = true;

                            that.currentFolder = treeNode.fileId;
                            that.upLoadData.parentId = treeNode.fileId;
                            that.localFileParentName = treeNode.fileName;


                        that.addFileParentId=treeNode.fileId;

                        that.getCurrentAllFile();
                    }
                    setTimeout(function () {
                        $(document).ready(function () {
                            $.fn.zTree.init($("#left_tree"), left_setting, that.filetrees);
                        });
                    }, 1500);

                    //end


                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });
            },
            loadMore: function () {
                var that = this;
                this.$http.post(zyfUrl + '/file/getlimitChildren', {
                    userId: userId,
                    projectId: projectId,
                    jwt: jwt,
                    parentId: that.currentFolder,
                    hasLoadSize: that.currentFiles.length,
                    onceloadSize: that.onceloadSize

                }, {
                    headers: {},
                    emulateJSON: true
                }).then(function (result) {
                    // 这里是处理正确的回调
                    // $set(currentFile,result.data)
//                    console.log(result.data.data);
                    if (result.data.data.length < that.onceloadSize) {
                        that.loadMoreFlag = false
                    }
                    for (var i = 0; i < result.data.data.length; i++) {
                        that.currentFiles.push(result.data.data[i]);
                    }
                    if (result.data.data.length > 0) {
                        if (that.isIndeterminate == false) {
                            that.isIndeterminate = true;
                        }
                    }

                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });

            },
            changePid: function (index) {
                var that = this;
                if (that.isIndeterminate == false) {
                    that.isIndeterminate = true;
                }
                if (that.checkedFiles.length > 0) {
                    that.checkedFiles.splice(0, that.checkedFiles.length);
                }
                that.loadMoreFlag = true;
                if (index == -1) {
                    that.currentFolder = projectId;
                    that.localFileParentName = "全部文件";
                    that.upLoadData.parentId = projectId;
                    that.addFileParentId=projectId;
                } else {
                    that.currentFolder = that.leftFiles[index].fileId;
                     that.upLoadData.parentId = that.leftFiles[index].fileId;
                      that.localFileParentName=that.leftFiles[index].fileName;
                      that.addFileParentId=that.leftFiles[index].fileId;
                }

                this.getCurrentAllFile();
            },
            rightChange: function (index) {
                var that = this;
                that.loadMoreFlag = true;
                if (that.isIndeterminate == false) {
                    that.isIndeterminate = true;
                }
                if (that.checkedFiles.length > 0) {
                    that.checkedFiles.splice(0, that.checkedFiles.length);
                }
                if (that.currentFiles[index].isFile == "0") {
                    that.currentFolder = that.currentFiles[index].fileId;
                    that.addFileParentId=that.currentFiles[index].fileId;
                    that.localFileParentName=that.currentFiles[index].fileName;
                    this.getCurrentAllFile();
                }

            },
            nameMaxLength: function () {
                console.log("jianlale ");
                var that = this;
                var tvalnum = this.getStrLength(that.want2Name);
                console.log(tvalnum)

                if (tvalnum > 20) {
                    console.log("大于20 了")
                    var tval = that.want2Name;
                    tval = this.SetString(tval, 20);

                    that.want2Name = tval;
                    console.log(that.want2Name);

                }
            },
            reNameSure: function () {
                var that = this;
                var oldName;
                var data;
                if (that.want2Name.trim() == "") {

                    this.$alert('<strong>'+'请输入值'+'</strong>', '提示信息', {
                        dangerouslyUseHTMLString: true
                    });
                    return;
                }
                for (var i = 0; i < that.currentFiles.length; i++) {
                    if (that.currentFiles[i].fileId == that.currentEditFileOrFolderId) {
                        data = that.currentFiles[i];
                        break;
                    }
                }
                oldName = data.fileName
                data.fileName = that.want2Name.trim();
                data.jwt = jwt;

                data.userId = userId;
                data.updateUser = userId;


                this.$http.post(zyfUrl + '/file/update', data, {
                    headers: {}

                }).then(function (result) {

                    // 这里是处理正确的回调
                    // $set(currentFile,result.data)
//                    console.log(result.data.data);
                    console.log(result)
                    if (result.data.code == 20002) {
                        data.fileName = oldName;

                        this.$alert('<strong>'+'存在重名的文件'+'</strong>', '提示信息', {
                            dangerouslyUseHTMLString: true
                        });
                        return;


                    } else if (result.data.code == 10000) {
                        if (data.isFile == false) {
                            console.log("捡来修改了1")
                            for (var i = 0; i < that.leftFiles.length; i++) {
                                if (that.leftFiles[i].fileId == that.currentEditFileOrFolderId) {
                                    that.leftFiles[i].fileName = data.fileName;
                                    console.log("捡来修改了2")
//                                    that.leftFiles.splice(i,1,data)
                                    break;
                                }
                            }
                        }

                        $(".modal-backdrop.in").css("display", "none");
                        $("#myModal3").hide();

                    } else {
                        data.fileName = oldName;


                        this.$alert('<strong>'+'更新失败'+'</strong>', '提示信息', {
                            dangerouslyUseHTMLString: true
                        });
                        return;

                    }


                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });


            },
            reNameCancel: function () {
                this.want2Name = "";

            },
            deleteFile: function (index) {
                var that = this;
                var data = [];
                data.push(that.currentFiles[index])
                this.$http.post(zyfUrl + '/file/delete', {
                    userId: userId,
                    projectId: projectId,
                    jwt: jwt,
                    ulist: data

                }, {
                    headers: {}

                }).then(function (result) {
                    // 这里是处理正确的回调
                    // $set(currentFile,result.data)
//                    console.log(result.data.data);

                    if (result.data.code = 10000) {
                        that.currentFiles.splice(index, 1)
                        that.getAllFolder();
                    }


                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });


            },
            searchFile: function () {
                var that = this;
                if (that.search_value.trim() == "") {

                    this.$alert('<strong>'+'请输入值'+'</strong>', '提示信息', {
                        dangerouslyUseHTMLString: true
                    });
                    return;
                }
                this.$http.post(zyfUrl + '/file/search', {
                    userId: userId,
                    projectId: projectId,
                    jwt: jwt,
                    fileName: that.search_value.trim()

                }, {
                    headers: {},
                    emulateJSON: true
                }).then(function (result) {
                    // 这里是处理正确的回调
                    // $set(currentFile,result.data)
//                    console.log(result.data.data);
                    that.loadMoreFlag = false

                    that.currentFiles = result.data.data;

                }, function (response) {
                    // 这里是处理错误的回调
                    console.log(response);
                });

            },
            clearSearchValue: function () {
                this.search_value = "";
            },
            getStrLength: function (str) {
                var cArr = str.match(/[^\x00-\xff]/ig);
                return str.length + (cArr == null ? 0 : cArr.length);
            },
            SetString: function (str, len) {
                var strlen = 0;
                var s = "";
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) > 128) {
                        strlen += 2;
                    } else {
                        strlen++;
                    }
                    s += str.charAt(i);
                    if (strlen >= len) {
                        return s;
                    }
                }
                return s;
            },
            changEditFileOrFolder: function (index) {
                console.log("改变当前要编辑的文件Id")
                this.currentEditFileOrFolderId = this.currentFiles[index].fileId;
                console.log(this.currentEditFileOrFolderId);
            }

        },
        filters: {
            formatTime: function (time) {
                function formatDateTime(theDate) {
                    var _hour = theDate.getHours();
                    var _minute = theDate.getMinutes();
                    var _second = theDate.getSeconds();
                    var _year = theDate.getFullYear()
                    var _month = theDate.getMonth();
                    var _date = theDate.getDate();
                    if (_hour < 10) {
                        _hour = "0" + _hour;
                    }
                    if (_minute < 10) {
                        _minute = "0" + _minute;
                    }
                    if (_second < 10) {
                        _second = "0" + _second
                    }
                    _month = _month + 1;
                    if (_month < 10) {
                        _month = "0" + _month;
                    }
                    if (_date < 10) {
                        _date = "0" + _date
                    }
                    //返回：2017-02-02
                    return _year + "-" + _month + "-" + _date;
                }

                return formatDateTime(new Date(time));
            }
        }
    }
</script>

<template>
    <!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap">
            <section class="app-content" id="fileController">
                <!-- search results -->
                <!--相应内容-->
                <!--fileMange-->
                <div class="view-main container-fluid">
                    <div class="row">
                        <div class="col-sm-2 layout-sm3">
                            <div class="left-menu">
                                <div class="">
                                    <div class="left-menu-content">
                                        <div class="list-group">
                                            <div class="list-group-item curr dropdown">

                                                <ul id="left_tree" class="ztree fileZtree"></ul>
                                            <!--<span id="dropdownMenu1" class="dropdown-toggle theme-color"-->
                                                  <!--data-toggle="dropdown" aria-expanded="false" @click="changePid(-1)">-->
                                                <!--<img src="./images/fileIcon.png">全部文件-->
                                                <!--&lt;!&ndash;<img class="operateSpan" src="./images/moreICON.png">&ndash;&gt;-->
                                                <!--<ul class="droplistProject">-->
                                                    <!--<li>11</li>-->
                                                    <!--<li>11</li>-->
                                                    <!--<li>11</li>-->
                                                <!--</ul>-->
                                            <!--</span>-->
                                                <!--<button class="">权限设置</button>-->
                                                <!--<ul id="filetreeMenu" class="dropdown-menu doc_left" role="menu"-->
                                                    <!--aria-labelledby="dropdownMenu1">-->
                                                    <!--<li v-for="(lfile,index) in leftFiles" @click="changePid(index)">-->
                                                        <!--<a href="#" class="inner-curr">{{lfile.fileName}}</a>-->
                                                        <!--<img src="./images/fileIcon.png">-->
                                                    <!--</li>-->
                                                    <!--&lt;!&ndash;<li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<a href="#">施工资料(4)</a>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<img src="../img/moreICON.png">&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<ul>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<li><a href="#">设置权限</a></li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<li><a href="#">下载</a></li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<li><a href="#">重命名</a></li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<li><a href="#">移动到</a></li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<li><a href="#">删除</a></li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;</ul>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;</li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<li><a href="#">监理资料(16)</a>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<img src="../img/moreICON.png">&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<ul>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<li><a href="#">设置权限</a></li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<li><a href="#">下载</a></li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<li><a href="#">重命名</a></li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<li><a href="#">移动到</a></li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;<li><a href="#">删除</a></li>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;</ul>&ndash;&gt;-->
                                                    <!--&lt;!&ndash;</li>&ndash;&gt;-->
                                                <!--</ul>-->
                                            </div>
                                            <!--<a href="#" class="list-group-item"><img src="../assets/images/fileManage/people.png">成员</a>-->
                                            <!--<a href="#" class="list-group-item"><img src="../assets/images/fileManage/biaoqian.png">标签</a>-->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-10 layout-sm9">
                            <div class="page-content-wrapper">
                                <div class="page-content">
                                    <!--## 右边内容-->
                                    <div class="documentContent" id="myfielTable">
                                        <div class="container-fluid">
                                            <div class="row header">
                                                <div class="col-sm-9">
                                                    <el-upload
                                                            class="upload-demo"
                                                            :action="actionUrl"
                                                            :data="upLoadData"
                                                            :on-change="handleChange"
                                                            :on-success="uploadSuccess"
                                                            :on-error="uploadError"
                                                            :on-remove="handleRemove"
                                                            :before-remove="beforeRemove"
                                                            :before-upload="beforeUpload"
                                                            multiple
                                                            :file-list="fileList">
                                                        <el-button size="small" type="primary">点击上传</el-button>
                                                        <!--<button class="el-button el-button&#45;&#45;small checkShow moveTop" data-toggle="modal" data-target="#myModal6">移动到</button>-->
                                                        <!--<button class="el-button el-button&#45;&#45;small checkShow topdelete">删除</button>-->
                                                    </el-upload>
                                                    <button class="el-button el-button--small addfiletop"
                                                            data-toggle="modal" data-target="#myModal"
                                                            @click="loadNewFolder">添加文件夹
                                                    </button>
                                                    <button class="el-button el-button--small topdown"
                                                            @click="allCheckDown()"> 下载
                                                    </button>
                                                </div>
                                                <div class="col-sm-3 pull-right">
                                                    <div class="input-group">
                                                        <input name="inputSelected" type="text"
                                                               class="form-control search" placeholder="请输入文件夹名称"
                                                               v-model="search_value">
                                                        <img src="./images/search.png" class="search_img"
                                                             id="document_search" @click="searchFile">
                                                        <img src="./images/close.png" class="delete_img"
                                                             @click="clearSearchValue">
                                                    </div>
                                                </div>
                                            </div>
                                            <!--<div class="row header-navir">
                                                <div class="col-sm-6">
                                                    <ol class="breadcrumb">
                                                    </ol>
                                                </div>
                                            </div>-->
                                            <div class="row list">
                                                <table class="table">
                                                    <thead>
                                                    <tr>
                                                        <th>
                                                            <!-- <input id="selectAll" name="inputSelected" type="checkbox"> -->
                                                            <el-checkbox :indeterminate="isIndeterminate"
                                                                         v-model="checkAll"
                                                                         @change="handleCheckAllChange"></el-checkbox>
                                                        </th>
                                                        <th id="fileNameSord">文件名称</th>
                                                        <th>修改者</th>
                                                        <th id="fileSizeSord">大小</th>
                                                        <th id="fileTimeSord">时间</th>
                                                        <th>已选中<span id="selectedCount">0</span></th>
                                                    </tr>
                                                    </thead>
                                                </table>
                                                <div class="table_center">
                                                    <el-checkbox-group v-model="checkedFiles"
                                                                       @change="handleCheckedFilesChange">
                                                        <table class="table">
                                                            <tbody>
                                                            <!--<tr class="iconsFunction" v-for="savefile in savefilelist" filebh={{savefile.savefileId}}>-->

                                                            <tr class="iconsFunction"
                                                                v-for="(file,index) in currentFiles " >
                                                                <td>
                                                                    <el-checkbox :label="file.fileId"
                                                                                 :key="file.fileId"></el-checkbox>
                                                                </td>
                                                                <td @click="rightChange(index)">
                                                                <span v-if="file.isFile=='0'">
                                                                    <img src="./images/fileIcon.png"style="margin-right:5px;" >
                                                                    <span>{{file.fileName}}</span>
                                                                </span>
                                                                <span v-else>
                                                                    <img style="width: 20px" src="./images/file/default.png">
                                                                    <span>
                                                                        {{file.fileName}}.{{file.fileType}}
                                                                    </span>
                                                                </span>

                                                                </td>
                                                                <td>{{file.updateUser}}</td>
                                                                <td>{{file.fileSize}}</td>
                                                                <td>{{file.updateTime | formatTime}}</td>
                                                                <td class="dropdown more_buttons">
                                                                    <img src="./images/moreICON.png"
                                                                         class="more_button">
                                                                    <ul class="dropdown-menu more_menu"
                                                                        @click="changEditFileOrFolder(index)">
                                                                        <!--<li class="pli"><a href="#" data-toggle="modal"-->
                                                                        <!--data-target="#myModal2">设置权限</a>-->
                                                                        <!--</li>-->
                                                                        <li class="downfolderli"><a href="#"
                                                                                                    @click="fileDown(index)">下载</a>
                                                                        </li>
                                                                        <li class="changeFolderli"><a href="#"
                                                                                                      data-toggle="modal"
                                                                                                      data-target="#myModal3">重命名</a>
                                                                        </li>
                                                                        <!--<li class="moveFolderli"><a href="#"-->
                                                                        <!--data-toggle="modal"-->
                                                                        <!--data-target="#myModal4">移动到</a>-->
                                                                        <!--</li>-->
                                                                        <li class="delfolderli"
                                                                            @click="deleteFile(index)">
                                                                            <a href="#">删除</a></li>
                                                                    </ul>
                                                                </td>
                                                                <!--<td>-->
                                                                <!--<input name="inputSelected" type="checkbox">-->
                                                                <!--</td>-->

                                                                <!--<td v-if = "savefile.isFile == '0'" class="foldertd">-->
                                                                <!--<span ><img src="../assets/images/fileManage/fileIcon.png"></span>-->
                                                                <!--<span>{{savefile.savefileName}}</span>-->
                                                                <!--</td>-->
                                                                <!--<td v-else class="filetd">-->
                                                                <!--<span v-if = "savefile.savefileType == 'doc'">-->
                                                                <!--<img src="../assets/images/fileManage/file/DOC.png" width="20px" height="27px">-->
                                                                <!--</span>-->
                                                                <!--<span v-else>-->
                                                                <!--<span v-if = "savefile.savefileType == 'docx'">-->
                                                                <!--<img src="../assets/images/fileManage/file/DOC.png" width="20px" height="27px">-->
                                                                <!--</span>-->
                                                                <!--<span v-else>-->
                                                                <!--<span v-if = "savefile.savefileType == 'dwg'">-->
                                                                <!--<img src="../assets/images/fileManage/file/dwg.png" width="20px" height="27px">-->
                                                                <!--</span>-->
                                                                <!--&lt;!&ndash;<span v-else>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-if = "savefile.savefileType == 'pdf'">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<img src="${rc.contextPath}/img/file/PDF.png" width="20px" height="27px">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-else>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-if = "savefile.savefileType == 'ppt'">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<img src="${rc.contextPath}/img/file/PPT.png" width="20px" height="27px">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-else>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-if = "savefile.savefileType == 'xls'">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<img src="${rc.contextPath}/img/file/EXCEL.png" width="20px" height="27px">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-else>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-if = "savefile.savefileType == 'pptx'">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<img src="${rc.contextPath}/img/file/PPT.png" width="20px" height="27px">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-else>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-if = "savefile.savefileType == 'xlsx'">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<img src="${rc.contextPath}/img/file/EXCEL.png" width="20px" height="27px">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-else>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-if = "savefile.savefileType == 'jpg'">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<img src="${rc.contextPath}/project/projectpic?picId={{savefile.savefileOlderId}}" width="20px" height="27px">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-else>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-if = "savefile.savefileType == 'jpeg'">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<img src="${rc.contextPath}/project/projectpic?picId={{savefile.savefileOlderId}}" width="20px" height="27px">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-else>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-if = "savefile.savefileType == 'png'">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<img src="${rc.contextPath}/project/projectpic?picId={{savefile.savefileOlderId}}" width="20px" height="27px">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-else>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-if = "savefile.savefileType == 'bmp'">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<img src="${rc.contextPath}/project/projectpic?picId={{savefile.savefileOlderId}}" width="20px" height="27px">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-else>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-if = "savefile.savefileType == 'gif'">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<img src="${rc.contextPath}/project/projectpic?picId={{savefile.savefileOlderId}}" width="20px" height="27px">&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span v-else>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;##                                                                                                       <span ><img  class="otherPic" width="20px" height="27px"></span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;<span ><img  class="otherPic" src="${rc.contextPath}/img/file/default.png" style="height: 27px;width: 20px;"></span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                                                <!--</span>-->
                                                                <!--</span>-->
                                                                <!--<span>{{savefile.savefileName}}</span>-->
                                                                <!--</td>-->

                                                                <!--<td >-->
                                                                <!--<span class="nameCss1" title={{savefile.user.userName}} v-if="savefile.user.userName !='' && savefile.user.userName !=null ">{{savefile.user.userName}}</span>-->
                                                                <!--<span v-else>-->
                                                                <!--<span class="nameCss2"  title={{savefile.user.phone}} v-if="savefile.user.phone !='' && savefile.user.phone !=null ">{{savefile.user.phone}}</span>-->
                                                                <!--<span v-else>-->
                                                                <!--<span class="nameCss3" title={{savefile.user.email}}>{{savefile.user.email}}</span>-->
                                                                <!--</span>-->
                                                                <!--</span>-->
                                                                <!--</td>-->
                                                                <!--<td v-if = "savefile.isFile == '0'">&#45;&#45;</td>-->
                                                                <!--<td v-else>{{savefile.savefileSize | byteconvert}}</td>-->
                                                                <!--<td>{{savefile.savefileUpdateTime}}</td>-->
                                                                <!--<td class="dropdown more_buttons">-->
                                                                <!--<img src="../assets/images/fileManage/moreICON.png" class="more_button">-->
                                                                <!--<ul class="dropdown-menu more_menu" ></ul>-->
                                                                <!--</td>-->
                                                            </tr>

                                                            </tbody>
                                                        </table>
                                                    </el-checkbox-group>
                                                    <div class="text-center">
                                                        <button class="btn btn-default1 list div-more backg-color primary"
                                                                v-show="loadMoreFlag" @click="loadMore">
                                                            加载更多
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="filesBox">
                        <div class="files_top">
                            <div class="rate_left">

                            </div>
                            <div class="right_min">
                                <img src="./images/min.png" class="min">
                                <img src="./images/max.png" class="max">
                                <img src="./images/del.png" class="files_close">
                            </div>
                        </div>
                        <div class="files_menu">
                            <div class="xs2">

                            </div>
                            <div class="xs6">
                                文件名称
                            </div>
                            <div class="xs2">
                                大小
                            </div>
                            <div class="xs2">
                                状态
                            </div>
                        </div>
                        <!--用来存放item-->
                        <div id="fileList" class="uploader-list">
                            <div v-for="listFile in fileList">
                                <span></span>
                                <span>{{listFile.fileName}}</span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <!--新增-->
                    <div class="modal" id="myModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div>
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="documentContent-addFile">
                                        <div class="modal-header">
                                            <div class="container-fluid">
                                                <div class="row">
                                                    <button type="button" class="close" data-dismiss="modal"
                                                            aria-label="Close"><span aria-hidden="true">&times;</span>
                                                    </button>
                                                    <h4 class="modal-title">添加文件夹</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-body">
                                            <div class="container-fluid">
                                                <div class="row">
                                                    <div class="col-sm-3">文件夹名称</div>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control folderName"
                                                               placeholder="1到20个汉字或40个字符" v-model="addFileName">
                                                        <label class="input-tips">请输入1-20个汉字或40个字符</label>
                                                    </div>
                                                </div>
                                                <div class="row row2">
                                                    <div class="col-sm-3">当前文件夹</div>
                                                    <div class="col-sm-8 dropdown">
                                                        <div class="btn btn-default selectedMenu" type="button"
                                                             v-model="addFileParentName" @click="allParentFileTree()">
                                                            {{addFileParentName}}<span class="caret"></span>
                                                        </div>
                                                        <ul id="createFolderTree" class="selectedMenu-ul ztree"
                                                            v-show="ztreeUl">
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <div class="container-fluid">
                                                <div class="row">
                                                    <div class="col-sm-3 col-sm-offset-5">
                                                        <button type="button" class="btn btn-default confirm addFile"
                                                                @click="addNewFolder()">
                                                            确定
                                                        </button>
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <button type="button" class="btn btn-default cancel"
                                                                data-dismiss="modal">取消
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--##文件夹改名模态框-->
                    <div class="modal" id="myModal3" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div>
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="documentContent-changeFolder">
                                        <div class="modal-header">
                                            <div class="container-fluid">
                                                <div class="row">
                                                    <button type="button" class="close" data-dismiss="modal"
                                                            aria-label="Close"><span aria-hidden="true">&times;</span>
                                                    </button>
                                                    <h4 class="modal-title">修改文件夹名称</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-body">
                                            <div class="container-fluid">
                                                <div class="row">
                                                    <div class="col-sm-3">文件夹新名称</div>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control folderNewName"
                                                               v-model="want2Name" @keydown="nameMaxLength">
                                                        <label class="input-tips">请输入1-20个汉字或40个字符</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <div class="container-fluid">
                                                <div class="row">
                                                    <div class="col-sm-3 col-sm-offset-5">
                                                        <button type="button"
                                                                class="btn btn-default confirm changeFolderName"
                                                                @click="reNameSure">确定
                                                        </button>
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <button type="button" class="btn btn-default cancel"
                                                                data-dismiss="modal" @click="reNameCancel">取消
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--##文件改名模态框-->
                    <div class="modal" id="myModal5" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div>
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="documentContent-changeFile">
                                        <div class="modal-header">
                                            <div class="container-fluid">
                                                <div class="row">
                                                    <button type="button" class="close" data-dismiss="modal"
                                                            aria-label="Close"><span aria-hidden="true">&times;</span>
                                                    </button>
                                                    <h4 class="modal-title">修改文件名称</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-body">
                                            <div class="container-fluid">
                                                <div class="row">
                                                    <div class="col-sm-3">文件新名称</div>
                                                    <div class="col-sm-8">
                                                        <input id="fileName" type="text"
                                                               class="form-control fileNewName">
                                                        <label class="input-tips">请输入1-20个汉字或40个字符</label>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <div class="container-fluid">
                                                <div class="row">
                                                    <div class="col-sm-3 col-sm-offset-5">
                                                        <button type="button"
                                                                class="btn btn-default confirm changeFileName">确定
                                                        </button>
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <button type="button" class="btn btn-default cancel"
                                                                data-dismiss="modal">取消
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
    .app-main {
        margin-top: 60px;
        margin-bottom: 15px;
    }
</style>


