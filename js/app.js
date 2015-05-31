var base = 'http://api.themoviedb.org/3';
var service = '/search';
var serviceSearch = '/multi';
var serviceMovies = '/movie';
var serviceActors = '/person';
var servicePopular = '/popular';
var serviceActorCredits = '/movie_credits';
var serviceMovieCredits = '/credits';
var apiKey = '7ec0e417bf8581e66de5a69107fd3976';
var dirPictures = 'http://image.tmdb.org/t/p/w500/';

var cTextDialog = "";
var cTypeMediaTopSel = "";
var cQueryString = "";
var cServiceSelected = "";
var lVisualizingMediaInfo = false;
var lVisualizingInfo = false;
var cMediaTypeSelected = "";

var app = angular.module('MovArts', ['ngMaterial']);

app.controller('controlApp', function ($scope, $http, $mdDialog) {
    $scope.titleApp = "MovArts";
    $scope.creator = "By SEV";
    $scope.made = "Made for AlertLogic - 2015 - Improving Material Desing by AngularJS";

    $scope.inputTextSearch = "";
    $scope.labelTextSearch = "Text to Search";

    $scope.result = "";
    $scope.resultText = "";
    $scope.resultMedia = "";
    
    $scope.searchTypeActors = true;
    $scope.searchTypeMovies = true;

    $scope.hidePanelSearch = false;
    $scope.hideList = true;
    $scope.hideSearchingPanel = true;
    $scope.hidePanelPage = true;
    $scope.hideButtonLastPage = true;
    $scope.hideButtonFirstPage = true;
    $scope.hidePanelInfoMovie = true;
    $scope.hidePanelInfoPerson = true;
    $scope.hidePanelLastMedia = false;
    $scope.hidePanelCredits = true;

    $scope.pageShowResults = 1;
    $scope.totalPageShowResults = 0;
    $scope.lastVisit = "";
    $scope.listCredits = "";
    $scope.goToHome = false;

    $scope.langSelected = "EN";
    funcChangueLang($scope);

    // Local Storage for save the last media watched
    for (iData = 1; iData <= 5; iData++) {
        if ((window.localStorage["MovArtsLastId" + iData] + "") == "undefined") {
            window.localStorage["MovArtsLastId" + iData] = "";
        }
        if ((window.localStorage["MovArtsLastName" + iData] + "") == "undefined") {
            window.localStorage["MovArtsLastName" + iData] = "";
        }
        if ((window.localStorage["MovArtsLastPic" + iData] + "") == "undefined") {
            window.localStorage["MovArtsLastPic" + iData] = "";
        }
        if ((window.localStorage["MovArtsLastType" + iData] + "") == "undefined") {
            window.localStorage["MovArtsLastType" + iData] = "";
        }
    }

    $scope.hideTextTesting = true; // For Testing
    $scope.resultTest = ""; // For Testing
    $scope.showTest = function (cTextShow) { // For Testing
        $scope.hideTextTesting = false; // For Testing
        $scope.resultTest = cTextShow; // For Testing
    };

    // Adding information to the scope of last visit media for show in the principal page
    $scope.actLastVisit = function () {
        listData = null;
        lHasdata = false;
        for (iData = 1; iData <= 5; iData++) {
            nId = window.localStorage["MovArtsLastId" + iData];
            cType = window.localStorage["MovArtsLastType" + iData];
            cName = window.localStorage["MovArtsLastName" + iData];
            cPic = window.localStorage["MovArtsLastPic" + iData];
            lShow = true;
            if (nId == "") {
                lShow = false;
            }
            //lShow = !lShow;
            if (nId != "") {
                lHasdata = true;
            }
            if (iData == 1) {
                listData = [{ id: nId, type: cType, name: cName, pic: cPic, show: lShow }];
            } else {
                eEntitie = { id: nId, type: cType, name: cName, pic: cPic, show: lShow };
                listData.push(eEntitie);
            }
        }
        $scope.lastVisit = listData;
        $scope.hidePanelLastMedia = !lHasdata;
    };
    $scope.actLastVisit();

    // Alert
    $scope.showAlert = function () {
        $mdDialog.show(
          $mdDialog.alert()
            .title($scope.titleApp)
            .content(cTextDialog)
            .ariaLabel('')
            .ok('OK')
        );
    };

    // Home Button
    $scope.homeButton = function () {
        $scope.hidePanelSearch = false;
        $scope.hidePanelLastMedia = false;
        $scope.hideSearchingPanel = true;
        $scope.hidePanelInfoMovie = true;
        $scope.hidePanelInfoPerson = true;
        $scope.hideList = true;
        $scope.result = "";
        $scope.actLastVisit();
        lVisualizingInfo = false;
        lVisualizingMediaInfo = false;
        $scope.goToHome = false;
        $scope.hidePanelCredits = true;
    }

    // Popular Movies Search
    $scope.popularMovies = function () {
        $scope.hideSearchingPanel = false;
        $scope.hideList = true;
        $scope.hidePanelInfoMovie = true;
        $scope.hidePanelInfoPerson = true;
        cTypeMediaTopSel = "movie";
        $scope.pageShowResults = 1;
        lVisualizingMediaInfo = false;
        $scope.hidePanelCredits = true;

        serviceS = serviceMovies + servicePopular;
        queryString = "";
        $scope.hideSearchingPanel = false;
        $scope.buildWebService(serviceS, queryString);
    }

    // Popular Actors Search
    $scope.popularActors = function () {
        $scope.hideSearchingPanel = false;
        $scope.hideList = true;
        $scope.hidePanelInfoMovie = true;
        $scope.hidePanelInfoPerson = true;
        cTypeMediaTopSel = "person";
        $scope.pageShowResults = 1;
        lVisualizingMediaInfo = false;
        $scope.hidePanelCredits = true;

        serviceS = serviceActors + servicePopular;
        queryString = "";
        $scope.hideSearchingPanel = false;
        $scope.buildWebService(serviceS, queryString);
    }

    // Change to English Version
    $scope.englishVersion = function () {
        $scope.langSelected = "EN";
        funcChangueLang($scope);
        if (lVisualizingInfo) {
            $scope.buildWebService();
        }
    }
    // Change to Spanish Version
    $scope.spanishVersion = function () {
        $scope.langSelected = "ES";
        funcChangueLang($scope);
        if (lVisualizingInfo) {
            $scope.buildWebService();
        }
    }

    // First Page
    $scope.firstPage = function () {
        if ($scope.pageShowResults > 1) {
            $scope.pageShowResults=1;
            $scope.buildWebService();
        }
    }
    // Previus Page
    $scope.prevPage = function () {
        if ($scope.pageShowResults > 1) {
            $scope.pageShowResults--;
            $scope.buildWebService();
        }
    }
    // Next Page
    $scope.nextPage = function () {
        if (($scope.pageShowResults + 1) <= $scope.totalPageShowResults) {
            $scope.pageShowResults++;
            $scope.buildWebService();
        }
    }
    // Last Page
    $scope.lastPage = function () {
        if ($scope.pageShowResults < $scope.totalPageShowResults) {
            $scope.pageShowResults =$scope.totalPageShowResults;
            $scope.buildWebService();
        }
    }

    // Select Media
    $scope.selectMedia = function (nIdMedia,cMediaType,cName,cPic,lGoHome) {
        $scope.hideList = true;
        lVisualizingMediaInfo = true;
        cMediaType=cMediaType+"";
        if (cMediaType == "undefined") {
            cMediaTypeSelected = cTypeMediaTopSel;
        } else {
            cMediaTypeSelected = cMediaType;
        }
        if (cMediaTypeSelected == "movie") {
            serviceS = serviceMovies;
        } else {
            serviceS = serviceActors;
        }

        if (lGoHome == true) {
            $scope.goToHome = true;
        }

        $scope.hideSearchingPanel = false;
        // Web Service
        $scope.buildWebService(serviceS + "/" + nIdMedia, "", true);

        // web Service for credits
        if (cMediaTypeSelected == "movie") {
            serviceCredits = serviceMovieCredits;
        } else {
            serviceCredits = serviceActorCredits;
        }
        $scope.buildWebService(serviceS + "/" + nIdMedia + serviceCredits, "", true, true);

        // Local Storage for save the last media watched
        var lMediaIsNew = true;
        for (iData = 1; iData <= 5; iData++) {
            nId = window.localStorage["MovArtsLastId" + iData];
            cType = window.localStorage["MovArtsLastType" + iData];
            if (nId == nIdMedia && cType == cMediaTypeSelected) {
                lMediaIsNew = false;
                break;
            }
        }
        if (lMediaIsNew) {
            for (iData = 5; iData > 1; iData--) {
                nData = iData - 1;
                window.localStorage["MovArtsLastId" + iData] = window.localStorage["MovArtsLastId" + nData];
                window.localStorage["MovArtsLastName" + iData] = window.localStorage["MovArtsLastName" + nData];
                window.localStorage["MovArtsLastPic" + iData] = window.localStorage["MovArtsLastPic" + nData];
                window.localStorage["MovArtsLastType" + iData] = window.localStorage["MovArtsLastType" + nData];
            }
            window.localStorage["MovArtsLastId1"] = nIdMedia;
            window.localStorage["MovArtsLastName1"] = cName;
            window.localStorage["MovArtsLastPic1"] = cPic;
            window.localStorage["MovArtsLastType1"] = cMediaTypeSelected;
        }
    }

    // Building the webservice
    $scope.buildWebService = function (serviceSel, queryString, lNoPage, lSecondWebService) {
        lang = $scope.langSelected;
        lang = lang.toLowerCase();
        if (lNoPage != null && lNoPage==true) {
            page = "";
        } else {
            page = '&page=' + $scope.pageShowResults;
        }

        if (serviceSel != null && !lSecondWebService) {
            cQueryString = queryString;
            cServiceSelected = serviceSel;
        }
        cServiceTemp = cServiceSelected

        if (lSecondWebService) {
            cServiceTemp = serviceSel;
        }
        
        var url = base + cServiceTemp + '?api_key=' + apiKey + cQueryString + page + '&language=' + lang + '&callback=JSON_CALLBACK';
        //$scope.showTest(url + " " + lSecondWebService + " - " + serviceSel); // For Testing
        $http.jsonp(url).then(function (data, status) {
            if (!lVisualizingMediaInfo) {
                $scope.response(data);
            } else {
                if (!lSecondWebService) {
                    $scope.responseForVisualizingMedia(data);
                } else {
                    $scope.responseForVisualizingCredits(data);
                }
            }
        }, function (data, status) {
            if (!lVisualizingMediaInfo) {
                $scope.response(data);
            } else {
                if (!lSecondWebService) {
                    $scope.responseForVisualizingMedia(data);
                } else {
                    $scope.responseForVisualizingCredits(data);
                }
            }
        });
    }

    // Button Back
    $scope.backOption = function (serviceSel, queryString) {
        if ($scope.goToHome) {
            $scope.homeButton();
        } else {
            $scope.resultMedia = "";
            $scope.hidePanelInfoMovie = true;
            $scope.hidePanelInfoPerson = true;
            $scope.hideList = false;
            $scope.hidePanelPage = true;
            lVisualizingMediaInfo = false;
        }
    }

    // Botton Search
    $scope.search = function () {
        var queryString = $scope.inputTextSearch;
        var lContinue = true;
        lVisualizingMediaInfo = false;

        // Must be select movies or actors for search
        if (!$scope.searchTypeMovies && !$scope.searchTypeActors) {
            lContinue = false;
            cTextDialog = eval($scope.langSelected + "_TextDialog");
            $scope.showAlert();
        }

        // Dont search if input is empty
        if (lContinue && queryString == "") {
            $scope.labelTextSearch = eval($scope.langSelected + "_TextSearchMissing");
            lContinue = false;
        }

        if (lContinue) {
            // Web service to api
            $scope.hideSearchingPanel = false;
            $scope.hideList = true;
            cTypeMediaTopSel = "";
            var serviceS = serviceSearch;
            if (!$scope.searchTypeActors) {
                serviceS = serviceMovies;
            }
            if (!$scope.searchTypeMovies) {
                serviceS = serviceActors;
            }

            queryString = '&query=' + queryString;
            serviceS = service + serviceS;
            $scope.pageShowResults = 1;

            $scope.buildWebService(serviceS, queryString);
        }
    }


    // Response of Search
    $scope.response = function (dataResponse) {
        //$scope.showTest(JSON.stringify(dataResponse.data.results)); // For Testing

        $scope.hideSearchingPanel = true;
        $scope.hidePanelPage = true;
        // If Select Popular dont show the first or last page
        if (cTypeMediaTopSel != "") {
            $scope.hideButtonLastPage = true;
            $scope.hideButtonFirstPage = true;
        } else {
            $scope.hideButtonLastPage = false;
            $scope.hideButtonFirstPage = false;
        }
        $scope.result = "";

        var cTextSearch = $scope.inputTextSearch;
        var lContinue = true;
        var cTextResult = "";
        var lCheckByMediaType = true;

        // Check Filters
        if (!$scope.searchTypeActors || !$scope.searchTypeMovies) {
            lCheckByMediaType = false;
        }
        if (cTypeMediaTopSel != "") {
            lCheckByMediaType = false;
        }

        // Check Errors
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

            // If No results
            if (dataResponse.data.total_results == 0) {
                cTextResult = eval($scope.langSelected + "_TextNoResults");
                $scope.result = "";
            } else {

                // Adding fields to existing list for display
                listDataResults = dataResponse.data.results;
                listDataResults = funcAddFieldList(listDataResults, "nameshow");
                listDataResults = funcAddFieldList(listDataResults, "picture");
                listDataResults = funcAddFieldList(listDataResults, "mediatype");

                // Order by Popularity
                listDataResults.orderByNumber('popularity',-1);

                // Quit the tv results
                listNewDataResults = null;
                for (iResult = 0; iResult < listDataResults.length; iResult++) {
                    var cMediaType = "";
                    if (lCheckByMediaType) {
                        // Search Filtering media
                        cMediaType = listDataResults[iResult].media_type;
                    } else {
                        if (cTypeMediaTopSel != "") {
                            // Popular Tops
                            cMediaType = cTypeMediaTopSel;
                        } else {
                            // Serching Multiple
                            if (!$scope.searchTypeActors) {
                                cMediaType = "movie";
                            } else {
                                cMediaType = "person";
                            }
                        }
                    }
                    if (cMediaType == "movie" || cMediaType == "person") {
                        // Adding info to list
                        var cName = "";
                        var cPicture = "";
                        var cMediaTypeText = "";
                        if (cMediaType == "movie") {
                            cName = listDataResults[iResult].title;
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


                // Number of results
                if (cTypeMediaTopSel != "") {
                    if (cTypeMediaTopSel == "movie") {
                        cTextResult = eval($scope.langSelected + "_TextResults1") + nTotalResults + eval($scope.langSelected + "_TextResults4") + eval($scope.langSelected + "_TextBottonPopularMovies");
                        $scope.labelTextTitleListResults = eval($scope.langSelected + "_TextBottonPopularMovies");
                    } else {
                        cTextResult = eval($scope.langSelected + "_TextResults1") + nTotalResults + eval($scope.langSelected + "_TextResults4") + eval($scope.langSelected + "_TextBottonPopularActor");
                        $scope.labelTextTitleListResults = eval($scope.langSelected + "_TextBottonPopularActor");
                    }
                    $scope.hidePanelSearch = true;
                    $scope.hidePanelLastMedia = true;
                } else {
                    cTextResult = eval($scope.langSelected + "_TextResults1") + nTotalResults + eval($scope.langSelected + "_TextResults2") + cTextSearch + eval($scope.langSelected + "_TextResults3");
                }

                // list with results
                $scope.result = listNewDataResults;
                $scope.totalPageShowResults = dataResponse.data.total_pages;
                lVisualizingInfo = true;

                if ($scope.totalPageShowResults >1) {
                    $scope.hidePanelPage = false;
                }
            }
        }

        $scope.hideList = !lContinue;
        $scope.resultText = cTextResult;
    }

    // Responde for Visualizing Media Info
    $scope.responseForVisualizingMedia = function (dataResponse) {
        //$scope.showTest(JSON.stringify(dataResponse)); // For Testing

        $scope.hidePanelInfoMovie = true;
        $scope.hidePanelInfoPerson = true;
        $scope.hideSearchingPanel = true;
        $scope.hidePanelSearch = true;
        $scope.hidePanelLastMedia = true;
        $scope.hideList = true;

        var lContinue = true;

        // Check Errors
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
            dataResults = dataResponse.data;

            if (cMediaTypeSelected == "movie") {
                $scope.hidePanelInfoMovie = false;

                dataResults.poster_path = dirPictures + dataResults.poster_path;
                if (dataResults.overview == null || dataResults.overview == "") {
                    dataResults.overview = $scope.labelTextNoInfoToShow;
                }
                if (dataResults.release_date != null && dataResults.release_date != "") {
                    dataResults.release_date = getDateString(dataResults.release_date, $scope.langSelected);
                }

            } else {
                // Adding fields to existing list for display
                //dataResults = funcAddFieldEntitie(dataResults, "nameshow");

                if (dataResults.biography==null || dataResults.biography == "") {
                    dataResults.biography = $scope.labelTextNoInfoToShow;
                }
                if (dataResults.birthday != null && dataResults.birthday != "") {
                    dataResults.birthday = getDateString(dataResults.birthday, $scope.langSelected);
                }
                dataResults.profile_path = dirPictures + dataResults.profile_path;

                $scope.hidePanelInfoPerson = false;
            }

            $scope.resultMedia = dataResults;
            //$scope.showTest(JSON.stringify(dataResults)); // For Testing
            lVisualizingInfo = true;
        }
    }

    // Responde for Visualizing Credits
    $scope.responseForVisualizingCredits = function (dataResponse) {
        //$scope.showTest(JSON.stringify(dataResponse)); // For Testing

        listData = null;
        lHasdata = false;
        listDataSource = dataResponse.data.cast;
        if (listDataSource != null) {
            nGo = listDataSource.length;
            if (nGo > 5) {
                nGo = 5;
            }
            for (iData = 0; iData < nGo; iData++) {
                nId = listDataSource[iData].id;
                if (cMediaTypeSelected == "movie") {
                    cType = "person";
                    cName = listDataSource[iData].name;
                    cPic = dirPictures + listDataSource[iData].profile_path;
                } else {
                    cType = "movie";
                    cName = listDataSource[iData].title;
                    cPic = dirPictures + listDataSource[iData].poster_path;
                }
                lHasdata = true;
                if (iData == 0) {
                    listData = [{ id: nId, type: cType, name: cName, pic: cPic}];
                } else {
                    eEntitie = { id: nId, type: cType, name: cName, pic: cPic};
                    listData.push(eEntitie);
                }
            }
        }
        $scope.listCredits = listData;
        $scope.hidePanelCredits = !lHasdata;
    }

});

// Directive: Error when image not found
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

// Directive: Enter for search input searching
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


// Insert row to list
function funcInsertEntitieExist(listData, eEntitie) {
    if (listData == null) {
        listData = JSON.parse('[' + JSON.stringify(eEntitie) + ']');
    } else {
        listData.push(eEntitie);
    }
    return listData;
}

// Adding field to list
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

// Order
Array.prototype.orderByNumber = function (property, sortOrder) {
    if (sortOrder != -1 && sortOrder != 1) sortOrder = 1;
    this.sort(function (a, b) {
        return (a[property] - b[property]) * sortOrder;
    })
}

// Get Date
function getDateString(cDate, cLang) {
    cLang = cLang.toLowerCase();
    getMonthString = function (nMonth) {
        cMonth = ""
        if (cLang == "en") {
            if (nMonth == 1) {
                cMonth = "Jan";
            } else if (nMonth == 2) {
                cMonth = "Feb";
            } else if (nMonth == 3) {
                cMonth = "Mar";
            } else if (nMonth == 4) {
                cMonth = "Apr";
            } else if (nMonth == 5) {
                cMonth = "May";
            } else if (nMonth == 6) {
                cMonth = "Jun";
            } else if (nMonth == 7) {
                cMonth = "Jul";
            } else if (nMonth == 8) {
                cMonth = "Aug";
            } else if (nMonth == 9) {
                cMonth = "Sep";
            } else if (nMonth == 10) {
                cMonth = "Oct";
            } else if (nMonth == 11) {
                cMonth = "Nov";
            } else if (nMonth == 12) {
                cMonth = "Dec";
            }
        } else {
            if (nMonth == 1) {
                cMonth = "Ene";
            } else if (nMonth == 2) {
                cMonth = "Feb";
            } else if (nMonth == 3) {
                cMonth = "Mar";
            } else if (nMonth == 4) {
                cMonth = "Abr";
            } else if (nMonth == 5) {
                cMonth = "May";
            } else if (nMonth == 6) {
                cMonth = "Jun";
            } else if (nMonth == 7) {
                cMonth = "Jul";
            } else if (nMonth == 8) {
                cMonth = "Ago";
            } else if (nMonth == 9) {
                cMonth = "Sep";
            } else if (nMonth == 10) {
                cMonth = "Oct";
            } else if (nMonth == 11) {
                cMonth = "Nov";
            } else if (nMonth == 12) {
                cMonth = "Dic";
            }
        }
        return cMonth;
    }

    if (cLang == "en") {
        dDate = new Date(cDate);
    } else {
        //dDate = new Date(cDate.substring(8, 10) + "-" + cDate.substring(5, 7) + "-" + cDate.substring(0, 4));
        dDate = new Date(cDate);
    }
    cDay = dDate.getDate();
    cMon = getMonthString(dDate.getMonth() + 1);
    cYea = dDate.getFullYear();
    return cDay + " " + cMon + " " + cYea;
}


//http://docs.themoviedb.apiary.io/
//themoviedb.org