class TravelersRepo {
  constructor(data) {
    this.data = data;
  }

  findTraveler(id) {
    return this.data.find(traveler => traveler.id === id);
  }
}

export default TravelersRepo;