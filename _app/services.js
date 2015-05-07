// JavaScript Document
(function(){
	var serviceM = angular.module('reorder.subject');

	serviceM.service('inforRequest', ['$log', '$http', function ($log, $http) {
		this.obtainData = function (func) {
			$http.get('./_db/reo.json')
			.success(function (data) {
				func(data);
				$log.log("Data is loaded successfully.");
			})
			.error(function(data, config, status) {
				$log.log(data+" -- "+config+" -- "+status);
			});
		}
	}]);

})();