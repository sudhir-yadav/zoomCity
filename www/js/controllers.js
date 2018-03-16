angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$ionicLoading,$state,$ionicSideMenuDelegate,$state) {
  // Form data for the login modal
   $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
    };


    $scope.logOut = function (){
     // alert();
                  localStorage.clear();
                  $state.go('login');
     }

    $scope.customFilter = function($val,$divname){
        
          if($val != "" )
          {

                var URL = Serverlocal+'appStartup.php?hdnAction=filterCategory';
                var sending_data = "value='"+$val+"'";
                 $.ajax({
                         url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
                         success: function(response,request)
                         {
                            $ionicLoading.hide();
                            var statusresult = response.success;
                         
                            if(response.success == "true"){

                              $('#'+$divname).show(); 

                              var me = "";
                              for(var i=0;i<response.catfilterList.length;i++)
                              {
                                me +='<a class="item item-icon-right" href="#/app/additional_info/'+response.catfilterList[i].id+'/'+response.catfilterList[i].name+'">'+response.catfilterList[i].name+'<i class="icon fa fa-angle-right" ></i></a>';
                              }
                               $('#'+$divname).html(me); 
                            }
                            else{
                             var me ='<a class="item item-icon-right">No data found</a>'; 
                              $('#'+$divname).show(); 
                              $('#'+$divname).html(me);  
                            } 
                         }
                      });
          }
          else{  $('#'+$divname).hide(); }

     }



})

.controller('chngPassCtrl', function($scope, $ionicLoading,$stateParams,$ionicHistory,$ionicPopup) {
  
  $scope.changepasswordData = {};
  $scope.submitChangepasswordForm = function(isValid) {
    // check to make sure the form is completely valid

     if(isValid) 
     { 

       var u_id = localStorage.getItem(app_prefix+'user_id');
       var newpassword = $scope.changepasswordData.password ;
       var oldpassword = $scope.changepasswordData.oldpass ;

       var URL = Serverlocal+'appStartup.php?hdnAction=changePassword';
       var sending_data = "userId="+u_id+"&password="+newpassword+"&crrpass="+oldpassword+"";


       $ionicLoading.show();
       $.ajax({
               url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
               success: function(response,request)
               {
                  $ionicLoading.hide();
                  var statusresult = response.success;
                  if(response.success == "true"){
                    
                   // console.log(JSON.stringify(response.user_details));
                    alert("Password changed successfully");
  
                  }
                  else{ alert(response.error); } 
               }
            });
      $scope.changepasswordData = {};
      }

  };

})



.controller('sosCtrl', function($scope, $ionicLoading,$stateParams,$ionicHistory,$ionicPopup,$cordovaSms,$cordovaGeolocation) {


  
  $scope.onItemDelete = function(item,contact_id) {
    
   // console.log(contact_id);

      var URL = Serverlocal+'appStartup.php?hdnAction=deleteContact';
       var sending_data = "contactId="+contact_id+"";
       $ionicLoading.show();
       $.ajax({
               url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
               success: function(response,request)
               {
                  $ionicLoading.hide();
                  var statusresult = response.success;
                //  console.log(response);
                  if(response.success == "true"){
                    // $scope.items = response.contacts;
                    $scope.items.splice($scope.items.indexOf(item), 1);
                    // console.log();
                    $ionicLoading.hide();
                   
                  }
                  else{ alert("Sorry could not delete contact"); } 
               }
            });
  }


  $scope.getContacts = function(){
          
       var u_id = localStorage.getItem(app_prefix+'user_id');
      var URL = Serverlocal+'appStartup.php?hdnAction=getContacts';
       var sending_data = "userId="+u_id+"";
       $ionicLoading.show();
       $.ajax({
               url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
               success: function(response,request)
               {
                  $ionicLoading.hide();
                  var statusresult = response.success;
                 // console.log(response);
                  if(response.success == "true"){
                     $scope.items = response.contacts;
                    // console.log(response.contacts);
                  }
                  else{  $scope.items = []; /*alert("Sorry no data found ");*/ } 
               }
            });
   }


$scope.sendMsg  = function(){

  var m = $scope.items;
  
  //console.log(m);

    navigator.geolocation.getCurrentPosition(function(position){
                                                //alert(position.coords.latitude);
                                                var lat = position.coords.latitude;
                                                var longi  = position.coords.longitude;
                                                 

                                                 var message = "http://maps.google.com/?q="+lat+","+longi+"";
                                                 var success = 0;
                                                  for(var i = 0;i < m.length;i++)
                                                    {
                                                        var mobile_no = m[i].contact_no;
                                                        var options = { replaceLineBreaks: false, android: { intent: ''}};
                                                        $cordovaSms.send(mobile_no, message, options).then(function() { success++; }, function(error) {   });
                                                    }  

                                                  if(success > 0)
                                                  {
                                                    alert("message sent successfully");
                                                  } 
                                                  else
                                                  {
                                                     alert("Error while sending message ");
                                                  }

                                                 //$scope.shoadminMap(lat,longi);
                                              },function(){ alert("Error : We do not have sufficient permission to access your location  ");}); 



    

    
};

  
/*  $scope.items = [
    { id: 0 , name:'sudhir' ,phone:'+919574150396' },
    { id: 4 , name:'sudhir',phone:'+919574150396'}
  ];*/

 $scope.saveContact = {}; 

$scope.showPopup = function() {
    
    var myPopup = $ionicPopup.show({
    template: ' <label class="item item-input"><input type="text" ng-model="saveContact.name" placeholder="First Name"></label> <label class="item item-input number_input"><span>+91</span><input  type="number" ng-model="saveContact.phone" placeholder="Mobile no"></label>',
    title: 'Enter Contact Details',
    subTitle: '',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
   
         if (!$scope.saveContact.name && !$scope.saveContact.phone) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
           // console.log($scope.data.state);
             //console.log(m);
            return $scope.saveContact;

          }
        }
      }
    ]
  });

   myPopup.then(function(res) {
         
         if($scope.saveContact.name && $scope.saveContact.phone)
         {
             var u_id = localStorage.getItem(app_prefix+'user_id');
              var URL = Serverlocal+'appStartup.php?hdnAction=insertContacts';
               var sending_data = "userId="+u_id+"&contactNumber="+$scope.saveContact.phone+"&contactName="+$scope.saveContact.name+"";

               $ionicLoading.show();
               $.ajax({
                       url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
                       success: function(response,request)
                       {
                          $ionicLoading.hide();
                          var statusresult = response.success;
                         // console.log(response);
                          if(response.success == "true"){
                             $scope.items = response.contacts;
                            // console.log();
                            alert("Contact added successfully");
                               $ionicLoading.hide();
                           $scope.getContacts();
                          }
                          else{ alert("Error in adding contact "); } 
                       }
                    });
         }      
 

   });


 }

     $scope.shouldShowDelete = false;
     $scope.shouldShowReorder = false;
     $scope.listCanSwipe = true


  })

.controller('catGridCtrl', function($scope, $ionicLoading) {


      $scope.catGridList = {};
      $scope.searchText ={name:""} ;

       var URL = Serverlocal+'appStartup.php?hdnAction=getGridCategory';
       var sending_data = "email='sudhir'";
       $ionicLoading.show();
       $.ajax({
               url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
               success: function(response,request)
               {
                  $ionicLoading.hide();
                  var statusresult = response.success;
                 // console.log(response);
                  if(response.success == "true"){
                    
                      $scope.catGridList = response.catGridList;
                       $ionicLoading.hide();
  
                  }
                  else{ alert("Sorry no data found "); } 
               }
            });


   //console.log( $scope.catGridList);

})

.controller('catListingCtrl', function($scope, $ionicLoading,$stateParams,$ionicHistory) {

  $scope.filterFunction = function(element) {
    return element.name.match(/^Ma/) ? true : false;
  };

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
  
  $scope.CatGridNm = $stateParams.catgrid_nm;

    $scope.catListing = {}
    
    var URL = Serverlocal+'appStartup.php?hdnAction=getCategoryList';
       var sending_data = "catGridId='"+$stateParams.catGridId+"'";
       $ionicLoading.show();
       $.ajax({
               url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
               success: function(response,request)
               {
                  $ionicLoading.hide();
                  var statusresult = response.success;
                  //console.log(response);
                  if(response.success == "true"){
                      $scope.catListing = response.categoryList;
                  }
                  else{ alert("Sorry no data found ");/*$ionicHistory.goBack();*/ } 
               }
            });

   //console.log( $stateParams.catgrid_nm);

})

.controller('entListingCtrl', function($scope, $ionicLoading,$stateParams,$ionicHistory) {

  $scope.filterFunction = function(element) {
    return element.name.match(/^Ma/) ? true : false;
  };

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
  
  $scope.CatListNm = $stateParams.categoryLst_nm;
  $scope.CatGridNm = $stateParams.catgrid_nm;

 /* $scope.entListing =  [{id:'1', name:'John'},
                          {id:'2', name:'Mary'},
                          {id:'4', name:'Adam'},
                          {id:'5', name:'Julie'},
                          {id:'6', name:'Juliette'}];*/
  
  $scope.entListing = {}
    
    var URL = Serverlocal+'appStartup.php?hdnAction=getEntityList';
       var sending_data = "catListId='"+$stateParams.catListId+"'";
       $ionicLoading.show();
       $.ajax({
               url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
               success: function(response,request)
               {
                  $ionicLoading.hide();
                  var statusresult = response.success;
                  //console.log(response);
                  if(response.success == "true"){
                      $scope.entListing = response.categoryList;
                  }
                  else{ alert("Sorry no data found ");/*$ionicHistory.goBack();*/ } 
               }
            });

   //console.log( $stateParams.catgrid_nm);

})

.controller('mapRouteCtrl', function($scope, $ionicLoading,$stateParams,$ionicHistory,$cordovaGeolocation,$state) {

 $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };

//console.log($stateParams);
$state.maptype = $stateParams.map_type;
$scope.marker_name = $stateParams.place_name;

$scope.init = function(){

     $ionicLoading.show({
        template: 'Obtaining location .. '
      });

      directionsDisplay = new google.maps.DirectionsRenderer();
        var myLatlng = new google.maps.LatLng($stateParams.map_lat,$stateParams.map_longi);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            title: 'Destination'
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);   
        var marker = new google.maps.Marker({position: myLatlng,map: map,title: 'Kuber Bhavan '});

         directionsDisplay.setMap(map);
         $ionicLoading.hide();  
 }


   var directionsDisplay = new google.maps.DirectionsRenderer();
   var directionsService = new google.maps.DirectionsService();

  function calcRoute() {

       navigator.geolocation.getCurrentPosition(function(position)
       {
        
        var lat = position.coords.latitude;
        var longi  = position.coords.longitude;

           $ionicLoading.show({template: 'Obtaining location route'});

        var start =""+lat+","+longi+"";
       // var end = "22.302549600000000000,73.195528200000010000";
        var end = ""+$stateParams.map_lat+","+$stateParams.map_longi+"";
        //console.log(end);
      //  var end = "22,73";

        var request = {
          origin: start,
          destination: end,
          optimizeWaypoints: true,
           unitSystem:google.maps.UnitSystem.METRIC,
           durationInTraffic:true,
           provideRouteAlternatives:true,
          travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response); 
            //console.log(response);           
             $ionicLoading.hide();
          }
        });

                                                
      },function(){ 
        alert("Error : We do not have sufficient permission ");
      }); 


      }

        if($state.maptype == 'route'){
           calcRoute();
        }

})

.controller('addnInfoCtrl', function($scope, $ionicLoading,$stateParams,$ionicHistory,$cordovaGeolocation,$state) {

      $scope.myGoBack = function() {
        $ionicHistory.goBack();
      };

    $scope.isAdmin =  localStorage.getItem(app_prefix+'is_admin');
    



    $scope.currentPos = {};
    $scope.additionalInfo = {};
    $scope.additionalInfo.img = {};
    $scope.marker_name = $stateParams.entity_name;

    $scope.getaditionalInfo = function(){

            var URL = Serverlocal+'appStartup.php?hdnAction=getAdditionalInfo';
            var sending_data = "locationId="+$stateParams.entity_id+"";
             $ionicLoading.show();
             $.ajax({
                     url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
                     success: function(response,request)
                     {
                        $ionicLoading.hide();
                        var statusresult = response.success;
                       // console.log(response);
                        if(response.success == "true"){
                          /* alert("Location updated Successfully");*/
                         // console.log(response.getAdditionalInfo[0]);
                          $scope.additionalInfo.desc = response.getAdditionalInfo[0].markers_desc;
                          $scope.additionalInfo.address = response.getAdditionalInfo[0].markers_address;
                          $scope.additionalInfo.contact = response.getAdditionalInfo[0].markers_phone;
                          $scope.additionalInfo.desc = response.getAdditionalInfo[0].markers_desc;
                          $scope.additionalInfo.lat = response.getAdditionalInfo[0].markers_lat;
                          $scope.additionalInfo.longi = response.getAdditionalInfo[0].markers_lng;

                          // console.log(response.getAdditionalInfo) ;
                          for(var i=0;i<response.getAdditionalInfo.length;i++){
                            $scope.additionalInfo.img[i] = response.getAdditionalInfo[i].images_url;
                            //  console.log(response.getAdditionalInfo[i].images_url);
                          }

                            // console.log($scope.additionalInfo.img)   ;
                        }
                        else{ alert("Sorry no data found");} 
                     }
                  });  

            }

    $scope.onSwipeLeft = function(){
      var isadmin =  localStorage.getItem(app_prefix+'is_admin') ;
      //console.log(isadmin);
      if(isadmin == 0)
          {
           // $state.go('login/:experience_id/:context',{experience_id:myIdNumber,context:'login'});
            $state.go('app.route_map',{ place_name:$scope.marker_name,map_type: "smap",map_lat:$scope.additionalInfo.lat,map_longi:$scope.additionalInfo.longi});
          }
     }
 
    $scope.getCurrentLocation = function(){
                                              navigator.geolocation.getCurrentPosition(function(position){
                                                //alert(position.coords.latitude);
                                                var lat = position.coords.latitude;
                                                var longi  = position.coords.longitude;
                                                 $scope.shoadminMap(lat,longi);
                                                 $scope.longi = longi;
                                                 $scope.lat = lat;
                                                 //$scope.shoadminMap(lat,longi);
                                              },function(){ alert("Error : We do not have sufficient permission ");}); 

                                           }
    
    $scope.shoadminMap = function(lat,longi){

          if($scope.isAdmin == 1)
          {
              var directionsDisplay2 = new google.maps.DirectionsRenderer();
              var myLatlng2 = new google.maps.LatLng(lat,longi);
       
              var mapOptions = { center: myLatlng2,zoom: 17, mapTypeId: google.maps.MapTypeId.ROADMAP};
              var map = new google.maps.Map(document.getElementById("map-2"), mapOptions);   

              var marker = new google.maps.Marker({
                      position: myLatlng2,
                      map: map,
                      title: 'Your Location '
                  });
          }
   
    }


    $scope.setCurrentLocation = function(lat,longi)
    {
        if($scope.isAdmin == 1)
          {
             var URL = Serverlocal+'appStartup.php?hdnAction=setLocation';
              var sending_data = "locationId="+$stateParams.entity_id+"&lat="+lat+"&longi="+longi+"";
             $ionicLoading.show();
             $.ajax({
                     url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
                     success: function(response,request)
                     {
                        $ionicLoading.hide();
                        var statusresult = response.success;
                       // console.log(response);
                        if(response.success == "true"){
                           alert("Location updated Successfully");
                        }
                        else{ alert("Error in updating");} 
                     }
                  });

          }
    }

  

  })

.controller('LoginCtrl', function($scope,$ionicLoading,$state,$ionicModal,$ionicPopup) {


     $ionicModal.fromTemplateUrl('templates/registration.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the register modal to close it
  $scope.closeSignup = function() {$scope.modal.hide();};

  // Open the register modal
  $scope.showSignup = function() {$scope.modal.show();}; 

  $scope.loginData = {};
  $scope.registerData = {};

  $scope.submitLoginForm = function(isValid) {
    // check to make sure the form is completely valid

     if(isValid) 
     { 
     // alert("asdds");
        // $state.go('app.category_grid');
     
       var email =  $scope.loginData.email ;
       var password = $scope.loginData.password ;

       var URL = Serverlocal+'appStartup.php?hdnAction=login';
       var sending_data = "email="+email+"&password="+password+"";
       $ionicLoading.show();
       $.ajax({
               url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
               success: function(response,request)
               {
                  $ionicLoading.hide();
                  var statusresult = response.success;
                  if(response.success == "true"){
                    
                   // console.log(JSON.stringify(response.user_details));
                           
                     if(response.user_details.uactive == 0)
                     {
                        alert(" Your account is inactive ");
                     }
                     else
                     {
                        localStorage.setItem(app_prefix+'login_status',1);
                        localStorage.setItem(app_prefix+'user_fullname',response.user_details.ufull_name);
                        localStorage.setItem(app_prefix+'user_email',response.user_details.email);
                        localStorage.setItem(app_prefix+'user_id',response.user_details.uid);

                        if(response.user_details.ugroup == 1)
                          { localStorage.setItem(app_prefix+'is_admin','1');  }
                        else
                          { localStorage.setItem(app_prefix+'is_admin','0'); }

                        var udata = JSON.stringify(response.user_details);
                       

                        localStorage.setItem(app_prefix+'user_data',udata);
                        $state.go('app.category_grid');
                     }
  
                  }
                  else{ alert("Invalid user name or password "); } 
               }
            });
      // $scope.loginData = {}
     }




     

   //   $scope.saveContact = {}; 




  };

   $scope.passchang = {};

  $scope.showPopup = function() {
    
    var myPopup = $ionicPopup.show({
    template: ' <label class="item item-input"><input type="text" ng-model="passchang.email" placeholder="Enter your email "></label>',
    title: 'Enter Your Account Details',
    subTitle: '',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Change Password</b>',
        type: 'button-positive',
        onTap: function(e) {
   
         if (! $scope.passchang.email) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
           // console.log($scope.data.state);
             //console.log(m);
            return  $scope.passchang;

          }
        }
      }
    ]
  });

   
   myPopup.then(function(res) {
         
         if( $scope.passchang.email)
         {
           var email = $scope.passchang.email;


       var URL = Serverlocal+'appStartup.php?hdnAction=forgotPassword';
       var sending_data = "email="+email+"";


       $ionicLoading.show();
       $.ajax({
               url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
               success: function(response,request)
               {
                  $ionicLoading.hide();
                  var statusresult = response.success;
                  if(response.success == "true"){
                    
                   // console.log(JSON.stringify(response.user_details));
                    alert("Password changed successfully and has been sent to your Email Address");
  
                  }
                  else{ alert(response.error); } 
               }
            });
         }      
 

   });


  }





   $scope.submitRegistrationForm = function(isValid) {
    // check to make sure the form is completely valid
     if(isValid) 
     { 
        var email =  $scope.registerData.email ;
        var password = $scope.registerData.password ;
        var fullname = $scope.registerData.fullname ;
        var phone =  $scope.registerData.phone ;

       var URL = Serverlocal+'appStartup.php?hdnAction=register';
       var sending_data = "email="+email+"&password="+password+"&fullname="+fullname+"&phone_no="+phone+"";
       $ionicLoading.show({content: '<ion-spinner class="spinner-energized"></ion-spinner>',
                           animation: 'fade-in',
                           showBackdrop: true,
                           maxWidth: 200,
                           showDelay: 0});
       $.ajax({
               url: URL,type: "GET",dataType: 'jsonp',jsonpCallback: 'zoomCity',data: sending_data,
               success: function(response,request)
               {
                  $ionicLoading.hide();
                    
                  //  console.log(response);

                  var statusresult = response.success;
                  if(response.success == "true")
                  { 
                     $scope.closeSignup;
                    alert("Successfully registered "); 
                    $scope.modal.hide();
                  }
                  else{ alert("Error in Registeration"); } 
               }
            });
       $scope.registerData = {}
     //  $scope.closeSignup
     //  $scope.modal.hide();
     }
  };





});
