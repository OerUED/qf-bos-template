app.factory('httpInterceptor', ['$q', function($q) {
    var interceptor = {
        'request': function(config) {
            return config || $q.when(config);
        },
        'requestError': function(rejection) {
            return $q.reject(rejection);
        },
        'response': function(response) {
            if (response.data.status == '-1' &&  response.data.details == 'sessiontimeout') {
                window.location.href = response.data.data;
                return null;
            }else{
                return response || $q.when(response);
            }
        },
        'responseError': function(rejection) {
            return $q.reject(rejection);
        }
    };
    return interceptor;
}]);

// 通用的Http
app.factory('servHttp', ['$http', function($http) {
    return {
        get: (url, data) => {
            return $http.get(url, {
                params: data,
                cache: false
            }).then(res => res.data).catch(res => res.data);
        },
        post: (url, data) => {
            return $http.post(url, data).then(res => res.data).catch(res => res.data);
        },
    };
}]);