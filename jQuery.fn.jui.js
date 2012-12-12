// jsdoc for jquery >> http://jtemplates.tpython.com/doc/symbols/jQuery.html
// front developer >> https://github.com/Songhun/Front-end-Developer-Interview-Questions/blob/master/Korean/README_KR.md

(function ($) {

// JUI의 namespace를 지정
var ns	= $.fn.nsjui = 'jui',
	_STATIC	= {
		version	: '0.1.0'
	};



// 객체정의 시작
var jui	= $.fn[ns] = $.extend(

// 객체의 생성자 정의
function (method) {
	var	uiItem	= jui[method];

	if (uiItem) {
		return uiItem.apply(this, Array.prototype.slice.call(arguments, 1));
	}
	else if (typeof method === 'object' || !method) {
		return methods.init.apply(this, arguments);
	}
	else {
		$.error('Method "'+method+'" does not exist on jQuery.'+ns);
	}
},

// 객체의 static private member 연결
_STATIC,

// 객체의 private member 정의
{
	'init'	: function (settings) {
		return this;
	},

	'blankFnc'	: new Function(),

	'getOptionFromEvent'	: function (event, dataKey) {
		if (event) {
			settings	= event.data ? event.data : $(event.target).data(dataKey);
		}
		else {
			settings	= this;
		}

		return settings.node ? settings : null;
	},

	'getFocusNodes'	: function () {
		return $(this)
			.find('a, button:not(:disabled,[readonly]), input:not(:disabled,:hidden,[readonly]), select:not(:disabled,[readonly]), textarea:not(:disabled,[readonly])')
			.filter(jui.filterDisplayNode);
	},

	'filterDisplayNode'	: function () {
		var _this	= $(this);
		if (_this.css('display') == 'none' || _this.css('visibility') == 'hidden') {
			return null;
		}
		return this;
	}
}

);
// 객체정의 끝

})(jQuery);