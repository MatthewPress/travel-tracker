class Repository {
  constructor(data) {
    this.data = data;
  }

  findEntry(property, value) {
    return this.data.find(entry => entry[property] === value);
  }

  filterEntries(property, value) {
    return this.data.filter(entry => entry[property] === value);
  }
}

export default Repository;