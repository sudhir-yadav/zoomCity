
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','validation.match','ngCordova'])

.run(function($ionicPlatform,$state,$ionicHistory) {
  $ionicPlatform.ready(function($scope) {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);}
    if (window.StatusBar) { StatusBar.styleDefault();}

    $ionicPlatform.registerBackButtonAction(function () {

       var  m = $state.current.name;
   // alert(m);
   
       if(m == 'login' || m == 'app.category_grid' || m == 'login')
       {
          var r = confirm("Are you sure you want to exit application .?");
          if(r == true)
          {
           navigator.app.exitApp();
          }
       }
       else
       {
           window.history.back();
       }

     }, 100);

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    cache: false,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.category_grid', {
    cache: true,
    url: "/category_grid",
    views: {
      'menuContent': {
        templateUrl: "templates/category_grid.html",
        controller: 'catGridCtrl'
      }
    }
  })

  .state('app.category_listing', {
    cache: true,
    url: "/category_listing/:catGridId/:catgrid_nm",
    views: {
      'menuContent': {
        templateUrl: "templates/category_listing.html",
        controller:'catListingCtrl'
      }
    }
  })


  .state('app.entity_listing', {
    cache: true,
    url: "/entity_listing/:catListId/:categoryLst_nm/:catgrid_nm",
    views: {
      'menuContent': {
        templateUrl: "templates/entity_listing.html",
        controller:'entListingCtrl'
      }
    }
  })

  .state('app.additional_info', {
    cache: true,
    url: "/additional_info/:entity_id/:entity_name",
    views: {
      'menuContent': {
        templateUrl: "templates/additional_info.html",
        controller:"addnInfoCtrl"
      }
    }
  })

  .state('app.sos', {
    cache: true,
    url: "/sos",
    views: {
      'menuContent': {
         templateUrl: "templates/sos.html",
         controller:"sosCtrl"
      }
    }
  })

  .state('app.change_password', {
    cache: true,
    url: "/change_password",
    views: {
      'menuContent': {
         templateUrl: "templates/change_password.html",
         controller:"chngPassCtrl"
      }
    }
  })
   
   .state('app.route_map', {
    cache: false,
    url: "/route_map/:place_name/:map_type/:map_lat/:map_longi",
    views: {
      'menuContent': {
         templateUrl: "templates/route_map.html",
         controller:"mapRouteCtrl"
      }
    }
  })

  .state('login', {
    cache: false,
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  });



  if (localStorage.getItem(app_prefix+"login_status") === null) {
     $urlRouterProvider.otherwise('/login');
   }
   else if(localStorage.getItem(app_prefix+"login_status") == 1)
   {
     $urlRouterProvider.otherwise('/app/category_grid');
     
   }
   else
   {
     $urlRouterProvider.otherwise('/login');
   }

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/login');
});
