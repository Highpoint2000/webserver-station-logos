//////////////////////////////////////////////////////////////////////////////////////
///                                                                                ///
///  STATION LOGO INSERT SCRIPT FOR FM-DX-WEBSERVER (V3.2)                         ///
///                                                                                /// 
///  Thanks to Ivan_FL, Adam W, mc_popa, noobish & bjoernv for the ideas and       /// 
///  design!  	                                                                   ///
///                                                                                ///
///  New Logo Files (png/svg) and Feedback are welcome!                            ///
///  73! Highpoint                                                                 ///
///                                                          last update: 21.05.24 ///
//////////////////////////////////////////////////////////////////////////////////////


//////////////// Inject Logo Code for Desktop Devices ////////////////////////

// Define the HTML code as a string for Logo Container
var LogoContainerHtml = '<div style="width: 5%;"></div> <!-- Spacer -->' +
    '<div class="panel-30 m-0 hide-phone" style="width: 48%" >' +
    '    <div id="logo-container-desktop" style="width: auto; height: 60px; display: flex; justify-content: center; align-items: center; margin: auto;">' +
    '        <img id="station-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" alt="station-logo-desktop" style="max-width: 140px; padding: 1px 2px; max-height: 100%; margin-top: 30px; display: block; cursor: pointer;">' +
    '    </div>' +
    '</div>';
// Insert the new HTML code after the named <div>
document.getElementById("ps-container").insertAdjacentHTML('afterend', LogoContainerHtml);

// The new HTML for the div element with the Play / Stop button
var buttonHTML = '<div class="panel-10 no-bg h-100 m-0 m-right-20 hide-phone" style="width: 80px;margin-right: 20px !important;">' +
                     '<button class="playbutton" aria-label="Play / Stop Button"><i class="fa-solid fa-play fa-lg"></i></button>' +
                  '</div>';
// Select the original div element
var originalDiv = document.querySelector('.panel-10');
// Create a new div element
var buttonDiv = document.createElement('div');
buttonDiv.innerHTML = buttonHTML;
// Replace the original div element with the new HTML
originalDiv.outerHTML = buttonDiv.outerHTML;

//////////////// Inject Logo Code for Mobile Devices ////////////////////////

// Select the existing <div> element with the ID "flags-container-phone"
var flagsContainerPhone = document.getElementById('flags-container-phone');

// Create the new HTML for the replacement
var MobileHTML = `
    <div id="flags-container-phone" class="panel-33">
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
                <span class="pointer stereo-container" style="position: relative;">
                    <span style="margin-left: 20px;" class="data-st">ST</span>
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

// Determine the logo image element based on device type
var logoImage;
if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    logoImage = $('#station-logo-phone');
} else {
    logoImage = $('#station-logo');
}

function updateStationLogo(piCode, ituCode, Program) {
    const tooltipContainer = $('.panel-30');

    let oldPiCode = logoImage.attr('data-picode');
    let oldItuCode = logoImage.attr('data-itucode');
    let oldProgram = logoImage.attr('data-Program');

    if (piCode === '' || piCode.includes('?')) {
        piCode = '?';
    }
    if (ituCode === '' || ituCode.includes('?')) {
        ituCode = '?';
    }

    if (piCode !== oldPiCode || ituCode !== oldItuCode || Program !== oldProgram) {
        logoImage.attr('data-picode', piCode);
        logoImage.attr('data-itucode', ituCode);
        logoImage.attr('data-Program', Program);

        let formattedProgram = Program.toUpperCase().replace(/\s+/g, '');

        const localPaths = [
            `${localpath}${piCode}.gif`,
            `${localpath}${piCode}.svg`,
            `${localpath}${piCode}.png`
        ];

        const remotePaths = [
            `${localpath}${piCode}_${formattedProgram}.svg`,
            `${localpath}${piCode}_${formattedProgram}.png`,
            `${serverpath}${ituCode}/${piCode}.svg`,
            `${serverpath}${ituCode}/${piCode}.png`,
            `${serverpath}${ituCode}/${piCode}_${formattedProgram}.svg`,
            `${serverpath}${ituCode}/${piCode}_${formattedProgram}.png`
        ];

        function checkPaths(paths, onSuccess, onFailure, triggerLogoSearch) {
            function checkNext(index) {
                if (index >= paths.length) {
                    if (onFailure) onFailure();
                    return;
                }

                $.ajax({
                    type: "HEAD",
                    url: paths[index],
                    success: function() {
                        logoImage.attr('src', paths[index]).attr('alt', `Logo for station ${piCode}`).css('display', 'block').css('cursor', 'pointer');
                        console.log("Logo found: " + paths[index]);
						logoImage.css('cursor', 'default');
                        if (onSuccess) onSuccess();
                        if (triggerLogoSearch && Program !== oldProgram) {
                            LogoSearch(piCode, ituCode, Program);
                        }
                    },
                    error: function() {
                        checkNext(index + 1);
                    }
                });
            }

            checkNext(0);
        }

        // Check local paths first
        checkPaths(localPaths, null, function() {
            // Only check remote paths if both piCode and ituCode are valid
            if (piCode !== '?' && ituCode !== '?') {
                checkPaths(remotePaths, null, function() {
                    // If no logo found at all, set default logo
                    logoImage.attr('src', defaultServerPath).attr('alt', 'Default Logo').css('cursor', 'auto');
					tooltipContainer.css('background-color', '').off('click').css('cursor', 'auto');
					logoImage.css('cursor', 'default');
					// No logo found, perform the online radiobox search
					OnlineradioboxSearch(Program, ituCode, piCode);
                }, true);
            } else {
                logoImage.attr('src', defaultServerPath).attr('alt', 'Default Logo').css('cursor', 'auto');
				tooltipContainer.css('background-color', '').off('click').css('cursor', 'auto');
				logoImage.css('cursor', 'default');
            }
        }, false);
    }
}

function waitForServer() {
    if (typeof socket !== "undefined") {
        window.socket.addEventListener("message", (event) => {
            let parsedData = JSON.parse(event.data);
            let piCode = parsedData.pi;
            let ituCode = parsedData.txInfo.itu;
            let Program = parsedData.txInfo.station.replace(/%/g, '%25');
            updateStationLogo(piCode, ituCode, Program);
        });
    } else {
        setTimeout(waitForServer, 250);
    }
}

// Call the waitForServer to start waiting for socket to be defined
waitForServer();

function LogoSearch(piCode, ituCode, Program) {
    const currentPiCode = piCode;
    const currentStation = Program;
    const currentituCode = ituCode;
    const tooltipContainer = $('.panel-30');
    tooltipContainer.css('background-color', '').off('click').css('cursor', 'auto');
	

    // Debugging information
    console.log("currentituCode:", currentituCode);
    console.log("currentStation:", currentStation);

    // If piCode, ituCode, and Program are present, activate these commands
    if (currentituCode !== '' && currentStation !== '') {
        const countryName = getCountryNameByItuCode(ituCode); // Retrieve country name for the ITU code
        const ituCodeCurrentStation = `${currentStation} ${countryName}`; // Add country name to currentStation
        const searchQuery = `${ituCodeCurrentStation} filetype:png OR filetype:svg Radio&tbs=sbd:1&udm=2`;
        console.log("Search Query:", searchQuery);
        tooltipContainer.css('background-color', 'var(--color-2)').off('click').on('click', () => {
            console.log('Opening URL:', 'https://www.google.com/search?q=' + searchQuery);
            window.open('https://www.google.com/search?q=' + searchQuery, '_blank');
        });
		logoImage.css('cursor', 'pointer');
    }
}

// Function to query the country name using the ITU code
function getCountryNameByItuCode(ituCode) {
    const country = countryList.find(item => item.itu_code === ituCode.toUpperCase());
    return country ? country.country : "Country not found";
}

// Function to compare the current Program with the image titles and select the most similar image
async function compareAndSelectImage(currentStation, imgSrcElements) {
    let minDistance = Infinity;
    let selectedImgSrc = null;

    // Loop through all found image titles
    imgSrcElements.forEach(imgSrcElement => {
        // Extract the title of the image
        const title = imgSrcElement.getAttribute('title');

        // Calculate the Levenshtein distance between the current Program and the image title
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

function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const signal = controller.signal;
    setTimeout(() => controller.abort(), timeout);
    return fetch(url, { signal });
}

async function parsePage(url, Program_original, ituCode, piCode) {
    try {
        const corsAnywhereUrl = 'http://89.58.28.164:13128/';
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
            console.log('Die ausgewählte Bildquelle ist:', selectedImgSrc);
            logoImage.attr('src', selectedImgSrc).attr('alt', `Logo for station ${piCode}`).css('cursor', 'pointer');
            LogoSearch(piCode, ituCode, Program_original);  // Calling LogoSearch with the logo found
        } else {
            throw new Error("Kein Logo gefunden");
        }
    } catch (error) {
        console.error('Fehler beim Abrufen und Verarbeiten der Seite:', error);
        if (Program_original && piCode && ituCode) {
            logoImage.attr('src', defaultServerPath).attr('alt', 'Default Logo').css('cursor', 'auto');
            LogoSearch(piCode, ituCode, Program_original);  // Calling LogoSearch even if no logo is found
        } else {
            console.log("Program, PI-Code oder ITU-Code fehlen, kein Default-Logo wird geladen.");
        }
    }
}

// Definition of the OnlineradioboxSearch function in a separate module
async function OnlineradioboxSearch(Program, ituCode, piCode) {
    const currentStation = Program;

    const selectedCountry = countryList.find(item => item.itu_code === ituCode);
    const selectedCountryCode = selectedCountry ? selectedCountry.country_code : null;

    const searchUrl = `https://onlineradiobox.com/search?c=${selectedCountryCode}&cs=${selectedCountryCode}&q=${currentStation.replace(/\s/g, '%20')}`;
    console.log('Die Such-URL ist:', searchUrl);

    await parsePage(searchUrl, Program, ituCode, piCode);  // Forwarding of additional parameters
}

// Load the countryList JavaScript from an external source
$.getScript('https://tef.noobish.eu/logos/scripts/js/countryList.js');
