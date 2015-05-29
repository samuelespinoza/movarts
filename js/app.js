var base = 'http://api.themoviedb.org/3';
var service = '/search';
var serviceSearch = '/multi';
var serviceMovies = '/movie';
var serviceActors = '/person';
var apiKey = '7ec0e417bf8581e66de5a69107fd3976';
var callback = 'JSON_CALLBACK';
var dirPictures = 'http://image.tmdb.org/t/p/w500/';

var cTextDialog = "";

var app = angular.module('MovArts', ['ngMaterial']);

app.controller('controlApp', function ($scope, $http, $mdDialog) {
    $scope.titleDialog = "MovArts";

    $scope.inputTextSearch = "";
    $scope.labelTextSearch = "Text to Search";

    $scope.result = "";
    $scope.resultText = "";
    
    $scope.searchTypeActors = true;
    $scope.searchTypeMovies = true;

    $scope.hideList = true;
    $scope.hideSearchingPanel = true;

    $scope.langSelected = "EN";
    funcChangueLang($scope);

    $scope.hideTextTesting = true; // For Testing
    $scope.resultTest = ""; // For Testing

    $scope.showAlert = function () {
        $mdDialog.show(
          $mdDialog.alert()
            .title($scope.titleDialog)
            .content(cTextDialog)
            .ariaLabel('')
            .ok('OK')
        );
    };

    $scope.englishVersion = function () {
        $scope.langSelected = "EN";
        funcChangueLang($scope);
    }
    $scope.spanishVersion = function () {
        $scope.langSelected = "ES";
        funcChangueLang($scope);
    }

    $scope.search = function () {
        var queryString = $scope.inputTextSearch;
        var lContinue = true;

        if (!$scope.searchTypeMovies && !$scope.searchTypeActors) {
            lContinue = false;
            cTextDialog = eval($scope.langSelected + "_TextDialog");
            $scope.showAlert();
        }

        if (lContinue && queryString == "") {
            $scope.labelTextSearch = eval($scope.langSelected + "_TextSearchMissing");
            lContinue = false;
        }

        if (lContinue) {
            $scope.hideSearchingPanel = false;
            var serviceS = serviceSearch;
            if (!$scope.searchTypeActors) {
                serviceS = serviceMovies;
            }
            if (!$scope.searchTypeMovies) {
                serviceS = serviceActors;
            }
            var url = base + service + serviceS + '?api_key=' + apiKey + '&query=' + queryString + '&callback=' + callback;
            $http.jsonp(url).then(function (data, status) {
                $scope.response(data);
            }, function (data, status) {
                $scope.response(data);
            });
        }
    }


    $scope.response = function (dataResponse) {
        //$scope.resultJson = JSON.stringify(dataResponse.data.results); // TEMP
        $scope.hideSearchingPanel = true;

        var cTextSearch = $scope.inputTextSearch;
        var lContinue = true;
        var cTextResult = "";
        var lCheckByMediaType = true;
        if (!$scope.searchTypeActors || !$scope.searchTypeMovies) {
            lCheckByMediaType = false;
        }

        if (dataResponse == null) {
            cTextResult = eval($scope.langSelected + "_TextProblem");
            lContinue = false;
        }
        if (lContinue) {
            if (dataResponse.status != 200) {
                cTextResult = eval($scope.langSelected + "_TextProblem");
                lContinue = false;
            }
        }

        if (lContinue) {
            var nTotalResults = dataResponse.data.total_results;

            if (dataResponse.data.total_results == 0) {
                cTextResult = eval($scope.langSelected + "_TextNoResults");
                $scope.result = "";
            } else {
                listDataResults = dataResponse.data.results;
                listDataResults = funcAddFieldList(listDataResults, "nameshow");
                listDataResults = funcAddFieldList(listDataResults, "picture");
                listDataResults = funcAddFieldList(listDataResults, "mediatype");
                
                cTextResult = eval($scope.langSelected + "_TextResults1") + nTotalResults + eval($scope.langSelected + "_TextResults2") + cTextSearch + eval($scope.langSelected + "_TextResults3");

                // Quit the tv results
                listNewDataResults = null;
                for (iResult = 0; iResult < listDataResults.length; iResult++) {
                    var cMediaType = "";
                    if (lCheckByMediaType) {
                        cMediaType = listDataResults[iResult].media_type;
                    } else {
                        if (!$scope.searchTypeActors) {
                            cMediaType = "movie";
                        } else {
                            cMediaType = "person";
                        }
                    }
                    if (cMediaType == "movie" || cMediaType == "person") {
                        var cName = "";
                        var cPicture = "";
                        var cMediaTypeText = "";
                        if (cMediaType == "movie") {
                            cName = listDataResults[iResult].original_title;
                            cPicture = dirPictures + listDataResults[iResult].poster_path;
                            cMediaTypeText = eval($scope.langSelected + "_TextMediaTypeMovie");
                        } else {
                            cName = listDataResults[iResult].name;
                            cPicture = dirPictures + listDataResults[iResult].profile_path;
                            cMediaTypeText = eval($scope.langSelected + "_TextMediaTypeActor");
                        }
                        listDataResults[iResult].nameshow = cName;
                        listDataResults[iResult].picture = cPicture;
                        listDataResults[iResult].mediatype = cMediaTypeText;
                        listNewDataResults = funcInsertEntitieExist(listNewDataResults, listDataResults[iResult]);
                    }
                }

                $scope.result = listNewDataResults;
            }
        }

        $scope.hideList = !lContinue;
        $scope.resultText = cTextResult;
    }
});

app.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});



function funcInsertEntitieExist(listData, eEntitie) {
    if (listData == null) {
        listData = JSON.parse('[' + JSON.stringify(eEntitie) + ']');
    } else {
        listData.push(eEntitie);
    }
    return listData;
}

function funcAddFieldList(listData, cFieldAdd) {
    cNewList = "[";
    cInsert = ',"' + cFieldAdd + '":null}';
    for (iListData = 0; iListData < listData.length; iListData++) {
        cEstruc = JSON.stringify(listData[iListData]);
        cEstruc = cEstruc.substring(0, cEstruc.length - 1) + cInsert;
        cComa = ",";
        if (iListData == 0) {
            cComa = "";
        }
        cNewList += cComa+cEstruc;
    }
    cNewList += "]";
    return JSON.parse(cNewList);
}