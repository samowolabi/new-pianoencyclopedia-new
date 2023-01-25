/****************** PWA APP *****************/

function enablePWACode() {
    let installPWAApp;
    let hideInstallPromotion;
    let hideInstallPromotionIOS;

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
            navigator.serviceWorker
                .register("js/serviceWorker.js")
                .then(res => console.log("service worker registered"))
                .catch(err => console.log("service worker not registered", err))
        })
    }

    // Detects if device is on iOS 
    const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent);
    }

    var displayMode = null;

    hideInstallPromotionIOS = () => {
        document.querySelector('.installPromotionDiv').innerHTML = ``;
    }

    let showInstallPromotionIOS = () => {
        let html = `
        <style>
            .iosNotificationBarDiv {
                width: 100%;
                position: fixed;
                z-index: 50;
                bottom: 40px;
                font-family: Arial, sans-serif;
            }
            .iosNotificationBar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #000000;
                background: rgba(255, 255, 255, 1);
                border-radius: 16px;
                padding: 1rem;
                position: relative;
            }
            .iosNotificationBar::before {
                content: '';
                position: absolute;
                top: 80%;
                left: 48%;
                transform: rotate(45deg);
                background-color: #ffffff;
                padding: 10px;
                z-index: 1;
            }
        </style>

        <div class="iosNotificationBarDiv">
            <div class="iosNotificationBar">
                <div>
                    Install Piano Encyclopedia on your phone: Tap
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" style="margin-bottom:-12px" fill="#4693FE" viewBox="0 0 50 50" enable-background="new 0 0 50 50"><path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z"/><path d="M24 7h2v21h-2z"/><path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z"/></svg>
                    and then add to your homescreen.
                </div>
                <a href="javascript: hideInstallPromotionIOS();" style="margin-left: 0.25rem">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 1.5L22.8627 22.5627" stroke="#51526C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.8623 1.5L1.49961 22.5627" stroke="#51526C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </a>
            </div>
        </div>
    `;
        document.querySelector('.installPromotionDiv').innerHTML = html;
    }

    let showInstallPromotion = () => {
        let html = `
        <style>
            .promotionBarDiv {
                opacity:1; 
                transition: 0.6s; 
                width: 100%; 
                background-color:#F5BD41; 
                position:fixed; 
                z-index: 90; 
                left:0; 
                bottom:0; 
                padding: 1.4rem 0; 
                height: auto; 
                display: flex; 
                flex-direction: column; 
                align-items: center;
            }

            .promotionBarDiv h1 {
                text-align: center;
                font-family: Times New Roman;
                font-weight: 800;
                font-size: 28px;
                color: #000000;
                margin: 1.2rem 0;
            }

            @media only screen 
            and (min-width: 320px) 
            and (max-width: 480px) {
                .promotionBarDiv {
                    padding: 1.4rem 1rem; 
                }
            }

            .installPromotionButton {
                cursor: pointer;
                padding: 1.35rem 5rem;
                background-color: #000000;
                color: #ffffff;
                border: 0;
                border-radius: 40px;
                margin-bottom: 1rem;
                font-weight: 600;
                font-size: 1.1em;
                transition: 0.35s;
            }

            .hideInstallPromotionButton {
                cursor: pointer;
                padding: 0.75rem 3.25rem;
                background: transparent;
                color: #4e3600;
                border: 0;
                font-weight: bold;
                transition: 0.35s;
            }

            .installPromotionButton:hover, .hideInstallPromotionButton:hover {
                opacity: 70%;
            }
        </style>

        <div class="promotionBarDiv">
            <h1 style="text-align:center;">Add The Piano Encyclopedia to Home Screen</h1>
            <button class="installPromotionButton" onclick="installPWAApp()">Install</button>
            <button class="hideInstallPromotionButton" onclick="hideInstallPromotion()">Not Now</button>
        </div>
    `;
        document.querySelector('.installPromotionDiv').innerHTML = html;
    }


    let showInstallPromotionIntervalFunc = () => {
        if ((displayMode == null) || (displayMode == 'browser')) {
            if (typeof (document.querySelector('.promotionBarDiv')) != 'undefined' && document.querySelector('.promotionBarDiv') != null) {
            } else {
                showInstallPromotion();
            }
        }
    }

    var myTimer = null;

    hideInstallPromotion = () => {
        let element = document.querySelector('.installPromotionDiv > div')
        element.style.opacity = 0;
        element.addEventListener('transitionend', function (event) {
            document.querySelector('.installPromotionDiv').innerHTML = ``;
        }, false);
        element.addEventListener('webkitTransitionend', function (event) {
            document.querySelector('.installPromotionDiv').innerHTML = ``;
        }, false);

        if (myTimer !== null) {
            clearInterval(myTimer);
        }
        myTimer = setInterval(showInstallPromotionIntervalFunc, 3600000);
    }


    // Initialize deferredPrompt for use later to show browser install prompt.
    var deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt');

        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Optionally, send analytics event that PWA install promo was shown.
        //console.log(`'beforeinstallprompt' event was fired.`);

        if (!isIos()) {
            showInstallPromotionIntervalFunc();
        }
    });


    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
        showInstallPromotionIOS();
    }


    installPWAApp = async () => {
        // Hide the app provided install promotion
        hideInstallPromotion();
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        // Optionally, send analytics event with outcome of user choice
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null;
    }

    if (window.matchMedia) {
        function getPWADisplayMode() {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            if (document.referrer.startsWith('android-app://')) {
                return 'twa';
            } else if (navigator.standalone || isStandalone) {
                return 'standalone';
            }
            return 'browser';
        }

        console.log("Display mode:" + getPWADisplayMode());

        window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
            displayMode = 'browser';
            if (evt.matches) {
                displayMode = 'standalone';
            }
            // Log display mode change to analytics
            console.log('DISPLAY_MODE_CHANGED', displayMode);
        });
    }

}

// Enable PWA code if native=true is passed in the URL
const urlParams = new URLSearchParams(window.location.search);
// urlParams.has('native') && urlParams.get('native') === 'true' && enablePWACode();

if (!urlParams.has('platform')) {
    enablePWACode();
}




/****************** SCRIPT JS *******************/

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




/****************** MODULES JS *******************/

var modules = function() {
	var that = {};
	
	var PlaceholderLoading = function(state){
		try {
			// Placeholder
			let placeholderHTML = `
				<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; background: #000000;">
				<div class="materialPlaceHolder" style="width: 40%; height:60px; margin-top: 5rem;"></div>
				<div class="materialPlaceHolderDiv">
					<div id="" data-button="" class="materialCard" style="">
						<div class="materialCardImg materialPlaceHolder"></div>
						<div class="content materialPlaceHolder" style="margin-top:4px; height:55px;"></div>
					</div>
					<div id="" data-button="" class="materialCard" style="">
						<div class="materialCardImg materialPlaceHolder"></div>
						<div class="content materialPlaceHolder" style="margin-top:4px; height:55px;"></div>
					</div>
					<div id="" data-button="" class="materialCard" style="">
						<div class="materialCardImg materialPlaceHolder"></div>
						<div class="content materialPlaceHolder" style="margin-top:4px; height:55px;"></div>
					</div>
					<div id="" data-button="" class="materialCard" style="">
						<div class="materialCardImg materialPlaceHolder"></div>
						<div class="content materialPlaceHolder" style="margin-top:4px; height:55px;"></div>
					</div>
				</div>
				</div>
			`;

			if (state === 'open') {
				document.querySelector('.homePageSwitchAppsContainer').innerHTML = placeholderHTML;
			}
			if (state === 'close') {
				document.querySelector('.homePageSwitchAppsContainer').innerHTML = '';
			}
		} catch (error) {
			console.error(error);
		}
	}


	// Loader Function
	var ShowHideLoader = function(status){
		try {
			if (status === 'open') {
				document.querySelector('body').style.overflow = "hidden";
				document.querySelector('.loadingIconContainer').classList.add('active');
			}
			if (status === 'close') {
				document.querySelector('body').style.removeProperty('overflow');
				document.querySelector('.loadingIconContainer').classList.remove('active');
			}
		} catch (error) {
			console.error(error);
		}
	}
	
	var FetchFunction = async (baseURL=null, method=null, headersData=null, data=null) => {
		try {
			let headersObject={"Content-Type":"application/x-www-form-urlencoded"};
			headersData&&(headersObject[headersData[0]]=headersData[1]);

			let fetchParams = {
				method: method,
				headers: headersObject,
				cache: 'no-cache',
				referrerPolicy: 'strict-origin-when-cross-origin',
			}
			if (method == 'POST') {
				// Convert object to url encoded string
				fetchParams.body = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
			}

			const response = await fetch(baseURL, fetchParams);
			if (response.status == 500 || response.status == 404) {
				return {status: false, message: "We can't process your request at the moment, Please try again later"}
			} else {
				return await response.json();
			}
		} catch (error) {
			console.error(error);
			return error;
		}
	}
  
	var GenerateAppDataFunction = async () => {
		try {
			// Show Placeholder
			PlaceholderLoading('open');

			let formData = {
				url: window.location.href,
				referrer: document.referrer,
				hs_uid: (localStorage.getItem('hs_uid') || ""),
				hs_uidh: (localStorage.getItem('hs_uidh') || "")
			}
			const response = await FetchFunction('https://pianoencyclopedia.com/en/app-global/server/', 'POST', null, formData);

			// Render App UI
			renderAppUIFunc(response);

			// Open App Details Function
			document.querySelectorAll('.openAppDetailsDiv').forEach(function (value) {
				console.log(value);
				value.addEventListener('click', function (event) {
					// Open App Details Function
					OpenAppDetailsModal(event, response);
				});
			});

			return response;
		} catch (error) {
			console.error(error);
			return error;
		}
	}


	// Render App UI
	var renderAppUIFunc = (response) => {
		// Apps
		let appDivContent = ``;
		response.home.apps.forEach(function (value) {
			function disabledDiv() {
				return value.status === 'disabled' ? ['disabled', ''] : ['', ''];
			}
			function visibleDiv() {
				return value.visible ? '' : 'hide';
			}
			function statusDiv() {
				return value.status === 'locked' ? 'locked' : '';
			}
			function highlightedDiv() {
				return value.highlight ? 'highlighted' : '';
			}

			appDivContent += `
				<div id="${value.url}" data-button="" class="materialCard openAppDetailsDiv ${visibleDiv()} ${statusDiv()} ${highlightedDiv()} ${disabledDiv()[0]}" ${disabledDiv()[1]} data-image="${value.image}" data-title="${value.title}" data-subtitle="${value.subtitle}" data-description="${value.description}" data-url="${value.url}" data-salesUrl="${value.salesUrl}" data-orderUrl="${value.orderUrl}" data-status="${value.status}">
					<div class="materialCardImg">
						<div class="materialCardImgInside" style="background-image: url(${value.image}); background-color: grey;"></div> 
						<div class="materialCardImgOverlay "></div>
						<div class="materialCardMediaType materialThemeLightGold materialThemeFlat">
								<i class="fa fa-graduation-cap" title="Course"></i>
						</div> 
						<div class="materialCardNew materialThemeLightGold materialThemeFlat">
							<span data-progress="0">
								<span data-new="" style="display: inline;"><i>APP</i></span>
								<span data-incomplete="" style="display: none;"><span data-progress-affects-html="">0</span>%</span>
								<span data-complete="" style="display: none;"><i class="fa fa-check"></i></span>
							</span>
						</div>
					</div>
					<div class="content"><h3 class="materialHeader materialThemeDark fontFamilyLato">${value.title}</h3></div>
				</div>
			`;
		});

		let htmlContent = `
			<div><h2 class="materialHeader fontFamilyOptimus">${response.home.title}</h2></div>
			<div class="elementSeparatorOrnament"><img src="https://learn.pianoencyclopedia.com/hydra/HydraCreator/live-editor/modules-assets/app-global/img/Separator.min.png" alt=""></div>
			<div class="homePageSwitchAppsDiv">${appDivContent}</div>
		`;

		// Hide Placeholder
		PlaceholderLoading('close');
		document.querySelector('.homePageSwitchAppsContainer').innerHTML = htmlContent;
	}


	/*
	* @purpose: adds current query params to url
	* Example: Let's say we are at "https://piano.com/old/path/?color=blue&fruit=orange
	* Given url = "https://piano.com/new/path/?tool=hammer&valid=yes#!/some/parameters"
	* Output = "https://piano.com/new/path/?color=blue&fruit=orange&tool=hammer&valid=yes#!/some/parameters"
	* All params will be correctly merged, and hashes will be preserved
	*/
	var addCurrentQueryParamsToUrl = function(url){ 
		//This value usually starts with "?"
		let currentQueryParams = window.location.search; 
		 
		// Check if the iframe URL contains a hash
		if (url.indexOf('#') !== -1) {
			// Split the URL by the hash and insert the query params between the two parts
			let splitURL = url.split('#');
			let beforeHash = splitURL[0];
			let afterHash = splitURL[1];
			return `${beforeHash}${beforeHash.indexOf('?') === -1 ? '?' : '&'}${currentQueryParams.substring(1)}#${afterHash}`;
		} else {
			// Append the query params to the iframe URL
			return`${url}${url.indexOf('?') === -1 ? '' : '&'}${currentQueryParams.substring(1)}`;
		}
	}

	// Load the app in an iframe
	var LoadAppWithIframe = (iframeURL) => {
		try {
			let parentSelectorContainer = 'homePageSwitchAppsContainer';
			let iframeURLWithParams = addCurrentQueryParamsToUrl(iframeURL);
			// Show Loader
			ShowHideLoader('open');
			let htmlContent = `
				<iframe src="${iframeURLWithParams}" title="The Piano Encyclopedia Global App"></iframe>
			`;
			document.querySelector('.' + parentSelectorContainer).innerHTML = htmlContent;

			document.querySelector('.' + parentSelectorContainer + ' iframe').onload = () => {
				console.log('iframe loaded');
				// Hide Loader
				ShowHideLoader('close');
			};
		} catch (error) {
			console.error(error);
		}
	}
	
		
	var OpenAppDetailsModal = (event, response) => {
		try {

			let appButtonLinkFunc = () => {
				if (response.logged) {
					if (event.currentTarget.getAttribute('data-status') === 'locked') {
						return `
						<button class="openAppContentDiv materialButtonOutline materialThemeDark" data-app-content-link="${event.currentTarget.getAttribute('data-salesUrl')}" data-value="close">Read More</button>
						<button class="openAppContentDiv materialButtonFill materialThemeDark" data-app-content-link="${event.currentTarget.getAttribute('data-orderUrl')}" data-value="close">Order Now</button>
					`;
					} else {
						return `
						<button class="openAppContentDiv materialButtonFill materialThemeDark" data-app-content-link="${event.currentTarget.getAttribute('data-url')}" data-value="close">Start Learning</button>
					`;
					}
				} else {
					return `
					<button class="openAppContentDiv materialButtonFill materialThemeDark" data-app-content-link="${event.currentTarget.getAttribute('data-url')}" data-value="close">Start Learning</button>
				`;
				}
			};

			let htmlContent = `
				<section class="materialLightBox">
					<div> 
						<img src="${event.currentTarget.getAttribute('data-image')}" alt="">
						<div class="content">
							<h2 class="materialHeader materialThemeDark fontFamilyOptimus">${event.currentTarget.getAttribute('data-title')}</h2>
							<h3 class="materialHeader materialThemeDark fontFamilyLato">${event.currentTarget.getAttribute('data-subtitle')}</h3>
							<p class="materialParagraph materialThemeDark">
								${event.currentTarget.getAttribute('data-description') !== 'undefined' ? event.currentTarget.getAttribute('data-description') : ''}
							</p>
							<div class="buttonGroup">${appButtonLinkFunc()}</div>
						</div>
					</div>
				</section>
			`;

			let openLightBox = (htmlContent) => {
				dialogRewardPointsAdded.init = function (thisComponent) {
					thisComponent.html(htmlContent);
				}
				//Show dialog
				materialDialog.show("dialogRewardPointsAdded", {});
			}

			openLightBox(htmlContent);


			// Open App Content
			let openAppContentDiv = document.querySelectorAll('.openAppContentDiv');
			openAppContentDiv.forEach(function (value) {
				value.addEventListener('click', function (event) {
					if (response.logged) {
						LoadAppWithIframe(event.currentTarget.getAttribute('data-app-content-link'));
					} else {
						// Save the current URL to the session storage
						sessionStorage.setItem('currentUrl', event.currentTarget.getAttribute('data-app-content-link'));
						// Open the login modal
						materialDialog.show("dialogLogin", { modal: true, hideCallback: function () { } });
					}
				});
			});
		} catch (error) {
			console.error(error);
		}
	}
	 
	 
	const LoginLogoutFunc = async (response) => {
		try {
			if (response.logged) {
				document.querySelector('.homePageSwitchAppsContainer h2').innerHTML = `Hies ${response.name}!<br><br>The Piano Encyclopedia`; // Update Header
				document.querySelector('.materialFloatingButtonContainer .loginLogOutBtn').innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 12H3.62" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.85 8.6499L2.5 11.9999L5.85 15.3499" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

				// Get Session Storage currentUrl
				let currentUrl = sessionStorage.getItem('currentUrl');
				if (currentUrl) {
					// Redirect to currentUrl
					LoadAppWithIframe(currentUrl);
					// Clear Session Storage currentUrl
					sessionStorage.removeItem('currentUrl');
				}
			} else {
				document.querySelector('.homePageSwitchAppsContainer h2').innerHTML = `The Piano Encyclopedia`; // Update Header
				document.querySelector('.materialFloatingButtonContainer .loginLogOutBtn').innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12H14.88" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.65 8.6499L16 11.9999L12.65 15.3499" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
			}

			// Login/Logout Modal Dialog Function
			document.querySelector('.materialFloatingButtonContainer .loginLogOutBtn').addEventListener('click', function (event) {
				if (response.logged) {
					materialDialog.show("dialogLogout", { "modal": true });
				} else {
					materialDialog.show("dialogLogin", { modal: true, hideCallback: function () { } });
				}
			})
		} catch (error) {
			console.log(error);
		}
	}
	
 

	that.LoginLogoutFunc = LoginLogoutFunc; 
	that.OpenAppDetailsModal = OpenAppDetailsModal;
	that.LoadAppWithIframe = LoadAppWithIframe; 
	that.renderAppUIFunc = renderAppUIFunc;
	that.GenerateAppDataFunction = GenerateAppDataFunction;  
	that.PlaceholderLoading = PlaceholderLoading;
	that.ShowHideLoader = ShowHideLoader;
	that.FetchFunction = FetchFunction;
	return that;
}();




/****************** APP JS *******************/

const init = async () => {
    // Generate App Data
    let generateAppDataResponse =  await modules.GenerateAppDataFunction();

    // Login/Logout Text Status Function
    modules.LoginLogoutFunc(generateAppDataResponse);
}

init();