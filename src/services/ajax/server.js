define([], function () {

	"use strict";

	function AjaxServer( options )
	{
		var self = this;

		this._transport = options.arbiter.transport;
		
		this._transport.subscribe('*', AjaxServer.EVENTS.REQUEST, function () { self._receive.apply(self, arguments); });
	}

	AjaxServer.EVENTS = {
		REQUEST: 'AJAX.request',
		RESPONSE: 'AJAX.response'
	};

	AjaxServer.prototype._receive = function(origin, event, payload) {
		
		var self = this,
			requestId = payload.id,
			options = payload.options;

		this.send(options, function (response) {

			self._transport.emit(origin, AjaxServer.EVENTS.RESPONSE, {
				success: true,
				id: requestId,
				data: response
			});

		}, function (response) {

			self._transport.emit(origin, AjaxServer.EVENTS.RESPONSE, {
				success: false,
				id: requestId,
				data: response
			});

		});
	};

	AjaxServer.prototype.send = function(options, success, error) {

		var method = options.method || 'GET',
			url = options.url || null,
			headers = options.headers || {},
			data = options.data || {};

		if (!url) {
			return error({ message: 'No URL provided' });
		} else if (method === 'GET') {
			for(var idx in data) {
				url += (url.indexOf('?') > -1 ? '&' : '?');
				url += idx + '=' + encodeURIComponent(data[idx]);
			}
			data = '';
		} else {
			data = JSON.stringify(data);
		}

		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4)
				return;

			if (xhr.status < 400) {
				success(JSON.parse(xhr.responseText));
			} else {
				error(JSON.parse(xhr.responseText));
			}
		};

		xhr.open(method, url);
		xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

		for (var name in headers) { if (headers.hasOwnProperty(name)) {
				xhr.setRequestHeader(name, headers[name]);
			}
		}

		xhr.send(data);
	};

	return AjaxServer;
});