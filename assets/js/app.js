// $('#example').DataTable( {
//         "processing": true,
//         "serverSide": true,
//         "ajax": {
//             "url": "http://localhost:8080/api/cube",
//             "dataType": "json"
//         }
// });
//Anguar app
var app = angular.module('dynForm', []);


app.controller('cubeCreateCtrl', function($scope, $http) {


    $scope.cube = {};

    $http.get('http://localhost:8080/api/cube/search',  { params: { id : "5797d64ed4c6c0325d8b3689" }}).then(function successCallback(response) {

      console.log(response);

       $scope.cube.id = response.data.id;
       $scope.cube.title = response.data.title;
       $scope.cube.description = response.data.description;
       $scope.cube.attributeList = response.data.attributeList;

  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });;


     $scope.saveCube = function () {


      console.log(angular.copy($scope.cube));

       $http({
        method: 'POST',
        url: 'http://localhost:8080/api/cube/save',
        data: angular.copy($scope.cube) ,
        //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(response) {
       console.log(response);

    });




     }


    $scope.lastAddedID = 0;

    $scope.addItem = function (iType) {

      $scope.lastAddedID++;

      var newField = {
            "id" : $scope.lastAddedID,
            "type" : iType,
            "name" : "New field - " + $scope.lastAddedID,
            "value" : null,
            "required" : false,
            "helpText" : null,
            "validate" : false,
            "rule" : null
      };

      if(iType == "multiple" || iType == "check" || iType == "select"){
        newField.options = [{id:1,title:"Option 1", pos:"1"}, {id:2,title:"Option 2", pos:"2"}, {id:3,title:"Option 3", pos:"3"}];
      }

      $scope.cube.attributeList.push(newField);
    }


    $scope.updateValidation = function (field){

      if(field.validation.status == false){
        delete field.validation;
        field.validation = {status: false};
      }

    }


  //deletes particular field on button click
    $scope.deleteField = function (field){

      field_id = field.id;

      //alert(field_id); return;
        for(var i = 0; i < $scope.project.fields.length; i++){
            if($scope.project.fields[i].id == field_id){
                $scope.project.fields.splice(i, 1);
                break;
            }
        }
    }



    // delete particular option
    $scope.deleteOption = function (field,option){
      //console.log(field);return;
        for(var i = 0; i < field.options.length; i++){
            if(field.options[i].id == option.id){
                field.options.splice(i, 1);
                break;
            }
        }
    }


    // add new option to the field
    $scope.addOption = function (field){

     console.log(field);
        if(!field.options)
            field.options = new Array();

        var lastOptionID = 0;

        if(field.options[field.options.length-1])
            lastOptionID = field.options[field.options.length-1].id;

        // new option's id
        var option_id = lastOptionID + 1;

        var newOption = {
            "id" : option_id,
            "title" : "Option " + option_id,
            "pos" : option_id
        };

        // put new option into field_options array
        field.options.push(newOption);
    }




});



app.directive('fieldDirective', function($http, $compile) {

   
    var getTemplateUrl = function(field) {
      return '/forms/design/'+field.type+'.html';
    }

    var linker = function(scope, element, attrs) {
      // GET template content from path

      var templateUrl = getTemplateUrl(scope.field);
      $http.get(templateUrl).success(function(data) {
            element.html(data);
            $compile(element.contents())(scope);
      });
    }

    return {
        restrict: "EA",
        scope: false,
        link: linker,
    };

});






app.directive('previewDirective', function($http, $compile) {
   
    var getTemplateUrl = function(field) {
      return '/forms/preview/'+field.type+'.html';
    }

    var linker = function(scope, element, attrs) {
      // GET template content from path

      var templateUrl = getTemplateUrl(scope.field);
      $http.get(templateUrl).success(function(data) {
            element.html(data);
            $compile(element.contents())(scope);
      });
    }

    return {
        restrict: "EA",
        scope: false,
        link: linker,
    };

});