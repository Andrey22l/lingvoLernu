function LoginCtrl($scope, $state, RestService, $social) {
    $scope.user = {login: "", password: ""};

    $scope.login = function () {


        var data = RestService.login(1);
        data.success(function (_data, status, headers, config, statusText) {
            console.log(_data);
            console.log(status);
            console.log(headers);
            //$state.go('login');
        }).error(function (_data, status) {
            console.error('Repos error', status, _data);
            $state.go('error');
        });
    };

    $scope.authenticate = function (provider) {

        var data = $social.login(provider);
        data.then(function (_data) {
            console.log(_data);
            $state.go('/gallery');
        });
    };
}
