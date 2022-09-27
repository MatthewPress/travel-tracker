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

export default Traveler;