const BaseRepository = require("../repository/base/baseRepository");

class CarService {
  constructor({ cars }) {
    this.repository = new BaseRepository({ file: cars });
  }

  getRandomPositionFromList(list) {
    return Math.floor(Math.random() * list.length);
  }

  chooseRandomCar(carCategory) {
    const index = this.getRandomPositionFromList(carCategory.carIds);
    return carCategory.carIds[index];
  }

  async getAvailableCategory(carCategory) {
    const cardId = this.chooseRandomCar(carCategory);
    const car = await this.repository.find(cardId);
    return car;
  }
}

module.exports = CarService;
