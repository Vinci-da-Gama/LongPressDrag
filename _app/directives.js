// JavaScript Document
(function () {
	/**
	* reorder.directives Module
	*
	* Description
	*/
	var m = angular.module('reorder.directives');

	m.directive('sortable', ['$ionicGesture', '$ionicScrollDelegate', function($ionicGesture, $ionicScrollDelegate){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: {
				draggable: '@',
				sorted: '&'
			}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				

	            var settings = {
	                draggable: $scope.draggable ? $scope.draggable : '.card',
	                duration: 200
	            };

	            var dragging = null, placeholder = null, offsetY = 0, marginTop = 0;
	            var cardSet, initialIndex, currentIndex, animating = false;

	            var placeholderHeight;
	            var scrollInterval;

	            var createPlaceholder = function createPlaceholder(height) {
	                // Use marginTop to compensate for extra margin when animating the placeholder
	                return $('<div></div>')
	                        .css({
	                            height: height + 'px',
	                            marginTop: (currentIndex > 0 ? -marginTop : -1) + 'px'
	                        })
	                        .addClass('placeholder');
	            };

	            var touchHold = function touchHold(e) {
	                // Get the element we're about to start dragging
	                dragging = angular.element(e.target).closest(settings.draggable);
	                if (!dragging.length) dragging = null;

	                if (dragging) {
	                    // Get the initial index
	                    initialIndex = currentIndex = dragging.index(settings.draggable);

	                    var position = dragging.position();

	                    // Get relative position of touch
	                    var clientY = e.gesture.touches[0].clientY;
	                    offsetY = clientY - position.top - iElm.offset().top;

	                    // Switch to Absolute position at same location
	                    dragging.css({
	                        position: 'absolute',
	                        zIndex: 1000,
	                        left: position.left + 'px',
	                        top: position.top + 'px',
	                        width: dragging.outerWidth() + 'px'
	                    })
	                    .addClass('dragging');

	                    // Get the set of cards that were re-ordering with
	                    cardSet = iElm.find(settings.draggable + ':not(.dragging)');

	                    // We need to know the margin size so we can compensate for having two
	                    // margins where we previously had one (due to the placeholder being there)
	                    marginTop = parseInt(dragging.css('marginTop')) + 1;

	                    // Replace with placeholder (add the margin for when placeholder is full size)
	                    placeholderHeight = dragging.outerHeight() + marginTop;
	                    placeholder = createPlaceholder(placeholderHeight);
	                    placeholder.insertAfter(dragging);

	                    // Interval to handle auto-scrolling window when at top or bottom
	                    // initAutoScroll();
	                    // scrollInterval = setInterval(autoScroll, 20);
	                }
	            };
	            var holdGesture = $ionicGesture.on('hold', touchHold, iElm);

	            var touchMove = function touchMove(e) {
	                if (dragging) {
	                    e.stopPropagation();
	                    touchY = e.touches ? e.touches[0].clientY : e.clientY;
	                    var newTop = touchY - offsetY - iElm.offset().top;

	                    // Reposition the dragged iElm
	                    dragging.css('top', newTop + 'px');

	                    // Check for position in the list
	                    var newIndex = 0;
	                    cardSet.each(function (i) {
	                        if (newTop > $(this).position().top) {
	                            newIndex = i + 1;
	                        }
	                    });

	                    if (!animating && newIndex !== currentIndex) {
	                        currentIndex = newIndex;

	                        var oldPlaceholder = placeholder;
	                        // Animate in a new placeholder
	                        placeholder = createPlaceholder(1);

	                        // Put it in the right place
	                        if (newIndex < cardSet.length) {
	                            placeholder.insertBefore(cardSet.eq(newIndex));
	                        } else {
	                            placeholder.insertAfter(cardSet.eq(cardSet.length - 1));
	                        }

	                        // Animate the new placeholder to full height
	                        animating = true;
	                        setTimeout(function () {
	                            placeholder.css('height', placeholderHeight + 'px');
	                            // Animate out the old placeholder
	                            oldPlaceholder.css('height', 1);

	                            setTimeout(function () {
	                                oldPlaceholder.remove();
	                                animating = false;
	                            }, settings.duration);
	                        }, 50);
	                    }
	                }
	            };

	            var touchMoveGesture = $ionicGesture.on('touchmove', touchMove, iElm);
	            var mouseMoveGesture = $ionicGesture.on('mousemove', touchMove, iElm);

	            var touchRelease = function touchRelease(e) {
	                if (dragging) {
	                    // Set iElm back to normal
	                    dragging.css({
	                        position: '',
	                        zIndex: '',
	                        left: '',
	                        top: '',
	                        width: ''
	                    }).removeClass('dragging');

	                    // Remove placeholder
	                    placeholder.remove();
	                    placeholder = null;

	                    if (initialIndex !== currentIndex && $scope.sorted) {
	                        // Call the callback with the instruction to re-order
	                        $scope.$fromIndex = initialIndex;
	                        $scope.$toIndex = currentIndex;
	                        $scope.$apply($scope.sorted);
	                    }
	                    dragging = null;

	                    // clearInterval(scrollInterval);
	                }
	            };
	            var releaseGesture = $ionicGesture.on('release', touchRelease, iElm);

	            $scope.$on('$destroy', function () {
	                $ionicGesture.off(holdGesture, 'hold', touchHold);
	                $ionicGesture.off(touchMoveGesture, 'touchmove', touchMove);
	                $ionicGesture.off(mouseMoveGesture, 'mousemove', touchMove);
	                $ionicGesture.off(releaseGesture, 'release', touchRelease);
	            });

	            var touchY, scrollHeight, containerTop, maxScroll;
	            var scrollBorder = 80, scrollSpeed = 0.2;
	            // Setup the autoscroll based on the current scroll window size
	            var initAutoScroll = function initAutoScroll() {
	                touchY = -1;
	                var scrollArea = iElm.closest('.scroll');
	                var container = scrollArea.parent();
	                scrollHeight = container.height();
	                containerTop = container.position().top;
	                maxScroll = scrollArea.height() - scrollHeight;
	            };

	            // Autoscroll function to scroll window up and down when
	            // the touch point is close to the top or bottom
	            var autoScroll = function autoScroll() {
	                var scrollChange = 0;
	                if (touchY >= 0 && touchY < containerTop + scrollBorder) {
	                    // Should scroll up
	                    scrollChange = touchY - (containerTop + scrollBorder);
	                } else if (touchY >= 0 && touchY > scrollHeight - scrollBorder) {
	                    // Should scroll down
	                    scrollChange = touchY - (scrollHeight - scrollBorder);
	                }

	                if (scrollChange !== 0) {
	                    // get the updated scroll position
	                    var newScroll = $ionicScrollDelegate.getScrollPosition().top + scrollSpeed * scrollChange;
	                    // Apply scroll limits
	                    if (newScroll < 0)
	                        newScroll = 0;
	                    else if (newScroll > maxScroll)
	                        newScroll = maxScroll;

	                    // Set the scroll position
	                    $ionicScrollDelegate.scrollTo(0, newScroll, false);
	                }
	            };
			}
		};
	}]);
})();