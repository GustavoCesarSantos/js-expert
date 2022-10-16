const { deepStrictEqual } = require("assert");

function* calculate(arg1, arg2) {
  yield arg1 * arg2;
}

function* main() {
  yield "Hello";
  yield "-";
  yield "World";
  yield* calculate(10, 10);
}

const generator = main();
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());

deepStrictEqual(generator.next(), { value: "Hello", done: false });
deepStrictEqual(generator.next(), { value: "-", done: false });
deepStrictEqual(generator.next(), { value: "World", done: false });
deepStrictEqual(generator.next(), { value: 100, done: false });
deepStrictEqual(generator.next(), { value: undefined, done: true });
deepStrictEqual(Array.from(main()), ["Hello", "-", "World", 100]);
deepStrictEqual([...main()], ["Hello", "-", "World", 100]);

// ---------------------------- async iterators ------------------------------
const { readFile, stat, readdir } = require("fs/promises");
function* promisified() {
  yield readFile(__filename);
  yield Promise.resolve("Hey");
}

// Promise.all([...promisified()]).then((results) =>
//   console.log("Promisified: ", results)
// );
// (async () => {
//   for await (const item of promisified()) {
//     console.log("for await ", item.toString());
//   }
// })();

async function* systemInfo() {
  const file = await readFile(__filename);
  yield { file: file.toString() };
  const { size } = await stat(__filename);
  yield { size };
  const dir = await readdir(__dirname);
  yield { dir };
}
(async () => {
  for await (const item of systemInfo()) {
    console.log("for await ", item);
  }
})();
