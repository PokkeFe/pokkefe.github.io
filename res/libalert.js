/*! libalert.js */
/*  ============================================================================================
    ********************************************************************************************
    libalert.js
    ********************************************************************************************

	Cole Potter
	Version: 0.0.2-20191203-01

	Released under Creative Commons Attribution 4.0 International license (CC BY)
	https://creativecommons.org/licenses/by/4.0/

	The code, with it's heavy use of comments, is provided as an educational resource in hopes
	that it can be useful in function and disection.
	Minifying and obvuscating for production environments is OK and, in fact, strongly encouraged
	even if it removes attribution comments.

	Created from template:
		Chad Leigh Kluck - 10/15/2018
		Version: 0.0.1-20181015-01
		chadkluck.net
		github.com/chadkluck/js-template

    ********************************************************************************************

	USAGE:



    ********************************************************************************************
*/

if (typeof libalert === 'undefined') { libalert = false; } // let init take care of setting true
if (typeof libalert_config === 'undefined') { libalert_config = null; } // let init take care of setting true


/*  ============================================================================================
    ********************************************************************************************
    SELF-INVOKING FUNCTION
	********************************************************************************************
*/

(function(myInit, configParam) {

    "use strict";

    /* *** Local variables *** */

    /* Just version and credits that will show in console log */
    var info = {
        version: "0.0.1-20191203-03", // just a manual version number for debugging: "Is it loading the code I *thought* I uploaded?" Recommend 0.0.0-YYYYMMDD-00 format
        handle: "ALERT", // the uppercase short handle that shows in console log
        name: "LibAlert Widget", // the name of the script
        author: "Cole Potter", // author or organization credited with writing it
        code: "" // github or other link for code - optional, leave "" if no public repository
    };

    // this can eithr be passed in as the second param (very bottom) or set here
    var configDefault = {
        silence: { allowToggle: true, default: false },
        allowMultipleExecutions: false, // no reason to ever set this as true
        apiURL: "https://cole.63klabs.net/ust-sys-api/systems.php", // set this to the location of the api
    };

    const CONFIG = configParam !== null ? configParam : configDefault;

    /* Runtime Settings (Read/Write) */
    var settings = {
        silent: false, // does debug() output to console.log?
    };


    /* *** Local Functions *** */


    /* =====================================================================
     *  init()
     *
     *  Initial function called at runtime
     */
    var init = function() {
        // check to see if it has already initialized or if another copy of the code has already ran
        if (!getGlobalInit() || (getGlobalInit() && CONFIG.allowMultipleExecutions)) {
            setGlobalInit(true);
            attribution();
            setSilence(CONFIG.silence.default);
            execute();
        }

    };

    /* =====================================================================
     *	debug()
     *
     *	If not silenced, outputs text passed to it to console.log
     *
     *	Need a line number? In your code use debug(yourmessage + " - Line:"+ (new Error()).lineNumber );
     *
     *	This function has a companion variable: silent
     */
    var debug = function(text) {

        // as long as we aren't silenced (silent === false)...
        if (!settings.silent) {
            var d = new Date();
            var ts = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
            console.log(info.handle + " [" + ts + "] : " + text);
        }
    };


    /* =====================================================================
     *  setSilence()
     *
     *  If silenced, debug() won't send messages to console.log
     */
    var setSilence = function(silence) {
        if (silence !== settings.silent) {
            if (CONFIG.silence.allowToggle) {
                if (silence) {
                    debug("Silenced");
                    settings.silent = true; // we do it last so that there was one final peep
                } else {
                    settings.silent = false;
                    debug("Unsilenced");
                }
            } else {
                settings.silent = CONFIG.silence.default;
            }
        }

    };

    /* =====================================================================
     *  attribution()
     *
     *  Display info about the script in the command line
     */
    var attribution = function() {
        debug("Loading " + info.name + " by " + info.author);
        debug("Version " + info.version);
        if (info.code !== "") { debug("Get Code: " + info.code); }
    };

    /* =====================================================================
     *  getGlobalInit() / setGlobalInit()
     *
     */
    var getGlobalInit = function() {
        return myInit;
    };

    var setGlobalInit = function(b) {
        myInit = b === true ? true : false; // don't blindly accept what is passed
        return getGlobalInit();
    };

    /* =====================================================================
     *  API functions to get remote JSON data
     */
    var xhrSuccess = function() { this.callback.apply(this, this.arguments); };

    var xhrError = function() { console.error(this.statusText); };

    var loadFile = function(sURL, fCallback) {
        var oReq = new XMLHttpRequest();
        oReq.callback = fCallback;
        oReq.arguments = Array.prototype.slice.call(arguments, 2);
        oReq.onload = xhrSuccess;
        oReq.onerror = xhrError;
        oReq.open("get", sURL, true);
        oReq.send(null);
    };

    var getAPI = function(url, display) {

        // Define the function we want to use to process the data, accepting a callback function as a parameter (which will be pased to it later)
        var process = function(callback) {
            var data = JSON.parse(this.responseText);
            callback(data);
        }; // end callback processing function

        // The actual call to the loadFile, passing the two functions we wish to execute
        loadFile(url, process, display);
    };

    /* ****************************************************************************
     * EXECUTION
     * ****************************************************************************

    	Function that runs at execution time, invoked by init()
    	All code goes in here

     * ************************************************************************** */

    var execute = function() {

        var showData = function(data) {
            console.log(data);

            let outerDiv = document.createElement("div");
            outerDiv.setAttribute("id", "libraryAlertMessage");

            data.data.forEach(function(system) {
                if (!system.attributes.isNormal) {
                    debug("Adding " + system.attributes.name);
                    let innerDiv = document.createElement("div");
                    let innerText = document.createElement("p");
                    let innerBody = document.createElement("div");

                    innerDiv.classList.add("library-alert-message");

                    switch (system.attributes.color) {
                        case "yellow":
                            innerDiv.classList.add("warning"); //Yellow
                            innerDiv.classList.add("yellow-advisory-warning"); //Yellow
                            break;
                        case "red":
                            innerDiv.classList.add("critical"); //Red
                            innerDiv.classList.add("red-critical-error"); //Red
                            break;
                        case "blue":
                            innerDiv.classList.add("help"); //Blue
                            innerDiv.classList.add("blue-help-informational"); //Blue
                            break;
                    }

                    if (system.posts.length > 0) {
                        innerText.innerHTML = "<b>" + system.attributes.name + " - " + system.posts[0].title + "</b>";
                        innerBody.innerHTML = system.posts[0].body;
                    } else {
                        innerText.textContent = system.attributes.name + " - " + system.attributes.status;
                    }

                    innerDiv.appendChild(innerText);
                    innerDiv.appendChild(innerBody);
                    outerDiv.appendChild(innerDiv);
                }
            });

            debug(window.location.href);

            if (window.location.href.indexOf("stthomas.edu/libraries") > -1) {
                debug("Detected Library Home Site");
                debug("Inserting Alert...");
                document.getElementById("content").insertBefore(outerDiv, document.getElementById("rightNavContainer"));
            } else if (window.location.href.indexOf("libguides.stthomas.edu/beta/home") > -1) {
                debug("Detected LibGuides Beta Home");
                debug("Inserting Alert...");
                document.getElementById("alertContainer").appendChild(outerDiv);
            } else if (window.location.href.indexOf("clicsearch.stthomas.edu") > -1) {
                debug("Detected ClicSearch Page");
                debug("Inserting Alert...");
                let parentElement = document.getElementsByClassName("topbar-wrapper")[0];
                parentElement.appendChild(outerDiv);
            }
        }

        // call API and after data is returned, show it
        getAPI(CONFIG.apiURL, showData);


    };


    /* ****************************************************************************
     * RUN-TIME
     * ****************************************************************************

    	Code that runs on load, typically just an init which in turn calls execute()
    	after some initial initialization is perfomed

     * ************************************************************************** */

    init();

})(libalert, libalert_config);