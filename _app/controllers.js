// JavaScript Document
(function () {
	/**
	* reorder.controllers Module
	*
	* Description
	*/
	var m = angular.module('reorder.controllers');

	m.controller('reorderController', ['$scope', '$http', 'inforRequest', '$log', function($scope, $http, inforRequest, $log){
		inforRequest.obtainData(retrieveDossier);
		function retrieveDossier (dataPassedFromService) {
			$scope.contacts = dataPassedFromService;
			$log.log("Data bind to Ctrl."+dataPassedFromService[0].name);
		}

		$scope.onReorder = function (fromIndex, toIndex) {
			var moved = $scope.contacts.splice(fromIndex, 1);
			$scope.contacts.splice(toIndex, 0, moved[0]);
		};
	}]);
})();