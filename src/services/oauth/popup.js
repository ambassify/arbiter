define([], function () {

	"use strict";

	function OAuthPopup( options )
	{
		var self = this;

		this._transport = options.arbiter.transport;
		this._target = this._transport.middlemanName;
		this._targetLocation = this._transport.middlemanLocation;

		this._requestId = this._findRequestId(options);

		this._transport.subscribe(this._target, OAuthPopup.EVENTS.RESPONSE, function () { self._receive.apply(self, arguments); });
	}

	OAuthPopup.EVENTS = {
		CALLBACK: 'OAUTH.callback',
		RESPONSE: 'OAUTH.response'
	};

	OAuthPopup.prototype.callback = function(token, profile) {
		var requestId = this._requestId;

		var payload = {
			id: requestId,
			success: true,
			data: {
				token: token,
				profile: profile
			}
		};

		this._transport.emit(this._target, OAuthPopup.EVENTS.CALLBACK, payload);
	};

	OAuthPopup.prototype.failure = function(message) {
		var requestId = this._requestId;

		var payload = {
			id: requestId,
			success: false,
			data: {
				message: message
			}
		};

		this._transport.emit(this._target, OAuthPopup.EVENTS.CALLBACK, payload);
	};

	OAuthPopup.prototype._findRequestId = function(options) {
		return options.requestId || null;
	};

	return OAuthPopup;
});