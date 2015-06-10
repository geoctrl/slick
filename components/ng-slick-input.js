angular.module('ng-slick-input', [])


    .directive('ngSlickInput', function() {
        return {
            restrict: 'C',
            scope: {
                ngModel: '=',
                placeholder: '@'
            },
            controller: function($scope, $element) {

                var placeholderElement,
                    defaults = {
                        placeholder: ''
                    };

                var init = function() {
                    if ($scope.placeholder) {
                        defaults.placeholder = $scope.placeholder;
                        $element.removeAttr('placeholder');
                        placeholderElement = angular.element('<div class="ng-slick-input-placeholder">'+defaults.placeholder+'</div>');
                        $scope.container.append(placeholderElement);
                    }

                    // if value/ngModel already exists, move placeholder without animation
                    if ($scope.ngModel) {
                        if ($scope.ngModel.length) {placeholderElement.css('top', '36px')}
                    } else {
                        if ($element.val().length) {placeholderElement.css('top', '36px')}
                    }
                };

                // put element inside parent container
                $scope.container = angular.element('<div class="ng-slick-input-container"></div>');
                $element.after($scope.container);
                $scope.container.append($element);

                // fire events for click/focus/blur
                $scope.container.on('click', function() { $element[0].focus() });
                $element.on('focus', function() { controlPlaceholder.animateIn() });
                $element.on('blur', function() {
                    controlPlaceholder.decide($scope.ngModel ? $scope.ngModel.length : $element.val().length);
                });

                $scope.$watch('ngModel', function(newVal, oldVal) {
                    if (newVal!=oldVal) {
                        controlPlaceholder.decide(newVal.length)
                    }
                });

                // control animation
                var controlPlaceholder = {
                    decide: ngSlickHelpers.debounce(function(value) {
                        value ? controlPlaceholder.animateIn() : controlPlaceholder.animateOut();
                    }, 100),

                    animateIn: function() {
                        Velocity(placeholderElement, 'stop');
                        Velocity(placeholderElement, {
                            top: '36px'
                        }, {
                            duration: 500,
                            easing: 'ease'
                        })
                    },
                    animateOut: function() {
                        Velocity(placeholderElement, 'stop');
                        Velocity(placeholderElement, {
                            top: '0'
                        }, {
                            duration: 500,
                            easing: 'ease'
                        });
                    }
                };

                init();

            }
        }
    });