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