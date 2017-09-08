'use strict';

window.cc = window.cc || {};

cc.Extended_CotApp = function () {
	cot_app.apply(this, arguments);
	this.utilityItem = null;
};

cc.Extended_CotApp.prototype = Object.create(cot_app.prototype);

cc.Extended_CotApp.prototype.setUtility = function (item) {
	this.utilityItem = item;
	this._renderUtility();
	return this;
};

cc.Extended_CotApp.prototype._renderUtility = function () {
	var container = $("#app-utility");
	if (container.length) var child = container.children('div').empty().append(this.utilityItem);
};

cc.Extended_CotApp.prototype.render = function (onAfterRender, contentUrl) {
	onAfterRender = onAfterRender || function () {};

	var dis = this;

	cot_app.prototype.render.call(this, function () {
		$('#app-breadcrumb > div.row > div.col-xs-12.hidden-xs.hidden-print').removeClass('col-xs-12').addClass('col-xs-auto').after(['<div class="hidden-print col-xs-auto">', '<div id="app-utility">', '<div></div>', '</div>', '</div>'].join(''));

		if (contentUrl) {
			$('<div>').load(contentUrl, function () {
				var $dis = $(this);

				$('head').append($dis.find('style'));

				var $breadcrumb = $dis.find('#breadcrumb > li');
				if ($breadcrumb) {
					dis.setBreadcrumb($.map($breadcrumb, function (item, index) {
						return { name: $(item).text(), link: $(item).find('a:first').attr('href') };
					}), true);
				}

				var $utility = $dis.find('#utility');
				if ($utility) dis.setUtility($utility.html());

				var $title = $dis.find('h1:first');
				if ($title) dis.setTitle($title.text());

				var $top = $dis.find('#content-top');
				if ($top) $('#app-content-top > div:first').html($top.html());

				var $left = $dis.find('#content-left');
				if ($left) $('#app-content-left > div:first').html($left.html());

				var $right = $dis.find('#content-right');
				if ($right) $('#app-content-right > div:first').html($right.html());

				var $bottom = $dis.find('#content-bottom');
				if ($bottom) $('#app-content-bottom > div:first').html($bottom.html());

				$('body').append($dis.find('script[title]'));
			});
		}

		dis._renderUtility();

		onAfterRender();
	});
};

'use strict';

$(function () {
	var contentMatch = window.location.href.match(/(\?|\&)content\=([^&]+)/);
	var app = new cc.Extended_CotApp('');
	app.render(function () {}, contentMatch && contentMatch.length >= 3 ? contentMatch[2] : '01_signin.html');
});