angular.module('ngSocial', []).provider('$social', function () {
    var config = {
        redirect_url: encodeURIComponent('http://localhost:8080/lingvolernu/'),
        window_options: 'width=350,height=350,top=216,left=710',
        login_url: '#/login',
        provider: null,
        token: null,
        api_url: null
    };

    var facebook = {
        app_id: null,
        secret: null,
        response_type: 'token',
        api_url: 'https://api.facebook.com/v1/',
        authorize_url: 'https://www.facebook.com/v2.5/dialog/oauth',
        scope: ['read_custom_friendlists'],
        authorize_parameters: '?app_id=%app_id%&redirect_uri=%redirect_url%&response_type=%response_type%'
    };

    var instagram = {
        app_id: null,
        secret: null,
        response_type: 'token',
        api_url: 'https://api.instagram.com/v1/',
        authorize_url: 'https://api.instagram.com/oauth/authorize',
        scope: ['public_content', 'follower_list', 'likes', 'basic', 'comments', 'relationships'],
        authorize_parameters: '?client_id=%app_id%&redirect_uri=%redirect_url%&response_type=%response_type%'
    };

    var linkedin = {
        app_id: null,
        secret: null,
        response_type: 'code',
        api_url: 'https://api.linkedin.com/v1/',
        authorize_url: 'https://www.linkedin.com/oauth/v2/authorization',
        scope: ['r_emailaddress', 'rw_company_admin', 'w_share', 'r_fullprofile', 'r_basicprofile'],
        authorize_parameters: '?client_id=%app_id%&redirect_uri=%redirect_url%&state=DCE4Ga3fWf49296sdOlefs24&response_type=%response_type%',
        token_url: 'https://www.linkedin.com/uas/oauth2/accessToken',
        token_parameters: '?grant_type=authorization_code&code=%code%&redirect_uri=%redirect_url%&client_id=%app_id%&client_secret=%client_secret%'
    };

    this.setFacebookAppId = function (appId) {
        facebook.app_id = appId;
        config.facebook = facebook;
        return this;
    };

    this.setInstagramAppId = function (appId) {
        instagram.app_id = appId;
        config.instagram = instagram;
        return this;
    };

    this.setLinkedinAppId = function (appId, secret) {
        linkedin.app_id = appId;
        linkedin.secret = secret;
        config.linkedin = linkedin;
        return this;
    };

    this.setRedirectURL = function (url) {
        config.redirect_url = encodeURIComponent(url);
        return this;
    };

    this.initialize = function () {
        authorizeParameters('facebook');
        authorizeParameters('instagram');
        authorizeParameters('linkedin');
        tokenParameters('linkedin');
//        console.log(config);
    };


    function authorizeParameters(socialAPI) {
        if (angular.isUndefined(config[socialAPI].authorize_parameters)) {
            return;
        }
        config[socialAPI].authorize_parameters = config[socialAPI].authorize_parameters
                .replace('%app_id%', config[socialAPI].app_id)
                .replace('%redirect_url%', config.redirect_url)
                .replace('%response_type%', config[socialAPI].response_type);

        var part_url = '&scope=';
        config[socialAPI].scope.forEach(function (scope) {
            part_url += scope + '+';
        });
        config[socialAPI].authorize_parameters += part_url.substr(0, part_url.length - 1);
    }

    function tokenParameters(socialAPI) {
        if (angular.isUndefined(config[socialAPI].token_parameters)) {
            return;
        }
        config[socialAPI].token_parameters = config[socialAPI].token_parameters
                .replace('%app_id%', config[socialAPI].app_id)
                .replace('%redirect_url%', config.redirect_url)
                .replace('%client_secret%', config[socialAPI].secret);
    }




    this.$get = ['$q', 'RestService', '$http', '$timeout', function ($q, RestService, $http, $timeout) {
            var $social = $q.defer();

            $social.login = function (provider) {
                var deferred = $q.defer();

                config.provider = provider;
                var response_type = config[provider].response_type;

                var popup = window.open(config.login_url, ' ', config.window_options);
                popup.onload = function () {
                    var interval = null;
                    function findToken() {
                        //check if hash exists
                        if (popup.location.hash.length > 14) {
                            //hash found, that includes the access token
                            var response = popup.location.hash.slice(14);

                            //check for Facebook response
                            var index = response.search('&expires_in=');
                            if (index > 0) {
                                response = response.substr(0, index);
                            }

                            clearInterval(interval);

                            config.token = response;
                            config.api_url = config[provider].api_url;

                            deferred.resolve(config.token);
                            popup.close();
                        }
                    }

                    function findCode() {
                        //check search params
                        if (popup.location.search.length > 6) {
                            var response = popup.location.search.slice(6);

                            //for linkedin
                            var index = response.search('&state=');
                            if (index > 0) {
                                response = response.substr(0, index);
                            }


                            config[provider].token_parameters = config[provider].token_parameters.replace('%code%', response);

                            var data = RestService.token(config[provider].token_url + config[provider].token_parameters);
                            data.then(function (resp) {
                                var obj = resp.data;
                                config.token = obj.access_token;
                                config.api_url = config[provider].api_url;
                                deferred.resolve(config.token);

                            });

                            clearInterval(interval);
                            popup.close();
                        }
                    }

                    function createInterval() {
                        interval = setInterval(function () {
                            try {
                                if (response_type === 'token') {
                                    findToken();
                                }

                                if (response_type === 'code') {
                                    findCode();
                                }
                            } catch (evt) {
                                //permission denied
                            }
                        }, 5);
                    }

                    createInterval();


                    popup.open(config[provider].authorize_url + config[provider].authorize_parameters, '_self');
                };

                return deferred.promise;
            };

            $social.execute = function (url, request) {
                var deferred = $q.defer();

                var url_part = url;
                if (angular.isUndefined(request)||request===null) {
                    url_part += '?';
                } else {
                    url_part += request + '&';
                }

                $http.jsonp(config.api_url + url_part + 'access_token=' + config.token + '&callback=JSON_CALLBACK').success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    console.log(error);
                });

                return deferred.promise;
            };


            $social.post = function (url) {
                var deferred = $q.defer();

                var data = RestService.like(config.api_url + url + '?access_token=' + config.token);
                data.then(function (resp) {
                    console.log(resp);
                });
                return deferred.promise;
            };

            

            return $social;
        }];
});
