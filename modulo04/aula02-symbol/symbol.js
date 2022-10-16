const { deepStrictEqual, throws } = require("assert");

// ---------------- Keys ------------------
const user = {};
// Sempre único em nível de endereço de memória
const uniqueKey = Symbol("userName");

user["userName"] = "Value for normal object";
user[uniqueKey] = "Value for symbol";
// console.log("Getting normal object: ", user.userName);
// console.log("Getting symbol: ", user[Symbol("userName")]);
// console.log("Getting normal object: ", user[uniqueKey]);
// console.log("symbol", Object.getOwnPropertySymbols(user)[0]);

deepStrictEqual(user.userName, "Value for normal object");
deepStrictEqual(user[Symbol("userName")], undefined);
deepStrictEqual(user[uniqueKey], "Value for symbol");
deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey);

// Well Known Symbols
const obj = {
  // iterators
  [Symbol.iterator]: () => ({
    items: ["c", "b", "a"],
    next() {
      return {
        done: this.items.length === 0,
        // remove o ultimo e retorna
        value: this.items.pop(),
      };
    },
  }),
};

// for( const item of obj) {
//     console.log('item', item)
// }

deepStrictEqual([...obj], ["a", "b", "c"]);

const kItems = Symbol("kItems");
class MyDate {
  constructor(...args) {
    this[kItems] = args.map((arg) => new Date(...arg));
  }
  [Symbol.toPrimitive](coercionType) {
    if (coercionType !== "string") throw new TypeError();

    const itens = this[kItems].map((item) =>
      new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(item)
    );

    return new Intl.ListFormat("pt-BR", {
      style: "long",
      type: "conjunction",
    }).format(itens);
  }
  *[Symbol.iterator]() {
    for (const item of this[kItems]) {
      yield item;
    }
  }

  async *[Symbol.asyncIterator]() {
    const timeout = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const item of this[kItems]) {
      await timeout(100);
      yield item.toISOString();
    }
  }
  get [Symbol.toStringTag]() {
    return "WHAT?";
  }
}

const myDate = new MyDate([2020, 03, 01], [2018, 02, 02]);

const expectedDates = [new Date(2020, 03, 01), new Date(2018, 02, 02)];

deepStrictEqual(Object.prototype.toString.call(myDate), "[object WHAT?]");
throws(() => myDate + 1, TypeError);

// coercao explicita para chamar o toPrimitive
deepStrictEqual(String(myDate), "01 de abril de 2020 e 02 de março de 2018");

// implementar o iterator!
deepStrictEqual([...myDate], expectedDates);

// ;(async() => {
//     for await(const item of myDate) {
//         console.log('asyncIterator', item)
//     }
// })()
(async () => {
  const dates = await Promise.all([...myDate]);
  deepStrictEqual(dates, expectedDates);
})();
