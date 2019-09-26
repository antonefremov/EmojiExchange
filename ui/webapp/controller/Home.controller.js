sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/ui/model/json/JSONModel"
], function(Controller, formatter, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,
		model: {},
		localDataUrl: "http://localhost:8010/proxy/",
		accountId: "",

		onInit: async function () {
			this.model = new JSONModel({
				"myAccount": this.accountId,
				"myBalance": "0",
				"timer": 0,
				"emojiCollection": [
					{
						"emojiCount": "0",
						"emojiPrice": "0",
						"iconUrl": "sap-icon://arobase"
					}, 
					{
						"emojiCount": "0",
						"emojiPrice": "0",
						"iconUrl": "sap-icon://cloud"
					}, 
					{
						"emojiCount": "0",
						"emojiPrice": "0",
						"iconUrl": "sap-icon://bell"
					},
					{
						"emojiCount": "0",
						"emojiPrice": "0",
						"iconUrl": "sap-icon://competitor"
					},
					{
						"emojiCount": "0",
						"emojiPrice": "0",
						"iconUrl": "sap-icon://building"
					},
					{
						"emojiCount": "0",
						"emojiPrice": "0",
						"iconUrl": "sap-icon://camera"
					},
					{
						"emojiCount": "0",
						"emojiPrice": "0",
						"iconUrl": "sap-icon://car-rental"
					},
					{
						"emojiCount": "0",
						"emojiPrice": "0",
						"iconUrl": "sap-icon://attachment"
					}
				]
			});
			this.getView().setModel(this.model, "local");
			this.accountId = await this.createAccount();
			this.getCurrentAccountBalance();
			this.refreshData();
			this.startTimer();
		},

		startTimer: function() {
			var that = this,
				oModel = this.model,
				timer = 0;
			setInterval(function() {
				timer += 10;
				if (timer >= 100) {
					that.refreshData();
					timer = 0;
				}
				oModel.setProperty("/timer", timer);
			}, 1000);
		},

		createAccount: function() {
			var url = this.localDataUrl + "create",
				xhr = new XMLHttpRequest(),
				data = "",
				that = this;

			var promise = new Promise(function(resolve, reject) {
				xhr.addEventListener("readystatechange", function () {
					if (this.readyState === this.DONE) {
						if (this.responseText === "") {
							reject("");
						}
						if (that.accountId === "") {
							resolve(this.responseText);
						}
					}
				});
	
				xhr.open("POST", url);
				xhr.send(data);
			});

			return promise;
		},

		refreshData: function() {
			var url = this.localDataUrl + "fullBalance",
				xhr = new XMLHttpRequest(),
				data = "",
				that = this;

			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === this.DONE) {
					if (this.responseText === "") {
						return;
					}
					that.enrichModel(this.responseText);
				}
			});

			xhr.open("GET", url);
			xhr.setRequestHeader("accountId", this.accountId);
			xhr.send(data);
		},

		onBuy: function(oEvent) {
			var url = this.localDataUrl + "buy",
				index = oEvent.getSource().getParent().getBindingContext("local").getPath().substr(-1),
				emojiCollection = this.model.getProperty("/emojiCollection/" + index),
				xhr = new XMLHttpRequest(),
				that = this,
				data = "";
			
			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === this.DONE) {
					if (this.responseText === "{}") {
						return;
					}
					emojiCollection.emojiCount++;
					that.updateBalance(this.responseText);
				}
			});
	
			xhr.open("POST", url);
			xhr.setRequestHeader("accountId", this.accountId);
			xhr.setRequestHeader("emojiIndex", index);
			xhr.send(data);
		},

		onSell: function(oEvent) {
			var url = this.localDataUrl + "sell",
				index = oEvent.getSource().getParent().getBindingContext("local").getPath().substr(-1),
				emojiCollection = this.model.getProperty("/emojiCollection/" + index),
				xhr = new XMLHttpRequest(),
				that = this,
				data = "";
			
			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === this.DONE) {
					if (this.responseText === "{}") {
						return;
					}
					emojiCollection.emojiCount--;
					that.updateBalance(this.responseText);
				}
			});
	
			xhr.open("POST", url);
			xhr.setRequestHeader("accountId", this.accountId);
			xhr.setRequestHeader("emojiIndex", index);
			xhr.send(data);
		},

		enrichModel: function(responseText) {
			var receivedArr = JSON.parse(responseText),
				emojiCollection = this.model.getProperty("/emojiCollection");
			for(var i = 0; i < receivedArr.length; i++) {
				emojiCollection[i].emojiCount = receivedArr[i][0];
				emojiCollection[i].emojiPrice = receivedArr[i][1];
			}
			this.model.setProperty("/emojiCollection", emojiCollection);
		},

		getCurrentAccountBalance: function() {
			var url = this.localDataUrl + "balance",
				xhr = new XMLHttpRequest(),
				that = this,
				data = "";
			
			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === this.DONE) {
					if (this.responseText === "{}") {
						return;
					}
					that.updateBalance(this.responseText);
				}
			});
	
			xhr.open("GET", url);
			xhr.setRequestHeader("accountId", this.accountId);
			xhr.send(data);
		},

		updateBalance: function(responseText) {
			var receivedBalance = JSON.parse(responseText);
			if (!isNaN(receivedBalance)) {
				this.model.setProperty("/myBalance", receivedBalance);
			}
		}
	});
});