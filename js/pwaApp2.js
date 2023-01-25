if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("js/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}

// Install Prompt Banner for iOS
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


var displayMode = null;
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



// Detects if device is on iOS 
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
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
var hideInstallPromotion = () => {
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


var installPWAApp = async () => {
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


// IOS Banner

// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// Checks if should display install popup notification:
if (isIos() && !isInStandaloneMode()) {
    showInstallPromotionIOS();
}

var hideInstallPromotionIOS = () => {
    document.querySelector('.installPromotionDiv').innerHTML = ``;
}