/**
 * Created by Administrator on 2017/12/30.
 */
$(document).ready(function() {
    // ##    左边内容高度
    var thisH = $(window).height();
    // console.log(thisH);
    var centerH = thisH - 160+38 + 'px!important';
    console.log(centerH);
    $(".doc_left.ztree").css("height", centerH);
    // ##    左边菜单
    $(".left-menu-content ul.dropdown-menu").on("click", "li>a", function () {
        $(".left-menu-content ul.dropdown-menu").css("display", "block");
        $("li>a").removeClass("inner-curr");
        $(this).addClass("inner-curr");
    });
    $(".left-menu-content .list-group").on("click", ".list-group-item", function () {
        $(".list-group .list-group-item ul.dropdown-menu").css("display", "none");
        $(this).children(".dropdown-menu").css("display", "block");
    })

    // ##    右边内容高度
    // console.log(thisH);
    var centerH_ = thisH - 97+28 -75 + 'px';
    console.log(centerH);
    $(".page-content").css("min-height", centerH_);
    var leftMenuH=thisH - 97-46-45+"px";
    console.log(leftMenuH);
    $('#filetreeMenu').css('height',leftMenuH);
});
//    ------------------------------------------------------------------------------------------------------------------
$(document).ready(function() {
    //table 高度设置
    var thisH = $(window).height();
    //左边高度
    var lefeH=thisH -154 + 'px'
    $(".ztree.fileZtree").css("height", lefeH);
    //    列表高度
    var centerH = thisH - 263 -35 + 'px';
    $(".table_center").css("height", centerH);
    var thumbnailListH=thisH-263 -35+'px';
    //图标高度
    $('.thumbnailListH').css('height',thumbnailListH);
})
window.onresize = function() {
    var thisH = $(window).height();
    //左边高度
    var lefeH=thisH -154 + 'px'
    //$(".left-menu").css("height", lefeH);
    $(".ztree.fileZtree").css("height", lefeH);
    var centerHH = thisH - 263 -35 + 'px';
    //    列表高度
    $(".table_center").css("height", centerHH);
    var thumbnailListH=thisH-263+'px';
    var centerH_ = thisH - 97+28 -75 + 'px';
    // console.log(centerH);
    $(".page-content").css("min-height", centerH_);
//    图标高度
    $('.thumbnailListH').css('height',thumbnailListH);
    var leftMenuH=thisH - 97-46-45+"px";
    // console.log(leftMenuH);
    $('#filetreeMenu').css('height',leftMenuH);
};
$('#edit').on('click','li img',function () {
    if($(this).siblings('ul').css('display')=='none'){
        $(this).siblings('ul').css('display','block')
    }else{
        $(this).siblings('ul').css('display','none')
    }
});
$(document).on('mouseover','#edit li',function () {
    $(this).children('img').css('visibility','visible')
});
$(document).on('mouseleave','#edit li',function () {
    $(this).children('img').css('visibility','hidden')
});

$(document).on('mouseleave','.list-group-item .droplistProject',function () {
    $(this).remove();
});

$(".navbar-nav.navs a").removeClass("activing");
$(".head_doc").addClass("activing");
//filesBox
$(".files_close").click(function () {
    $(".filesBox").css("display","none");
    $('#fileList').html("");
});
$(".min").click(function () {
    $(".files_menu").css("display","none");
    $(".uploader-list").css("display","none");
    $(".max").css("display","block");
    $(".min").css("display","none");
});
$(".max").click(function () {
    $(".files_menu").css("display","block");
    $(".uploader-list").css("display","block");
    $(".max").css("display","none");
    $(".min").css("display","block");
});

//搜索
$(".search").focus(function () {
    $(".delete_img").hide();
    $(".search_img").show();
});
$(".search_img").click(function () {
    if($('.search').val().trim().length>0){
        $(this).hide();
        $(".delete_img").show();
    }
});
$(".delete_img").click(function () {
    $(this).hide();
    $(".search_img").show();
    $(".search").val("");
});

//列表悬浮显示更多
$(document).on('mouseover','.documentContent .container-fluid .row .table tbody tr',function () {
    $(this).children('td').children('img').css('visibility','visible')
});
$(document).on('mouseleave','.documentContent .container-fluid .row .table tbody tr',function () {
    $(this).children('td').children('img').css('visibility','hidden')
});

//缩略图切换
$('.documentContent #listIcon').on('click','div',function () {
    $(this).index();
    console.log($(this).index());
    if($(this).index()==0){
        $('.list').css('display','block');
        $('.thumbnailList').css('display','none');
        $(this).addClass('listICONHover');
        $(this).removeClass('listICON');
        $(this).siblings('div').removeClass('listThumbnailHover');
        $(this).siblings('div').addClass('listThumbnail');
    }else if($(this).index()==1){
        $('.list').css('display','none');
        $('.thumbnailList').css('display','block');
        $(this).addClass('listThumbnailHover');
        $(this).removeClass('listThumbnail');
        $(this).siblings('div').removeClass('listICONHover');
        $(this).siblings('div').addClass('listICON');
    }
});

//    选中状态
$('.documentContent .thumbnailList').on('click','.col-sm-2 .row .thumbnailListSelected label',function () {
    if($(this).hasClass('selected')){
        $(this).removeClass('selected');
        $(this).parents('.thumbnailListSelected').removeClass('thumbnailList-selected')
    }else{
        $(this).addClass('selected');
        $(this).parents('.thumbnailListSelected').addClass('thumbnailList-selected')
    }
});
//    下拉菜单
$('.list').on('click','tr td img',function () {
    if($(this).siblings('ul').css('display')=='none'){
        $(this).siblings('ul').css('display','block')
    }else{
        $(this).siblings('ul').css('display','none')
    }
});
//缩略图移上去效果-更多显示&&边框hover
$(document).on('mouseover','.documentContent .thumbnailList .col-sm-2 .row .thumbnailListSelected',function () {
    $(this).children('div').children('span').children('img').css('visibility','visible');
    if($(this).hasClass('thumbnailList-selected')){
        $(this).css('background','#FFFFFF').css('border','1px solid #CCCCCC').css('box-shadow','0 2px 4px 0 rgba(0,0,0,0.20)').css('border-radius','3px')
    }else{
        $(this).children('label').css('visibility','visible');
        $(this).css('background','#FFFFFF').css('border','1px solid #CCCCCC').css('box-shadow','0 2px 4px 0 rgba(0,0,0,0.20)').css('border-radius','3px')
    }
});
$(document).on('mouseleave','.documentContent .thumbnailList .col-sm-2 .row .thumbnailListSelected',function () {
    $(this).children('div').children('span').children('img').css('visibility','hidden');
    if($(this).hasClass('thumbnailList-selected')){
        $(this).css('background','#FFFFFF').css('border','1px solid #fff').css('box-shadow',' 0 2px 4px 0 rgba(255,255,255,255)').css('border-radius','3px')
    }else{
        $(this).children('label').css('visibility','hidden');
        $(this).css('background','#FFFFFF').css('border','1px solid #fff').css('box-shadow',' 0 2px 4px 0 rgba(255,255,255,255)').css('border-radius','3px')
    }
});

//权限模态框
//        ##    权限展示与隐藏
$('#limit').mouseover(function () {
    $('.toolTips').css('display', 'block')
})
$('#limit').mouseleave(function () {
    $('.toolTips').css('display', 'none')
})
//limitSet
//        ##    全选
$('#sectorSelected').change(function () {
    if ($(this).prop('checked')) {
        $('.sector input').prop('checked', 'checked')
    } else {
        $('.sector input').removeAttr('checked');
    }
})
$('#userSelected').change(function () {
    if ($(this).prop('checked')) {
        $('.user input').prop('checked', 'checked')
    } else {
        $('.user input').removeAttr('checked');
    }
})
//    hover效果
$('.container-fluid .center').mouseover(function () {
//    if($(this).has('img').length>0){
//        $(this).children().remove('img');
//        var img='<img src="../img/RIGHT_ICON_hover.png" class="addright">'
//        $('.container-fluid .center').append(img)
//    }
    $(".addright").css("display", "none");
    $(".addright2").css("display", "block");
})
$('.container-fluid .center').mouseleave(function () {
    $(".addright2").css("display", "none");
    $(".addright").css("display", "block");
//    if($(this).has('img').length>0){
//        $(this).children().remove('img');
//        var img='<img src="../img/RIGHT_ICON.png" class="addright">'
//        $('.container-fluid .center').append(img)
//    }
})
$('.borderStyle').on('click', '.headerContent div', function () {
    $(this).addClass('active');
    $(this).siblings('div').removeClass('active');
    if ($(this).index() == 0) {
        $('.sector').css('display', 'block');
        $('.user').css('display', 'none');
    } else if ($(this).index() == 1) {
        $('.sector').css('display', 'none');
        $('.user').css('display', 'block');
    }
})
//共用
$('#addLimit').click(function () {
    $('.documentContent-addLimit').css('display', 'none')
    $('.documentContent-limitSet').css('display', 'block');
})
$('#backLimitSet').click(function () {
    $('.documentContent-addLimit').css('display', 'block')
    $('.documentContent-limitSet').css('display', 'none');
})
$(".addright2").click(function () {
    addright();
})
//    取消
$('.documentContent-addLimit .cancel').click(function () {
    $(".modal-backdrop.in").css("display","none");
    $('#myModal2').modal('hide');
})

//文件操作下拉菜单显示和隐藏
$(document).on("click", ".documentContent .iconsFunction .more_buttons img", function () {
    if ($(this).siblings("ul").css("display") == "block") {
        $(this).siblings("ul").css("display", "none");
        $(this).parents('td').parent('tr').siblings('tr').children('td').children('ul').css('display', 'none')
    } else {
        $(this).siblings("ul").css("display", "block");
        $(this).parent('td').parent('tr').siblings('tr').children('td').children('ul').css('display', 'none')
    }
})
//文件操作下拉菜单显示和隐藏
$(document).on("click", ".more_menu li", function () {
    $(this).parent(".more_menu").css("display", "none");
});
