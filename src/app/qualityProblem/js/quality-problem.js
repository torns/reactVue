var zNodes = [
    {
        "nodeId":"0",
        "nodeName":"木质",
        "parentId":"",
    },
    {
        "nodeId":"1",
        "nodeName":"1",
        "parentId":"0",
    },
    {
        "nodeId":"11",
        "nodeName":"墙",
        "parentId":"1",
    },
    {
        "nodeId":"111",
        "nodeName":"装饰",
        "parentId":"11",
    },
    {
        "c":"2",
        "nodeName":"书具",
        "parentId":"1",
    },
    {
        "nodeId":"22",
        "nodeName":"窗帘",
        "parentId":"2",
    },
    {
        "nodeId":"3",
        "nodeName":"大理石",
        "parentId":"0",
    },
    {
        "nodeId":"33",
        "nodeName":"洗碗池",
        "parentId":"3",
    }
];


//---------------------------------------------构件---------------------------------------------------------------------
var settingAdd = {
    data: {
        key: {
            children: "",
            name: "nodeName",
            title: "",
            url: "url",
            icon: "icon",
            // pathname: "nodePath"
        },
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pid",
            rootPId: null
        },
        keep: {
            parent: false,
            leaf: false
        }
    },
    callback: {
        // onCheck: onClick(),    // zTreeOnCheck
        // onCheck:GetCheckedAll,
        beforeClick: beforeClick
    }
};    //参数配置
var log, className = "dark";

function beforeClick(treeId, treeNode, clickFlag) {
    // showLog(treeNode.nodeName);
    if(treeNode.isParent){  /*判断点击是否是最后一个节点*/
        // $_str='';
        return false;
    }else{
        // return false;
        showLog(treeNode.nodeName,treeNode.id);
        console.log(treeNode.isLastNode);
        return (treeNode.click != false);
    }
}

// function onClick(event, treeId, treeNode, clickFlag) {
//     // console.log($(this));
// }
var $_str;

function showLog(name,id) {
    if (!log) log = $("#log");
    $_str=
        '<div class="row contentCenter">'+
        '<div class="col-sm-10 element-name" id='+id+'>'+name+'</div>'+
        '<div class="col-sm-2"><img src="../assets/images/quality/DELETE_ICON.png" class="delete-icon">'+
        '</div>'+
        '</div>';
    console.log($_str);
}

function remove(e) {
    var zTree = $.fn.zTree.getZTreeObj("add-treeDemo"),
        nodes = zTree.getSelectedNodes();
    if(nodes.isParent){

    }else{
        treeNode = nodes[0];
        zTree.removeNode(treeNode);
    }
}

// $('#addModal_1 .center').click(function () {
//     $('#addModal_1').find('.right-content').append($_str);
//     $_str='';
//     remove();
// });
// ----------------------------------------------空间结构---------------------------------------------------------------

var setting = {
    data: {
        key: {
            children: "",
            name: "nodeName",
            title: "",
            url: "url",
            icon: "icon",
            pathname: "nodePath"
        },
        simpleData: {
            enable: true,
            idKey: "nodeId",
            pIdKey: "parentId",
            rootPId: null
        },
        keep: {
            parent: false,
            leaf: false
        }
    },
    callback: {
        // onCheck: onClick(),    // zTreeOnCheck
        // onCheck:GetCheckedAll,
        beforeClick: beforeClick_
    }
};    //参数配置
var log, className = "dark";

function beforeClick_(treeId, treeNode, clickFlag) {
    if(treeNode.isParent){  /*判断点击是否是最后一个节点*/
        showLog_(treeNode.nodeName,treeNode.nodeId);
        console.log(treeNode.isLastNode);
        return (treeNode.click != false);

    }else{
        return false;
    }
}

var $_str_;

function showLog_(name,id) {
    if (!log) log = $("#log");
    $_str_=
        '<div class="row contentCenter">'+
        '<div class="col-sm-10 element-name" id='+id+'>'+name+'</div>'+
        '<div class="col-sm-2"><img src="../assets/images/quality/DELETE_ICON.png" class="delete-icon">'+
        '</div>'+
        '</div>';
    // console.log($_str_);
}
//同一个点击事件
// $('#addModal_1 .center').click(function () {
//     alert(11)
//     console.log($_str);
//     //判断头部index
//     if(index == 1){
//         // 空间结构
//         $('#addModal_1').find('.right-content').append($_str_);
//         $_str_='';
//     }else if(index == 2){
//         //   任务
//     }else{
//         // 构件
//         $('#addModal_1').find('.right-content').append($_str);
//         $_str='';
//         remove();
//     }

// });
$(document).ready(function () {
    $.fn.zTree.init($("#treeDemos"), setting, zNodes);/*空间结构*/
});
// $(document).ready(function () {
//     console.log('znodes'+zNode);
//     $.fn.zTree.init($("#add-treeDemo"), settingAdd, zNode);/*构建*/
// })
