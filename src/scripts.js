// DEPENDENCIES **************************************
import './css/styles.css';
// import './images/turing-logo.png'
import Traveler from './Traveler';
import Repository from './Repository';

// GLOBAL DATA ***************************************
let travelersRepo;
let destinationsRepo;
let tripsRepo;
let user;
let currentDate;

// FETCH DATA ****************************************
requestData(50);

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
  console.log("user", user);

  displayUserInfo();
  populateLocationChoices();
}
// DOM ELEMENTS **************************************
const tripsSection = document.querySelector('.trips-section');
const yearlyExpenseDisplay = document.querySelector('.yearly-expense-display');
const userNameDisplay = document.querySelector('.user-name-display');
const userIdDisplay = document.querySelector('.user-id-display');
const requestTripForm = document.forms[0];
const locationChoices = document.querySelector('.location-choices');
const requestTripBtn = document.querySelector('.request-trip-btn');

// EVENT LISTENERS ***********************************
requestTripBtn.addEventListener('click', requestTrip);


// EVENT HANDLERS ************************************
function displayUserInfo() {
  userNameDisplay.innerText = user.name;
  userIdDisplay.innerText = user.id;
  
  tripsSection.innerHTML = "";
  user.trips.forEach(trip => {
    tripsSection.innerHTML += `
    <article>
      <p>Destination: <span class="trip-destination-display">${destinationsRepo.filterData('id', trip.destinationID)[0].destination}</span></p>
      <p>Duration: <span class="trip-duration-display">${trip.duration}</span> days</p>
      <p>Status: <span class="trip-status-display">${trip.status}</span></p>
      <p>Date: <span class="trip-date-display">${trip.date}</span></p>
    </article>
    `;
  })

  yearlyExpenseDisplay.innerText = `$${user.calcYearExpenses(destinationsRepo, 2022)}`;
}

function populateLocationChoices() {
  locationChoices.innerHTML = "";
  destinationsRepo.data.forEach(location => {
    locationChoices.innerHTML += `
    <option value="${location.id}">${location.destination}</option>
    `;
  })
}

function requestTrip(event) {
  event.preventDefault();
  
  const formData = new FormData(requestTripForm);
  const values = [...formData.values()];

  const requestedTripData = {
    id: 9999, // Make dynamic
    userID: user.id,
    destinationID: parseInt(values[2]),
    travelers: parseInt(values[1]),
    date: '2022/12/30', // Grab date selection
    duration: parseInt(values[0]),
    status: "pending",
    suggestedActivities: []
  }

  postData('trips', requestedTripData);
  // reset the form
}