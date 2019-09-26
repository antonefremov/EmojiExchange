sap.ui.define([], function () {
	"use strict";
	return {
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue/100).toFixed(2);
		}
	};
});