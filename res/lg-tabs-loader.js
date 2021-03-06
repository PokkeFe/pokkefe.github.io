/*! Tabs Loader */
/*  ============================================================================================
    ********************************************************************************************
    LibGuides 2020 Tabs Loader
    ********************************************************************************************

	Cole Potter
	Version: 0.0.1-20200610

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
    This script is used to load and populate the LibGuides 2020 homepage tabs.

    ********************************************************************************************
*/

if (typeof tabsLoader === "undefined") {
  tabsLoader = false;
} // let init take care of setting true
if (typeof tabsLoader_config === "undefined") {
  tabsLoader_config = null;
} // let init take care of setting true

/*  ============================================================================================
    ********************************************************************************************
    SELF-INVOKING FUNCTION
	********************************************************************************************
*/

(function (myInit, configParam) {
  "use strict";

  /* *** Local variables *** */

  /* Just version and credits that will show in console log */
  var info = {
    version: "0.1.0-20200624", // just a manual version number for debugging: "Is it loading the code I *thought* I uploaded?" Recommend 0.0.0-YYYYMMDD-00 format
    handle: "LG-FEED", // the uppercase short handle that shows in console log
    name: "LibGuides 2020 Feed Loader", // the name of the script
    author: "University of St. Thomas Libraries", // author or organization credited with writing it
    code: "", // github or other link for code - optional, leave "" if no public repository
  };

  // this can eithr be passed in as the second param (very bottom) or set here
  var configDefault = {
    silence: { allowToggle: true, default: false },
    allowMultipleExecutions: false, // no reason to ever set this as true
    apiHost: "https://libraries.aws.stthomas.edu",
    apiURLs: {
      subject: "/api/libguides/guides-subject/",
      course: "/api/libguides/guides-course/",
      community: "/api/libguides/guides-community/",
      featured: "/api/libguides/guides-featured/",
      info: "/api/libguides/guides-informational/",
      popular: "/api/libguides/guides-popular/",
    },
    feedContainer: {
      // Query for the container to append feed elements to
      subject: "#subject",
      course: "#course",
      community: "#topics",
      featured: "#article-container",
      info: "#help",
      popular: "#feed-popular",
    },
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
  var init = function () {
    // check to see if it has already initialized or if another copy of the code has already ran
    if (
      !getGlobalInit() ||
      (getGlobalInit() && CONFIG.allowMultipleExecutions)
    ) {
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
  var debug = function (text) {
    // as long as we aren't silenced (silent === false)...
    if (!settings.silent) {
      var d = new Date();
      var ts =
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds() +
        "." +
        d.getMilliseconds();
      console.log(info.handle + " [" + ts + "] : " + text);
    }
  };

  /* =====================================================================
   *  setSilence()
   *
   *  If silenced, debug() won't send messages to console.log
   */
  var setSilence = function (silence) {
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
  var attribution = function () {
    debug("Loading " + info.name + " by " + info.author);
    debug("Version " + info.version);
    if (info.code !== "") {
      debug("Get Code: " + info.code);
    }
  };

  /* =====================================================================
   *  getGlobalInit() / setGlobalInit()
   *
   */
  var getGlobalInit = function () {
    return myInit;
  };

  var setGlobalInit = function (b) {
    myInit = b === true ? true : false; // don't blindly accept what is passed
    return getGlobalInit();
  };

  /* =====================================================================
   *  API functions to get remote JSON data
   */
  var xhrSuccess = function () {
    this.callback.apply(this, this.arguments);
  };

  var xhrError = function () {
    console.error(this.statusText);
  };

  var loadFile = function (sURL, fCallback) {
    var oReq = new XMLHttpRequest();
    oReq.callback = fCallback;
    oReq.arguments = Array.prototype.slice.call(arguments, 2);
    oReq.onload = xhrSuccess;
    oReq.onerror = xhrError;
    oReq.open("get", sURL, true);
    oReq.send(null);
  };

  var getAPI = function (url, display) {
    // Define the function we want to use to process the data, accepting a callback function as a parameter (which will be pased to it later)
    var process = function (callback) {
      var data = JSON.parse(this.responseText);
      callback(data);
    }; // end callback processing function

    // The actual call to the loadFile, passing the two functions we wish to execute
    loadFile(url, process, display);
  };

  var getGuidesAPI = function (url, display, id) {
    // Define the function we want to use to process the data, accepting a callback function as a parameter (which will be pased to it later)
    var process = function (callback) {
      var data = JSON.parse(this.responseText);
      let newData = { id: id, data: data };
      callback(newData);
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

  var execute = function () {
    // This is where you add all your functions. If using APIs don't forget to declare a function that will be excuted after the api data is returned
    // showData() is provided as an example
    let getFullURL = function(api) {
      let endpoint = CONFIG.apiURLs[api];
      if(endpoint) {
        return CONFIG.apiHost + endpoint;
      } else {
        debug("Requested API not present in config.");
        return undefined;
      }
    }

    let createSpinner = function() {
      let spinner = document.createElement("div");
      spinner.classList.add("loader");
      let container = document.createElement("div");
      container.appendChild(spinner);
      container.classList.add("loader-container");
      return container;

    }

    let populateGuides = function (data) {
      // GET PARENT
      let id = data.id;
      let parent = document.getElementById("subj-" + id);
      // GET SPINNER
      let spinner = parent.querySelector(".loader-container");
      
      let list = document.createElement("ul");
      // Create sub-elements and append to container
      for (let guide of data.data.guides) {
        let item = document.createElement("li");
        let link = document.createElement("a");
        let icon = document.createElement("i");
        let tooltip = document.createElement("span");

        // Set Properties
        link.innerText = guide.name;
        link.href = guide.url;
        icon.classList.add("fa", "fa-info-circle");
        icon.setAttribute("aria-hidden", "true");
        tooltip.innerText = guide.description;

        // Set Classes
        item.classList.add("feed-item","feed-acc-item");
        link.classList.add("feed-link");
        icon.classList.add("feed-icon");
        tooltip.classList.add("feed-tooltip");
        if(tooltip.textContent == "") {
          icon.classList.add("feed-icon-empty");
        }

        // DECALRE STRUCTURE
        icon.appendChild(tooltip);
        item.appendChild(link);
        item.appendChild(icon);
        list.appendChild(item);
      }
      // Show Librarians
      let libList = document.createElement("ul");
      for (let librarian of data.data.librarians) {
        let item = document.createElement("li");
        let img = document.createElement("img");
        let name = document.createElement("a");

        img.src = librarian.image;
        name.textContent = librarian.name;
        name.href = librarian.url;

        item.classList.add("feed-librarian");

        item.appendChild(img);
        item.appendChild(name);

        libList.appendChild(item);
      }

      // REMOVE SPINNER
      if(spinner) {
        parent.removeChild(spinner);
      }

      parent.appendChild(list);
      parent.appendChild(libList);

    };

    let generateSubjectElements = function (data) {
      let parent = document.querySelector(CONFIG.feedContainer.subject);
      if (parent == undefined) {
        debug(
          "Specified parent ID - " +
            CONFIG.subjectContainerId +
            " - is undefined. Can't append subjects."
        );
      } else {
        for (let subject of data.subjects) {
          // Create Elements
          let container = document.createElement("div");
          let accordionBox = document.createElement("div");
          let accordionText = document.createElement("p");

          // Set Classes
          container.classList.add("acc-container");
          accordionBox.classList.add("acc-subject");

          // Set Properties
          container.setAttribute("id", "subj-" + subject.id);
          accordionText.innerText = subject.name;
          accordionBox.setAttribute("data-subject-id", subject.id);

          // Order Elements Internally
          accordionBox.appendChild(accordionText);
          container.append(accordionBox);


          // POSSIBLE FEATURE/TODO - Include a link to the subject homepage under subject.url


          // Add Container to Document
          parent.appendChild(container);

          // Bind Event Listener
          accordionBox.addEventListener("click", function () {
            parent = document.getElementById(
              "subj-" + this.getAttribute("data-subject-id")
            );
            if (parent.classList.contains("expanded")) {
              parent.classList.replace("expanded", "collapsed");
            } else if (parent.classList.contains("collapsed")) {
              parent.classList.replace("collapsed", "expanded");
            } else {
              let id = this.getAttribute("data-subject-id");
              getGuidesAPI(getFullURL("subject") + "?subject_id=" + id, populateGuides, id);
              parent.classList.add("expanded");
              let spinner = createSpinner();
              parent.appendChild(spinner);
            }
          });
        }
      }
    };

    let loadSubjectFeed = function () {
      debug("Loading Subject Feed...");
      getAPI(getFullURL("subject"), generateSubjectElements);
    };

    let generatePopularElements = function (data) {
      let parent = document.querySelector(CONFIG.feedContainer.popular);

      // CHECK IF PARENT
      if (parent == undefined) {
        debug("Parent not defined, skipping populating...");
      } else {
        debug("Popular feed retrieved, populating list...");

        // SET PARENT CLASS
        parent.classList.add("feed-popular");

        // GET SPINNER
        let spinner = parent.querySelector(".loader-container");

        // CREATE LIST
        let list = document.createElement("ul");
        list.classList.add("feed-list");

        // LOOP THROUGH GUIDES
        for (let guide of data.guides) {

          // DECLARE ELEMENTS
          let item = document.createElement("li");
          let link = document.createElement("a");
          let icon = document.createElement("i");
          let tooltip = document.createElement("span");

          // SET PROPERTIES
          link.textContent = guide.name;
          link.href = guide.url;
          tooltip.innerText = guide.description;
          icon.setAttribute("aria-hidden", "true");
          icon.classList.add("fa", "fa-info-circle");

          // SET CLASSES
          item.classList.add("feed-item");
          link.classList.add("feed-link");
          icon.classList.add("feed-icon");
          tooltip.classList.add("feed-tooltip");
          if(tooltip.textContent == "") {
            icon.classList.add("feed-icon-empty");
          }

          // DECLARE STRUCTURE
          item.appendChild(link);
          icon.appendChild(tooltip);
          item.appendChild(icon);
          list.appendChild(item);

        }

        // REMOVE SPINNER
        if(spinner) {
          parent.removeChild(spinner);
        }

        // APPEND LIST TO PARENT
        parent.appendChild(list);
      }
    };

    let loadPopularFeed = function () {
      debug("Loading Popular Feed...");
      let url = getFullURL("popular");
      let parent = document.querySelector(CONFIG.feedContainer.popular);
      if(url && parent){
        let spinner = createSpinner();
        parent.appendChild(spinner);
        getAPI(url, generatePopularElements);
      } else {
        debug("Aborting Popular Feed API request - URL undefined or Parent non-existent.");
      }
    };

    let generateFeaturedElements = function(data) {
      let parent = document.querySelector(CONFIG.feedContainer.featured);

      // CHECK IF PARENT
      if (parent == undefined) {
        debug("Parent not defined, skipping populating...");
      } else {
        parent.classList.add("feed-featured");
        parent.innerHTML = '';

        let dots = document.querySelector("#featured-dots");
        if(dots){
          dots.innerHTML = "";
        }

        // STEP THROUGH GUIDES - AND GROUP IN THREES
        let count = 0;
        let loop = 0;
        let section;
        let firstSection;
        for(let guide of data.guides){
          // CHECK IF START OF NEW GROUP
          if(count == 0){
            // ADD NEW SECTION
            if(section){
              parent.appendChild(section);
            }
            section = document.createElement("section");

            if(!firstSection){
              firstSection = section;
            }
          }
          
          // CREATE ELEMENTS
          let container = document.createElement("article");
          let img = document.createElement("img");
          let title = document.createElement("p");
          let desc = document.createElement("p");

          img.setAttribute("src", guide.image);

          title.innerText = guide.name;
          title.classList.add("title");

          desc.innerText = guide.description;
          desc.classList.add("summary");

          container.appendChild(img);
          container.appendChild(title);
          container.appendChild(desc);

          section.appendChild(container);

          // INCREASE COUNT OR RESET
          if(count >= 2) {
            count = 0;
            loop++;
          } else {
            count++;
          }
        }

        while(count <= 2 && count != 0){
          let emptyArticle = document.createElement("article");
          section.appendChild(emptyArticle);
          count++;
        }

        parent.appendChild(section);

        if(window.refreshCarouselDots){
          window.refreshCarouselDots();
        }
        
        firstSection.classList.add("active");

      }

    };

    let loadFeaturedFeed = function () {
      debug("Loading Featured Feed...");
      let url = getFullURL("featured");
      if(url){
        getAPI(url, generateFeaturedElements);
      } else {
        debug("Aborting Featured Feed API request - URL undefined.");
      }
    };

    let generateCourseElements = function (data) {
      // GET PARENT
      let parent = document.querySelector(CONFIG.feedContainer.course);

      // GET SPINNER
      let spinner = parent.querySelector(".loader-container");

      let list = document.createElement("ul");
      for(let guide of data.guides){
        let item = document.createElement("li");
        let link = document.createElement("a");
        let icon = document.createElement("i");
        let tooltip = document.createElement("span");

        // SET PROPERTIES
        link.textContent = guide.name;
        link.setAttribute("href",guide.url);
        icon.classList.add("fa", "fa-info-circle");
        icon.setAttribute("aria-hidden", "true");
        tooltip.textContent = guide.description;

        // SET CLASSES
        item.classList.add("feed-item");
        link.classList.add("feed-link");
        icon.classList.add("feed-icon");
        tooltip.classList.add("feed-tooltip");
        if(tooltip.textContent == "") {
          icon.classList.add("feed-icon-empty");
        }

        // SET ORDER
        item.appendChild(link);
        icon.appendChild(tooltip);
        item.appendChild(icon);
        list.appendChild(item);
      }

      // REMOVE SPINNER
      if(spinner) {
        parent.removeChild(spinner);
      }

      parent.appendChild(list);
    };

    let loadCourseFeed = function () {
      debug("Loading Course Feed...");
      let url = getFullURL("course");
      let parent = document.querySelector(CONFIG.feedContainer.course);
      if(url && parent){
        let spinner = createSpinner();
        parent.appendChild(spinner);
        getAPI(url, generateCourseElements);
      } else {
        debug("Aborting Guide by Course feed API request - URL unidentified.");
      }
    };

    let generateCommunityElements = function (data) {
      // GET PARENT
      let parent = document.querySelector(CONFIG.feedContainer.community);

      // GET SPINNER
      let spinner = parent.querySelector(".loader-container");


      let list = document.createElement("ul");
      for(let guide of data.guides){
        // DECLARE ELEMENTS
        let item = document.createElement("li");
        let link = document.createElement("a");
        let icon = document.createElement("i");
        let tooltip = document.createElement("span");

        // SET PROPERTIES
        link.textContent = guide.name;
        link.setAttribute("href",guide.url);
        icon.classList.add("fa", "fa-info-circle");
        icon.setAttribute("aria-hidden", "true");
        tooltip.textContent = guide.description;

        // SET CLASSES
        icon.classList.add("feed-icon");
        tooltip.classList.add("feed-tooltip");
        item.classList.add("feed-item");
        link.classList.add("feed-link");
        if(tooltip.textContent == "") {
          icon.classList.add("feed-icon-empty");
        }

        // DEFINE STRUCTURE
        item.appendChild(link);
        icon.appendChild(tooltip);
        item.appendChild(icon);
        list.appendChild(item);
      }

      // REMOVE SPINNER
      if(spinner) {
        parent.removeChild(spinner);
      }

      // APPEND LIST
      parent.appendChild(list);
    };

    let loadCommunityFeed = function() {
      debug("Loading Community Feed");
      let url = getFullURL("community");
      let parent = document.querySelector(CONFIG.feedContainer.community);
      if(url && parent){
        let spinner = createSpinner();
        parent.appendChild(spinner);
        getAPI(url, generateCommunityElements);
      } else {
        debug("Aborting Community feed API request - URL unidentified.");
      }
    };

    let generateInfoElements = function (data) {
      // GET PARENT
      let parent = document.querySelector(CONFIG.feedContainer.info);

      // GET SPINNER
      let spinner = parent.querySelector(".loader-container");

      let list = document.createElement("ul");
      for(let guide of data.guides){
        // DECLARE ELEMENTS
        let item = document.createElement("li");
        let link = document.createElement("a");
        let icon = document.createElement("i");
        let tooltip = document.createElement("span");

        // SET PROPERTIES
        link.textContent = guide.name;
        link.setAttribute("href",guide.url);
        icon.classList.add("fa", "fa-info-circle");
        icon.setAttribute("aria-hidden", "true");
        tooltip.textContent = guide.description;

        // SET CLASSES
        icon.classList.add("feed-icon");
        tooltip.classList.add("feed-tooltip");
        item.classList.add("feed-item");
        link.classList.add("feed-link");
        if(tooltip.textContent == "") {
          icon.classList.add("feed-icon-empty");
        }

        // DECLARE STRUCTURE
        item.appendChild(link);
        icon.appendChild(tooltip);
        item.appendChild(icon);
        list.appendChild(item);
      }

      // REMOVE SPINNER
      if(spinner) {
        parent.removeChild(spinner);
      }

      // APPEND LIST
      parent.appendChild(list);
    };

    let loadInfoFeed = function() {
      debug("Loading Info Feed");
      let url = getFullURL("info");
      let parent = document.querySelector(CONFIG.feedContainer.info);
      if(url && parent){
        let spinner = createSpinner();
        parent.appendChild(spinner);
        getAPI(url, generateInfoElements);
      } else {
        debug("Aborting Info feed API request - URL unidentified.");
      }
    }

    let attachTabListeners = function () {
      debug("Attaching Tab Listeners...");
      // TODO
      let courseBtn = document.querySelector("#course-button");
      let courseLoaded = false;
      courseBtn.addEventListener("click", function() {
          if(!courseLoaded) {
            loadCourseFeed();
            courseLoaded = true;
          }
      });

      let communityBtn = document.querySelector("#topics-button");
      let communityLoaded = false;
      communityBtn.addEventListener("click", function() {
        if(!communityLoaded){
          loadCommunityFeed();
          communityLoaded = true;
        }
      });

      let helpBtn = document.querySelector("#help-button");
      let helpLoaded = false;
      helpBtn.addEventListener("click", function() {
        if(!helpLoaded) {
          loadInfoFeed();
          helpLoaded = true;
        }
      });
    };

    loadSubjectFeed();
    loadPopularFeed();
    loadFeaturedFeed();
    attachTabListeners();
  };

  /* ****************************************************************************
     * RUN-TIME
     * ****************************************************************************

    	Code that runs on load, typically just an init which in turn calls execute()
    	after some initial initialization is perfomed

     * ************************************************************************** */

  init();
})(tabsLoader, tabsLoader_config);
