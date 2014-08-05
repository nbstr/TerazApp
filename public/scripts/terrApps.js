angular.module('app',['AnalyticsEvents'])

.factory('$geo', function($rootScope){

    return {
        position:function (success){
            // check whether browser supports geolocation api
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(success, this.position_error, { enableHighAccuracy: true });
            }
            else{
                console.error("Your browser does not support geolocation. We advise you to update it.");
            }
        },
        position_error:function(error){

            var errors = {
                1: "Permission denied.",
                2: "Position unavailable.",
                3: "Connection timeout."
            };

            console.error("Error:" + errors[error.code]);
        },
        distance:function (p1, p2){
            var point1 = new google.maps.LatLng(p1.lat, p1.lng);
            var point2 = new google.maps.LatLng(p2.lat, p2.lng);
            return parseInt(google.maps.geometry.spherical.computeDistanceBetween(point1, point2));
        }
    }
})
.filter('distance', function () {
return function (input) {
    if (input >= 1000) {
        return (input/1000).toFixed(2);
    } else {
        return Math.floor(input);
    }
}
});

angular.module('AnalyticsEvents', ['angularGoogleAnalytics'])
/*
|--------------------------------------------------------
| GOOGLE ANALYTICS SERVICE
|--------------------------------------------------------
*/
.config(['AnalyticsProvider', function(AnalyticsProvider) {
    //-------------------------------
    // GOOGLE ANALYTICS CONFIGURATION
    //-------------------------------

    // initial configuration
    AnalyticsProvider.setAccount('UA-52373857-2');

    // track all routes (or not)
    AnalyticsProvider.trackPages(true);

    //Optional set domain (Use 'none' for testing on localhost)
    AnalyticsProvider.setDomainName('none');

    // url prefix (default is empty)
    // - for example: when an app doesn't run in the root directory
    //AnalyticsProvider.trackPrefix('mainApp');

    // Use analytics.js instead of ga.js
    AnalyticsProvider.useAnalytics(false);

    // Ignore first page view... helpful when using hashes and whenever your bounce rate looks obscenely low.
    //AnalyticsProvider.ignoreFirstPageLoad(true);

    //Enabled eCommerce module for analytics.js
    //AnalyticsProvider.useECommerce(false);

    //Enable enhanced link attribution
    AnalyticsProvider.useEnhancedLinkAttribution(true);

    //Enable analytics.js experiments
    //AnalyticsProvider.setExperimentId('12345');

    //Set custom cookie parameters for analytics.js
    
    // AnalyticsProvider.setCookieConfig({
    //   cookieDomain: 'daprileproperties.com',
    //   cookieName: 'daprileproperties',
    //   cookieExpires: 20000
    // });

    // change page event name
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');
}])
.directive('fkTrack', function($rootScope){
    /*----------------------------------------------
    | TO USE ON ANY TAG THAT TRIGGERS A GOOGLE ANALYTICS EVENT
    |
    | triggers a function decalred in the $g object that calls
    | a google analytics event tracker like $g.product.buy()
    |
    | attribute fk-track="product.buy"
    | fires: $rootScope.$g.product.buy()
    | - or -
    | optional: add a label after triggered function and ::
    | attribute fk-track="product.buy::id"
    | fires: $rootScope.$g.product.buy(id)
    ----------------------------------------------*/
    return {
        restrict:'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                if(element.attr('fk-cnd') == undefined || element.attr('fk-cnd') == 'track'){
                    if(element.attr('fk-track').indexOf('::') >= 0){
                        var data = element.attr('fk-track').split('::')[0];
                        var label = element.attr('fk-track').split('::')[1];
                        var input = data.split('.');
                        $rootScope.$g[input[0]][input[1]](label);
                    }
                    else{
                        var input = element.attr('fk-track').split('.');
                        $rootScope.$g[input[0]][input[1]]();
                    }
                }
            });
        }
    }
})
.run(function($rootScope, Analytics) {
    //-------------------------------
    // GOOGLE ANALYTICS EVENT TRACKER
    //-------------------------------
    $rootScope.$g_event = function(category, action, label){
        if(label == undefined){
            Analytics.trackEvent(category, action);
        }
        else{
            Analytics.trackEvent(category, action, label);
        }
    };
    //------------------------------
    // GOOGLE ANALYTICS PAGE TRACKER
    //------------------------------
    $rootScope.$g_page = function(page){
        Analytics.trackPage('/'+page);
    };
    //--------------------------------
    // GOOGLE ANALYTICS CLOSE FUNCTION
    //--------------------------------
    $rootScope.$g_close = function(){
        Analytics.trackTrans();
    };
    //---------------------------
    // GOOGLE ANALYTICS FUNCTIONS
    //---------------------------
    $rootScope.$g = {
        // HEADER
        header:{
            merchant_portal:function(){
                $rootScope.$g_event('MERCHANT PORTAL', 'Click on Merchant Portal');
                new_tab('http://54.213.206.26/clients/nascar/public/www/merchant/index.html#/');
            },
            cart:function(){
                $rootScope.$g_event('SHOPPING CART', 'Click on Shopping Cart');
            },
            donation_dollars:function(){
                $rootScope.$g_event('DONATION DOLLARS', 'Click on Donation Dollars');
            }
        },
        // ALL
        nav:{
            shop:function(){
                $rootScope.$g_event('MAIN NAVIGATION', 'Click on SHOP');
            },
            donate:function(){
                $rootScope.$g_event('MAIN NAVIGATION', 'Click on DONATE');
            },
            howitworks:function(){
                $rootScope.$g_event('MAIN NAVIGATION', 'Click on HOW IT WORKS');
            },
            login:function(){
                $rootScope.$g_event('MAIN NAVIGATION', 'Click on LOG IN');
            },
            signin:function(){
                $rootScope.$g_event('MAIN NAVIGATION', 'Click on SIGN IN');
            },
            signup:function(){
                $rootScope.$g_event('MAIN NAVIGATION', 'Click on SIGN UP');
            },
            forgot:function(){
                $rootScope.$g_event('MAIN NAVIGATION', 'Click on FORGOT PASSWORD');
            },
            profile:function(){
                $rootScope.$g_event('MAIN NAVIGATION', 'Click on PROFILE');
            }
        },
        // HOMEPAGE
        home:{
            shop:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on START SHOPPING');
            },
            donate:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on DONATE TO FUNDRAISER');
            },
            create:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on CREATE A FUNDRAISER');
            },
            featured:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on Featured Fundraiser');
            },
            fundraiser1:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on Fundraiser #1');
            },
            fundraiser2:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on Fundraiser #2');
            },
            fundraiser3:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on Fundraiser #3');
            },
            fundraisers:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on See All Fundraisers');
            },
            giftcard1:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on Merchant #1');
            },
            giftcard2:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on Merchant #2');
            },
            giftcard3:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on Merchant #3');
            },
            giftcards:function(){
                $rootScope.$g_event('CTA NAVIGATION', 'Click on See All Gift Cards');
            }
        },
        // SHOP HOME
        shop:{
            pop:function(){
                $rootScope.$g_event('SHOP SECONDARY NAVIGATION', 'Click on MOST POPULAR');
            },
            recent:function(){
                $rootScope.$g_event('SHOP SECONDARY NAVIGATION', 'Click on MOST RECENT');
            },
            cat:function(label){
                $rootScope.$g_event('SHOP SECONDARY NAVIGATION', 'Click on CATEGORY', label);
            },
            giftcard:function(label){
                $rootScope.$g_event('SHOP VISIT GIFT CARDS', 'Click on GIFT CARD', label);
            },
            merchant:function(label){
                $rootScope.$g_event('SHOP PRIMARY NAVIGATION', 'Click on Merchant in Header ', label);
            }
        },
        // SHOP DETAILS
        gc:{
            cart:function(label){
                $rootScope.$g_event('ADD TO CART', 'Click on ADD TO CART', label);
            },
            share:function(label){
                $rootScope.$g_event('SHARE GIFT CARD', 'Click on Share', label);
            },
            conf:function(label){
                $rootScope.$g_event('ADD TO CART CONFIRM', 'Click on OK in confirmation box', label);
            }
        },
        // CHECK OUT
        check:{
            check:function(){
                $rootScope.$g_event('CHECK OUT', 'Click on Check Out');
            },
            remove:function(){
                $rootScope.$g_event('REMOVE', 'Click on Remove');
            },
            submit:function(){
                $rootScope.$g_event('SUBMIT PAYMENT', 'Click on Submit');
            },
            cancel:function(){
                $rootScope.$g_event('SUBMIT PAYMENT', 'Click on Cancel');
            },
            conf:function(){
                $rootScope.$g_event('PAYMENT CONFIRMATION', 'Click on OK');
            }
        },
        // DONATE HOME
        donate:{
            promo:function(label){
                $rootScope.$g_event('VISIT PROMO FUNDRAISER PAGE', 'Click on DONATE in Header Graphic', label);
            },
            start:function(){
                $rootScope.$g_event('START A FUNDRAISER', 'Click on Start a Fundraiser in Header Graphic');
            },
            all:function(){
                $rootScope.$g_event('SEARCH FUNDRAISER', 'Click on All');
            },
            featured:function(){
                $rootScope.$g_event('SEARCH FUNDRAISER', 'Click on Featured');
            },
            ending:function(){
                $rootScope.$g_event('SEARCH FUNDRAISER', 'Click on Ending Soon');
            },
            cat:function(label){
                $rootScope.$g_event('SEARCH FUNDRAISER', 'Click on Category', label);
            },
            visit:function(label){
                $rootScope.$g_event('VISIT FUNDRAISER', 'Click on fundraiser module', label);
            }
        },
        // DONATE DETAIL
        fund:{
            donate:function(label){
                $rootScope.$g_event('DONATE', 'Click on Fund this Project', label);
            },
            share:function(label){
                $rootScope.$g_event('SHARE FUNDRAISER', 'Click on SHARE', label);
            },
            video:function(label){
                $rootScope.$g_event('VIEW VIDEO', 'Click Play', label);
            },
            comment:function(label){
                $rootScope.$g_event('COMMENT', 'Click Add Comment', label);
            }
        },
        // DONATE CHECK OUT
        fund_check:{
            submit:function(label){
                $rootScope.$g_event('SUBMIT DONATION DOLLARS', 'Click OK', label);
            },
            conf:function(label){
                $rootScope.$g_event('CONFIRM DONATION DOLLARS', 'Click Yes', label);
            }
        },
        // MY PROFILE HOME / MY WALLET HOME
        pnav:{
            wallet:function(){
                $rootScope.$g_event('NAVIGATION MY WALLET', 'Click on My Wallet');
            },
            donations:function(){
                $rootScope.$g_event('NAVIGATION MY DONATIONS', 'Click on My Donations');
            },
            fundraisers:function(){
                $rootScope.$g_event('NAVIGATION MY FUNDRAISERS', 'Click on My Fundraisers');
            },
            info:function(){
                $rootScope.$g_event('NAVIGATION MY PERSONAL INFO', 'Click on My Personal Info');
            },
            gc:function(){
                $rootScope.$g_event('NAVIGATION GIFT CARD', 'Cick on Gift Cards sub nav');
            },
            dd:function(){
                $rootScope.$g_event('NAVIGATION DONATION DOLLARS', 'Click on Donation Dollars sub nav');
            }
        },
        // MY WALLET GIFT CARD HOME / MY WALLET DONATION DOLLARS HOME
        wallet:{
            redeem:function(label){
                $rootScope.$g_event('REDEEM GIFT CARD', 'Click on Gift Card for Redemption', label);
            },
            rebuy:function(label){
                $rootScope.$g_event('BUY AGAIN', 'Click on Gift Card for to BUY AGAIN', label);
            },
            donate:function(){
                $rootScope.$g_event('MY WALLET DONATE', 'Click on Donate');
            }
        },
        // MY DONATIONS 
        pdonate:{
            visit:function(label){
                $rootScope.$g_event('MY DONATIONS', 'Click on Fundraiser', label);
            }
        },
        // MY FUNDRAISER
        pfund:{
            edit:function(){
                $rootScope.$g_event('MY FUNDRAISERS - EDIT', 'Click on Edit');
            },
            share:function(){
                $rootScope.$g_event('MY FUNDRAISERS - SHARE', 'Click on Share');
            }
        }
    };
});