class Repository {
  constructor(data) {
    this.data = data;
  }

  findEntry(property, id) {
    return this.data.find(entry => entry[property] === id);
  }

  filterEntries(property, id) {
    return this.data.filter(entry => entry[property] === id);
  }
}

export default Repository;