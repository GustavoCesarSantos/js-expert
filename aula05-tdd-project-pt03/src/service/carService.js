const Tax = require("../entities/tax");
const Transaction = require("../entities/transaction");
const BaseRepository = require("../repository/base/baseRepository");

class CarService {
  constructor({ cars }) {
    this.repository = new BaseRepository({ file: cars });
    this.taxesBasedOnAge = Tax.taxesBasedOnAge;
    this.currencyFormat = new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    });
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

  calculateFinalPrice(customer, carCategory, numberOfDays) {
    const { age } = customer;
    const price = carCategory.price;
    const { then: tax } = this.taxesBasedOnAge.find(
      (tax) => age >= tax.from && age <= tax.to
    );
    const finalPrice = tax * price * numberOfDays;
    return this.currencyFormat.format(finalPrice);
  }

  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCategory(carCategory);
    const finalPrice = await this.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    );
    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dueDate = today.toLocaleDateString("pt-br", options);
    return new Transaction({
      customer,
      car,
      amount: finalPrice,
      dueDate,
    });
  }
}

module.exports = CarService;
