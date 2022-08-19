const { join } = require("node:path");
const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");

const CarService = require("../../src/service/carService");

const carsDatabase = join(__dirname, "./../../database", "cars.json");
const mocks = {
  validCar: require("../mocks/car-valid.json"),
  validCarCategory: require("../mocks/carCategory-valid.json"),
  validCustomer: require("../mocks/customer-valid.json"),
};

describe("Car Service Suite Tests", () => {
  let carService = {};
  let sandbox = {};
  before(() => {
    carService = new CarService({ cars: carsDatabase });
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should retrieve a random position from a list", () => {
    const data = [0, 1, 2, 3, 4];
    const result = carService.getRandomPositionFromList(data);
    expect(result).to.be.lte(data.length).and.be.gte(0);
  });

  it("should choose the first id from carIds in carCategory", () => {
    const carCategory = mocks.validCarCategory;
    const carIdIndex = 0;
    sandbox
      .stub(carService, carService.getRandomPositionFromList.name)
      .returns(carIdIndex);
    const result = carService.chooseRandomCar(carCategory);
    const expected = carCategory.carIds[carIdIndex];
    expect(carService.getRandomPositionFromList.calledOnce).to.be.ok;
    expect(result).to.be.equal(expected);
  });

  it("given a car cartegory it should return  an available car", async () => {
    const car = mocks.validCar;
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIds = [car.id];
    sandbox
      .stub(carService.repository, carService.repository.find.name)
      .resolves(car);
    sandbox.spy(carService, carService.chooseRandomCar.name);
    const result = await carService.getAvailableCategory(carCategory);
    const expected = car;
    expect(carService.chooseRandomCar.calledOnce).to.be.ok;
    expect(carService.repository.find.calledWithExactly(car.id)).to.be.ok;
    expect(result).to.be.deep.equal(expected);
  });
});
