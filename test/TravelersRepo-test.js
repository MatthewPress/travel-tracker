import chai from 'chai';
const expect = chai.expect;
import travelersData from '../src/data/Travelers-data';

describe('TravelersRepo', () => {

  it('should be a function', () => {
    // expect()
  });

  let travelers;

  beforeEach(() => {
    travelers = new Traveler(travelersData);
  });

  it('should hold data for Travelers', () => {
    // console.log(travelersData);
    expect(travelers.data).to.deep.equal(travelersData);
  });
});