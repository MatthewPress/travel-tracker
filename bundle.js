/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "displayErrorMessage": () => (/* binding */ displayErrorMessage),
/* harmony export */   "requestData": () => (/* binding */ requestData)
/* harmony export */ });
/* harmony import */ var _css_styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _Traveler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _Repository__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _apiCalls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_4__);
// DEPENDENCIES **************************************






// GLOBAL DATA ***************************************
let currentDate = dayjs__WEBPACK_IMPORTED_MODULE_4___default()();
let destinationsRepo;
let tripsRepo;
let user;
let travelersRepo;

// FETCH DATA ****************************************
function requestData(id) {
  Promise.all([(0,_apiCalls__WEBPACK_IMPORTED_MODULE_3__.getData)(`travelers${id}`), (0,_apiCalls__WEBPACK_IMPORTED_MODULE_3__.getData)('trips'), (0,_apiCalls__WEBPACK_IMPORTED_MODULE_3__.getData)('destinations')])
    .then((data) => {
      setData(data);
    })
    .catch(error => {
      displayErrorMessage();
    });
}

function setData(data) {
  destinationsRepo = new _Repository__WEBPACK_IMPORTED_MODULE_2__.default(data[2].destinations);
  tripsRepo = new _Repository__WEBPACK_IMPORTED_MODULE_2__.default(data[1].trips);
  user = new _Traveler__WEBPACK_IMPORTED_MODULE_1__.default(data[0]);
  user.setTrips(tripsRepo);

  localStorage.setItem('traveler', JSON.stringify(data[0]));
  localStorage.setItem('trips', JSON.stringify(data[1]));
  localStorage.setItem('destinations', JSON.stringify(data[2]));

  displayUserInfo();
  parseTripDates();
  displayUserTrips();
  populateLocationChoices();
  validateTripRequest();
}

// DOM ELEMENTS **************************************
const loginForm = document.forms.login;
const loginBtn = document.querySelector('.login-btn');
const userSection = document.querySelector('.user-info-section');
const userNameDisplay = document.querySelector('.user-name-display');
const resetBtn = document.querySelector('.reset-btn');
const errorMessageDisplay = document.querySelector('.error-message');
const mainDisplay = document.querySelector('main');
const destinationNameDisplay = document.querySelector('.destination-name-display');
const destinationImg = document.querySelector('#destination-img');
const destinationLodgingDisplay = document.querySelector('.destination-lodging-display');
const destinationFlightDisplay = document.querySelector('.destination-flight-display');
const requestTripForm = document.forms.planTrip;
const dateInput = document.querySelector('#date-input');
const locationChoices = document.querySelector('.location-choices');
const estimatedCostDisplay = document.querySelector('.estimated-cost-display');
const requestTripBtn = document.querySelector('.request-trip-btn');
const userTripsDisplay = document.querySelectorAll('.user-trips-display');
const pastTripsSection = document.querySelector('.past');
const futureTripsSection = document.querySelector('.future');
const pendingTripsSection = document.querySelector('.pending');
const yearlyExpenseDisplay = document.querySelector('.yearly-expense-display');

// EVENT LISTENERS ***********************************
window.addEventListener('load', checkForData);
loginForm.addEventListener('input', verifyLogin);
loginBtn.addEventListener('click', login);
resetBtn.addEventListener('click', function() {
  localStorage.clear();
  switchPages();
});
requestTripForm.addEventListener('change', validateTripRequest);
requestTripBtn.addEventListener('click', requestTrip);

// EVENT HANDLERS ************************************
function checkForData() {
  if (localStorage.getItem('traveler')) {
    switchPages();

    const traveler = JSON.parse(localStorage.getItem('traveler'));
    const trips = JSON.parse(localStorage.getItem('trips'));
    const destinations = JSON.parse(localStorage.getItem('destinations'));
    setData([traveler, trips, destinations]);
  }
}

function getLoginData() {
  const loginData = new FormData(loginForm);
  return [...loginData.values()];
}

function verifyLogin() {
  const loginCredentials = getLoginData();
  const loginID = parseInt(loginCredentials[0].split('traveler')[1]);

  if (loginID && loginCredentials[1] === 'travel') {
    loginBtn.disabled = false;
  } else {
    loginBtn.disabled = true;
  }
}

function login(event) {
  event.preventDefault();

  const loginCredentials = getLoginData();
  const loginID = parseInt(loginCredentials[0].split('traveler')[1]);

  requestData(`/${loginID}`);
  switchPages();
  loginForm.reset();
  loginBtn.disabled = true;
}

function switchPages() {
  loginForm.classList.toggle('hidden');
  mainDisplay.classList.toggle('hidden');
  userSection.classList.toggle('hidden');
}

function displayUserInfo() {
  const yearlyExpense = user.trips.reduce((acc, currTrip) => {
    if (currTrip.date >= `${dayjs__WEBPACK_IMPORTED_MODULE_4___default()(currentDate).format('YYYY')}/1/1` && currTrip.date <= `${dayjs__WEBPACK_IMPORTED_MODULE_4___default()(currentDate).format('YYYY')}/12/31`) {
      console.log("if");
      acc += getCostEstimate(currTrip);
    }
    return acc;
  }, 0);

  userNameDisplay.innerText = user.name;
  yearlyExpenseDisplay.innerText = yearlyExpense;
}

function getCostEstimate(trip) {
  const location = destinationsRepo.findEntry('id', trip.id);

  let total = (
    (trip.travelers * location.estimatedFlightCostPerPerson) 
    + (trip.duration * location.estimatedLodgingCostPerDay) 
    * 1.1
  );

  return total;
}

function parseTripDates() {
  user.trips.forEach(trip => {
    trip.date = dayjs__WEBPACK_IMPORTED_MODULE_4___default()(trip.date, "YYYY/MM/DD");
  });
}

function displayUserTrips() {
  userTripsDisplay.forEach(section => {
    section.innerHTML = '';
  });

  user.trips.forEach(trip => {
    const plannedTrip = destinationsRepo.findEntry('id', trip.destinationID)
    
    const tripCard = `
      <article class="trip-card">
        <h3><span class="trip-destination-display">${plannedTrip.destination}</span></h3>
        <img src="${plannedTrip.image}" alt="${plannedTrip.alt}" />
        <p><span class="trip-date-display">${dayjs__WEBPACK_IMPORTED_MODULE_4___default()(trip.date).format('dddd, MMM D, YYYY')}</span></p>
        <p><span class="trip-duration-display">${trip.duration}</span> day(s)</p>
        <p>Status: <span class="trip-status-display">${trip.status}</span></p>
      </article>
    `;

    if (trip.date < currentDate) {
      pastTripsSection.innerHTML += tripCard;
    }
    else if (trip.date > currentDate && trip.status === 'approved') {
      futureTripsSection.innerHTML += tripCard;
    } else {
      pendingTripsSection.innerHTML += tripCard;
    }
  });
}

function populateLocationChoices() {
  locationChoices.innerHTML = '';
  destinationsRepo.data.forEach(location => {
    locationChoices.innerHTML += `
      <option value="${location.id}">${location.destination}</option>
    `;
  })
}

function getTripFormData() {
  const tripDate = new FormData(requestTripForm);
  const parsedTripDate = [];
  tripDate.forEach(element => parsedTripDate.push(parseInt(element)));
  return parsedTripDate;
}

function validateTripRequest() {
  const tripFormData = getTripFormData();

  if (tripFormData.every(element => element > 0) && dateInput.value) {
    displayTripCost(tripFormData);
    requestTripBtn.disabled = false;
  } else {
    requestTripBtn.disabled = true;
    estimatedCostDisplay.innerText = 0;
  }

  displayLocationChoice(tripFormData);
}

function displayLocationChoice(tripFormData) {
  const selectedDestination = destinationsRepo.findEntry('id', tripFormData[0]);
  
  destinationNameDisplay.innerText = selectedDestination.destination;
  destinationImg.src = selectedDestination.image;
  destinationImg.alt = selectedDestination.alt;
  destinationLodgingDisplay.innerText = selectedDestination.estimatedLodgingCostPerDay;
  destinationFlightDisplay.innerText = selectedDestination.estimatedFlightCostPerPerson;
}

function displayTripCost(tripFormData) {
  const costEstimate = getCostEstimate({
    id: tripFormData[0], 
    duration: tripFormData[1], 
    travelers: tripFormData[2]
  });

  estimatedCostDisplay.innerText = costEstimate;
}

function requestTrip(event) {
  event.preventDefault();
  
  const tripFormData = getTripFormData();
  const tripRequestData = {
    id: tripsRepo.data.length + 1,
    userID: user.id,
    destinationID: tripFormData[0],
    travelers: tripFormData[2],
    date: dayjs__WEBPACK_IMPORTED_MODULE_4___default()(dateInput.value).format('YYYY/MM/D'),
    duration: tripFormData[1],
    status: 'pending',
    suggestedActivities: []
  }
  ;(0,_apiCalls__WEBPACK_IMPORTED_MODULE_3__.postData)('trips', tripRequestData, user.id);

  requestTripForm.reset();
  requestTripBtn.disabled = true;
}

function displayErrorMessage() {
  errorMessageDisplay.classList.remove('hidden');
}




/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* VARIABLES ********************************************* */\n:root {\n  --white: #FFFFFF;\n  --light-white: rgba(255, 255, 255, 0.3);\n  --black: #000000;\n  --primary-color: #212121;\n  --secondary-color: #0B6030;\n  --primary-font: sans-serif;\n  --secondary-font: cursive, sans-serif;\n  --shadow: 5px 5px 7px#000000;\n  --radius: 5px;\n}\n\n/* TEXT ************************************************* */\nlabel,\np,\nbutton {\n  font-size: 1.2em;\n}\n\np {\n  margin: 5px;\n}\n\n/* SHARED LAYOUTS **************************************** */\nheader,\nsection,\nform[name=\"login\"],\n.user-info-section,\n.form-field {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-wrap: wrap;\n}\n\nheader,\n.form-field,\n.user-info-section {\n  justify-content: space-between;\n}\n\n/* BODY ************************************************* */\nbody {\n  background: rgb(54,100,228);\n  background: linear-gradient(180deg, rgba(54,100,228,1) 10%, rgba(255,255,255,1) 100%);\n  background-repeat: no-repeat;\n  color: var(--white);\n  font-family: var(--primary-font);\n  margin: 0px;\n}\n\n/* HEADER ****************************************** */\nheader {\n  background: var(--primary-color);\n  font-family: var(--secondary-font);\n  color: var(--white);\n  padding: 10px;\n}\n\nh1 {\n  margin: 10px;\n}\n\n/* MAIN ******************************************* */\nmain {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 20px;\n  padding: 20px;\n}\n\nsection {\n  background: var(--light-white);\n  min-width: 320px;\n  padding: 10px;\n  border-radius: var(--radius);\n  filter: drop-shadow(0 0 0.5rem var(--black));\n}\n\n/* Trip Card ****************************** */\n.trip-card {\n  background: var(--secondary-color);\n  color: var(--white);\n  height: 375px;\n  width: 300px;\n  padding: 5px;\n  border: 2px solid var(--black);\n  border-radius: var(--radius);\n  margin: 5px;\n}\n\nh3 {\n  margin: 5px 0px 5px 15px;\n}\n\nimg {\n  width: 250px;\n  height: 200px;\n  margin: 5px 25px;\n  border-radius: var(--radius);\n}\n\n.trip-card p {\n  text-align: right;\n  margin-right: 15px;\n}\n\n/* PLAN TRIP SECTION **************************** */\n.plan-trip-section {\n  grid-column: span 2;\n  flex-direction: column;\n}\n\nh2 {\n  align-self: flex-start;\n  margin-left: 20px;\n}\n\n.request-trip-btn {\n  align-self: flex-end;\n}\n\n/* USER'S TRIPS ***************************************** */\n.user-trips-section {\n  max-height: 500px;\n  overflow-y: scroll;\n}\n\n.user-trips-section h2 {\n  flex-grow: 2;\n}\n.user-trips-display {\n  background: var(--light-white);\n  padding: 5px;\n}\n\n.yearly-expense-section {\n  grid-column: 3;\n}\n\n/* INPUTS & LABELS ************************************* */\n.form-field,\nbutton {\n  background: var(--secondary-color);\n  color: var(--white);\n  box-shadow: var(--shadow);\n  margin: 15px;\n}\n\nbutton,\n.form-field,\ninput,\nselect {\n  font-family: var(--primary-font);\n  padding: 5px;\n  border: 2px solid var(--black);\n  border-radius: var(--radius);;\n  -webkit-transform: perspective(1px) translateZ(0);\n  transform: perspective(1px) translateZ(0);\n  -webkit-transition-duration: 0.3s;\n  transition-duration: 0.3s;\n  -webkit-transition-property: transform;\n  transition-property: transform;\n}\n\nbutton:enabled:hover,\nselect:hover,\ninput:hover {\n  -webkit-transform: scale(1.1);\n  transform: scale(1.1);\n}\n\nbutton:enabled:hover,\nselect {\n  cursor: pointer;\n}\n\nbutton:disabled {\n  background: var(--light-white);\n  color: lightgrey;\n  cursor: not-allowed;\n}\n\ninput:invalid {\n  border: 3px solid red;\n}\n\ninput:valid {\n  border: 3px solid gold;\n}\n\nlabel {\n  margin-right: 15px;\n}\n\n/* GENERAL ********************************************** */\n.hidden {\n  display: none !important;\n}\n\n/* EXTRA SMALL SCREEN *********************************** */\n@media screen and (max-width: 1000px) {\n  main {\n    display: flex;\n    flex-wrap: wrap;\n    flex-direction: column;\n    align-items: center;\n  }\n\n  label,\n  p,\n  button {\n    font-size: 0.9em;\n  }\n}", "",{"version":3,"sources":["webpack://./src/css/styles.css"],"names":[],"mappings":"AAAA,4DAA4D;AAC5D;EACE,gBAAgB;EAChB,uCAAuC;EACvC,gBAAgB;EAChB,wBAAwB;EACxB,0BAA0B;EAC1B,0BAA0B;EAC1B,qCAAqC;EACrC,4BAA4B;EAC5B,aAAa;AACf;;AAEA,2DAA2D;AAC3D;;;EAGE,gBAAgB;AAClB;;AAEA;EACE,WAAW;AACb;;AAEA,4DAA4D;AAC5D;;;;;EAKE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,eAAe;AACjB;;AAEA;;;EAGE,8BAA8B;AAChC;;AAEA,2DAA2D;AAC3D;EACE,2BAA2B;EAC3B,qFAAqF;EACrF,4BAA4B;EAC5B,mBAAmB;EACnB,gCAAgC;EAChC,WAAW;AACb;;AAEA,sDAAsD;AACtD;EACE,gCAAgC;EAChC,kCAAkC;EAClC,mBAAmB;EACnB,aAAa;AACf;;AAEA;EACE,YAAY;AACd;;AAEA,qDAAqD;AACrD;EACE,aAAa;EACb,qCAAqC;EACrC,cAAc;EACd,aAAa;AACf;;AAEA;EACE,8BAA8B;EAC9B,gBAAgB;EAChB,aAAa;EACb,4BAA4B;EAC5B,4CAA4C;AAC9C;;AAEA,6CAA6C;AAC7C;EACE,kCAAkC;EAClC,mBAAmB;EACnB,aAAa;EACb,YAAY;EACZ,YAAY;EACZ,8BAA8B;EAC9B,4BAA4B;EAC5B,WAAW;AACb;;AAEA;EACE,wBAAwB;AAC1B;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,gBAAgB;EAChB,4BAA4B;AAC9B;;AAEA;EACE,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA,mDAAmD;AACnD;EACE,mBAAmB;EACnB,sBAAsB;AACxB;;AAEA;EACE,sBAAsB;EACtB,iBAAiB;AACnB;;AAEA;EACE,oBAAoB;AACtB;;AAEA,2DAA2D;AAC3D;EACE,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA;EACE,YAAY;AACd;AACA;EACE,8BAA8B;EAC9B,YAAY;AACd;;AAEA;EACE,cAAc;AAChB;;AAEA,0DAA0D;AAC1D;;EAEE,kCAAkC;EAClC,mBAAmB;EACnB,yBAAyB;EACzB,YAAY;AACd;;AAEA;;;;EAIE,gCAAgC;EAChC,YAAY;EACZ,8BAA8B;EAC9B,4BAA4B;EAC5B,iDAAiD;EACjD,yCAAyC;EACzC,iCAAiC;EACjC,yBAAyB;EACzB,sCAAsC;EACtC,8BAA8B;AAChC;;AAEA;;;EAGE,6BAA6B;EAC7B,qBAAqB;AACvB;;AAEA;;EAEE,eAAe;AACjB;;AAEA;EACE,8BAA8B;EAC9B,gBAAgB;EAChB,mBAAmB;AACrB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,kBAAkB;AACpB;;AAEA,2DAA2D;AAC3D;EACE,wBAAwB;AAC1B;;AAEA,2DAA2D;AAC3D;EACE;IACE,aAAa;IACb,eAAe;IACf,sBAAsB;IACtB,mBAAmB;EACrB;;EAEA;;;IAGE,gBAAgB;EAClB;AACF","sourcesContent":["/* VARIABLES ********************************************* */\n:root {\n  --white: #FFFFFF;\n  --light-white: rgba(255, 255, 255, 0.3);\n  --black: #000000;\n  --primary-color: #212121;\n  --secondary-color: #0B6030;\n  --primary-font: sans-serif;\n  --secondary-font: cursive, sans-serif;\n  --shadow: 5px 5px 7px#000000;\n  --radius: 5px;\n}\n\n/* TEXT ************************************************* */\nlabel,\np,\nbutton {\n  font-size: 1.2em;\n}\n\np {\n  margin: 5px;\n}\n\n/* SHARED LAYOUTS **************************************** */\nheader,\nsection,\nform[name=\"login\"],\n.user-info-section,\n.form-field {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-wrap: wrap;\n}\n\nheader,\n.form-field,\n.user-info-section {\n  justify-content: space-between;\n}\n\n/* BODY ************************************************* */\nbody {\n  background: rgb(54,100,228);\n  background: linear-gradient(180deg, rgba(54,100,228,1) 10%, rgba(255,255,255,1) 100%);\n  background-repeat: no-repeat;\n  color: var(--white);\n  font-family: var(--primary-font);\n  margin: 0px;\n}\n\n/* HEADER ****************************************** */\nheader {\n  background: var(--primary-color);\n  font-family: var(--secondary-font);\n  color: var(--white);\n  padding: 10px;\n}\n\nh1 {\n  margin: 10px;\n}\n\n/* MAIN ******************************************* */\nmain {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 20px;\n  padding: 20px;\n}\n\nsection {\n  background: var(--light-white);\n  min-width: 320px;\n  padding: 10px;\n  border-radius: var(--radius);\n  filter: drop-shadow(0 0 0.5rem var(--black));\n}\n\n/* Trip Card ****************************** */\n.trip-card {\n  background: var(--secondary-color);\n  color: var(--white);\n  height: 375px;\n  width: 300px;\n  padding: 5px;\n  border: 2px solid var(--black);\n  border-radius: var(--radius);\n  margin: 5px;\n}\n\nh3 {\n  margin: 5px 0px 5px 15px;\n}\n\nimg {\n  width: 250px;\n  height: 200px;\n  margin: 5px 25px;\n  border-radius: var(--radius);\n}\n\n.trip-card p {\n  text-align: right;\n  margin-right: 15px;\n}\n\n/* PLAN TRIP SECTION **************************** */\n.plan-trip-section {\n  grid-column: span 2;\n  flex-direction: column;\n}\n\nh2 {\n  align-self: flex-start;\n  margin-left: 20px;\n}\n\n.request-trip-btn {\n  align-self: flex-end;\n}\n\n/* USER'S TRIPS ***************************************** */\n.user-trips-section {\n  max-height: 500px;\n  overflow-y: scroll;\n}\n\n.user-trips-section h2 {\n  flex-grow: 2;\n}\n.user-trips-display {\n  background: var(--light-white);\n  padding: 5px;\n}\n\n.yearly-expense-section {\n  grid-column: 3;\n}\n\n/* INPUTS & LABELS ************************************* */\n.form-field,\nbutton {\n  background: var(--secondary-color);\n  color: var(--white);\n  box-shadow: var(--shadow);\n  margin: 15px;\n}\n\nbutton,\n.form-field,\ninput,\nselect {\n  font-family: var(--primary-font);\n  padding: 5px;\n  border: 2px solid var(--black);\n  border-radius: var(--radius);;\n  -webkit-transform: perspective(1px) translateZ(0);\n  transform: perspective(1px) translateZ(0);\n  -webkit-transition-duration: 0.3s;\n  transition-duration: 0.3s;\n  -webkit-transition-property: transform;\n  transition-property: transform;\n}\n\nbutton:enabled:hover,\nselect:hover,\ninput:hover {\n  -webkit-transform: scale(1.1);\n  transform: scale(1.1);\n}\n\nbutton:enabled:hover,\nselect {\n  cursor: pointer;\n}\n\nbutton:disabled {\n  background: var(--light-white);\n  color: lightgrey;\n  cursor: not-allowed;\n}\n\ninput:invalid {\n  border: 3px solid red;\n}\n\ninput:valid {\n  border: 3px solid gold;\n}\n\nlabel {\n  margin-right: 15px;\n}\n\n/* GENERAL ********************************************** */\n.hidden {\n  display: none !important;\n}\n\n/* EXTRA SMALL SCREEN *********************************** */\n@media screen and (max-width: 1000px) {\n  main {\n    display: flex;\n    flex-wrap: wrap;\n    flex-direction: column;\n    align-items: center;\n  }\n\n  label,\n  p,\n  button {\n    font-size: 0.9em;\n  }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Traveler {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.travelerType = data.travelerType;
    this.trips = [];
  }

  setTrips(repo) {
    if (repo.filterEntries('userID', this.id)) {
      repo.filterEntries('userID', this.id)
        .forEach(trip => {
          this.trips.push(trip);
        });
    } 
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Traveler);

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Repository {
  constructor(data) {
    this.data = data;
  }

  findEntry(property, value) {
    return this.data.find(entry => entry[property] === value);
  }

  filterEntries(property, value) {
    return this.data.filter(entry => entry[property] === value);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Repository);

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getData": () => (/* binding */ getData),
/* harmony export */   "postData": () => (/* binding */ postData)
/* harmony export */ });
/* harmony import */ var _scripts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


function getData(path) {
  return fetch(`http://localhost:3001/api/v1/${path}`)
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(error => {
      (0,_scripts__WEBPACK_IMPORTED_MODULE_0__.displayErrorMessage)();
    });
}

function postData(path, request, userID) {
  const entry = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  };

  return fetch(`http://localhost:3001/api/v1/${path}`, entry)
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .then(() => {
      (0,_scripts__WEBPACK_IMPORTED_MODULE_0__.requestData)(`/${userID}`);
    })
    .catch(error => {
      alert('post error');
    });
}



/***/ }),
/* 9 */
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,(function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return+(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},v="en",D={};D[v]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return v;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else{var a=e.name;D[a]=e,i=a}return!r&&i&&(v=i),i||!r&&v},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=g;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t)}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},m.$utils=function(){return O},m.isValid=function(){return!(this.$d.toString()===$)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),$=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},l=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case c:return r?$(1,0):$(31,11);case f:return r?$(1,M):$(0,M+1);case o:var v=this.$locale().weekStart||0,D=(y<v?y+7:y)-v;return $(r?m-D:m+(6-D),M);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),$=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],l=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[$](l),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,$=this;r=Number(r);var l=O.p(h),y=function(t){var e=w($);return O.w(e.date(e.date()+Math.round(t*r)),$)};if(l===f)return this.set(f,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return y(1);if(l===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||$;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||l[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,g=this-M,v=O.m(this,M);return v=(l={},l[c]=v/12,l[f]=v,l[h]=v/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/n,l[s]=g/e,l[i]=g/t,l)[y]||g,$?v:O.a(v)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),T=_.prototype;return w.prototype=T,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){T[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[v],w.Ls=D,w.p={},w}));

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map