define([], function () {

	"use strict";

	function OAuthServer( options )
	{
		var self = this;

		this._transport = options.arbiter.transport;
		this._subscribers = {};
		
		this._transport.subscribe('*', OAuthServer.EVENTS.SUBSCRIBE, function () { self._subscribe.apply(self, arguments); });
		this._transport.subscribe('*', OAuthServer.EVENTS.CALLBACK, function () { self._callback.apply(self, arguments); });
	}

	OAuthServer.EVENTS = {
		CALLBACK: 'OAUTH.callback',
		SUBSCRIBE: 'OAUTH.subscribe',
		RESPONSE: 'OAUTH.response'
	};

	OAuthServer.prototype._subscribe = function(origin, event, payload) {
		this._subscribers[payload.requestId] = origin;
	};

	OAuthServer.prototype._callback = function(origin, event, payload) {
		var target = this._subscribers[payload.id];
		this._transport.emit(target, OAuthServer.EVENTS.RESPONSE, payload);
	};

	return OAuthServer;
});