// DEPENDENCIES **************************************
import './css/styles.css';
import Traveler from './Traveler';
import Repository from './Repository';
import { getData, postData } from './apiCalls';
import dayjs from 'dayjs';

// GLOBAL DATA ***************************************
let currentDate = dayjs();
let destinationsRepo;
let tripsRepo;
let user;
let travelersRepo;

// FETCH DATA ****************************************
function requestData(id) {
  Promise.all([getData(`travelers${id}`), getData('trips'), getData('destinations')])
    .then((data) => {
      setData(data);
    })
    .catch(error => {
      displayErrorMessage();
    });
}

function setData(data) {
  destinationsRepo = new Repository(data[2].destinations);
  tripsRepo = new Repository(data[1].trips);
  user = new Traveler(data[0]);
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
    if (currTrip.date >= `${dayjs(currentDate).format('YYYY')}/1/1` && currTrip.date <= `${dayjs(currentDate).format('YYYY')}/12/31`) {
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
    trip.date = dayjs(trip.date, "YYYY/MM/DD");
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
        <p><span class="trip-date-display">${dayjs(trip.date).format('dddd, MMM D, YYYY')}</span></p>
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
    date: dayjs(dateInput.value).format('YYYY/MM/D'),
    duration: tripFormData[1],
    status: 'pending',
    suggestedActivities: []
  }
  postData('trips', tripRequestData, user.id);

  requestTripForm.reset();
  requestTripBtn.disabled = true;
}

function displayErrorMessage() {
  errorMessageDisplay.classList.remove('hidden');
}

export { displayErrorMessage, requestData };
