function GalleryCtrl($scope, $state, RestService, $social, $timeout) {

    $scope.langs = [
        {description: 'Russian', shortcat: 'ru'},
        {description: 'English', shortcat: 'en'},
        {description: 'Polish', shortcat: 'pl'},
        {description: 'Italian', shortcat: 'it'}
    ];

    $scope.from = $scope.langs[0].shortcat;
    $scope.to = $scope.langs[1].shortcat;

    $scope.loadInfo = function (url, request) {
        var data = $social.execute(url, request);
        data.then(function (_data) {
            console.log(_data);
            $scope.user = _data.data;
        });
    };

    $scope.load = function (url, request) {
        var data = $social.execute(url, request);
        data.then(function (_data) {
            console.log(_data);
            $scope.medias = _data.data;
//            _data.data.forEach(function (media) {
//            console.log(media);
//            $scope.setLike(media.id);
//           // $scope.setLike(_data.data[2].id);
//            });
        });
    };



    $scope.setLike = function (mediaId) {
        var data = $social.post('media/' + mediaId + '/likes');
        data.then(function (_data) {
            console.log(_data);
        });
    };

    $scope.search = function (url, request) {
        var data = $social.execute(url, request);
        data.then(function (_data) {
            _data.data.forEach(function (media) {
                console.log(request);
                $scope.load('tags/' + media.name + '/media/recent');
            });
        });
    };

    $scope.medias = [];

    $scope.loadMedia = function (url, request) {
        var data = $social.execute(url, request);
        data.then(function (_data) {
            console.log(_data);
            $scope.medias.push(_data.data);
        });
    };

    $scope.text = '';

//     $scope.result = '';

    $scope.translate = function () {
        var data = RestService.translate($scope.text, $scope.from + '-' + $scope.to);
        data.then(function (_data) {
            console.log(_data);
            $scope.vocabulary = _data.vocabulary;
            $scope.translation = _data.translation;

            $scope.translation.text.forEach(function (word) {
                $scope.load('tags/' + word + '/media/recent');
            });
            $scope.load('tags/' + $scope.text + '/media/recent');
        });
    };

    $scope.loadInfo('users/self');

//            $scope.load('users/1574083');
//            $scope.loadMedia('users/self/media/recent');
//            $scope.load('users/self/media/liked');
//            $scope.load('users/self/follows');
//            $scope.load('users/self/followed-by');
//            $scope.load('users/374441388/relationship');
//            $scope.load('media/1301497422983335001_374441388');
//    $scope.load('tags/mainecoon');
    // $scope.load('tags/mainecoon/media/recent');

//    $scope.search('tags/search?', 'q=mainecoon');
    //$scope.search('tags/search?', 'q=mainecoon');

//    $scope.load('tags/spring/media/recent');
//    $scope.load('users/374441388');
//    $scope.load('users/self/media/liked');
//    $scope.load('users/374441328');
    //    
    //$scope.search('tags/search?', 'q=cat');
    // $scope.translate('test');
}