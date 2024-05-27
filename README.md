# Station Logo Plugin for [FM-DX-Webserver](https://github.com/NoobishSVK/fm-dx-webserver)
![Screenshot3](https://github.com/Highpoint2000/webserver-station-logos/assets/168109804/c66bab09-045e-47d3-a719-9e269bb48a4a)

Compatible from version 1.2.0

## Installation notes:

1. [Download](https://github.com/Highpoint2000/webserver-station-logos/releases) the last repository as a zip
2. Unpack it into the plugins folder in the root of the web server
3. Restart the server
4. Activate it in the settings

#### For anyone who would like to receive their future updates automatically, please install the Always on Update (AOU) version from [here](https://tef.noobish.eu/logos/scripts/StationLogo_AOU_Version.zip). This script always gets the current code from the logo server. If you have installed the AOU version before May 7th, 2024, you will have to clear the cache regularly to use the latest version of the logo plugin. This bug has been fixed in the current [download](https://tef.noobish.eu/logos/scripts/StationLogo_AOU_Version.zip) file!

Important notes: 

In order for logos to be displayed, your own location in the web server must also be correctly entered and activated! Otherwise, the system cannot receive an ITU code of the sender location to display the logo. The correct station logo should then be loaded during RDS recognition, provided a specific logo has already been created on our [server](https://tef.noobish.eu/logos/logo_preview.html) or it is located in the local /web/logos folder. Missing logos will be taken over by onlineradiobox.com (from version 3.1).

For missing or incorrect logos, please use the integrated Google search function. This is activated automatically (the logo box is highlighted) if a country code and a program name can also be retrieved from the database for a PI code. In most cases, you can find the right logo this way. Many logos are in PNG or SVG format with a transparent background. These fit in very well with the look of the web server. For the PNG format, a small version is often sufficient, as we currently process a maximum of 140 pixels wide and 60 pixels high. Basically, the script inserts the logos appropriately into the existing window. If you create logos for different countries, please place them in separate folders that you are welcome to use with the ITU names. Then just send me the files or a download link via [email](mailto:highpoint2000@googlemail.com) or via our [Discord Community](https://discord.gg/ZAVNdS74mC). I will upload them to our [server](https://tef.noobish.eu/logos/logo_preview.html) as soon as possible.

## History:

### version v3.2a:
- Added switch for alternative search at onlineradiobox.com
- Added switch for logo reload when PI code changes, recommended for SDR receivers (e.g.: Airspy)

### version v3.2:
- Switching the query process to JSON
- Reduction of query values
- Stability and performance improvements
- Bug fixing
- Countrylist (ITU codes) were moved to the server

### version v3.12a:
- program name logo query in capital letters
- itu code additions
- code optimization & bug fixing

### version v3.12:
- additional query for PI code and program name (Local + Server)

### version v3.11:
- Play/Stop button back to original size
- Problem with logo retrieval from onlineradiobox.com fixed

### version v3.1:
- Instead of Lyngsat, missing logos are now downloaded from onlineradiobox.com
- Fixed the disappearance of the PS identifier
- remove tooltip
- code optimizations

### version v3.0:
- additional logo query via the Lyngsat website
- fixed missing display of TP/TA/MO/ST on mobile devices

### version v2.25c:
- local folder "/web/logos" is prioritized
- further optimized Google Search Function (e.g. country name added)

### version v2.25b:
- Tooltip has been bugfixed

### version v2.25a:
- optimized Google Search Function (ITU code added)
  
### version v2.25:
- Google Search Function
  -> When a RDS Station has been identified, the logo field is highlighted. Now you can click on the field and go directly to Google image search to download a suitable logo quickly and easily

### version v2.2:
- code optimizing
- The script now also searches the local directory /web/logos


