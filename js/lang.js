var EN_TextTitle = "Searching For Movies and Actors By SEV";
var ES_TextTitle = "Busqueda de Peliculas y Actores By SEV";
var EN_TextTitleSearch = "Type any word to Start Search by Movies And Actors";
var ES_TextTitleSearch = "Escriba una palabra para empezar la busqueda de Peliculas y Actores";
var EN_TextSearching = "Searching...";
var ES_TextSearching = "Buscando...";
var EN_TextTitleResultList = "Result List";
var ES_TextTitleResultList = "Lista de Resultados";
var EN_TextButtonSearch = "Search";
var ES_TextButtonSearch = "Buscar";
var EN_TextDialog = "Select Movies or Actors for Search";
var ES_TextDialog = "Seleccione Peliculas o Actores Para la Busqueda";
var EN_TextSearch = "Text to Search";
var ES_TextSearch = "Texto a Buscar";
var EN_TextSearchMissing = "Type here a word to search";
var ES_TextSearchMissing = "Digite Aqui el Texto a Buscar";
var EN_TextProblem = "Ops!, There is a Problem!";
var ES_TextProblem = "Ops!, Tenemos un Problema!";
var EN_TextNoResults = "No Results, Try Again";
var ES_TextNoResults = "Sin Resultados, Vuelva a Intentarlo";
var EN_TextResults1 = "There is ";
var ES_TextResults1 = "Se Encontraron ";
var EN_TextResults2 = " Results for ";
var ES_TextResults2 = " Resultados para la Busqueda de ";
var EN_TextResults3 = " Search";
var ES_TextResults3 = "";
var EN_TextMediaTypeMovie = "Movie";
var ES_TextMediaTypeMovie = "Pelicula";
var EN_TextMediaTypeActor = "Actor";
var ES_TextMediaTypeActor = "Actor";


function funcChangueLang($scope) {
    $scope.labelTextSearch = eval($scope.langSelected + "_TextSearch");
    $scope.labelTextTitle = eval($scope.langSelected + "_TextTitle");
    $scope.labelTextTitleSearch = eval($scope.langSelected + "_TextTitleSearch");
    $scope.labelTextSearching = eval($scope.langSelected + "_TextSearching");
    $scope.labelTextTitleListResults = eval($scope.langSelected + "_TextTitleResultList");
    $scope.labelTextButtonSearch = eval($scope.langSelected + "_TextButtonSearch");
}