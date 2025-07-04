# Station Logo Plugin for [FM-DX-Webserver](https://github.com/NoobishSVK/fm-dx-webserver)

This script provides a logo for identified radio stations.

![image](https://github.com/user-attachments/assets/db9c267c-bf2b-45bd-9c99-d030a80e60f8)


## v3.6a:

- Revised socket logic to avoid duplicate connections (thanks to AmateurAudioDude)

## Installation notes:

Compatible from webserver version 1.2.6 !!! Older webserver versions take the Plugin Version 3.2a, 3.2b or 3.2c !!!

1. [Download](https://github.com/Highpoint2000/webserver-station-logos/releases) the last repository as a zip
2. Unpack the Station Logo.js and the Station Logo folder with the updateStationLogo-js into the web server plugins folder (..fm-dx-webserver-main\plugins) [image](https://github.com/Highpoint2000/webserver-station-logos/assets/168109804/e0a6fd0e-a70e-4624-9487-b96df144d703)
3. Restart the server
4. coming soon:  Activate the plugin it in the settings

#### For anyone who would like to receive their future updates automatically, please install the Always on Update (AOU) version from [here](https://tef.noobish.eu/logos/scripts/StationLogo_AOU_Version.zip). This script always gets the current code from the logo server. If you have installed the AOU version before May 7th, 2024, you will have to clear the cache regularly to use the latest version of the logo plugin. This bug has been fixed in the current [download](https://tef.noobish.eu/logos/scripts/StationLogo_AOU_Version.zip) file!

## Configuration options:

The following variables can be changed in the header of the script:

    enableSearchLocal = false; 		// Enable or disable searching local paths (.../web/logos)
    enableOnlineradioboxSearch = true; 	// Enable or disable onlineradiobox search if no local or server logo is found.
    updateLogoOnPiCodeChange = true; 	// Enable or disable updating the logo when the PI code changes on the current frequency. For Airspy and other SDR receivers, this function should be set to false.
    updateInfo = true; 			// Enable or disable daily versions check for admin login


## Important notes: 

In order for logos to be displayed, your own location in the web server must also be correctly entered and activated! Otherwise, the system cannot receive an ITU code of the sender location to display the logo. The correct station logo should then be loaded during RDS recognition, provided a specific logo has already been created on our [server](https://tef.noobish.eu/logos/logo_preview.html) or it is located in the local /web/logos folder. LOGOS with the same PI code can be distinguished by adding the program name from the TX field. To do this, rename the file to PICODE_PROGRAMNAME.png/.svg, all in capital letters and without spaces or special characters e.g. "9210" & "DR P1/DR P2" ---> 9210_DRP1DRP2.png . Missing logos will be taken over by onlineradiobox.com (from version 3.1).
For missing or incorrect logos, please use the integrated Google search function. This is activated automatically (the logo box is highlighted) if a country code and a program name can also be retrieved from the database for a PI code. In most cases, you can find the right logo this way. Many logos are in PNG or SVG format with a transparent background. These fit in very well with the look of the web server. For the PNG format, a small version is often sufficient, as we currently process a maximum of 140 pixels wide and 60 pixels high. Basically, the script inserts the logos appropriately into the existing window. If you create logos for different countries, please place them in separate folders that you are welcome to use with the ITU names. Then just send me the files or a download link via [email](mailto:highpoint2000@googlemail.com) or via our [Discord Community](https://discord.gg/fmdx). I will upload them to our [server](https://tef.noobish.eu/logos/logo_preview.html) as soon as possible.

## Disclaimer: 
If a logo used in the plugin violates copyright, please let [me](mailto:highpoint2000@googlemail.com) know. I will remove it immediately.

## History:

### v3.6:

- automatic reconnect of the websocket built in (this could eliminate the hanging logo)

### v3.5:

- Fixed logo display for identified US Stations
- Updates are now displayed in Setup

### v3.4g:

- Logo display now also in landscape format on smartphones (side reload required!)

### v3.4f:

- Google Image Search opens in a new window

### v3.4e:

- Added local search for default-logo.png

### v3.4d:

- Added console output for Program Name Search (PI_PROGRAMNAME.svg/.png)
- Problems with quick PI code changes fixed 
- minor code optimizations

### v3.4c:
- Removed unnecessary console output


### v3.4b:
- Added support for Proxy and VPN-Connections


### v3.4a:
- Added Program Name Search (PI_PROGRAMNAME.svg/.png) for local directory 
- Implemented handling of special characters in program names  (Everything must be in capital letters and without spaces or special characters!)

### v3.4:
- Server request via directory file (faster and no error messages)
- Daily update check for admin login installed

### v3.3b:
- Improved cors proxy mechanism
- Query order adjusted
- small design adjustment

### v3.3a:
- Built-in switch to deactivate local search (reduction of error messages in the console!)

### v3.3:
- compatible with changed websocket data in version 1.2.6

### v3.2c (only works from web server version 1.2.5!!!):
- Design adjustment for transparent background
- Stereo toggle problem fixed on mobile devices
- mouseover show plugin version

### v3.2b (only works from web server version 1.2.4!!!):
- Design correction for stereo symbol in mobile layout
- CORS PROXY HTTPS Support for onlineradiobox.com 

### v3.2a
- Added switch for alternative search at onlineradiobox.com
- Added switch for logo reload when PI code changes, recommended for SDR receivers (e.g.: Airspy)

### v3.2
- Switching the query process to JSON
- Reduction of query values
- Stability and performance improvements
- Bug fixing
- Countrylist (ITU codes) were moved to the server

### v3.12a
- program name logo query in capital letters
- itu code additions
- code optimization & bug fixing

### v3.12
- additional query for PI code and program name (Local + Server)

### v3.11
- Play/Stop button back to original size
- Problem with logo retrieval from onlineradiobox.com fixed

### v3.1
- Instead of Lyngsat, missing logos are now downloaded from onlineradiobox.com
- Fixed the disappearance of the PS identifier
- remove tooltip
- code optimizations

### v3.0
- additional logo query via the Lyngsat website
- fixed missing display of TP/TA/MO/ST on mobile devices

### v2.25c
- local folder "/web/logos" is prioritized
- further optimized Google Search Function (e.g. country name added)

### v2.25b
- Tooltip has been bugfixed

### v2.25a
- optimized Google Search Function (ITU code added)
  
### v2.25
- Google Search Function
  -> When a RDS Station has been identified, the logo field is highlighted. Now you can click on the field and go directly to Google image search to download a suitable logo quickly and easily

### v2.2
- code optimizing
- The script now also searches the local directory /web/logos


