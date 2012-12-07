(function ($) {
var ns = $.fn.nsjui;



/* ids
inp_year
inp_month
txt_ymd
img_msg
tit_msg
tpl_days
*/




var calendar	= $.fn[ns].calendar = function (settings) {

	var	iframe	= $('<iframe src="calendar/ui.html" style="width:200px; height:250px"></iframe>');
	iframe
		.data('calendar.settings.org', settings)
		.load(oHandler.parent.loadTemplate)
		.appendTo($(document.body));

//	daysBdy.click(calendar.handler.child.selectDate);

	return this;
};

var oHandler	= calendar.handler = {};
oHandler.parent	= {
	loadTemplate	: function (event) {
//		var ymd	= [2012, 12, 21],
		var ymd		= [],
			calWindow	= $(this).unbind('load', arguments.callee),
			calDOM		= $(this.contentWindow.document),
			daysBody	= calDOM.find('#tbl_days'),
			settings	= $.extend({
				'node'	: this,
				'nodes'	: {
					'daysBody'		: daysBody,
					'inpYear'		: calDOM.find('#inp_year'),
					'inpMonth'		: calDOM.find('#inp_month')
				},
				'templates'	: {
					'days'	: $.template(null, daysBody.clone())
				}
			}, calWindow.data('calendar.settings.org'));

		calDOM.data('calendar.settings', settings);
		calWindow.data('calendar.settings', settings);
		calendar.setDate.call(calDOM, ymd);
		calDOM.click(oHandler.child.selectDate);
	}
};



oHandler.child	= {
	closeCalendar	: function () {},
	resetDate	: function () {},
	selectDate	: function (event) {
		var settings	= $(this).data('calendar.settings'),
			nodes		= settings.nodes,
			ymd			= [nodes.inpYear.val(), nodes.inpMonth.val(), $(event.target).html];
	},
	repaintCalendar	: function () {}
};

calendar.setDate	= function (ymd) {
	var settings	= this.data('calendar.settings'),
		nodes		= settings.nodes,
		oDate		= new Date();
		

	ymd.today	= [oDate.getFullYear(), oDate.getMonth()+1, oDate.getDate()];
	switch (ymd.length) {
	case 0 : ymd[0] = ymd.today[0];
	case 1 : ymd[1] = ymd.today[1];
	case 2 : ymd[2] = ymd.today[2];
	}

	nodes.inpYear.val(ymd[0]);
	nodes.inpMonth.val(ymd[1]);

	calendar.paintDays.call(this, ymd);
};


calendar.paintDays	= function (ymd) {
	var settings	= this.data('calendar.settings'),
		nodes		= settings.nodes,
		daysFrag	= $(this.get(0).createDocumentFragment()),
		tplRow		= settings.templates.days,
		getDayStyle	= calendar.getDayStyle,
		dateMatrix	= calendar.getDateMatrix(ymd),
		monthStyle	= ['', '', '', '', '', '', '', '', '', '', '', ''];

	monthStyle[dateMatrix.prevMonth]	= 'prev';
	monthStyle[dateMatrix.nextMonth]	= 'next';

	for (var i=0; dateMatrix[i];) {
		$.tmpl(tplRow, {
			'stylesun'	: getDayStyle(monthStyle, dateMatrix, i),
			'datesun'	: dateMatrix[i++].date,
			'stylemon'	: getDayStyle(monthStyle, dateMatrix, i),
			'datemon'	: dateMatrix[i++].date,
			'styletue'	: getDayStyle(monthStyle, dateMatrix, i),
			'datetue'	: dateMatrix[i++].date,
			'stylewed'	: getDayStyle(monthStyle, dateMatrix, i),
			'datewed'	: dateMatrix[i++].date,
			'stylethu'	: getDayStyle(monthStyle, dateMatrix, i),
			'datethu'	: dateMatrix[i++].date,
			'stylefri'	: getDayStyle(monthStyle, dateMatrix, i),
			'datefri'	: dateMatrix[i++].date,
			'stylesat'	: getDayStyle(monthStyle, dateMatrix, i),
			'datesat'	: dateMatrix[i++].date
		}).appendTo(daysFrag);
	}

	settings.nodes.daysBody.find('*').replaceWith(daysFrag);
};


calendar.getDayStyle	= function (monthStyle, dateMatrix, idx) {
	return monthStyle[dateMatrix[idx].month] + (dateMatrix[idx].today ? ' today' : '');
};








// UTIL: 6주치 날짜 매트릭스를 반환한다.
calendar.getDateMatrix	= function (ymd) {
	var oDate	= ymd.length == 3 ? new Date(ymd[0], ymd[1]-1, ymd[2]) : new Date(),
		matrix	= [];

	matrix.year		= oDate.getFullYear();
	matrix.month	= oDate.getMonth()+1;
	matrix.date		= oDate.getDate();

	oDate.setDate(0);
	oDate.setDate(oDate.getDate()-oDate.getDay());

	matrix.prevMonth = oDate.getMonth()+1;

	for (var i=6; i--;) {

		for (var j=7, y, m, d; j--;) {
			y	= oDate.getFullYear();
			m	= oDate.getMonth()+1;
			d	= oDate.getDate();
			matrix.push({
				'month'	: m,
				'date'	: d,
				'today'	: ymd.today[0] == y && ymd.today[1] == m && ymd.today[2] == d
			});
			oDate.setDate(++d);
		}
	}

	matrix.nextMonth = oDate.getMonth()+1;

	return matrix;
};

})(jQuery);