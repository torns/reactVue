+

//require("fullcalendar"); 
function($){ "use strict";
//$(function(){ 
	//"use strict";
	$('.external-event').each(function(){
		$(this).data('event', {
			title: $.trim($(this).text()),
			className: [$(this).data('class')]
		});
	});
//拖拽
// 	$('.external-event').draggable({
//     	revert: true,
//     	revertDuration: 0
//     });
	var cal = $('#fullcalendar').fullCalendar({
		theme: true,
		editable: true,
		droppable: true,
		//defaultDate: 'month',
		header: {
			left: 'prev, today, next',
			center: 'title',
			right: 'month, agendaWeek, agendaDay'
		},
		buttonText: {
			prev: '',
			next: ''
		},
		// events: [
		// 	{
		// 		"category": "warning",
		// 		"title": "My First Event",
		// 		"start": "2016-05-05",
		// 		"end": "2016-05-8",
		// 		"className": ["warning"]
		// 	},
		// 	{
		// 		"category": "success",
		// 		"title": "Three Days Event",
		// 		"start": "2016-05-11",
		// 		"className": ["success"]
		// 	},
		// 	{
		// 		"category": "warning",
		// 		"title": "Imporatnt Event",
		// 		"start": "2016-05-13",
		// 		"end": "2016-05-15",
		// 		"className": ["danger"]
		// 	},
		// 	{
		// 		"category": "primary",
		// 		"title": "Four Days Event",
		// 		"start": "2016-05-22",
		// 		"end": "2016-05-25",
		// 		"className": ["primary"]
		// 	}
		// ],
		drop: function(date) {
			if ($('#drop-remove').is(':checked')) {
				$(this).remove();
			}
		},
		//点击day
		dayClick: function(date, jsEvent, view) {
			console.log(date);
			var modal = $('#new_event_modal');
			modal.modal('show');
			modal.find('#event_start').val(date.format());
		}
	});
	//查看详情
	$("#fullcalendar").on("click",".fc-event",function () {
        var modal = $('#detail_modal');
        modal.modal('show');
        //modal.find('#event_start').val(date.format());
    })
	//人员操作
	//    $(".add-event-center .left .borderStyle .dropdown-toggle").click(function () {
	// 		if($(this).siblings("ul").show()){
	// 			$(this).siblings("ul").hide();
	// 		}else{
	// 			$(this).siblings("ul").show();
	// 		}
	//    })

	$.fn.windowCheck = function() {
		var ww = $(window).width();
		if(ww > 768) {
			cal.fullCalendar('changeView', 'month');
		} else if(ww < 768 && ww > 540) {
			cal.fullCalendar('changeView', 'basicWeek');
		} else {
			cal.fullCalendar('changeView', 'basicDay');
		}
	};

	$(window).on('resize', function(e){
		$().windowCheck();
	});

	$('.fc-prev-button').append('<i class="fa fa-chevron-left"><i>');
	$('.fc-next-button').append('<i class="fa fa-chevron-right"><i>');
	//时间加一天
	function getNextDay(d){
		d = new Date(d);
		d = +d + 1000*60*60*24;
		d = new Date(d);
		//return d;
		//格式化
		return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();

	}
	// add new event category添加会议提交
	$('#new_event_cat_form').on('submit', function(e){
		e.preventDefault();
		
        var title = $(this).find('#event_title').val();
        var category = $(this).find('#event_category').val();
        var start = $(this).find('#datetimeStart').val();
        var end=$(this).find('#datetimeEnd').val();
        end=getNextDay(end);
        var content=$(this).find('#event_content').val();
        //人员
        // $(".Three .tree_div input").each(function (index,item) {
        //     console.log(item);
        //     if($(this).attr("checked")){
        //         console.log($(this))
        //     }
        // })
        if(title.length==0||category.length==0||start.length==0||end.length==0||content.length==0){
		//if(end.length==0){
        	alert("请完善信息后再提交！");
		}else{

        	//日历板
            cal.fullCalendar('addEventSource', [
                {
                    title: title,
                    start: start,
                    end:end,
                    className: [category]
                }
            ])
            $('#new_event_cat_modal').modal('hide');
		}

	});

	// add new event添加事件
	$('#new_event_form').on('submit', function(e){
		e.preventDefault();

		var title = $(this).find('#event_title').val();
		var category = $(this).find('#event_category').val();
		var start = $(this).find('#event_start').val();

		cal.fullCalendar('addEventSource', [
			{
				title: title,
				start: start,
				className: [category]
			}
		])
		$('#new_event_modal').modal('hide');
	});
	//time
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
        //小时的判断
        $('#datetimeEnd-hour').on("change",function () {
            if($('#datetimeStart-hour').val()>$("#datetimeEnd-hour").val()){
                alert("结束时间不能小于开始时间！");
                return false;
            }
        })
	//})
}(jQuery);