// jsdoc for jquery >> http://jtemplates.tpython.com/doc/symbols/jQuery.html
// front developer >> https://github.com/Songhun/Front-end-Developer-Interview-Questions/blob/master/Korean/README_KR.md

(function ($) {

// JUI의 namespace를 지정한다.
var ns	= 'jui';



$.fn.nsjui = ns;

var jui	= $.fn[ns] = function (method) {
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
};

jui.init	= function (settings) {
	return this;
};

jui.blankFnc	= new Function();



})(jQuery);