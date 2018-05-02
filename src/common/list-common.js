//generate json from parameter names and values list
function paramJson(keys, values) {
    var arr = new Array();
    //arr.push("{");
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var v = values[i];
        //arr.push("\"");
        arr.push(k);
        //arr.push("\"");
        arr.push(":");
        arr.push(v);
        if (i < keys.length - 1)
            arr.push(",");
    }
    //arr.push("}");
    return arr.join("");
}


// function list(el,url,json_param)
// {
//     //constructor
//     this.el = el;
//     this.url = url;
//     this.json_param = json_param;
//     this.server_rslt = null;
//     this.processed_list = null;
//     this.vue = null;
//
//     list.prototype.init=function()
//     {
//         //获取列表
//         var vue =new Vue({
//             list:this,
//             el:this.el,
//             url:this.url,
//             json_param:this.json_param,
//             data:{
//                 items:[]
//             },
//             created: function () {
//                 //请求数据
//                 this.$http.post(this.url, this.json_param, {
//                     headers: {
//                     },
//                     emulateJSON: true
//                 }).then(function(rslt) {
//                     var list = rslt.data.data;
//                     //process the result list
//                     //var showlist = callback(list); //the list shown on pages
//                     this.list.server_rslt = list;
//                     this.list.process();//virtual function
//
//                 }, function(response) {
//                     // 这里是处理错误的回调
//                     console.log(response)
//                 });
//             },
//             methods:{
//                 setData: function (list) {
//                     this.items = list;
//                 }
//             }
//         });
//
//         this.vue = vue;
//     }
//     list.prototype.edit=function()
//     {
//
//     }
//     list.prototype.add=function()
//     {
//
//     }
//     list.prototype.show=function()
//     {
//
//     }
//     //process the server result
//     list.prototype.process=function()
//     {
//
//     }
//
//
// }

//alert("before extjs define list");

// // list class definition
// Ext.define("list", {
//     // status
//     el: null,
//     urls:[],
//     params:[],
//     server_rslt:null,
//     processed_list:null,
//     vue:null,
//     list_hds:[],
//     rows:[],
//     url_idx:{},
//     constructor: function (args) {
//         this.el = args.el;
//         this.urls = args.urls;
//         this.params= args.params;
//         this.server_rslt = null;
//         this.processed_list = null;
//         this.vue = null;
//         this.url_idx = args.url_idx;
//
//         return this;
//     },
//     init:function ()
//     {
//         //获取列表
//         var vue =new Vue({
//             el:this.el,
//             data:{
//                 parent:this,
//                 urls:this.urls,
//                 params:this.params,//init params on page load
//                 url_idx:this.url_idx,
//                 rows:[]
//             },
//             created: function () {
//                 //请求数据
//                 var idx = 0;
//                 this.params = {projectId:11};
//                 this.$http.post(this.urls[idx], this.params, {
//                     headers: {
//                     },
//                     emulateJSON: true
//                 }).then(function(rslt) {
//                     var server_rslt;
//                     //process the result list
//                     //var showlist = callback(list); //the list shown on pages
//                     this.parent.server_rslt = server_rslt;
//                     this.parent.process();//virtual function
//
//                 }, function(response) {
//                     // 这里是处理错误的回调
//                     console.log(response)
//                 });
//             },
//             methods:{
//                 setData: function (list) {
//                     this.rows = list;
//                 },
//                 ajax:function (idx,params) {
//                     this.$http.post(this.urls[idx], params, {
//                         headers: {
//                         },
//                         emulateJSON: true
//                     }).then(function(rslt) {
//                         //request success
//                         //process the result list
//                         alert("ajax success");
//                         this.rows = [];
//                     }, function(response) {
//                         // 这里是处理错误的回调
//                         console.log(response)
//                     });
//                 }
//             }
//         });
//
//         this.vue = vue;
//     },
//     generate_one_row:function (vals) {
//
//     },
//     //process result json from server
//     process:function ()
//     {
//
//     },
//     //ajax invoke
//     //idx is apis index
//     ajax:function (idx,params)
//     {
//         this.vue.ajax(idx,params);
//     }
// });


//ajax request


function ajax(vue, url, params, mtd, callback) {
    //alert("entering ajax");
    vue.$http.post(url, params, {
        headers: {},
        emulateJSON: true
    }).then(function (result) {
        // 这里是处理正确的回调
        //console.log(result.data.data);
        //vue.list = result.data.data;
        //alert(result.data.message);
        callback(result);

    }, function (response) {
        // 这里是处理错误的回调
        console.log(response);
        //alert(result.data.message);
    });

    //
    // $.ajax({
    //     type: 'POST',
    //     data: params,
    //     url: url,
    //     //url:zyfUrl+'/model/getTree',
    //     dataType: 'json',
    //     cache: false,
    //     success: function(data) {
    //         console.log(data.data);
    //         callback(data);
    //         //console.log(zNodes);
    //     },
    //     error: function(jqXHR, textStatus, errorThrown) {
    //         console.log('error ' + textStatus + ' ' + errorThrown);
    //     }
    // });


    //this.vue = vue;

    //alert("leaving ajax");
}

export {
    ajax
}