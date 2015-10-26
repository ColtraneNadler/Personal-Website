//
//  * FEEL FREE TO USE ALL THE CODE ON HERE HOWEVER YOU WANT! 
// 	* ALL THE CODE IS OPEN SOURCE, AND IS VIEWABLE ON GITHUB
// 	* BY CLICKING THE 'FORK ME ON GITHUB' BUTTON ON THE TOP 
// 	* RIGHT OF THIS PAGE! 
// 	* 
// 	* KANYE WEST 2020
// 	*
// 	* Coltrane Nadler © 2015
//

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-69338700-1', 'auto');
ga('send', 'pageview');

var coltrane = angular.module('coltrane', ['ngRoute']);

coltrane.config(function($routeProvider) {
	$routeProvider.
		when('/home', {
			templateUrl: 'partials/home.html',
			controller: 'home'
		}).
		when('/blog', {
			templateUrl: 'partials/blog.html',
			controller: 'blog'
		}).
		when('/blog/:num', {
			templateUrl: 'partials/blog.html',
			controller: 'blogpag'
		}).
		when('/post/:post', {
			templateUrl: 'partials/post.html',
			controller: 'blogpost'
		}).
		when('/admin', {
			templateUrl: 'partials/admin.html',
			controller: 'admin'
		}).
		otherwise({
			redirectTo: '/home'
		})
})

coltrane.factory('$page', function(){
  var title = 'Coltrane Nadler // Home';
  var showT = false;
  return {
  	// showT = true;
    title: function() { return title; },
    setTitle: function(newTitle) { title = newTitle; showT = true; }
  };
});

coltrane.directive('bindHtmlUnsafe', function( $compile ) {
    return function( $scope, $element, $attrs ) {

        var compile = function( newHTML ) { // Create re-useable compile function
            newHTML = $compile(newHTML)($scope); // Compile html
            $element.html('').append(newHTML); // Clear and append it
        };

        var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable 
                                              // Where the HTML is stored

        $scope.$watch(htmlName, function( newHTML ) { // Watch for changes to 
                                                      // the HTML
            if(!newHTML) return;
            compile(newHTML);   // Compile it
        });

    };
});

coltrane.controller('wrap', function($scope, $page) {
	$scope.Page = $page;
})

coltrane.controller('home', function($scope, $http, $timeout, $page) {

	ga('set', 'page', '/home');

	$page.setTitle('Coltrane Nadler // Home')

	$scope.contact_name = '';
	$scope.contact_email = '';
	$scope.contact_subject = '';
	$scope.contact_message = '';
	$scope.email_alert = false;
	$scope.alert_success = false;
	$scope.alert_warning = false;

	$scope.emailme = function() {
		var obj = {
			name: $scope.contact_name,
			email: $scope.contact_email,
			subject: $scope.contact_subject,
			message: $scope.contact_message
		}

		$http.post('/', obj).
			then(function(data) {
				$scope.contact_name = '';
				$scope.contact_email = '';
				$scope.contact_subject = '';
				$scope.contact_message = '';
				if(data.data === 'good') {
					$scope.alert_success = true;
					$scope.email_alert = true;
					$timeout(function() {
						$scope.alert_success = false;
						$scope.email_alert = false;
					}, 8000)
				} else {
					$scope.alert_warning = true;
					$scope.email_alert = true;
					$timeout(function() {
						$scope.alert_warning = true;
						$scope.email_alert = false;
					}, 8000)
				}
			}, function(err) {
				console.log(err)
			})
	}
})

coltrane.controller('blog', function($scope, $http, $page) {

	ga('set', 'page', '/blog');

	$page.setTitle('Coltrane Nadler // Blog')

	$scope.posts = false;
	$scope.next = 2;
	$scope.convertTime = function(unix) {
		return new Date(unix).toString().split(' ').slice(1,4).join(' ');
	}
	$http.get('/api/posts?amnt=3').
		then(function(data) {
			$scope.posts = data.data.posts;
			console.log(data.data.next)
			!data.data.next ? $scope.next = false : null;
		}, function(err) {
			console.log(err)
		})
})

coltrane.controller('blogpag', function($scope, $http, $routeParams, $page) {

	ga('set', 'page', '/blog/' + $routeParams['num']);

	$page.setTitle('Coltrane Nadler // Blog')

	$scope.posts = [];
	$scope.convertTime = function(unix) {
		return new Date(unix).toString().split(' ').slice(1,4).join(' ');
	}
	$scope.next = parseInt($routeParams['num']) + 1;

	if($routeParams['num'] - 1 === 1) {
		$scope.prev = '#';
	} else {
		$scope.prev = $routeParams['num'] - 1;
	}

	$http.get('/api/posts?amnt=3&num=' + $routeParams['num']).
		then(function(data) {
			$scope.posts = data.data.posts;
			!data.data.next ? $scope.next = false : null;
		}, function(err) {
			console.log(err)
		})
})

coltrane.controller('blogpost', function($scope, $http, $routeParams, $rootScope, $location, $page) {

	ga('set', 'page', '/blog/' + $routeParams['post']);

	$page.setTitle('Coltrane Nadler // Blog')

	$scope.post = {};
	$scope.admin = $rootScope.auth;
	$scope.edit = false;
	$scope.preivew = '';
	$scope.editor = '';
	$scope.convertTime = function(unix) {
		console.log(unix)
		return new Date(unix).toString().split(' ').slice(1,4).join(' ');
	}
	$scope.editpost = function() {
		if($scope.edit) {
			$scope.edit = false;
		} else {
			$scope.edit = true;
		}
	}

	$scope.updateprev = function() {
		if($scope.editor === undefined) {
			return '';
		} else {
			return marked($scope.editor);
		}
	}

	$scope.removepost = function() {
		$http.get('/api/post/del?post=' + $routeParams['post'] + '&id=' + $rootScope.authId).
			then(function(data) {
				console.log(data)
				if(data.data.success === true) {
					$location.path('/blog')
				}
			}, function(err) {
				if(err) return console.log(err)
			})
	}

	$scope.updatepost = function() {
		var obj = {
			raw: $scope.editor,
			body: marked($scope.editor),
			date: $routeParams['post'],
			id: $rootScope.authId
		}

		$http.post('/api/post/update', obj).
			then(function(data) {
				$scope.post.body = marked($scope.editor);
				$scope.post.raw = $scope.editor;
				$scope.edit = false;
			}, function(err) {
				return console.log(err);
			})
	}

	$http.get('/api/post?post=' + $routeParams['post']).
		then(function(data) {
			$scope.post = data.data;
			$scope.post.date = new Date($scope.post.date).toString().split(' ').slice(1,4).join(' ');
			$scope.preview = data.data.body;
			$scope.editor = data.data.raw;
		}, function(err) {
			console.log(err)
		})
})

coltrane.controller('admin', function($scope, $http, $rootScope, $page) {

	ga('set', 'page', '/admin');

	$page.setTitle('Coltrane Nadler // Admin')

	$scope.auth = $rootScope.auth || null;

	$scope.body = '';
	$scope.title = '';
	$scope.preview = function() {
		if($scope.body === undefined) {
			return '';
		} else {
			return marked($scope.body);
		}
	}

	$scope.newpost = function() {
		var obj = {
			title: $scope.title,
			body: marked($scope.body),
			raw: $scope.body,
			id: $rootScope.authId
		}

		$http.post('/api/newpost', obj).
			then(function(data) {
				$scope.successpost = true;
				$scope.title = '';
				$scope.body = '';
				$scope.preview();
				setTimeout(function() {
					$scope.successpost = false;
				}, 4000)
			}, function(err) {
				console.log(err)
			})
	}

	$scope.authenticate = function() {
		var obj = {
			username: $('#username').val(),
			password: $('#password').val()
		}

		$http.post('/api/auth', obj).
			then(function(data) {
				if(data.data.success === true) {
					$rootScope.auth = true;
					$rootScope.authId = data.data.id;
					$scope.auth = true;
					// authmsg('success', 'logged in successfully!')
					$scope.alert = false;
				} else {
					$scope.alert = true;
					// authmsg('warning', 'incorrect credentials!')

				}
			}, function(err) {
				console.log(err)
			})
	}
})
