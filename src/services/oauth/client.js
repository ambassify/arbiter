define([], function () {

	"use strict";

	function OAuthClient( options )
	{
		var self = this;

		this._transport = options.arbiter.transport;
		this._target = this._transport.middlemanName;
		this._targetLocation = this._transport.middlemanLocation;
		this._endpoint = options.endpoint;
		
		this._callbackId = (new Date()).getTime() + Math.floor(Math.random() * 10000);
		this._callbacks = {};

		this._transport.subscribe(this._target, OAuthClient.EVENTS.RESPONSE, function () { self._receive.apply(self, arguments); });
	}

	OAuthClient.EVENTS = {
		SUBSCRIBE: 'OAUTH.subscribe',
		RESPONSE: 'OAUTH.response'
	};

	OAuthClient.prototype.login = function(network, success, error) {
		this._call('login', network, success, error);
	};

	OAuthClient.prototype.logout = function(network, success, error) {
		this._call('logout', network, success, error);
	};

	OAuthClient.prototype._call = function(action, network, success, error) {

		var requestId = ++this._callbackId;

		this._callbacks[requestId] = {
			success: success,
			error: error
		};

		this._transport.emit(this._target, OAuthClient.EVENTS.SUBSCRIBE, { requestId: requestId });
		this._transport.openWindow('sso', this._buildUrl(requestId, network, action), this._getWindowOptions(network));
	};

	OAuthClient.prototype._buildUrl = function(id, network, action) {
		return this._endpoint
			.replace('{{ request_id }}', id)
			.replace('{{ network }}', network)
			.replace('{{ action }}', action)
			.replace('{{ xdmChannel }}', this._transport.channel)
			.replace('{{ xdmServerName }}', this._target)
			.replace('{{ xdmServerLocation }}', this._targetLocation);
	};

	OAuthClient.prototype._getWindowOptions = function(network) {
		return {
			title: network + ' connect',
			width: 400,
			height: 400
		};
	};

	OAuthClient.prototype._receive = function(origin, event, payload) {
		
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

	return OAuthClient;
});