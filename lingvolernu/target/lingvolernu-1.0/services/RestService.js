instaApp.factory('RestService', function (Restangular, $http, $q) {
    return {
        login: function (recordId) {

            return $http.post("rest/record/login/", recordId);

//            var aPromise = Restangular.all("rest/record/login/");
//            return aPromise.post(recordId);
        },
        token: function (url) {

            return $http.post("rest/record/token/", url);

//            var aPromise = Restangular.all("rest/record/login/");
//            return aPromise.post(recordId);
        },
        like: function (url) {
            return $http.post("rest/record/like/", url);
        },
        translate: function (text, lang) {
           
            var key = 'trnsl.1.1.20160817T100626Z.c07bc8abc833cbc1.b751f1dff6954b73f2afff1ab48beb25a327f9d3';
            var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + key +
                    '&text=' + encodeURIComponent(text) +
                    '&lang=' + lang +
                    '&format=html';
            console.log(url);
            var promise1= $http.jsonp(url + '&callback=JSON_CALLBACK');

            var key = 'dict.1.1.20160817T115021Z.79a682cbd5e2773d.ba97613978fa1208f72f3f30070fc9a01d7d959c';
            var url = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=' + key +
                    '&lang=' + lang +
                    '&text=' + encodeURIComponent(text);
            console.log(url);
            var promise2= $http.jsonp(url + '&callback=JSON_CALLBACK');
            
            return $q.all([promise1, promise2]).then(function(result){
                return {translation: result[0].data, vocabulary: result[1].data};
            });
        }
    };
});