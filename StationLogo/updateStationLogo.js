(() => {
//////////////////////////////////////////////////////////////////////////////////////
///                                                                                ///
///  STATION LOGO INSERT SCRIPT FOR FM-DX-WEBSERVER (V3.4g)                        ///
///                                                                                /// 
///  Thanks to Ivan_FL, Adam W, mc_popa, noobish & bjoernv for the ideas and       /// 
///  design!                                                                       ///
///                                                                                ///
///  New Logo Files (png/svg) and Feedback are welcome!                            ///
///  73! Highpoint                                                                 ///
///                                                   	 last update: 12.04.24     ///
///                                                                                ///
//////////////////////////////////////////////////////////////////////////////////////

const enableSearchLocal = false; 			// Enable or disable searching local paths (.../web/logos)
const enableOnlineradioboxSearch = true; 	// Enable or disable onlineradiobox search if no local or server logo is found.
const updateLogoOnPiCodeChange = true; 		// Enable or disable updating the logo when the PI code changes on the current frequency. For Airspy and other SDR receivers, this function should be set to false.
const updateInfo = true; 					// Enable or disable daily versions check for admin login

//////////////////////////////////////////////////////////////////////////////////////
   
// Define local version and Github settings
const plugin_version = '3.4g';
const plugin_path = 'https://raw.githubusercontent.com/highpoint2000/webserver-station-logos/';
const plugin_JSfile = 'main/StationLogo/updateStationLogo.js';
const plugin_name = 'Station Logo';
	
let isTuneAuthenticated;
	
//////////////// Insert logo code for desktop devices ////////////////////////

// Define the HTML code as a string for the logo container
var LogoContainerHtml = '<div style="width: 5%;"></div> <!-- Spacer -->' +
    '<div class="panel-30 m-0 hide-phone" style="width: 48%" >' +
    '    <div id="logo-container-desktop" style="width: 215px; height: 60px; display: flex; justify-content: center; align-items: center; margin: auto;">' +
    '        <img id="station-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" alt="station-logo-desktop" style="max-width: 140px; padding: 1px 2px; max-height: 100%; margin-top: 30px; display: block; cursor: pointer;">' +
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
        logoImage.attr('title', `Plugin Version: ${plugin_version}`);

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


// Function to wait for the server to define the socket and handle incoming messages
function waitForServer() {
    if (typeof socket !== "undefined") {
        window.socket.addEventListener("message", (event) => {
            let parsedData = JSON.parse(event.data);
            let piCode = parsedData.pi.toUpperCase();
            let ituCode = parsedData.txInfo.itu.toUpperCase();
            let Program = parsedData.txInfo.tx.replace(/%/g, '%25');
            let frequenz = parsedData.freq;
            updateStationLogo(piCode, ituCode, Program, frequenz);
        });
    } else {
        setTimeout(waitForServer, 250);
    }
}

setTimeout(() => {
    waitForServer();
}, 250); 


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


// Function to get the country name by ITU code
function getCountryNameByItuCode(ituCode) {
    const country = countryList.find(item => item.itu_code === ituCode.toUpperCase());
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

// Load the countryList JavaScript from an external source
$.getScript('https://tef.noobish.eu/logos/scripts/js/countryList.js');

  const PluginUpdateKey = `${plugin_name}_lastUpdateNotification`; // Unique key for localStorage

  // Function to check if the notification was shown today
  function shouldShowNotification() {
    const lastNotificationDate = localStorage.getItem(PluginUpdateKey);
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    if (lastNotificationDate === today) {
      return false; // Notification already shown today
    }
    // Update the date in localStorage to today
    localStorage.setItem(PluginUpdateKey, today);
    return true;
  }

  // Function to check plugin version
  function checkPluginVersion() {
    // Fetch and evaluate the plugin script
    fetch(`${plugin_path}${plugin_JSfile}`)
      .then(response => response.text())
      .then(script => {
        // Search for plugin_version in the external script
        const pluginVersionMatch = script.match(/const plugin_version = '([\d.]+[a-z]*)?';/);
        if (!pluginVersionMatch) {
          console.error(`${plugin_name}: Plugin version could not be found`);
          return;
        }

        const externalPluginVersion = pluginVersionMatch[1];

        // Function to compare versions
		function compareVersions(local, remote) {
			const parseVersion = (version) =>
				version.split(/(\d+|[a-z]+)/i).filter(Boolean).map((part) => (isNaN(part) ? part : parseInt(part, 10)));

			const localParts = parseVersion(local);
			const remoteParts = parseVersion(remote);

			for (let i = 0; i < Math.max(localParts.length, remoteParts.length); i++) {
				const localPart = localParts[i] || 0; // Default to 0 if part is missing
				const remotePart = remoteParts[i] || 0;

				if (typeof localPart === 'number' && typeof remotePart === 'number') {
					if (localPart > remotePart) return 1;
					if (localPart < remotePart) return -1;
				} else if (typeof localPart === 'string' && typeof remotePart === 'string') {
					// Lexicographical comparison for strings
					if (localPart > remotePart) return 1;
					if (localPart < remotePart) return -1;
				} else {
					// Numeric parts are "less than" string parts (e.g., `3.5` < `3.5a`)
					return typeof localPart === 'number' ? -1 : 1;
				}
			}

			return 0; // Versions are equal
		}


        // Check version and show notification if needed
        const comparisonResult = compareVersions(plugin_version, externalPluginVersion);
        if (comparisonResult === 1) {
          // Local version is newer than the external version
          console.log(`${plugin_name}: The local version is newer than the plugin version.`);
        } else if (comparisonResult === -1) {
          // External version is newer and notification should be shown
          if (shouldShowNotification()) {
            console.log(`${plugin_name}: Plugin update available: ${plugin_version} -> ${externalPluginVersion}`);
			sendToast('warning important', `${plugin_name}`, `Update available:<br>${plugin_version} -> ${externalPluginVersion}`, false, false);
            }
        } else {
          // Versions are the same
          console.log(`${plugin_name}: The local version matches the plugin version.`);
        }
      })
      .catch(error => {
        console.error(`${plugin_name}: Error fetching the plugin script:`, error);
      });
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

  	setTimeout(() => {

	// Execute the plugin version check if updateInfo is true and admin ist logged on
	if (updateInfo && isTuneAuthenticated) {
		checkPluginVersion();
		}
	}, 200);

})();