// DEPENDENCIES **************************************
import './css/styles.css';
// import './images/turing-logo.png'
import Traveler from './Traveler';
import Repository from './Repository';

// GLOBAL DATA ***************************************
let destinationsRepo;
let tripsRepo;
let user;
let travelersRepo;
let currentDate;

// FETCH DATA ****************************************
function requestData(id) {
  Promise.all([getData(`travelers/${id}`), getData('trips'), getData('destinations')])
    .then((data) => {
      setData(data);
    });
}

function getData(path) {
  return fetch(`http://localhost:3001/api/v1/${path}`)
    .then(response => {
      return response.json();
    })
}

function postData(path, request) {
  const entry = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  };

  return fetch(`http://localhost:3001/api/v1/${path}`, entry)
    .then(response => {
      return response.json();
    })
    .then(() => {
      requestData(50);
    })
}

function setData(data) {
  destinationsRepo = new Repository(data[2].destinations);
  tripsRepo = new Repository(data[1].trips);
  user = new Traveler(data[0]);
  user.setTrips(tripsRepo);
  console.log('user', user);

  displayUserInfo();
  populateLocationChoices();
}

// DOM ELEMENTS **************************************
const loginSection = document.querySelector('.login-section');
const loginForm = document.forms[0];
const loginBtn = document.querySelector('.login-btn');

const mainDisplay = document.querySelector('main');

const requestTripForm = document.forms[1];
const locationChoices = document.querySelector('.location-choices');
const requestTripBtn = document.querySelector('.request-trip-btn');

const tripsSection = document.querySelector('.user-trips-section');
const yearlyExpenseDisplay = document.querySelector('.yearly-expense-display');
const userNameDisplay = document.querySelector('.user-name-display');
const userIdDisplay = document.querySelector('.user-id-display');

// EVENT LISTENERS ***********************************
loginBtn.addEventListener('click', login);
requestTripBtn.addEventListener('click', requestTrip);

// EVENT HANDLERS ************************************
function login(event) {
  event.preventDefault();

  const loginData = new FormData(loginForm);
  const loginCredentials = [...loginData.values()];
  console.log(loginCredentials);

  if (validateLogin(loginCredentials[1])) {
    const loginID = parseInt(loginCredentials[0]);
    requestData(loginID);
    loginForm.reset();
  } else {
    alert('Nope');
  }
}

function validateLogin(passwordAttempt) {
  return passwordAttempt === 'travel';
}

function displayUserInfo() {
  userNameDisplay.innerText = user.name;
  userIdDisplay.innerText = user.id;

  tripsSection.innerHTML = '';
  user.trips.forEach(trip => {
    tripsSection.innerHTML += `
    <article>
      <p>Destination: <span class="trip-destination-display">${destinationsRepo.filterData('id', trip.destinationID)[0].destination}</span></p>
      <p>Duration: <span class="trip-duration-display">${trip.duration}</span> days</p>
      <p>Status: <span class="trip-status-display">${trip.status}</span></p>
      <p>Date: <span class="trip-date-display">${trip.date}</span></p>
    </article>
    `;
  });

  yearlyExpenseDisplay.innerText = `$${user.calcYearExpenses(destinationsRepo, 2022)}`;
 
  loginSection.classList.toggle('hidden');
  mainDisplay.classList.toggle('hidden');

  console.log('trips repo length', tripsRepo.length);
}

function populateLocationChoices() {
  locationChoices.innerHTML = '';
  destinationsRepo.data.forEach(location => {
    locationChoices.innerHTML += `
    <option value="${location.id}">${location.destination}</option>
    `;
  })
}

function requestTrip(event) {
  event.preventDefault();
  
  const requestedTrip = new FormData(requestTripForm);
  const values = [...requestedTrip.values()];
  
  const requestedTripData = {
    id: tripsRepo.length,
    userID: user.id,
    destinationID: parseInt(values[2]),
    travelers: parseInt(values[1]),
    date: '2022/12/30', // Grab date selection
    duration: parseInt(values[0]),
    status: 'pending',
    suggestedActivities: []
  }

  postData('trips', requestedTripData);

  requestTripForm.reset();
}