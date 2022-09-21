class Traveler {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.travelerType = data.travelerType;
    this.trips = [];
  }

  setTrips(repo) {
    if (repo.filterData('userID', this.id)) {
      repo.filterData('userID', this.id)
        .forEach(trip => {
          this.trips.push(trip);
        });
    } 
  }

  filterTrips(property, criteria) {
    return this.trips.filter(trip => trip[property] === criteria);
  }

  calcTripCost(repo, trip) {
    const location = repo.filterData(trip.destinationID)[0];
    let total = ((trip.travelers * location.estimatedFlightCostPerPerson) + (trip.duration * location.estimatedLodgingCostPerDay) * 1.1);
    return total;
  }

  calcYearExpenses(repo, year) {
    return this.trips.reduce((acc, currTrip) => {
      if (currTrip.date >= `${year}/01/01` && currTrip.date <= `${year}/12/31`) {
        acc += this.calcTripCost(repo, currTrip);
      }
      return acc;
    }, 0);
  }
}

export default Traveler;