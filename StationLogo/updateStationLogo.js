//////////////////////////////////////////////////////////////////////////////////////
///                                                                                ///
///  STATION LOGO INSERT SCRIPT FOR FM-DX-WEBSERVER (V3.3a)                        ///
///                                                                                /// 
///  Thanks to Ivan_FL, Adam W, mc_popa, noobish & bjoernv for the ideas and       /// 
///  design!                                                                       ///
///                                                                                ///
///  New Logo Files (png/svg) and Feedback are welcome!                            ///
///  73! Highpoint                                                                 ///
///                                                          last update: 27.08.24 ///
//////////////////////////////////////////////////////////////////////////////////////

///  This plugin only works from web server version 1.2.6!!!

const enableSearchLocal = true; // Enable or disable searching local paths (.../web/logos)
const enableOnlineradioboxSearch = true; // Enable or disable onlineradiobox search if no local or server logo is found.
const updateLogoOnPiCodeChange = true; // Enable or disable updating the logo when the PI code changes on the current frequency. For Airspy and other SDR receivers, this function should be set to false.

// Immediately invoked function expression (IIFE) to encapsulate the loggerPlugin code
(() => {
    
    const plugin_version = '3.3a'; // Plugin Version
    const StationLogoPlugin = (() => {

//////////////// Insert logo code for desktop devices ////////////////////////

// Define the HTML code as a string for the logo container
var LogoContainerHtml = '<div style="width: 5%;"></div> <!-- Spacer -->' +
    '<div class="panel-30 m-0 hide-phone" style="width: 48%" >' +
    '    <div id="logo-container-desktop" style="width: auto; height: 60px; display: flex; justify-content: center; align-items: center; margin: auto;">' +
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
const defaultServerPath = serverpath + 'default-logo.png';
const emptyServerPath = serverpath + 'empty-logo.png';

// Determine the logo image element based on the device type
var logoImage;
if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    logoImage = $('#station-logo-phone');
} else {
    logoImage = $('#station-logo');
}

let currentFrequenz = null;
let logoLoadedForCurrentFrequenz = false;
let logoLoadingInProgress = false;

// Function to update the station logo based on various parameters
function updateStationLogo(piCode, ituCode, Program, frequenz) {
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

    // Check if the frequency has changed
    if (frequenz !== currentFrequenz) {
        currentFrequenz = frequenz;
        logoLoadedForCurrentFrequenz = false; // Reset variable on frequency change
    }

    // Only load the logo if the frequency has changed or if the PI code, ITU code, or Program have changed
    if (!logoLoadedForCurrentFrequenz || (updateLogoOnPiCodeChange && (piCode !== oldPiCode || ituCode !== oldItuCode || Program !== oldProgram))) {
        logoLoadingInProgress = true;
        logoImage.attr('data-picode', piCode);
        logoImage.attr('data-itucode', ituCode);
        logoImage.attr('data-Program', Program);
        logoImage.attr('data-frequenz', frequenz);
        logoImage.attr('title', `Plugin Version: ${plugin_version}`);

        let formattedProgram = Program.toUpperCase().replace(/\s+/g, '');

        // Define paths to check for the logo
        const localPaths = enableSearchLocal ? [
            `${localpath}${piCode}.gif`,
            `${localpath}${piCode}.svg`,
            `${localpath}${piCode}.png`
        ] : [];

        const remotePaths = [
            ...(enableSearchLocal ? [
                `${localpath}${piCode}_${formattedProgram}.svg`,
                `${localpath}${piCode}_${formattedProgram}.png`
            ] : []),
            `${serverpath}${ituCode}/${piCode}.svg`,
            `${serverpath}${ituCode}/${piCode}.png`,
            `${serverpath}${ituCode}/${piCode}_${formattedProgram}.svg`,
            `${serverpath}${ituCode}/${piCode}_${formattedProgram}.png`
        ];

        // Initialize checked paths array
        let checkedPaths = [];

        // Function to check if logo exists at specified paths
        function checkPaths(paths, onSuccess, onFailure, triggerLogoSearch) {
            function checkNext(index) {
                if (index >= paths.length) {
                    if (onFailure) onFailure();
                    logoLoadingInProgress = false;
                    return;
                }

                // Skip path if already checked
                if (checkedPaths.includes(paths[index])) {
                    checkNext(index + 1);
                    return;
                }

                $.ajax({
                    type: "HEAD",
                    url: paths[index],
                    success: function() {
                        logoImage.attr('src', paths[index]).attr('alt', `Logo for station ${piCode}`).css('display', 'block');
                        console.log("Logo found: " + paths[index]);
                        if (onSuccess) onSuccess();
                        if (triggerLogoSearch && Program !== oldProgram) {
                            LogoSearch(piCode, ituCode, Program);
                        }
                        logoLoadedForCurrentFrequenz = true; // Mark that the logo has been loaded
                        logoLoadingInProgress = false;
                    },
                    error: function() {
                        checkedPaths.push(paths[index]); // Mark path as checked
                        checkNext(index + 1);
                    }
                });
            }
            checkNext(0);
        }

        if (piCode !== '?') {
            checkPaths(localPaths, null, function() {
                // Only check remote paths if both piCode and ituCode are valid
                if (piCode !== '?' && ituCode !== '?') {
                    checkPaths(remotePaths, null, function() {
                        // If no logo is found, set default logo
                        logoImage.attr('src', defaultServerPath).attr('alt', 'Default Logo').css('cursor', 'auto');
                        tooltipContainer.css('background-color', '').off('click').css('cursor', 'auto');
                        logoImage.css('cursor', 'default');

                        // If no logo is found, perform the Online Radio Box search
                        if (enableOnlineradioboxSearch) {
                            OnlineradioboxSearch(Program, ituCode, piCode);
                            logoLoadedForCurrentFrequenz = true; // Mark that the logo has been loaded
                        }
                        logoLoadingInProgress = false;
                    }, true);
                } else {
                    logoImage.attr('src', defaultServerPath).attr('alt', 'Default Logo').css('cursor', 'auto');
                    tooltipContainer.css('background-color', '').off('click').css('cursor', 'auto');
                    logoImage.css('cursor', 'default');
                    logoLoadingInProgress = false;
                }
            }, false);
        } else {
            // If piCode is '?', set default logo
            logoImage.attr('src', defaultServerPath).attr('alt', 'Default Logo').css('cursor', 'auto');
            tooltipContainer.css('background-color', '').off('click').css('cursor', 'auto');
            logoImage.css('cursor', 'default');
            logoLoadingInProgress = false;
        }
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

// Call waitForServer to wait for the socket definition
waitForServer();

// Function to perform a Google search for station logos and handle results
function LogoSearch(piCode, ituCode, Program) {
    const currentPiCode = piCode;
    const currentStation = Program;
    const currentituCode = ituCode;
    const tooltipContainer = $('.panel-30');

    // Debugging information
    console.log("currentituCode:", currentituCode);
    console.log("currentStation:", currentStation);

    // If piCode, ituCode, and Program are present, enable these commands
    if (currentituCode !== '' && currentStation !== '') {
        const countryName = getCountryNameByItuCode(ituCode); // Retrieve the country name for the ITU code
        const ituCodeCurrentStation = `${currentStation} ${countryName}`; // Add the country name to the current station
        const searchQuery = `${ituCodeCurrentStation} filetype:png OR filetype:svg Radio&tbs=sbd:1&udm=2`;
        console.log("Search query:", searchQuery);
        tooltipContainer.css('background-color', 'var(--color-2-transparent)').off('click').on('click', () => {
            console.log('Opening URL:', 'https://www.google.com/search?q=' + searchQuery);
            window.open('https://www.google.com/search?q=' + searchQuery, '_blank');
        });

        // Set the cursor to pointer
        logoImage.css('cursor', 'pointer');
        logoLoadedForCurrentFrequenz = true; // Mark that the logo has been loaded
    } else {
        // Set the cursor to auto if no valid search query is formed
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
        const corsAnywhereUrl = 'https://cors-proxy.highpoint2000.synology.me:5001/';
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

    })();
})();
