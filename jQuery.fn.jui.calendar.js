(function ($) {
var ns = $.fn.nsjui;



var calendar	= $.fn[ns].calendar = function (settings) {
	calendar.paintMatrix.call($('tbody:nth(1)'));

	return this;
};

// 6주치 날짜 매트릭스를 반환한다.
calendar.getDateMatrix	= function (year, month, date) {
	var oDate	= arguments.length == 3 ? new Date(year, month-1, date) : new Date(),
		matrix	= [];

	matrix.year		= oDate.getFullYear();
	matrix.month	= oDate.getMonth()+1;
	matrix.date		= oDate.getDate();

	oDate.setDate(0);
	oDate.setDate(oDate.getDate()-oDate.getDay());

	matrix.prevMonth = oDate.getMonth()+1;

	for (var i=6; i--;) {

		for (var j=7, m, d, w; j--;) {
			d = oDate.getDate();
			matrix.push({
				'month'	: oDate.getMonth()+1,
				'date'	: d
			});
			oDate.setDate(++d);
		}
	}

	matrix.nextMonth = oDate.getMonth()+1;

	return matrix;
};

calendar.paintMatrix	= function () {
	var newBodyNode;
	var tplRow		= $.template(null, this);
	var dateMatrix	= calendar.getDateMatrix();
	var monthStyle	= ['', '', '', '', '', '', '', '', '', '', '', ''];

	monthStyle[dateMatrix.prevMonth]	= 'prev';
	monthStyle[dateMatrix.nextMonth]	= 'next';

	(newBodyNode = this.clone()).find('*').remove();
	for (var i=0; dateMatrix[i];) {

		$.tmpl(tplRow, {
			'stylesun'	: monthStyle[dateMatrix[i].month],
			'datesun'	: dateMatrix[i++].date,
			'stylemon'	: monthStyle[dateMatrix[i].month],
			'datemon'	: dateMatrix[i++].date,
			'styletue'	: monthStyle[dateMatrix[i].month],
			'datetue'	: dateMatrix[i++].date,
			'stylewed'	: monthStyle[dateMatrix[i].month],
			'datewed'	: dateMatrix[i++].date,
			'stylethu'	: monthStyle[dateMatrix[i].month],
			'datethu'	: dateMatrix[i++].date,
			'stylefri'	: monthStyle[dateMatrix[i].month],
			'datefri'	: dateMatrix[i++].date,
			'stylesat'	: monthStyle[dateMatrix[i].month],
			'datesat'	: dateMatrix[i++].date
		})
			.appendTo(newBodyNode);
	}
	newBodyNode.replaceAll(this);
};



})(jQuery);