var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope,$http) {
    $scope.levels = [
        {model : "Level 1",no :1},
        {model : "Level 2",no :2 },
        {model : "Level 3",no :3},
        {model : "Level 4",no :4}
    ];
  
  $scope.dropdown=function(){
	$http({
        method : "GET",
        url : "http://ec2-34-209-125-251.us-west-2.compute.amazonaws.com:6061/level"+$scope.selectedlevel
    }).then(function mySuccess(response) {
        
        var str=response.data;

        if(str=="undefined[] []"){
        	$scope.flag=false;
        	$scope.temp1="";
      		$scope.temp2="";	
      	  	alert("You have not uploaded files");
        }
       	else
       	{   
       	    var i=0;
       	    var u1="/uploads/";
       	    var u2="/uploads/";
       	    str=str.substring(9,str.length);
  		            while(str.charAt(i)!=' ')
      	         {
      		        u1+=str.charAt(i);
      		        i++;
      	         }
      	   u2+=str.substring(i+1,str.length);
      	   $scope.temp1=u1;
      	   $scope.temp2=u2;	
      	   $scope.flag=true;
       	}

     	 }, function myError(response) {
       	alert("error");
      });
	}
});
function showalert(){
	alert("Files Uploaded successfully");
}
