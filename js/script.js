// Toggle Navigate Pages
let openCloseFloatingButton = () => {
    document.querySelector('.materialFloatingButtonContainer').classList.toggle('active');
    document.querySelector('.materialFloatingButtonContainer .materialFloatingButton').classList.toggle('active');
}
document.querySelector('.materialFloatingButtonContainer .materialFloatingButton').addEventListener('click', function (event) {
    openCloseFloatingButton();
});
document.querySelector('.materialFloatingButtonContainer .materialFloatingLinkButton').addEventListener('click', function (event) {
    openCloseFloatingButton();
});


// Go Home Button
let backToHomeFunc = () => {
    materialDialog.question("Please confirm.", "Would you like to go to the home screen?", {
        "buttonNo": {
            caption: "No",
            additional: "data-value='close'"
        },
        "buttonYes": {
            caption: "Yes",
            href: `javascript: modules.GenerateAppDataFunction()`, // GenerateAppDataFunction() is a global module function
            class: "goHomeButton",
            //href:`javascript: ${alert()}`,
            additional: "data-value='close'"
        }
    })
}

// Create dialog dynamically
// Append html to end of body
document.querySelector('body').insertAdjacentHTML('beforeend', '<div id="dialogRewardPointsAdded" class="materialDialog appDetailedContentModalDialog" data-on-init-callback="dialogRewardPointsAdded.init(thisComponent)"></div>');
var dialogRewardPointsAdded = {}; 


var plaformCustomBehavior = function() {
	var that = {};
	var hidePremium = function(){
		$("html").addClass("app-hide-premium");
	};
	
	var hideAds = function(){
		$("html").addClass("app-hide-ads");
	};
	
	var hideSignup = function(){
		$("html").addClass("app-hide-signup");
	};
	
	var hideCustomDialogs = function(){
		$("html").addClass("app-custom-dialogs");
	};
	

	
	function getParameterByName(name, url = window.location.href) {
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}
	
	/*
	MAC DESKTOP:
	safari=true
	version=
	versionNumber=
	mac=true
	desktop=true
	webkit=true
	name=safari
	platform=mac
	
	IPHONE:
	nativeMobileWrapper=cordova
	platform=iphone
	cordova=true
	nativeMobile=true
	ios=true
	mobile=true
	iphone=true
	*/
	var getPlatformId = function(){
		var platform = getParameterByName("platform");
		var electron = getParameterByName("electron") ? "-electron" : "";
		var cordova  = getParameterByName("cordova") ? "-cordova" : ""; 
		//appleStore
		return platform + electron + cordova;
	}; 	
	
	var init = function(platform){
		var platform = getPlatformId();
		
		console.log("Platform Custom Behavior", platform);
		
		if(platform == "iphone-cordova" || platform == "mac-electron" ){
			hidePremium();
			hideAds();
			hideSignup();
			hideCustomDialogs(); 
		} 
	}
	
	
	init();
	//that.run = run;
	//return that;	
}();