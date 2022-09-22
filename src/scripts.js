// Remove last two lines of code and uncomment window event listener

// DEPENDENCIES **************************************
import './css/styles.css';
import Traveler from './Traveler';
import Repository from './Repository';
import { getData, postData } from './apiCalls';
import dayjs from 'dayjs';
// import './images/turing-logo.png'

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
      alert('promise error');
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
}

// DOM ELEMENTS **************************************
const loginForm = document.forms.login;
const loginBtn = document.querySelector('.login-btn');

const userSection = document.querySelector('.user-section');
const userNameDisplay = document.querySelector('.user-name-display');
const resetBtn = document.querySelector('.reset');

const mainDisplay = document.querySelector('main');

const requestTripForm = document.forms.planTrip;
const dateInput = document.querySelector('#date-input');
const locationChoices = document.querySelector('.location-choices');
const requestTripBtn = document.querySelector('.request-trip-btn');

const tripsSection = document.querySelector('.user-trips-section');
const yearlyExpenseDisplay = document.querySelector('.yearly-expense-display');


// EVENT LISTENERS ***********************************
window.addEventListener('load', checkForData);
loginBtn.addEventListener('click', login);
requestTripForm.addEventListener('change', validateTripRequest);
requestTripBtn.addEventListener('click', requestTrip);
resetBtn.addEventListener('click', function() {
  localStorage.clear();
  switchPages();
});

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

function login(event) {
  event.preventDefault();

  const loginData = new FormData(loginForm);
  const loginCredentials = [...loginData.values()];
  const loginID = parseInt(loginCredentials[0].split('traveler')[1]);

  if (loginID && loginCredentials[1] === 'travel') {
    requestData(`/${loginID}`);
    switchPages();
    loginForm.reset();
  } else {
    alert('Nope');
  }
}

function switchPages() {
  loginForm.classList.toggle('hidden');
  mainDisplay.classList.toggle('hidden');
  userSection.classList.toggle('hidden');
}

function displayUserInfo() {
  userNameDisplay.innerText = user.name;
  yearlyExpenseDisplay.innerText = `$${user.calcYearExpenses(destinationsRepo, 2022)}`;
}

function parseTripDates() {
  user.trips.forEach(trip => {
    trip.date = dayjs(trip.date, "YYYY/MM/DD");
  });
}

function displayUserTrips() {
  tripsSection.innerHTML = '';
  user.trips.forEach(trip => {
    tripsSection.innerHTML += `
    <article>
      <p>Destination: <span class="trip-destination-display">${destinationsRepo.filterData('id', trip.destinationID)[0].destination}</span></p>
      <p>Date: <span class="trip-date-display">${dayjs(trip.date).format('dddd, MMM D, YYYY')}</span></p>
      <p>Duration: <span class="trip-duration-display">${trip.duration}</span> days</p>
      <p>Status: <span class="trip-status-display">${trip.status}</span></p>
    </article>
    `;
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

function validateTripRequest() {
  

}

function requestTrip(event) {
  event.preventDefault();
  
  const tripRequest = new FormData(requestTripForm);
  const values = [...tripRequest.values()];

  const tripRequestData = {
    id: tripsRepo.data.length + 1,
    userID: user.id,
    destinationID: parseInt(values[2]),
    travelers: parseInt(values[1]),
    date: dayjs(dateInput.value).format('YYYY/MM/D'), // Grab date selection
    duration: parseInt(values[0]),
    status: 'pending',
    suggestedActivities: []
  }

  postData('trips', tripRequestData);

  requestTripForm.reset();
}

export { requestData };

// switchPages();
// requestData('/50');