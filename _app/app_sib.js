// JavaScript Document
(function () {
	//reorder.subject main subject of reorder
	angular.module('reorder.subject', ['ui.router', 'reorder.services', 'reorder.controllers', 'reorder.directives']);
	//reorder.services main services of reorder
	angular.module('reorder.services', []);
	//reorder.directives main directives of reorder
	angular.module('reorder.directives', ['ionic', 'reorder.services']);
	//reorder.controllers main controllers of reorder
	angular.module('reorder.controllers', ['reorder.services']);
})();