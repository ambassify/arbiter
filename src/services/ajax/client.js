define([], function () {

	"use strict";

	function AjaxClient( options )
	{
		var self = this;

		this._target = options.arbiter._options.remoteName;
		this._transport = options.arbiter.transport;
		
		this._callbackId = (new Date()).getTime() + Math.floor(Math.random() * 10000);
		this._callbacks = {};

		this._transport.subscribe(this._target, AjaxClient.EVENTS.RESPONSE, function () { self._receive.apply(self, arguments); });
	}

	AjaxClient.EVENTS = {
		REQUEST: 'AJAX.request',
		RESPONSE: 'AJAX.response'
	};

	AjaxClient.prototype.send = function(options, success, error) {

		var requestId = ++this._callbackId;

		this._callbacks[requestId] = {
			success: success,
			error: error
		};

		var payload = {
			id: requestId,
			options: options
		};

		this._transport.emit(this._target, AjaxClient.EVENTS.REQUEST, payload);
	};

	AjaxClient.prototype._receive = function(origin, event, payload) {
		
		var success = payload.success,
			requestId = payload.id,
			data = payload.data,

			callbacks = this._callbacks[requestId] || {},
			callback;

		if (success && callbacks.success) {
			callback = callbacks.success;
		} else if (callbacks.error) {
			callback = callbacks.error;
		}

		if (callback && typeof callback === 'function') {
			callback(payload.data);
		}
	};

	return AjaxClient;
});