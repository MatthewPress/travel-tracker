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

requestData(50);

function setData(data) {
  destinationsRepo = new Repository(data[2].destinations);
  tripsRepo = new Repository(data[1].trips);
  user = new Traveler(data[0]);
  user.setTrips(tripsRepo);
  console.log("user", user);

  displayUserInfo();
}
// DOM ELEMENTS **************************************
const tripsSection = document.querySelector('.trips-section');
const yearlyExpenseDisplay = document.querySelector('.yearly-expense-display');
const userNameDisplay = document.querySelector('.user-name-display');
const userIdDisplay = document.querySelector('.user-id-display');

// EVENT LISTENERS ***********************************



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
