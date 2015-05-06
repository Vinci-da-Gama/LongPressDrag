// JavaScript Document
(function () {
	/**
	* reorder.controllers Module
	*
	* Description
	*/
	var m = angular.module('reorder.controllers');

	m.controller('reorderController', ['$scope', '$http', function($scope, $http){
		$scope.contacts = [
			{ name: 'Frank', imgConn: './_img/flag1.png', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
			{ name: 'Susan', imgConn: './_img/flag2.png', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
			{ name: 'Emma', imgConn: './_img/flag3.png', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
			{ name: 'Scott', imgConn: './_img/flag4.png', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
			{ name: 'Bob', imgConn: './_img/flag5.png', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
			{ name: 'Olivia', imgConn: './_img/flag6.png', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
			{ name: 'Anne', imgConn: './_img/flag7.png', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' }
		];
		$scope.onReorder = function (fromIndex, toIndex) {
			var moved = $scope.contacts.splice(fromIndex, 1);
			$scope.contacts.splice(toIndex, 0, moved[0]);
		};
	}]);
})();