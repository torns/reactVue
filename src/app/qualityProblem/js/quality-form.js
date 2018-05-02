/**
 * Created by Administrator on 2018/1/13.
 */
var addformId;
var addformContent;
$(document).ready(function (){
    // 高度
    var thisH = $(window).height();
    var centerH = thisH - 320 + 'px';
    $(".note-editable.panel-body").css("min-height", centerH);
    window.onresize = function () {
        var thisH = $(window).height();
        var centerH = thisH - 320 + 'px';
        $(".note-editable.panel-body").css("min-height", centerH);
    }
    //添加表单
    $("#save").click(function(){
        var formName=$(".formName").val();
        var formType=$(".typeName").val();
        addformContent=$(".note-editable.panel-body").html();
        $.ajax({
            type: 'POST',
            data: {
                formName:formName,
                formType:formType,
                formContent:addformContent
            },
            url: zyfUrl+'/qualityForm/insertQualityForm',
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log(data);
                if(data.code==0){
                    // alert(data.message);
                    addformId=data.data;
                    console.log(addformId);
                    window.localStorage.setItem('addformId', addformId);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + ' ' + errorThrown);
            }
        });
    })
    //获得Id
    var  urlId=location.href;
    urlId=urlId.substr(urlId.lastIndexOf('=')+1);
    console.log(urlId);
    //获取表单
    // var lookVue = new Vue({
    //     el: '#edit-form',
    //     data:{
    //         formName:"",
    //         formType:"",
    //         formContent:""
    //     },
    //     mounted:function () {
    //
    //     },
    //     methods:function () {
    //
    //     }
    // })
    $.ajax({
        type: 'POST',
        data: {
            formId:urlId
        },
        url: zyfUrl+'/qualityForm/selectQualityFormById',
        dataType: 'json',
        cache: false,
        success: function(result) {
            console.log(result);
            var data=result.data;
            console.log(data.formContent);
            $(".edit-formName").val(data.formName);
            $(".edit-typeName").val(data.formType);
            $(".edit-center .note-editable.panel-body").append(data.formContent);//现在不可以
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error ' + textStatus + ' ' + errorThrown);
        }
    });

    //修改表单
    $("#edit-save").click(function(){
        var formName=$(".edit-formName").val();
        var formType=$(".edit-typeName").val();
        addformContent=$(".edit-center .note-editable.panel-body").html();
        $.ajax({
            type: 'POST',
            data: {
                formId:urlId,
                formName:formName,
                formType:formType,
                formContent:addformContent
            },
            url: zyfUrl+'/qualityForm/updateQualityForm',
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log(data);
                if(data.code==0){
                    // alert(data.message);
                    addformId=data.data;
                    console.log(addformId);
                   // window.localStorage.setItem('addformId', addformId);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + ' ' + errorThrown);
            }
        });
    })
})