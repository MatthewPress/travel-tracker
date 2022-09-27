import chai from 'chai';
const expect = chai.expect;
import Traveler from '../src/Traveler';
import Repository from '../src/Repository';
import travelersData from '../src/data/Travelers-data';
import tripsData from '../src/data/Trips-data';

describe('Traveler', () => {
  it('should be a function', () => {
    expect(Traveler).to.be.a('function');
  });

  let user;
  let tripsRepo;

  beforeEach(() => {
    user = new Traveler(travelersData[0]);
    tripsRepo = new Repository(tripsData);
  });

  it('should hold data for a traveler', () => {
    Object.keys(travelersData[0])
      .forEach(key => {
        expect(user[key]).to.equal(travelersData[0][key]);
      });
  });

  it('should be able to find its trips', () => {
    user.setTrips(tripsRepo);
    const userTrips = [tripsData[0], tripsData[1], tripsData[2]]

    expect(user.trips).to.deep.equal(userTrips);
    // test to see what happens when no trips are found (use a user with a crazy id)
  });

});