class Repository {
  constructor(data) {
    this.data = data;
  }

  filterData(property, id) {
    return this.data.filter(entry => entry[property] === id);
  }

  addData(entry) {
    this.data.push(entry);
  }

  removeData(id) {
    this.data.forEach((entry, currIndex) => {
      if (entry.id === id) {
        this.data.splice(currIndex , 1);
      }
    });
  }
}

export default Repository;