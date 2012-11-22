(function ($) {
var ns = $.fn.nsjui;



var lottery	= $.fn[ns].lottery = function (settings) {
	if (settings && settings.imageUrl) {
		settings.imageUrl = 'url('+settings.imageUrl+')';
	}

	var settings, ulNode, liNodes,
		jui			= $.fn[ns],
		lottery		= jui.lottery,
		blankFnc	= jui.blankFnc,
		settings	= $.extend({
			'node'				: this,
			'imageUrl'	: this.css('background-image'),
			'cellWidth'			: 20,
			'cellHeight'		: 20,
			'transparentRate'	: 0.3,
			'ready'				: blankFnc,
			'start'				: blankFnc,
			'mouseOver'			: blankFnc,
			'complete'			: blankFnc
		}, settings);
	if (settings.ready.call(this, settings)) return;

	this
		.data('lottery.settings', settings)
		.css({
			'position'			: 'relative',
			'background-image'	: 'none'
		})
		.append(
			lottery
				.createMatrix.call(this)
				.focus(lottery.viewBackground)
		)
		.find('> .jui-lottery-wrap-focus > ul > li')
			.each(lottery.setForeground)
			.mouseover(lottery.setTransparency);

	if (settings.complete.call(this, settings)) return;

	return this;
};

lottery.createMatrix	= function () {
	var settings	= this.data('lottery.settings'),
		wSize		= this.width(),
		hSize		= this.height(),
		cellWidth	= settings.cellWidth,
		cellHeight	= settings.cellHeight,
		celMatrix	= {
			'hIndex'	: wSize/cellWidth,
			'vIndex'	: hSize/cellHeight,
			'width'		: wSize%cellWidth,
			'height'	: hSize%cellHeight
		},
		hCnt	= Math.ceil(celMatrix.hIndex),
		vCnt	= Math.ceil(celMatrix.vIndex),
		liCnt	= hCnt*vCnt,
		bgImg	= settings.imageUrl;

	var ancNode	= $('<a/>')
			.data('lottery.settings', settings)
			.attr({
				'href'	: '#tmp',
				'class'	: 'jui-lottery-wrap-focus'
			})
			.css({
				'display'	: 'block',
				'position'	: 'absolute',
				'top'		: '0',
				'left'		: '0',
				'width'		: '100%',
				'height'	: '100%'
			});

	var ulNode	= $('<ul/>')
			.data('lottery.settings', settings)
			.css({
				'position'		: 'absolute',
				'top'			: '0',
				'left'			: '0',
				'list-style'	: 'none'
			});

	var liNode	= $('<li/>').css({
			'position'			: 'relative',
			'float'				: 'left',
			'width'				: cellWidth,
			'height'			: cellHeight,
			'cursor'			: 'pointer',
			'background-image'	: settings.imageUrl,
			'background-repeat'	: 'no-repeat',
			'opacity'			: '1',
			'filter'			: 'alpha(opacity=100)'
		});

	for (var i=liCnt; i--;) {
		liNode
			.clone()
			.data('lottery.settings', settings)
			.appendTo(ulNode);
	}
	if (celMatrix.width) {
		ulNode
			.find('li:nth-child('+hCnt+'n)')
			.css('width', celMatrix.width);
	}
	if (celMatrix.height) {
		for (var i=liCnt, last=liCnt-hCnt; i>last; i--) {
			ulNode
				.find('li:nth-child('+i+')')
				.css('height', celMatrix.height);
		}
	}

	return ancNode.append(ulNode);
};

lottery.setForeground	= function (i, node) {
	var node	= $(node),
		pos		= node.position();

	node.css('background-position', (pos.left*-1)+'px '+(pos.top*-1)+'px');
};

lottery.setTransparency	= function () {
	var liNode		= $(this),
		settings	= liNode.data('lottery.settings'),
		opacity		= liNode.css('opacity')-0;

	if (settings.start) {
		if (settings.start.call(settings.node, settings, liNode)) return;
		delete settings.start;
	}
	if (settings.mouseOver.call(settings.node, settings, liNode)) return;

	if (opacity > 0) {
		liNode.css({
			'opacity'	: opacity = Math.floor(opacity*10)/10-settings.transparentRate,
			'filter'	: 'alpha(opacity='+(opacity*100)+')'
		});
	}
	else {
		liNode
			.unbind('mouseover')
			.css({
				'opacity'	: '0',
				'filter'	: 'alpha(opacity=0)',
				'cursor'	: 'default'
			});
	}
};

lottery.viewBackground	= function () {
	var ancNode		= $(this),
		settings	= ancNode.data('lottery.settings'),
		liNodes		= ancNode.find('> ul > li');

	if (settings.start) {
		if (settings.start.call(settings.node, settings, ancNode)) return;
		delete settings.start;
	}
	if (settings.mouseOver.call(settings.node, settings, ancNode)) return;

	liNodes.unbind('mouseover');
	liNodes.css({
		'opacity'	: '0',
		'filter'	: 'alpha(opacity=0)',
		'cursor'	: 'default'
	});
};



})(jQuery);