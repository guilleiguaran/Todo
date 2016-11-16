/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngResource'])
	.config($routeProvider => {
    const routeConfig = {
        controller: 'TodoCtrl',
        templateUrl: 'todomvc-index.html',
        resolve: {
            store(todoStorage) {
                // Get the correct module (API or localStorage).
                return todoStorage.then(module => {
                    module.get(); // Fetch the todo records in the background.
                    return module;
                });
            }
        }
    };

    $routeProvider
        .when('/', routeConfig)
        .when('/:status', routeConfig)
        .otherwise({
            redirectTo: '/'
        });
})
    .config($httpProvider => {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
});