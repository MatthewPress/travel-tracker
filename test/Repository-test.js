import chai from 'chai';
const expect = chai.expect;
import Repository from '../src/Repository';
import travelersData from '../src/data/Travelers-data';
import tripsData from '../src/data/Trips-data';

describe('Repository', () => {
  it('should be a function', function () {
    expect(Repository).to.be.a('function');
  });

  it('should hold data an array of data', () => {
    const travelersRepo = new Repository(travelersData);

    expect(travelersRepo.data).to.deep.equal(travelersData);
  });

  it('should have no default data if no data is passed to it', () => {
    const travelersRepo = new Repository();

    expect(travelersRepo.data).to.equal(undefined);
  });

  it('should be able to find a traveler by id', () => {
    const travelersRepo = new Repository(travelersData);

    expect(travelersRepo.findEntry('id', 1)).to.deep.equal(travelersData[0]);
  });

  it('should be able to filter data entries', () => {
    const tripsRepo = new Repository(tripsData);

    expect(tripsRepo.filterEntries('status', 'pending')).to.deep.equal([tripsData[1]])
  });

});