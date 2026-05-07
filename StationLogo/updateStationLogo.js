(() => {
//////////////////////////////////////////////////////////////////////////////////////
///                                                                                ///
///  STATION LOGO INSERT SCRIPT FOR FM-DX-WEBSERVER (V4.1)                         ///
///                                                                                /// 
///  Thanks to Ivan_FL, Adam W, mc_popa, noobish & bjoernv for the ideas/design    /// 
///  and AmateurAudioDude for the code customizations!                             ///
///                                                                                ///
///  New Logo Files (png/svg) and Feedback are welcome!                            ///
///  73! Highpoint                                                                 ///
///                                                                                ///
//////////////////////////////////////////////////////////////////////////////////////

const enableSearchLocal = true; 			// Enable or disable searching local paths (.../web/logos)
const enableOnlineradioboxSearch = false; 	// Enable or disable onlineradiobox search if no local or server logo is found.
const updateLogoOnPiCodeChange = true; 		// Enable or disable updating the logo when the PI code changes on the current frequency. For Airspy and other SDR receivers, this function should be set to false.
const enableLogoTransition = true;          // Enable or disable the flip transition animation when the logo changes.

//////////////////////////////////////////////////////////////////////////////////////

const pluginSetupOnlyNotify = true;		
const CHECK_FOR_UPDATES = true;

// Cache Expiry Timer for exactly resolved remote logos (7 Days)
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; 

// Session-level caches (cleared on browser start / page reload)
let sessionRemoteDirCache = {};
window.forceImageReload = false; // Flag for Cache-Busting on Long Press
  
// Define local version and Github settings

const pluginVersion = '4.1';
const pluginName = "Station Logo";
const pluginHomepageUrl = "https://github.com/Highpoint2000/webserver-station-logos/releases";
const pluginUpdateUrl = "https://raw.githubusercontent.com/Highpoint2000/webserver-station-logos/main/StationLogo/updateStationLogo.js";
const countryListUrl = 'https://tef.noobish.eu/logos/scripts/js/countryList.js';

window.countryList = window.countryList || [];
$.getScript(countryListUrl)
  .done(() => {
    console.log('countryList loaded successfully.');

    // If countryList was not globally exported, manually assign it:
    if (typeof countryList !== 'undefined' && (!window.countryList || window.countryList.length === 0)) {
        window.countryList = countryList;
        console.log(`countryList entries loaded: ${window.countryList.length}`);
    }

    window.countryListLoaded = true;
  })
  .fail(() => {
    console.error('Failed to load countryList – falling back to empty list.');
    window.countryList = [];
    window.countryListLoaded = false;
  });


let isTuneAuthenticated;
	
// Function for update notification in /setup
function checkUpdate(setupOnly, pluginName, urlUpdateLink, urlFetchLink) {
	
    if (setupOnly && window.location.pathname !== '/setup') return;
    let pluginVersionCheck = typeof pluginVersion !== 'undefined' ? pluginVersion : typeof plugin_version !== 'undefined' ? plugin_version : typeof PLUGIN_VERSION !== 'undefined' ? PLUGIN_VERSION : 'Unknown';

    // Function to check for updates
    async function fetchFirstLine() {
        const urlCheckForUpdate = urlFetchLink;

        try {
            const response = await fetch(urlCheckForUpdate);
            if (!response.ok) {
                throw new Error(`[${pluginName}] update check HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            const lines = text.split('\n');

            let version;

            if (lines.length > 2) {
                const versionLine = lines.find(line => line.includes("const pluginVersion =") || line.includes("const plugin_version =") || line.includes("const PLUGIN_VERSION ="));
                if (versionLine) {
                    const match = versionLine.match(/const\s+(?:pluginVersion|plugin_version|PLUGIN_VERSION)\s*=\s*['"]([^'"]+)['"]/);
                    if (match) {
                        version = match[1];
                    }
                }
            }

            if (!version) {
                const firstLine = lines[0].trim();
                version = /^\d/.test(firstLine) ? firstLine : "Unknown"; // Check if first character is a number
            }

            return version;
        } catch (error) {
            console.error(`[${pluginName}] error fetching file:`, error);
            return null;
        }
    }

    // Check for updates
    fetchFirstLine().then(newVersion => {
        if (newVersion) {
            if (newVersion !== pluginVersionCheck) {
                let updateConsoleText = "There is a new version of this plugin available";
                
                console.log(`[${pluginName}] ${updateConsoleText}`);
                setupNotify(pluginVersionCheck, newVersion, pluginName, urlUpdateLink);
            }
        }
    });

    function setupNotify(pluginVersionCheck, newVersion, pluginName, urlUpdateLink) {
        if (window.location.pathname === '/setup') {
          const pluginSettings = document.getElementById('plugin-settings');
          if (pluginSettings) {
            const currentText = pluginSettings.textContent.trim();
            const newText = `<a href="${urlUpdateLink}" target="_blank">[${pluginName}] Update available: ${pluginVersionCheck} --> ${newVersion}</a><br>`;

            if (currentText === 'No plugin settings are available.') {
              pluginSettings.innerHTML = newText;
            } else {
              pluginSettings.innerHTML += ' ' + newText;
            }
          }

          const updateIcon = document.querySelector('.wrapper-outer #navigation .sidenav-content .fa-puzzle-piece') || document.querySelector('.wrapper-outer .sidenav-content') || document.querySelector('.sidenav-content');

          const redDot = document.createElement('span');
          redDot.style.display = 'block';
          redDot.style.width = '12px';
          redDot.style.height = '12px';
          redDot.style.borderRadius = '50%';
          redDot.style.backgroundColor = '#FE0830' || 'var(--color-main-bright)'; // Theme colour set here as placeholder only
          redDot.style.marginLeft = '82px';
          redDot.style.marginTop = '-12px';

          updateIcon.appendChild(redDot);
        }
    }
}

if (CHECK_FOR_UPDATES) checkUpdate(pluginSetupOnlyNotify, pluginName, pluginHomepageUrl, pluginUpdateUrl);

//////////////// Insert logo code for desktop devices ////////////////////////

// Define the HTML code as a string for the logo container
var LogoContainerHtml = '<div style="width: 5%;"></div> <!-- Spacer -->' +
    '<div class="panel-30 m-0 hide-phone" style="width: 48%" >' +
    '    <div id="logo-container-desktop" style="width: 215px; height: 60px; display: flex; justify-content: center; align-items: center; margin: auto;">' +
'        <img id="station-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" alt="station-logo-desktop" style="max-width: 140px; max-height: 100%; margin-top: 30px; display: block; cursor: pointer;">' +    '    </div>' +
    '</div>';
// Insert the new HTML code after the named <div>
document.getElementById("ps-container").insertAdjacentHTML('afterend', LogoContainerHtml);

// The new HTML code for the <div> element with the play / stop button
var buttonHTML = '<div class="panel-10 no-bg h-100 m-0 m-right-20 hide-phone" style="width: 80px;margin-right: 20px !important;">' +
                     '<button class="playbutton" aria-label="Play / Stop Button"><i class="fa-solid fa-play fa-lg"></i></button>' +
                  '</div>';
// Select the original <div> element
var originalDiv = document.querySelector('.panel-10');
// Create a new <div> element
var buttonDiv = document.createElement('div');
buttonDiv.innerHTML = buttonHTML;
// Replace the original <div> element with the new HTML
originalDiv.outerHTML = buttonDiv.outerHTML;

//////////////// Insert logo code for mobile devices ////////////////////////

// Select the existing <div> element with the ID "flags-container-phone"
var flagsContainerPhone = document.getElementById('flags-container-phone');

// Create the new HTML code for the replacement
var MobileHTML = `
    <div id="flags-container-phone" class="panel-33 user-select-none">
        <h2 class="show-phone">    
            <div id="logo-container-phone" style="width: auto; height: 70px; display: flex; justify-content: center; align-items: center; margin: auto;">                 
                <img id="station-logo-phone" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" alt="station-logo-phone" style="max-width: 160px; padding: 1px 2px; max-height: 100%; margin-top: 30px; display: block;">    
            </div>
            <br>
            <div class="data-pty text-color-default"></div>
        </h2>
        <h3 style="margin-top:0;margin-bottom:0;" class="color-4 flex-center">
                <span class="data-tp">TP</span>
                <span style="margin-left: 15px;" class="data-ta">TA</span>
                <div style="display:inline-block">
                    <span style="margin-left: 20px;display: block;margin-top: 2px;" class="data-flag"></span>
                </div>
                <span class="pointer stereo-container" style="position: relative; margin-left: 20px;" role="button" aria-label="Stereo / Mono toggle" tabindex="0">
                    <div class="circle-container">
                        <div class="circle data-st circle1"></div>
                        <div class="circle data-st circle2"></div>
                    </div>
                    <span class="overlay tooltip" data-tooltip="Stereo / Mono toggle. <br><strong>Click to toggle."></span>
                </span>
                <span style="margin-left: 15px;" class="data-ms">MS</span>
        </h3>
    </div>
`;

// Replace the HTML content of the <div> element with the new HTML code
flagsContainerPhone.innerHTML = MobileHTML;

const serverpath = 'https://tef.noobish.eu/logos/';
const localpath = '/logos/';
const defaultLocalPath = localpath + 'default-logo.png';
const defaultServerPath = serverpath + 'default-logo.png';

var logoImage;
if (window.innerWidth < 768) {
    logoImage = $('#station-logo-phone');
} else {
    logoImage = $('#station-logo');
}

// ==========================================
// LOGO FLIP TRANSITION (Only on change)
// ==========================================
function changeLogoWithFlip(newSrc, newAlt) {
    // Avoid animation if the exact same logo is loaded again
    if (logoImage.attr('src') === newSrc) return;

    if (!enableLogoTransition) {
        logoImage.attr('src', newSrc);
        if (newAlt) logoImage.attr('alt', newAlt);
        return;
    }

    // Preload the image to ensure it's fully downloaded before starting the animation
    const tempImg = new Image();
    
    tempImg.onload = () => {
        // 1. Rotate logo to 90 degrees (becomes a line / invisible)
        logoImage.css({
            'transition': 'transform 0.2s ease-in',
            'transform': 'rotateY(90deg)'
        });

        // 2. Wait until the rotation is finished (200ms)
        setTimeout(() => {
            // Swap image source while it is invisible (now instantaneous because it's preloaded)
            logoImage.attr('src', newSrc);
            if (newAlt) logoImage.attr('alt', newAlt);

            // 3. Jump to -90 degrees (without animation), 
            // so it continues rotating from the other side
            logoImage.css({
                'transition': 'none',
                'transform': 'rotateY(-90deg)'
            });

            // 4. Wait a few milliseconds so the browser registers the jump
            setTimeout(() => {
                // Rotate the new logo back to 0 degrees (fade in)
                logoImage.css({
                    'transition': 'transform 0.2s ease-out',
                    'transform': 'rotateY(0deg)'
                });
                
                // 5. Clean up CSS after the animation finishes
                setTimeout(() => {
                    logoImage.css({
                        'transition': '',
                        'transform': ''
                    });
                }, 200);
            }, 30);
        }, 200);
    };

    // Fallback: If the image fails to load for some reason, just set it directly to avoid getting stuck
    tempImg.onerror = () => {
        logoImage.attr('src', newSrc);
        if (newAlt) logoImage.attr('alt', newAlt);
    };

    // Trigger the image download
    tempImg.src = newSrc;
}

let currentFrequency = null;
let logoLoadedForCurrentFrequency = false;
let logoLoadingInProgress = false;
let defaultLogoLoadedForFrequency = {}; // New flag object to track default logo for each frequency
let localPiCode = '';

// Helper to force image reload by bypassing browser cache
function getBustedUrl(url) {
    if (window.forceImageReload && url && url !== 'DEFAULT') {
        const sep = url.includes('?') ? '&' : '?';
        return `${url}${sep}cb=${Date.now()}`;
    }
    return url;
}

// ==========================================
// LONG PRESS REFRESH LOGIC
// ==========================================
let pressTimer;
window.isLongPressInProgress = false;

function forceLogoRefresh() {
    const piCode = logoImage.attr('data-picode') || '?';
    const ituCode = logoImage.attr('data-itucode') || '?';
    const Program = logoImage.attr('data-Program') || '';
    const frequency = logoImage.attr('data-frequency');

    console.log(`[Force Refresh] Long press detected. Clearing caches for ITU: ${ituCode}, PI: ${piCode}`);

    // Enable cache busting for the next image load
    window.forceImageReload = true;
    setTimeout(() => { window.forceImageReload = false; }, 3000); // Auto-reset after 3 seconds

    // Visual feedback (blink)
    logoImage.css('opacity', '0.3');
    setTimeout(() => logoImage.css('opacity', '1'), 300);

    // 1. Clear session directory cache for this ITU
    if (ituCode !== '?' && sessionRemoteDirCache[ituCode]) {
        delete sessionRemoteDirCache[ituCode];
        console.log(`[Force Refresh] Cleared session directory cache for ITU: ${ituCode}`);
    }

    // 2. Clear 7-day logo URL cache (including eventual "DEFAULT" cache)
    if (piCode !== '?') {
        let formattedProgram = Program.toUpperCase().replace(/[\/\-\*\+\:\.\,\§\%\&\"!\?\|\>\<\=\)\(\[\]´`'~#\s]/g, '');
        let cleanPiCode = piCode.trim(); 
        const logoUrlCacheKey = `remote_logo_url_v2_${ituCode}_${cleanPiCode}_${formattedProgram}`;
        
        if (localStorage.getItem(logoUrlCacheKey) !== null) {
            localStorage.removeItem(logoUrlCacheKey);
            console.log(`[Force Refresh] Cleared 7-day logo cache key.`);
        }
    }

    // 3. Reset state flags to force update
    logoLoadedForCurrentFrequency = false;
    if(frequency) defaultLogoLoadedForFrequency[frequency] = false;
    logoLoadingInProgress = false;
    
    // Temporarily empty attributes so the update function doesn't skip thinking it's the same station
    logoImage.attr('data-picode', ''); 

    // 4. Trigger reload
    updateStationLogo(piCode.trim(), ituCode, Program, frequency);
}

// Bind long press events to the logos
$('#station-logo, #station-logo-phone').on('mousedown touchstart', function(e) {
    if (e.type === 'mousedown' && e.button !== 0) return; // Only allow left-click
    window.isLongPressInProgress = false;
    pressTimer = setTimeout(() => {
        window.isLongPressInProgress = true;
        forceLogoRefresh();
    }, 800); // 800 milliseconds for a long press
}).on('mouseup mouseleave touchend touchmove', function() {
    clearTimeout(pressTimer);
});
// ==========================================

// Centralized function to load the default logo properly
async function showDefaultLogo(frequency) {
    let finalDefaultPath = defaultServerPath;
    
    if (enableSearchLocal) {
        try {
            const response = await fetch(defaultLocalPath, { method: 'HEAD' });
            if (response.ok) finalDefaultPath = defaultLocalPath;
        } catch(e) {}
    }
    
    changeLogoWithFlip(getBustedUrl(finalDefaultPath), 'Default Logo'); logoImage.css('cursor', 'pointer');
   
    if (frequency) defaultLogoLoadedForFrequency[frequency] = true;
    logoLoadedForCurrentFrequency = true;
    logoLoadingInProgress = false;
    return finalDefaultPath;
}

// Function to check local paths sequentially
async function checkLocalPaths(cleanPiCode, formattedProgram) {
    const priorityFiles = [];
    if (formattedProgram !== "") {
        priorityFiles.push(`${cleanPiCode}_${formattedProgram}.svg`);
        priorityFiles.push(`${cleanPiCode}_${formattedProgram}.png`);
    }
    priorityFiles.push(`${cleanPiCode}.gif`, `${cleanPiCode}.svg`, `${cleanPiCode}.png`);

    for (const fileName of priorityFiles) {
        try {
            let fetchUrl = `${localpath}${fileName}`;
            let fetchOptions = { method: 'HEAD' };

            // Bypass browser HTTP cache if a long-press refresh is active
            if (window.forceImageReload) {
                fetchUrl += `?cb=${Date.now()}`;
                fetchOptions.cache = 'no-store';
            }

            const response = await fetch(fetchUrl, fetchOptions);
            if (response.ok) {
                return `${localpath}${fileName}`;
            }
        } catch(e) { }
    }
    return null;
}

// Function to handle the fallback routine if no local or remote logo is found
async function handleFallbackSearch(Program, ituCode, piCode, frequency, cacheKey) {
    const hasValidProgram = Program && Program.trim() !== '';

    // Only run OnlineRadioBox if we have a valid Program name and PiCode
    if (enableOnlineradioboxSearch && hasValidProgram && piCode !== '?' && !logoLoadedForCurrentFrequency) {
        OnlineradioboxSearch(Program, ituCode, piCode, cacheKey);
        logoLoadedForCurrentFrequency = true; 
        logoLoadingInProgress = false;
        return null;
    }
    
    // If OnlineRadioBox is disabled or Program is empty, cache the failure as "DEFAULT" and show default
    if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), url: "DEFAULT" }));
    }
    
    if (!defaultLogoLoadedForFrequency[frequency] && !logoLoadedForCurrentFrequency) {
        await showDefaultLogo(frequency);
    } else {
        logoLoadingInProgress = false;
    }
    
    return null; 
}

// Function to fetch the directory index of a given ITU code (cached for the session only)
async function getRemoteDirectoryIndex(ituCode) {
    if (sessionRemoteDirCache[ituCode]) {
        return sessionRemoteDirCache[ituCode]; // Use in-memory session cache
    }

    // Fetch the directory listing from the server
    try {
        let fetchUrl = `${serverpath}${ituCode}/`;
        let fetchOptions = {};
        
        // Bypass browser HTTP cache if a long-press refresh is active
        if (window.forceImageReload) {
            fetchUrl += `?cb=${Date.now()}`;
            fetchOptions.cache = 'no-store';
        }

        const response = await fetch(fetchUrl, fetchOptions);
        if (!response.ok) {
            console.warn(`[Remote Directory] Failed to fetch directory for ${ituCode}`);
            return [];
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const links = Array.from(doc.querySelectorAll('a'))
                           .map(a => a.getAttribute('href'))
                           .filter(href => href && (href.toLowerCase().endsWith('.svg') || href.toLowerCase().endsWith('.png')));
        
        const decodedLinks = links.map(link => {
            let cleanLink = link.split('?')[0]; 
            cleanLink = cleanLink.split('/').pop(); 
            return decodeURIComponent(cleanLink).trim(); 
        });

        sessionRemoteDirCache[ituCode] = decodedLinks; // Store in session memory
        console.log(`[Remote Directory] Loaded ${decodedLinks.length} files for ITU: ${ituCode} for this browser session.`);
        return decodedLinks;

    } catch (err) {
        console.error(`[Remote Directory] Error fetching directory index for ${ituCode}:`, err);
        return [];
    }
}

// Function to check remote paths (Maintains 7-Day cache for actual resolved URLs AND defaults)
async function checkRemotePaths(Program, ituCode, piCode, frequency) {
    let formattedProgram = Program.toUpperCase().replace(/[\/\-\*\+\:\.\,\§\%\&\"!\?\|\>\<\=\)\(\[\]´`'~#\s]/g, '');
    let cleanPiCode = piCode.trim(); 
    
    // Check 7-day localStorage cache for this specific station's resolved URL
    const logoUrlCacheKey = `remote_logo_url_v2_${ituCode}_${cleanPiCode}_${formattedProgram}`;
    const cachedLogoDataStr = localStorage.getItem(logoUrlCacheKey);
    const now = Date.now();

    if (cachedLogoDataStr) {
        try {
            const cachedData = JSON.parse(cachedLogoDataStr);
            if (now - cachedData.timestamp < CACHE_EXPIRY_MS) {
                if (frequency && lastLogoState.frequenz && frequency !== lastLogoState.frequenz) return null;
                
                if (cachedData.url === "DEFAULT") {
                    console.log(`[Logo Cache] Known missing logo for this station (cached state). Loading default logo.`);
                    return await showDefaultLogo(frequency);
                } else if (cachedData.url) {
                    console.log(`[Logo Cache] Using 7-day cached URL: ${cachedData.url}`);
                    changeLogoWithFlip(getBustedUrl(cachedData.url), 'Station Logo'); logoImage.css('cursor', 'pointer');
                    logoLoadedForCurrentFrequency = true;
                    return cachedData.url;
                }
            } else {
                localStorage.removeItem(logoUrlCacheKey);
            }
        } catch (e) {
            localStorage.removeItem(logoUrlCacheKey);
        }
    }

    const priorityFiles = [
        `${cleanPiCode}_${formattedProgram}.svg`,
        `${cleanPiCode}_${formattedProgram}.png`,
        `${cleanPiCode}.svg`,
        `${cleanPiCode}.png`
    ];

    try {
        const dirFiles = await getRemoteDirectoryIndex(ituCode);

        for (const fileName of priorityFiles) {
            const foundFile = dirFiles.find(f => f.toLowerCase() === fileName.toLowerCase());
            
            if (foundFile) {
                if (frequency && lastLogoState.frequenz && frequency !== lastLogoState.frequenz) return null;
                
                const remotePath = `${serverpath}${ituCode}/${foundFile}`; 
                console.log(`[Directory Search] Found new logo: ${remotePath}`);
                
                localStorage.setItem(logoUrlCacheKey, JSON.stringify({ timestamp: now, url: remotePath }));

                changeLogoWithFlip(getBustedUrl(remotePath), 'Station Logo'); logoImage.css('cursor', 'pointer');
                logoLoadedForCurrentFrequency = true;
                return remotePath; 
            }
        }

        console.log(`Logo not found in remote directory cache for ${cleanPiCode} / ${formattedProgram}`);
        return await handleFallbackSearch(Program, ituCode, cleanPiCode, frequency, logoUrlCacheKey);

    } catch (error) {
        console.error('Error while checking remote paths:', error);
        return await showDefaultLogo(frequency);
    }
}

// Function to update the station logo based on various parameters
function updateStationLogo(piCode, ituCode, Program, frequency) {
    const tooltipContainer = $('.panel-30');

    if (logoLoadingInProgress) return;

    let oldPiCode = logoImage.attr('data-picode');
    let oldItuCode = logoImage.attr('data-itucode');
    let oldProgram = logoImage.attr('data-Program');

    if (piCode === '' || piCode === null || piCode.includes('?')) piCode = '?';
    if (ituCode === '' || ituCode === null || ituCode.includes('?')) ituCode = '?';
    if (!Program) Program = '';

    // If the PI code has changed, trigger a delay to check again
    if (piCode !== oldPiCode && updateLogoOnPiCodeChange) {
        setTimeout(() => {
            if (piCode !== oldPiCode && updateLogoOnPiCodeChange) {
                logoLoadedForCurrentFrequency = false;
                defaultLogoLoadedForFrequency[frequency] = false;
            }
        }, 1500);
    }

    // Check if the frequency has changed
    if (frequency !== currentFrequency) {
        currentFrequency = frequency;
        logoLoadedForCurrentFrequency = false; 
        defaultLogoLoadedForFrequency[frequency] = false;
    }

    // Only load the logo if the frequency has changed or if the PI code, ITU code, or Program have changed
    if (!logoLoadedForCurrentFrequency || (updateLogoOnPiCodeChange && (piCode !== oldPiCode || ituCode !== oldItuCode || Program !== oldProgram))) {
        logoLoadingInProgress = true;

        // ── NEW: Deadlock protection - automatically release flag after max. 8s ──
        const loadingGuard = setTimeout(() => {
            if (logoLoadingInProgress) {
                console.warn('[Station Logo] logoLoadingInProgress Timeout – resetting flag');
                logoLoadingInProgress = false;
            }
        }, 8000);

        logoImage.attr('data-picode', piCode);
        logoImage.attr('data-itucode', ituCode);
        logoImage.attr('data-Program', Program);
        logoImage.attr('data-frequency', frequency);
        logoImage.attr('title', `Plugin Version: ${pluginVersion}`);

        (async () => {
            try {
                let formattedProgram = Program.toUpperCase().replace(/[\/\-\*\+\:\.\,\§\%\&\"!\?\|\>\<\=\)\(\[\]´`'~#\s]/g, '');
                let cleanPiCode = piCode.toUpperCase().trim();

                if (cleanPiCode !== '?') {
                    if (formattedProgram !== "") {
                        console.log(cleanPiCode + '_' + formattedProgram + '.svg or ' + cleanPiCode + '_' + formattedProgram + '.png');
                    }

                    let localFoundPath = null;

                    if (enableSearchLocal) {
                        localFoundPath = await checkLocalPaths(cleanPiCode, formattedProgram);
                    }

                    if (localFoundPath) {
                        changeLogoWithFlip(getBustedUrl(localFoundPath), `Logo for station ${cleanPiCode}`); logoImage.css('display', 'block');
                        console.log(`[Local Search] Found local logo: ${localFoundPath}`);
                        if (Program !== oldProgram) LogoSearch(cleanPiCode, ituCode, Program);
                        logoLoadedForCurrentFrequency = true;
                        logoLoadingInProgress = false;
                    } else {
                        if (ituCode.includes("USA")) ituCode = 'USA';
                        if (ituCode !== '?') {
                            const remoteLogo = await checkRemotePaths(Program, ituCode, cleanPiCode, frequency);
                            if (remoteLogo && remoteLogo !== "DEFAULT") {
                                if (Program !== oldProgram) LogoSearch(cleanPiCode, ituCode, Program);
                                logoLoadingInProgress = false; // ← was already there
                            }
                            // ── NEW: also release flag on null/DEFAULT ──
                            else {
                                logoLoadingInProgress = false;
                            }
                        } else {
                            await handleFallbackSearch(Program, ituCode, cleanPiCode, frequency, null);
                        }
                    }
                } else {
                    await showDefaultLogo(frequency);
                }
            } finally {
                // ── NEW: Always cancel guard when async block is finished ──
                clearTimeout(loadingGuard);
                // Ensure flag is always released at the end
                if (logoLoadingInProgress) logoLoadingInProgress = false;
            }
        })();
    }
}

let lastLogoState = {
    piCode: null,
    ituCode: null,
    Program: null,
    frequenz: null,
    psCode: null
};

let lastProcessedTime_Station = 0;
let executeStationLogo = false;

const TIMEOUT_DURATION_STATION = 75;

window.addEventListener('DOMContentLoaded', () => {
    executeStationLogo = true;
    connectWebSocket_StationLogo();
});

function connectWebSocket_StationLogo() {
    if (!window.socket || window.socket.readyState === WebSocket.CLOSED || window.socket.readyState === WebSocket.CLOSING) {
        try {
            window.socket = new WebSocket(socketAddress);
            console.log('Station Logo: Attempting to create WebSocket...');
        } catch (e) {
            console.error('Station Logo: Failed to create WebSocket:', e);
            return;
        }
    } else if (window.socket.readyState === WebSocket.OPEN) {
        console.log('Station Logo: WebSocket already open.');
    }

    window.socket.removeEventListener('message', handleStationLogoUpdate);
    window.socket.removeEventListener('close', onSocketClose);
    window.socket.removeEventListener('error', onSocketError);

    window.socket.addEventListener('message', handleStationLogoUpdate);
    window.socket.addEventListener('close', onSocketClose);
    window.socket.addEventListener('error', onSocketError);
}

function onSocketClose() {
    setTimeout(() => {
        console.log('Station Logo: WebSocket closed. Attempting to reconnect...');
        connectWebSocket_StationLogo();
    }, 10000);
}

function onSocketError() {
    console.warn('Station Logo: WebSocket error. Attempting to reconnect...');
    setTimeout(connectWebSocket_StationLogo, 10000);
}

// ── Debounce protection against transient pi='?' from RDS AI Decoder ──
let _pendingDefaultTimer = null;

function handleStationLogoUpdate(event) {
    const now = Date.now();
    if (now - lastProcessedTime_Station < TIMEOUT_DURATION_STATION) return;
    lastProcessedTime_Station = now;

    try {
        const data = JSON.parse(event.data);
        const piCode   = data.pi?.toUpperCase();
        const ituCode  = data.txInfo?.itu?.toUpperCase();
        const Program  = data.txInfo?.tx?.replace(/%/g, '%25');
        const frequenz = data.freq;
        const psCode   = data.ps;

        // ── NEW: Catch transient intermediate states from RDS AI Decoder ──
        // pi='?' on unchanged frequency = short transition state, no real channel change
        const freqChanged  = frequenz !== lastLogoState.frequenz;
        const piIsInvalid  = !piCode || piCode === '?' || piCode.includes('?');
        const psIsEmpty    = !psCode || psCode.trim() === '';

        if (piIsInvalid && !freqChanged && psIsEmpty) {
            // Could be a transient '?' from the RDS AI Decoder.
            // Wait 600ms - if a real PI comes after, it will be used.
            if (_pendingDefaultTimer) clearTimeout(_pendingDefaultTimer);
            _pendingDefaultTimer = setTimeout(() => {
                _pendingDefaultTimer = null;
                // Only load default if there is still no valid PI
                if (lastLogoState.piCode && lastLogoState.piCode !== '?') return;
                updateStationLogo(piCode, ituCode, Program, frequenz);
                lastLogoState = { piCode, ituCode, Program, frequenz, psCode };
            }, 600);
            return;
        }

        // Process real PI immediately - abort pending default
        if (!piIsInvalid && _pendingDefaultTimer) {
            clearTimeout(_pendingDefaultTimer);
            _pendingDefaultTimer = null;
        }

    if (
        executeStationLogo && (
            piCode !== lastLogoState.piCode ||
            ituCode !== lastLogoState.ituCode ||
            Program !== lastLogoState.Program ||
            frequenz !== lastLogoState.frequenz
            // ── psCode REMOVED - PS changes should not trigger a logo reload ──
        )
    ) {
        updateStationLogo(piCode, ituCode, Program, frequenz);
        lastLogoState = { piCode, ituCode, Program, frequenz, psCode };
    }

    } catch (err) {
        console.error('Station Logo: Failed to parse WebSocket message', err);
    }
}


// Function to perform a Google search for station logos and handle results
function LogoSearch(piCode, ituCode, Program) {
    const currentPiCode = piCode;
    const currentStation = Program;
    const currentituCode = ituCode;
    const tooltipContainer = $('.panel-30');

    if (currentituCode !== '' && currentStation !== '' && currentPiCode !== '?') {
        const countryName = getCountryNameByItuCode(ituCode);
        const ituCodeCurrentStation = `${currentStation} ${countryName}`;
        const searchQuery = `${ituCodeCurrentStation} filetype:png OR filetype:svg Radio&tbs=sbd:1&udm=2`;
        console.log("Search query:", searchQuery);

        tooltipContainer
            // Set the default color and (optional) a soft animation
            .css({
                'background-color': 'var(--color-1-transparent)',
                'transition': 'background-color 0.2s ease-in-out' 
            })
            // Remove previous events to prevent multiple executions
            .off('click mouseenter mouseleave')
            // Mouseover (Hover on)
            .on('mouseenter', () => {
                tooltipContainer.css('background-color', 'var(--color-2-transparent)');
            })
            // Mouseout (Hover off)
            .on('mouseleave', () => {
                tooltipContainer.css('background-color', 'var(--color-1-transparent)');
            })
            // Click event
            .on('click', (e) => {
                // Block link opening if this was a long press
                if (window.isLongPressInProgress) {
                    window.isLongPressInProgress = false; 
                    return; 
                }
                
                console.log('Opening URL:', 'https://www.google.com/search?q=' + searchQuery);
                window.open('https://www.google.com/search?q=' + searchQuery, '_blank');
            });

        logoImage.css('cursor', 'pointer');
        logoLoadedForCurrentFrequency = true; 
    } else {
        // If incomplete data, still allow long press cursor
        logoImage.css('cursor', 'pointer');
    }
}

function getCountryNameByItuCode(ituCode) {
    if (!Array.isArray(window.countryList)) return "Country not found";
    
    const country = window.countryList.find(
      item => item.itu_code === ituCode.toUpperCase()
    );
    return country ? country.country : "Country not found";
}


// Function to compare the current program with image titles and select the most similar image
async function compareAndSelectImage(currentStation, imgSrcElements) {
    let minDistance = Infinity;
    let selectedImgSrc = null;

    imgSrcElements.forEach(imgSrcElement => {
        const title = imgSrcElement.getAttribute('title');
        const distance = Math.abs(currentStation.toLowerCase().localeCompare(title.toLowerCase()));

        if (distance < minDistance) {
            minDistance = distance;
            selectedImgSrc = imgSrcElement.getAttribute('src');
        }
    });

    if (selectedImgSrc && !selectedImgSrc.startsWith('https://')) {
        selectedImgSrc = 'https:' + selectedImgSrc;
    }

    return selectedImgSrc;
}

// Function to parse a page, search for logos, and handle results
async function parsePage(url, Program_original, ituCode, piCode, cacheKey) {
    try {
        const corsAnywhereUrl = 'https://cors-proxy.de:13128/';
        const fetchPromise = fetch(`${corsAnywhereUrl}${url}`);
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 2000);
        });

        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (!response.ok) throw new Error('Network response was not ok.');

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const imgSrcElements = doc.querySelectorAll('img[class="station__title__logo"]');

        const selectedImgSrc = await compareAndSelectImage(Program_original, imgSrcElements);

        if (selectedImgSrc) {
            console.log('Selected image source from OnlineRadioBox:', selectedImgSrc);
            
            // Cache successful ORB finding
            if (cacheKey) localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), url: selectedImgSrc }));
            
            changeLogoWithFlip(getBustedUrl(selectedImgSrc), `Logo for station ${piCode}`); logoImage.css('cursor', 'pointer');
            LogoSearch(piCode, ituCode, Program_original);  
        } else {
            throw new Error("No logo found on OnlineRadioBox");
        }
    } catch (error) {
        console.error('Error fetching ORB:', error.message);
        
        // Cache absolute failure as "DEFAULT"
        if (cacheKey) localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), url: "DEFAULT" }));
        
        await showDefaultLogo(currentFrequency);
        if (Program_original && piCode && ituCode) {
            LogoSearch(piCode, ituCode, Program_original);  
        }
    }
}

// Definition of the OnlineradioboxSearch function
async function OnlineradioboxSearch(Program, ituCode, piCode, cacheKey) {
    const currentStation = Program;
    const selectedCountry = countryList.find(item => item.itu_code === ituCode);
    const selectedCountryCode = selectedCountry ? selectedCountry.country_code : null;

    const searchUrl = `https://onlineradiobox.com/search?c=${selectedCountryCode}&cs=${selectedCountryCode}&q=${currentStation.replace(/\s/g, '%20')}`;
    console.log('Search URL:', searchUrl);

    await parsePage(searchUrl, Program, ituCode, piCode, cacheKey);  
}

    // Function to check if the user is logged in as an administrator
    function checkAdminMode() {
        const bodyText = document.body.textContent || document.body.innerText;
        const AdminLoggedIn = bodyText.includes("You are logged in as an administrator.") || bodyText.includes("You are logged in as an adminstrator.");
 
        if (AdminLoggedIn) {
            console.log(`Admin mode found`);
            isTuneAuthenticated = true;
        } 
    }
	
	checkAdminMode(); // Check admin mode

})();