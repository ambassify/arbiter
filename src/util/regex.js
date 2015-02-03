define([], function () {

	"use strict";

	return {
		escape: function escapeRegExp(string){
			return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
	};
});