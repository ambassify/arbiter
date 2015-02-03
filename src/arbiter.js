/*jslint browser: true*/
define([
	'wingman',
	'optional!services/ajax/client',
	'optional!services/ajax/server',
	'optional!services/oauth/client',
	'optional!services/oauth/server',
	'optional!services/oauth/popup'
], function (
	Wingman,
	AjaxClient,
	AjaxServer,
	OAuthClient,
	OAuthServer,
	OAuthPopup
) {
	"use strict";

	function Arbiter( options )
	{
		var self = this;

		options = options || {};
		this._options =  {
			name: options.name || null,
			channel: options.channel || null,
			remote: options.remote || null,
			remoteName: options.remoteName || null,
			remoteAttach: options.remoteAttach || null,
			frameProps: options.frameProps || null,
		};

		this.transport = new Wingman({
			name: this._options.name || null,
			channel: this._options.channel || null,
            isMiddleman: typeof options.isMiddleman === 'undefined' ? options.remote ? false : true : options.isMiddleman,
            middlemanName: this._options.remoteName || null,
            middlemanLocation: this._options.remote || null,
            register: this._options.remoteAttach || false,
            middlemanProps: this._options.frameProps || {}
		});

		if (!this._options.name) {
			this._options.name = this.transport.name;
		}

		this._populate();
	}

	Arbiter.prototype._populate = function() {
		
		if (AjaxClient || AjaxServer) this.Ajax = {};
		if (AjaxClient) this.Ajax.Client = this.serviceFactory(AjaxClient);
		if (AjaxServer) this.Ajax.Server = this.serviceFactory(AjaxServer);

		if (OAuthClient || OAuthServer || OAuthPopup) this.OAuth = {};
		if (OAuthClient) this.OAuth.Client = this.serviceFactory(OAuthClient);
		if (OAuthServer) this.OAuth.Server = this.serviceFactory(OAuthServer);
		if (OAuthPopup) this.OAuth.Popup = this.serviceFactory(OAuthPopup);
	};

	Arbiter.prototype.serviceFactory = function(Service) {
		var self = this;

		return function (options) {
			options = options || {};
			options.arbiter = options.arbiter || self;

			return new Service(options);
		};
	};

	return Arbiter;
});