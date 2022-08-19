const { deepStrictEqual } = require("assert");
const sinon = require("sinon");

const Service = require("./service");
const mocks = {
  tatooine: require("./mocks/tatooine.json"),
  alderaan: require("./mocks/alderaan.json"),
};

const BASE_URL_1 = "https://swapi.dev/api/planets/1/";
const BASE_URL_2 = "https://swapi.dev/api/planets/2/";

(async () => {
  const stub = sinon.stub(Service, Service.makeRequest.name);
  stub.withArgs(BASE_URL_1).resolves(mocks.tatooine);
  stub.withArgs(BASE_URL_2).resolves(mocks.alderaan);

  {
    const expect = {
      name: "Tatooine",
      surfaceWater: "1",
      appearedIn: 5,
    };
    const result = await Service.getPlanets(BASE_URL_1);
    deepStrictEqual(result, expect);
  }

  {
    const expect = {
      name: "Alderaan",
      surfaceWater: "40",
      appearedIn: 2,
    };
    const result = await Service.getPlanets(BASE_URL_2);
    deepStrictEqual(result, expect);
  }
})();
