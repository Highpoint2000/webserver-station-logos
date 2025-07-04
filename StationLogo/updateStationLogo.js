(() => {
//////////////////////////////////////////////////////////////////////////////////////
///                                                                                ///
///  STATION LOGO INSERT SCRIPT FOR FM-DX-WEBSERVER (V3.6a)                        ///
///                                                                                /// 
///  Thanks to Ivan_FL, Adam W, mc_popa, noobish & bjoernv for the ideas/design    /// 
///  and AmateurAudioDude for the code customizations!                             ///
///                                                                                ///
///  New Logo Files (png/svg) and Feedback are welcome!                            ///
///  73! Highpoint                                                                 ///
///                                                   	 last update: 04.07.24     ///
///                                                                                ///
//////////////////////////////////////////////////////////////////////////////////////

const enableSearchLocal = false; 		// Enable or disable searching local paths (.../web/logos)
const enableOnlineradioboxSearch = false; 	// Enable or disable onlineradiobox search if no local or server logo is found.
const updateLogoOnPiCodeChange = true; 		// Enable or disable updating the logo when the PI code changes on the current frequency. For Airspy and other SDR receivers, this function should be set to false.

const pluginSetupOnlyNotify = true;		
const CHECK_FOR_UPDATES = true;; 					

//////////////////////////////////////////////////////////////////////////////////////
   
// Define local version and Github settings

const pluginVersion = '3.6a';
const pluginName = "Station Logo";
const pluginHomepageUrl = "https://github.com/Highpoint2000/webserver-station-logos/releases";
const pluginUpdateUrl = "https://raw.githubusercontent.com/Highpoint2000/webserver-station-logos/main/StationLogo/updateStationLogo.js";
const countryListUrl = 'https://tef.noobish.eu/logos/scripts/js/countryList.js';

window.countryList = window.countryList || [];
$.getScript(countryListUrl)
  .done(() => console.log('countryList loaded successfully.'))
  .fail(() => {
    console.error('Failed to load countryList – falling back to empty list.');
    window.countryList = []; // ensure it's still an array
	
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
                // Any custom code here
                
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
    '        <img id="station-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" alt="station-logo-desktop" style="max-width: 140px; max-height: 100%; margin-top: 30px; display: block; cursor: pointer;">' +
    '    </div>' +
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
                <img id="station-logo-phone" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" alt="station-logo-phone" style="max-width: 160px; padding: 1px 2px; max-height: 100%; margin-top: 0px; display: block;">    
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
const emptyServerPath = serverpath + 'empty-logo.png';

var logoImage;
if (window.innerWidth < 768) {
    logoImage = $('#station-logo-phone');
} else {
    logoImage = $('#station-logo');
}

let currentFrequency = null;
let logoLoadedForCurrentFrequency = false;
let logoLoadingInProgress = false;
let defaultLogoLoadedForFrequency = {}; // New flag object to track default logo for each frequency
let localPiCode = '';

// Store checked paths per frequency
let checkedPathsPerFrequency = {};

// Function to update the station logo based on various parameters
function updateStationLogo(piCode, ituCode, Program, frequency) {
    const tooltipContainer = $('.panel-30');

    if (logoLoadingInProgress) return;

    let oldPiCode = logoImage.attr('data-picode');
    let oldItuCode = logoImage.attr('data-itucode');
    let oldProgram = logoImage.attr('data-Program');

    if (piCode === '' || piCode.includes('?')) {
        piCode = '?';
    }
    if (ituCode === '' || ituCode.includes('?')) {
        ituCode = '?';
    }

    // If the PI code has changed, trigger a delay to check again
    if (piCode !== oldPiCode && updateLogoOnPiCodeChange) {
        // Wait for 1.5 seconds before checking the condition again
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
        logoLoadedForCurrentFrequency = false; // Reset variable on frequency change
        // Clear checked paths for the new frequency
        checkedPathsPerFrequency[frequency] = new Set();
        defaultLogoLoadedForFrequency[frequency] = false;
    }

    // Only load the logo if the frequency has changed or if the PI code, ITU code, or Program have changed
    if (!logoLoadedForCurrentFrequency || (updateLogoOnPiCodeChange && (piCode !== oldPiCode || ituCode !== oldItuCode || Program !== oldProgram))) {
        logoLoadingInProgress = true;
        logoImage.attr('data-picode', piCode);
        logoImage.attr('data-itucode', ituCode);
        logoImage.attr('data-Program', Program);
        logoImage.attr('data-frequency', frequency);
        logoImage.attr('title', `Plugin Version: ${pluginVersion}`);

        let formattedProgram = Program.toUpperCase().replace(/[\/\-\*\+\:\.\,\§\%\&\"!\?\|\>\<\=\)\(\[\]´`'~#\s]/g, '');
        let formattedpiCode = piCode.toUpperCase();
        if (formattedProgram !== "") {
            console.log(formattedpiCode + '_' + formattedProgram + '.svg or ' + formattedpiCode + '_' + formattedProgram + '.png');
        }

        // Define paths to check for the logo
        const localPaths = enableSearchLocal ? [
            `${localpath}${piCode}_${formattedProgram}.svg` !== `${localpath}${piCode}_.svg` ? `${localpath}${piCode}_${formattedProgram}.svg` : null,
            `${localpath}${piCode}_${formattedProgram}.png` !== `${localpath}${piCode}_.png` ? `${localpath}${piCode}_${formattedProgram}.png` : null,
            `${localpath}${piCode}.gif`,
            `${localpath}${piCode}.svg`,
            `${localpath}${piCode}.png`
        ].filter(path => path !== null) : [];

        // Ensure checked paths are initialized for the current frequency
        if (!checkedPathsPerFrequency[frequency]) {
            checkedPathsPerFrequency[frequency] = new Set();
        }

        // Filter out paths that have already been checked for the current frequency
        const pathsToCheck = localPaths.filter(path => !checkedPathsPerFrequency[frequency].has(path));

        // Function to check if the logo exists at specified paths
        function checkPaths(paths, onSuccess, onFailure, triggerLogoSearch) {
            function checkNext(index) {
                if (index >= paths.length) {
                    if (onFailure) onFailure();
                    logoLoadingInProgress = false;
                    return;
                }

                const currentPath = paths[index];

                $.ajax({
                    type: "HEAD",
                    url: currentPath,
                    success: function() {
                        logoImage.attr('src', currentPath).attr('alt', `Logo for station ${piCode}`).css('display', 'block');
                        console.log("Logo found: " + currentPath);
                        if (onSuccess) onSuccess();
                        if (triggerLogoSearch && Program !== oldProgram) {
                            LogoSearch(piCode, ituCode, Program);
                        }
                        logoLoadedForCurrentFrequency = true; // Mark that the logo has been loaded
                        logoLoadingInProgress = false;
                    },
                    error: function() {
                        checkedPathsPerFrequency[frequency].add(currentPath); // Mark path as checked for this frequency
                        checkNext(index + 1);
                    }
                });
            }
            checkNext(0);
        }

        if (piCode !== '?') {
            checkPaths(pathsToCheck, null, function() {
				
				if (ituCode.includes("USA")) {							
					ituCode = 'USA';
				}
				
                // If no local path has the logo, proceed with remote checks
                if (piCode !== '?' && ituCode !== '?') {
                    const remoteLogo = checkRemotePaths(Program, ituCode, piCode, frequency);
                    if (remoteLogo) {
                        if (Program !== oldProgram) {
                            LogoSearch(piCode, ituCode, Program);
                        }
                        logoLoadingInProgress = false;
                        return; // Abort further checks
                    }

                    logoLoadingInProgress = false;
                } else {
                    if (!defaultLogoLoadedForFrequency[frequency]) {
                        if (enableSearchLocal) {
                            // Check if defaultLocalPath exists
                            fetch(defaultLocalPath, { method: 'HEAD' })
                                .then(response => {
                                    if (response.ok) {
                                        // Local file exists
                                        logoImage.attr('src', defaultLocalPath)
                                            .attr('alt', 'Default Local Logo')
                                            .css('cursor', 'auto');
                                    } else {
                                        // Local file does not exist, load from server
                                        logoImage.attr('src', defaultServerPath)
                                            .attr('alt', 'Default Server Logo')
                                            .css('cursor', 'auto');
                                    }
                                    defaultLogoLoadedForFrequency[frequency] = true; // Mark default logo as loaded for this frequency
                                })
                                .catch(error => {
                                    // In case of an error, also load the server logo
                                    console.error("Error checking local path:", error);
                                    logoImage.attr('src', defaultServerPath)
                                        .attr('alt', 'Default Server Logo')
                                        .css('cursor', 'auto');
                                    defaultLogoLoadedForFrequency[frequency] = true;
                                })
                                .finally(() => {
                                    logoLoadingInProgress = false;
                                });
                        } else {
                            // Skip local check and use server logo
                            logoImage.attr('src', defaultServerPath)
                                .attr('alt', 'Default Server Logo')
                                .css('cursor', 'auto');
                            defaultLogoLoadedForFrequency[frequency] = true;
                            logoLoadingInProgress = false;
                        }
                    } else {
                        logoLoadingInProgress = false;
                    }
                }
            }, false);
        } else {
            if (!defaultLogoLoadedForFrequency[frequency]) {
                if (enableSearchLocal) {
                    // Check if defaultLocalPath exists
                    fetch(defaultLocalPath, { method: 'HEAD' })
                        .then(response => {
                            if (response.ok) {
                                // Local file exists
                                logoImage.attr('src', defaultLocalPath)
                                    .attr('alt', 'Default Local Logo')
                                    .css('cursor', 'auto');
                            } else {
                                // Local file does not exist, load from server
                                logoImage.attr('src', defaultServerPath)
                                    .attr('alt', 'Default Server Logo')
                                    .css('cursor', 'auto');
                            }
                            defaultLogoLoadedForFrequency[frequency] = true; // Mark default logo as loaded for this frequency
                        })
                        .catch(error => {
                            // In case of an error, also load the server logo
                            console.error("Error checking local path:", error);
                            logoImage.attr('src', defaultServerPath)
                                .attr('alt', 'Default Server Logo')
                                .css('cursor', 'auto');
                            defaultLogoLoadedForFrequency[frequency] = true;
                        })
                        .finally(() => {
                            logoLoadingInProgress = false;
                        });
                } else {
                    // Skip local check and use server logo
                    logoImage.attr('src', defaultServerPath)
                        .attr('alt', 'Default Server Logo')
                        .css('cursor', 'auto');
                    defaultLogoLoadedForFrequency[frequency] = true;
                    logoLoadingInProgress = false;
                }
            } else {
                logoLoadingInProgress = false;
            }
        }
    }
}

// Function to retrieve remotePaths from logo_directory.html
async function checkRemotePaths(Program, ituCode, piCode, frequency) {

    const logoDirectoryUrl = `${serverpath}/logo_directory.html?nocache=${Date.now()}`;
    let formattedProgram = Program.toUpperCase().replace(/[\/\-\*\+\:\.\,\§\%\&\"!\?\|\>\<\=\)\(\[\]´`'~#\s]/g, '');

    try {
        const response = await fetch(logoDirectoryUrl);
        if (!response.ok) throw new Error(`Failed to fetch logo directory: ${response.statusText}`);

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Locate the folder for the specified ITU code
        const folderElement = [...doc.querySelectorAll('.folder')].find(folder => folder.textContent.trim().endsWith(`./${ituCode}`));

        if (!folderElement) {
            return null; // No additional error message needed if the folder does not exist
        }

        const fileContainer = folderElement.nextElementSibling;
        if (!fileContainer) {
            return null; // No additional error message needed if no files are found
        }

        // Priority order: piCode_currentStation.svg > piCode_currentStation.png > piCode.svg > piCode.png
        const priorityFiles = [
            `${piCode}_${formattedProgram}.svg`,
            `${piCode}_${formattedProgram}.png`,
            `${piCode}.svg`,
            `${piCode}.png`
        ];

        // Search for priority files
        for (const fileName of priorityFiles) {
            const fileElement = [...fileContainer.querySelectorAll('.file a')].find(file => file.textContent === fileName);

            if (fileElement) {
                if (frequency && lastLogoState.frequenz && frequency !== lastLogoState.frequenz) return; // cancel displaying logo if frequency has been changed
                // Prevent duplicate or missing slashes in the URL
                const remotePath = `${serverpath}${ituCode}/${fileElement.textContent}`;
                console.log(`Logo found in remote directory: ${remotePath}`);
                // Logo found, update the image
                logoImage.attr('src', remotePath).attr('alt', 'Station Logo').css('cursor', 'pointer');
				logoLoadedForCurrentFrequency = true;
                return; // Return the found logo URL
            }
        }
					
        // If no logo is found, perform the Online Radio Box search
        if (enableOnlineradioboxSearch && !logoLoadedForCurrentFrequency) {
            OnlineradioboxSearch(Program, ituCode, piCode);
            logoLoadedForCurrentFrequency = true; // Mark that the logo has been loaded
			return;
        }
        
		if (!defaultLogoLoadedForFrequency[frequency] && !logoLoadedForCurrentFrequency) {
            logoImage.attr('src', defaultServerPath).attr('alt', 'Default Logo').css('cursor', 'auto');
            defaultLogoLoadedForFrequency[frequency] = true; // Mark default logo as loaded for this frequency
            console.log("Default logo loaded for frequency:", frequency);
        }
		
		return null; // No logo URL found, return null

    } catch (error) {
        console.error('Error while fetching and parsing logo_directory.html:', error);
        logoImage.attr('src', defaultServerPath).attr('alt', 'Default Logo').css('cursor', 'auto');
        
        // If no logo is found, perform the Online Radio Box search
        if (enableOnlineradioboxSearch) {
            OnlineradioboxSearch(Program, ituCode, piCode);
            logoLoadedForCurrentFrequency = true; // Mark that the logo has been loaded
        }
        return null; // In case of an error, the default logo is also set
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

        if (
            executeStationLogo && (
                piCode !== lastLogoState.piCode ||
                ituCode !== lastLogoState.ituCode ||
                Program !== lastLogoState.Program ||
                frequenz !== lastLogoState.frequenz ||
                psCode !== lastLogoState.psCode
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
    // Store parameters in local variables
    const currentPiCode = piCode;
    const currentStation = Program;
    const currentituCode = ituCode;
    const tooltipContainer = $('.panel-30');

    // If both the ITU code and station name are provided, proceed with the commands
    if (currentituCode !== '' && currentStation !== '') {
        // Retrieve the country name based on the ITU code
        const countryName = getCountryNameByItuCode(ituCode);
        // Combine the station name with the country name
        const ituCodeCurrentStation = `${currentStation} ${countryName}`;
        // Construct the search query for Google with specified file types and additional parameters
        const searchQuery = `${ituCodeCurrentStation} filetype:png OR filetype:svg Radio&tbs=sbd:1&udm=2`;
        console.log("Search query:", searchQuery);

        // Update the tooltip container style and assign a click event handler
        tooltipContainer
            .css('background-color', 'var(--color-2-transparent)')
            .off('click')
            .on('click', () => {
                console.log('Opening URL:', 'https://www.google.com/search?q=' + searchQuery);
                // Open the search URL in a new window or tab
                window.open('https://www.google.com/search?q=' + searchQuery, '_blank');
            });

        // Change the cursor to pointer to indicate the element is clickable
        logoImage.css('cursor', 'pointer');
        logoLoadedForCurrentFrequency = true; // Mark that the logo has been loaded for the current frequency
    } else {
        // Set the cursor to auto if no valid search query can be formed
        logoImage.css('cursor', 'auto');
    }
}

function getCountryNameByItuCode(ituCode) {
    // defensive check—if countryList isn't an array, bail out
    if (!Array.isArray(window.countryList)) {
        return "Country not found";
    }
    const country = window.countryList.find(
      item => item.itu_code === ituCode.toUpperCase()
    );
    return country ? country.country : "Country not found";
}


// Function to compare the current program with image titles and select the most similar image
async function compareAndSelectImage(currentStation, imgSrcElements) {
    let minDistance = Infinity;
    let selectedImgSrc = null;

    // Loop through all found image titles
    imgSrcElements.forEach(imgSrcElement => {
        // Extract the title of the image
        const title = imgSrcElement.getAttribute('title');

        // Calculate the Levenshtein distance between the current program and the image title
        const distance = Math.abs(currentStation.toLowerCase().localeCompare(title.toLowerCase()));

        // Update the selected image URL if the distance is smaller than the current minimum distance
        if (distance < minDistance) {
            minDistance = distance;
            selectedImgSrc = imgSrcElement.getAttribute('src');
        }
    });

    // Add "https://" to the beginning if not present
    if (selectedImgSrc && !selectedImgSrc.startsWith('https://')) {
        selectedImgSrc = 'https:' + selectedImgSrc;
    }

    return selectedImgSrc;
}

// Function to fetch a URL with a timeout
function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const signal = controller.signal;
    setTimeout(() => controller.abort(), timeout);
    return fetch(url, { signal });
}

// Function to parse a page, search for logos, and handle results
async function parsePage(url, Program_original, ituCode, piCode) {
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
            console.log('Selected image source:', selectedImgSrc);
            logoImage.attr('src', selectedImgSrc).attr('alt', `Logo for station ${piCode}`).css('cursor', 'pointer');
            LogoSearch(piCode, ituCode, Program_original);  // Calling LogoSearch with the logo found
        } else {
            throw new Error("No logo found");
        }
    } catch (error) {
        console.error('Error fetching and processing the page:', error);
        if (Program_original && piCode && ituCode) {
            logoImage.attr('src', defaultServerPath).attr('alt', 'Default Logo').css('cursor', 'auto');
            LogoSearch(piCode, ituCode, Program_original);  // Calling LogoSearch even if no logo is found
        } else {
            console.log("Program, PI code, or ITU code missing, no default logo will be loaded.");
        }
    }
}

// Definition of the OnlineradioboxSearch function in a separate module
async function OnlineradioboxSearch(Program, ituCode, piCode) {
    const currentStation = Program;

    const selectedCountry = countryList.find(item => item.itu_code === ituCode);
    const selectedCountryCode = selectedCountry ? selectedCountry.country_code : null;

    const searchUrl = `https://onlineradiobox.com/search?c=${selectedCountryCode}&cs=${selectedCountryCode}&q=${currentStation.replace(/\s/g, '%20')}`;
    console.log('Search URL:', searchUrl);

    await parsePage(searchUrl, Program, ituCode, piCode);  // Forwarding of additional parameters
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
