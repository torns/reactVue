//    time
// //开始时间
// var nowTemp = new Date();
// var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
// var checkin1 = $('#datetimeStart').fdatepicker({
//     format: 'yyyy-mm-dd',
//     language: 'zh-CN',
//     onRender: function (date) {
//         return date.valueOf() < now.valueOf() ? 'disabled' : '';
//     }
// }).on('changeDate', function (ev) {
//     if (ev.date.valueOf() > checkout1.date.valueOf()) {
//         var newDate = new Date(ev.date)
//         newDate.setDate(newDate.getDate() + 1);
//         //newDate.setDate(newDate.getDate());
//         checkout1.update(newDate);
//     }
//     checkin1.hide();
//     //$('#datetimeEnd')[0].focus();
// }).data('datepicker');
// //结束时间
// var checkout1 = $('#datetimeEnd').fdatepicker({
//     format: 'yyyy-mm-dd',
//     language: 'zh-CN',
//     onRender: function (date) {
//         return date.valueOf() <= checkin1.date.valueOf() ? 'disabled' : '';
//     }
// }).on('changeDate', function (date) {
//     checkout1.hide();
//     return date.valueOf() <= checkin1.date.valueOf() ? 'disabled' : '';
// }).data('datepicker');
// //添加截止时间
// var checkout1 = $('#modal_datetimeEnd').fdatepicker({
//     format: 'yyyy-mm-dd',
//     language: 'zh-CN',
//     onRender: function (date) {
//     }
// }).on('changeDate', function (date) {
//     checkout1.hide();
//     //return date.valueOf() <= checkin1.date.valueOf() ? 'disabled' : '';
// }).data('datepicker');
// //编辑截止时间
// var checkout1 = $('#modal_datetimeEnd2').fdatepicker({
//     format: 'yyyy-mm-dd',
//     language: 'zh-CN',
//     onRender: function (date) {
//     }
// }).on('changeDate', function (date) {
//     checkout1.hide();
//     //return date.valueOf() <= checkin1.date.valueOf() ? 'disabled' : '';
// }).data('datepicker');

//添加
var add_announcement = new Vue({
    el:'#add-announcement',
    data:{
        content:'content',
        date:'2018-01-04 17:30:19',
        file:'file'
    },
    methods:{
        add:function () {
            var that = this;
            that.$http.post(wxwUrl+'/notice/insertNotice',{
                noticeContent:this.content, /*内容*/
                noticeEndTime:this.date,    /*时间*/
                userId:'123123',
                noticeSaveFileList:this.file    /*上传附件*/
            },{
                headers:{

                },
                emulateJSON: true
            }).then(function (result) {
                console.log(result);
                if(result.body.code == 0){
                    $('#myModal_1').modal('hide');
                    $(".modal-backdrop.in").hide();
                }else{
                    console.log('返回数据失败');
                }
            },function (responsive) {
                console.log('error:'+responsive)
            })
        }
    }

});
//页面查询所有数据
var announcement = new Vue({
    el:'#announcement',
    data:{
        items:'',
        date:'3',
    },
    mounted:function () {
        var that = this;
        that.$http.get(wxwUrl+'/notice/selectNoticeByAll',{

        },{
            headers:{

            },
            emulateJSON: true
        }).then(function (result) {
            console.log(result.body.data)
            console.log(result.body.data[0].noticeCreateTime.replace(/-/g,""));
            this.items=result.body.data;
        },function (responsive) {
            console.log(responsive);
        })
    },
    methods:{
      edit:function (index) {
          // console.log(index);
          // console.log(this.items);
          console.log(this.items[index].noticeContent);
          edit_announcement.content = this.items[index].noticeContent;
          edit_announcement.num = index;
          edit_announcement.id = this.items[index].id;
          edit_announcement.date = this.items[index].noticeEndTime;
      },
      del:function (index) {
          this.item.splice(index,1);
      }
    },
    filters:{
        dateCount:function (date,start,end) {
           // alert("ddddd");
           //  console.log(start);
           //  console.log(end);
            var startDate=new Date(start);
            var endDate=new Date(end);
            var startDatelong = startDate.getTime();
            var endDateLong = endDate.getTime();
            // console.log(startDatelong);
            // console.log(endDateLong);
            // console.log("==============");
            return (endDateLong-startDatelong)/(60*60*1000);
        }
    }
});
//编辑
var edit_announcement = new Vue({
    el:'#edit_announcement',
    data:{
        content:'',
        num:'',
        date:'',
        id:''
    },
    methods:{
        edit:function () {
            var that = this;
            that.$http.post(wxwUrl+'',{

            },{
                headers:{

                },
                emulateJSON: true
            }).then(function (result) {
                console.log(result);
            },function (responsive) {
                console.log(responsive);
            })
            announcement.items[this.num].noticeContent=this.content;
            announcement.items[this.num].noticeEndTime=this.date;
        }
    }
});
