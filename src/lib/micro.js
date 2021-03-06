const Koa = require('koa');
const Router = require('koa-router');
const Route = require('../router.js');

const koaBody = require('koa-body');
const Service = require('./service.js');

var Micro = function(servicesConfig) {
	this.databaseList = [];

	this.servicesConfig = servicesConfig.services || [];

	this.initKoa();
	this.initService();
}

Micro.prototype = {

	initKoa: function() {

		const app = new Koa();
		const router = new Router();

		app.use(koaBody());

		for (var i = 0; i < this.servicesConfig.length; i++) {
			var serviceConfig = this.servicesConfig[i];

			if(!serviceConfig.router) {
				continue;
			}

			Route({
				router: {
					instance: router,
					configs: serviceConfig.router.configs || {},
					routeNotFound: serviceConfig.router.routeNotFound,
					methodNotSupported: serviceConfig.router.methodNotSupported,
					onError: serviceConfig.router.onError
				},
				service: serviceConfig
			});

		};

		app.use(router.routes());

		this.router = router;
		this.app = app;
		this.koaBody = koaBody;
	},

	initService: function() {
		this.service = new Service(this.servicesConfig);
	},

	run: function(opts, cb) {
		opts.port = opts.port || 3000;
		this.app.listen(opts.port, cb);
	},

	registerService: function(services, cb) {

		for (var i = 0; i < services.length; i++) {
			var service = services[i];
			service.registered = false;
			this.serviceList.push(service);
		};

		return this;
	},

	registerDatabase: function(serviceName, dbName, cb) {

		return this;
	}
}

module.exports = Micro;
