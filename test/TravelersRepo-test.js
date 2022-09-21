import chai from 'chai';
const expect = chai.expect;
import travelersData from '../src/data/Travelers-data';
import TravelersRepo from '../src/TravelersRepo';

describe('TravelersRepo', () => {
  it('should be a function', function () {
    expect(TravelersRepo).to.be.a('function');
  });

  let travelers;

  beforeEach(() => {
    travelers = new TravelersRepo(travelersData);
  });

  it('should hold data for all travelers', () => {
    expect(travelers.data).to.deep.equal(travelersData);
  });

  it('should be able to find a traveler by id', () => {
    expect(travelers.findTraveler(1)).to.deep.equal(travelersData[0]);
  });
});