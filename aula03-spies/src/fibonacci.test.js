const sinon = require("sinon");
const { deepStrictEqual } = require("node:assert");

const Fibonacci = require("./fibonacci");

(async () => {
  {
    const fibonacci = new Fibonacci();
    const spy = sinon.spy(fibonacci, fibonacci.execute.name);
    //Usando for await para pegar o resultado do generator
    for await (const i of fibonacci.execute(3)) {
    }
    const expectedCallCount = 4;
    deepStrictEqual(spy.callCount, expectedCallCount);
  }

  {
    const fibonacci = new Fibonacci();
    const spy = sinon.spy(fibonacci, fibonacci.execute.name);
    //Usando rest/spread para pegar o resultado do generator
    const [...result] = fibonacci.execute(5);
    const { args } = spy.getCall(2);
    const expectedParams = Object.values({
      input: 3,
      current: 1,
      next: 2,
    });
    deepStrictEqual(args, expectedParams);
  }

  {
    const fibonacci = new Fibonacci();
    const spy = sinon.spy(fibonacci, fibonacci.execute.name);
    //Usando rest/spread para pegar o resultado do generator
    const [...result] = fibonacci.execute(5);
    const expectResult = [0, 1, 1, 2, 3];
    deepStrictEqual(result, expectResult);
  }
})();
