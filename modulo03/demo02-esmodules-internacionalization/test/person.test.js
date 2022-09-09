import mocha from "mocha";
const { describe, it } = mocha;
import chai from "chai";
const { expect } = chai;

import Person from "../src/person.js";

describe("Person", () => {
  it("should return a person instance from a string", () => {
    const person = Person.generateInstanceFromString(
      "1 Bike,Carro 200 2020-09-09 2021-08-08"
    );
    const expected = {
      id: "1",
      vehicles: ["Bike", "Carro"],
      kmTraveled: "200",
      from: "2020-09-09",
      to: "2021-08-08",
    };
    expect(person).to.be.deep.equal(expected);
  });

  it("should format values", () => {
    const person = new Person({
      id: "1",
      vehicles: ["Bike", "Carro"],
      kmTraveled: "200",
      from: "2020-09-09",
      to: "2021-08-08",
    });
    const result = person.formatted("pt-BR");
    const expected = {
      id: 1,
      vehicles: "Bike e Carro",
      kmTraveled: "200 km",
      from: "09 de setembro de 2020",
      to: "08 de agosto de 2021",
    };
    expect(result).to.be.deep.equal(expected);
  });
});
