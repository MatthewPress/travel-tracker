import chai from 'chai';
const expect = chai.expect;
import travelersData from '../src/data/Travelers-data';
import tripsData from '../src/data/Trips-data';
import destinationsData from '../src/data/Destinations-data';
import Repository from '../src/Repository';

describe('Repository', () => {
  it('should be a function', function () {
    expect(Repository).to.be.a('function');
  });

  let travelersRepo;
  let tripsRepo;
  let destinationsRepo;
  let user;

  beforeEach(() => {
    travelersRepo = new Repository(travelersData);
    tripsRepo = new Repository(tripsData);
    destinationsRepo = new Repository(destinationsData);
  });

  it('should hold data for all travelers', () => {
    expect(travelersRepo.data).to.deep.equal(travelersData);
  });

  it('should be able to find a traveler by id', () => {
    expect(travelersRepo.filterData(1)[0]).to.deep.equal(travelersData[0]);
  });

});