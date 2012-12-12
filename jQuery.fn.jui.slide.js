(function ($) {
var ns	= $.fn.nsjui,
	jui	= $.fn[ns];
	_STATIC	= {
		OPTION_NM	: 'slide.settings'
	};



// 객체정의 시작
var slide = jui.slide = $.extend(

// 객체의 생성자 정의
function (settings) {
	var node		= this;
	if (!node.size()) return this;

	var jui			= $.fn[ns],
		slide		= jui.slide,
		blankFnc	= jui.blankFnc,
		settings	= $.extend({
			'slideDirection'	: 'horizon',
			'slideAuto'			: true,
			'slideInterval'		: 2500,
			'slideSpeed'		: 'past',
			'slides'			: $(),
			'slideNavigation'	: $(),
			'prevButton'		: $(),
			'nextButton'		: $(),
			'playButton'		: $(),
			'stopButton'		: $(),
			'toggleButton'		: $(),

			'slideDisplayClass'	: 'slide-display',
			'slideNextClass'	: 'slide-next',
			'slideShowNaviClass': 'slide-show',

			'slides'			: this.find('>*'),
			'show'				: blankFnc,
			'prev'				: blankFnc,
			'next'				: blankFnc,
			'play'				: blankFnc,
			'stop'				: blankFnc,
			'pause'				: blankFnc,
			'resume'			: blankFnc,

			'node'				: this,
			'playTimer'			: null,
			'isPlay'			: false,
			'isBusy'			: false,
			'isPause'			: false
		}, settings);

	this.data(slide.OPTION_NM, settings);
	slide._init.call(this);

	return this;
},

// 객체의 static private member 연결
_STATIC,

// 객체의 private member 정의
{
	'_init'	: function () {
		var slide		= jui.slide,
			settings	= this.data(slide.OPTION_NM);

		$(window).load(settings, slide._setLoadHandlersetLoadHandler);

		this
			.keydown(settings, slide.showKeydown)
			.delegate('*', 'focus mouseover', settings, slide.pause)
			.delegate('*', 'blur mouseout', settings, slide.resume);

		slide
			._setNavigationHandler.call(settings)
			._setButtonHandler.call(settings)
			[settings.slideAuto ? 'play' : 'stop']({'data' : settings});
	},

	'_setLoadHandlersetLoadHandler'	: function (event) {
		var settings	= event.data,
			node		= settings.node,
			slides		= settings.slides,
			fstNode		= slides.first(),
			tarPosition	= node.css('position');

		slides
			.each(function (idx, itmNode) {
				$(itmNode)
					.css({
						'position'	: 'absolute',
						'top'		: '0px',
						'left'		: '0px',
						'z-index'	: '0'
					})
					.hide()
					.data('slide.itemIndex', idx);
			});

		fstNode
			.addClass(settings.slideDisplayClass)
			.css({'z-index' : 1})
			.show();

		node.css({
			overflow	: 'hidden',
			position	: tarPosition == 'absolute' || tarPosition == 'relative' ? tarPosition : 'relative',
			display		: 'block',
			width		: fstNode.width(),
			height		: fstNode.height()
		});
	},

	'_setNavigationHandler'	: function () {
		var settings	= this;

		settings.slideNavigation
			.click(settings, slide.showIndex)
			.each(function (idx, navNode) {
				$(navNode).data('slide.nxtIndex', idx);
			});

		return slide;
	},

	'_setButtonHandler'	: function () {
		var settings	= this;

		settings.prevButton.click(settings, slide.showPrev);
		settings.nextButton.click(settings, slide.showNext);
		settings.playButton.click(settings, slide.play);
		settings.stopButton.click(settings, slide.stop);
		settings.toggleButton.click(settings, slide.toggle);

		return slide;
	},

	'_focusDisplayNode'	: function (nodes) {
		var settings		= this;

		settings.isKeydown	= true;
		jui.getFocusNodes.call(nodes.nxtNode || nodes).get(0).focus();
		settings.isKeydown	= false;
	},

	'_getAnimateOption'	: function (curNode, nxtNode, nxtIndex) {
		var settings	= this,
			direction	= settings.slideDirection,
			position	= direction == 'vertical' ? 'top' : 'left',
			distance	= direction == 'vertical' ? nxtNode.height() : nxtNode.width(),
			curCSS		= {},
			nxtCSS		= {},
			mark;

		switch (nxtIndex) {
		case 'next' :
			mark	= 1;
		break;
		case 'prev' :
			mark	= -1;
		break;
		default :
			mark	= curNode.data('slide.itemIndex') > nxtNode.data('slide.itemIndex') ? -1 : 1;
		break;
		}

		curCSS[position] = distance*mark;
		nxtCSS[position] = (mark == 1 ? '-=' : '+=')+distance;

		return {
			'prvCSS' : curCSS,
			'curCSS' : curCSS,
			'nxtCSS' : nxtCSS
		};
	},

	'_getItemNodeInfo'	: function (nxtIndex) {
		var settings	= this,
			slides		= settings.slides,
			curNode		= slides.filter('.'+settings.slideDisplayClass),
			nxtIndex	= typeof nxtIndex == 'undefined' ? 'next' : nxtIndex,
			nxtNode;

		if (!curNode.size()) {
			return null;
		}

		switch (nxtIndex) {
		case 'next' :
			nxtNode	= curNode.next().size() ? curNode.next() : slides.first();
		break;
		case 'prev' :
			nxtNode	= curNode.prev().size() ? curNode.prev() : slides.last();
		break;
		default :
			nxtNode	= slides.eq(nxtIndex);
		break;
		}

		if (!nxtNode.size() || nxtNode.filter('.'+settings.slideDisplayClass).size()) {
			return null;
		}

		return {
			'slides': slides,
			'curNode' : curNode,
			'nxtNode' : nxtNode
		};
	},
},

// 객체의 public member 정의
{
	'pause'	: function (event) {
		if (event) {
			event.stopPropagation();
		}

		var settings	= jui.getOptionFromEvent.call(this, event, slide.OPTION_NM);

		if (settings.isPause) return slide;

		settings.isPause	= true;
		clearTimeout(settings.playTimer);

		if (event && !settings.isKeydown) {
			settings.pause.call(settings.node, settings);
		}

		return slide;
	},

	'resume' : function (event) {
		if (event) {
			event.stopPropagation();
		}

		var settings	= jui.getOptionFromEvent.call(this, event, slide.OPTION_NM);

		if (!settings.isPause) return slide;
		if (settings.isPlay) {
			slide.play.call(settings);
		}

		settings.isPause	= false;

		if (event && !settings.isKeydown) {
			settings.resume.call(settings.node, settings);
		}

		return slide;
	},

	'play'	: function (event) {
		var settings	= jui.getOptionFromEvent.call(this, event, slide.OPTION_NM);

		settings.isPlay	= true;
		clearTimeout(settings.playTimer);
		settings.playTimer	= setTimeout(function () {
			slide.showNext.call(settings);
			if (!settings.isPause) {
				slide.play.call(settings);
			}
		}, settings.slideInterval);

		if (event) {
			settings.play.call(settings.node, settings);
		}

		return slide;
	},

	'stop'	: function (event) {
		var settings	= jui.getOptionFromEvent.call(this, event, slide.OPTION_NM);

		clearTimeout(settings.playTimer);
		settings.isPlay	= false;

		if (event) {
			settings.stop.call(settings.node, settings);
		}

		return slide;
	},

	'toggle'	: function (event) {
		var settings	= jui.getOptionFromEvent.call(this, event, slide.OPTION_NM);

		if (settings.isPlay) {
			return slide.stop(event);
		}
		else {
			return slide.play(event);
		}
	},

	'showIndex'	: function (event) {
		var settings	= jui.getOptionFromEvent.call(this, event, slide.OPTION_NM),
			nxtIndex	= $(event.target).data('slide.nxtIndex');

		return slide.show.call($.extend(settings, {nxtIndex : nxtIndex}));
	},

	'showKeydown'	: function (event) {
		// 버블링 중지
		if (event) {
			event.stopPropagation();
		}

		var keyCode	= event.keyCode,
			nxtIndex;

		switch (keyCode) {
		case 39 :
		case 40 :
			nxtIndex	= 'next';
		break;
		case 37 :
		case 38 :
			nxtIndex	= 'prev';
		break;
		default :
			return slide;
		}

		var settings	= jui.getOptionFromEvent.call(this, event, slide.OPTION_NM);

		event.preventDefault();

		return slide.show.call($.extend(settings, {nxtIndex : nxtIndex, callback : slide._focusDisplayNode}));
	},

	'showPrev'	: function (event) {
		var settings	= jui.getOptionFromEvent.call(this, event, slide.OPTION_NM);

		return slide.show.call($.extend(settings, {nxtIndex : 'prev'}));
	},

	'showNext'	: function (event) {
		var settings	= jui.getOptionFromEvent.call(this, event, slide.OPTION_NM);

		return slide.show.call($.extend(settings, {nxtIndex : 'next'}));
	},

	'show'	: function (event) {
		var slide		= jui.slide,
			settings	= jui.getOptionFromEvent.call(this, event, slide.OPTION_NM),
			nxtIndex	= settings.nxtIndex;

		if (settings.isBusy) {
			return slide;
		}

		var actInfo		= slide._getItemNodeInfo.call(settings, nxtIndex);

		if (!actInfo) {
			return slide;
		}
		settings.isBusy	= true;
		slide.pause.call(settings);

		var slides		= actInfo.slides,
			curNode		= actInfo.curNode,
			nxtNode		= actInfo.nxtNode,
			aniOption	= slide._getAnimateOption.call(settings, curNode, nxtNode, nxtIndex),
			navSlides	= settings.slideNavigation,
			shwClass	= settings.slideShowNaviClass;

		
		navSlides.removeClass(shwClass);
		navSlides.eq(nxtNode.data('slide.itemIndex')).addClass(shwClass);

		slides.css({'z-index' : '0'});
		nxtNode
			.addClass(settings.slideNextClass)
			.css(aniOption.curCSS);

		var aniNodes	= slides.filter('.'+settings.slideDisplayClass+', .'+settings.slideNextClass);

		aniNodes
			.show()
			.css({'z-index' : '1'})
			.animate(aniOption.nxtCSS, settings.slideSpeed);

		nxtNode.queue(function () {
			var node		= settings.node,
				callback	= settings.callback;

			aniNodes.removeClass(settings.slideDisplayClass+' '+settings.slideNextClass);
			nxtNode.addClass(settings.slideDisplayClass);
			curNode
				.css({'z-index' : '0'})
				.hide();

			settings.isBusy	= false;
			slide.resume.call(settings);

			if (callback) {
				callback.call(settings, actInfo);
			}

			if (settings[nxtIndex]) {
				settings[nxtIndex].call(node, settings);
			}
			else {
				settings.show.call(node, settings);
			}

			$.dequeue(this);
		});

		return slide;
	}
}

);
// 객체정의 끝


})(jQuery);

/*
$(function () {
	$('.slide-screen').jui('slide', {
//		slideDirection	: 'horizon', //vertical,horizon
//		slideAuto		: false,
//		slideInterval	: 3500,
		slideSpeed		: 'past',
//		slides			: $('.slide-screen > li'),
		slideNavigation	: $('.slide-navigation > li > button'),
		playButton		: $('.slide-play'),
		stopButton		: $('.slide-stop'),
		prevButton		: $('.slide-prev'),
		nextButton		: $('.slide-next'),
		toggleButton	: $('.slide-toggle'),

		show			: function (settings) {
			console.log('show : '+(settings.isPause?'pause':'resum'));
		},
		prev		: function (settings) {
			console.log('prev : '+(settings.isPause?'pause':'resum'));
		},
		next		: function (settings) {
			console.log('next : '+(settings.isPause?'pause':'resum'));
		},
		play			: function (settings) {
			console.log('play : '+(settings.isPause?'pause':'resum'));
			settings.playButton.attr('disabled', true);
			settings.stopButton.attr('disabled', false);
			settings.toggleButton.html('■');
		},
		stop			: function (settings) {
			console.log('stop : '+(settings.isPause?'pause':'resum'));
			settings.playButton.attr('disabled', false);
			settings.stopButton.attr('disabled', true);
			settings.toggleButton.html('▶');
		},
		pause			: function (settings) {
			console.log('pause : '+(settings.isPause?'pause':'resum'));
		},
		resume			: function (settings) {
			console.log('resume : '+(settings.isPause?'pause':'resum'));
		}
	});
});
*/