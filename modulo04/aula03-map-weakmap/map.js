const { deepStrictEqual, ok } = require("assert");

const myMap = new Map();
myMap
  .set(1, "one")
  .set("Teste", { number: "two" })
  .set(true, () => "Three");

const myMapWithConstructor = new Map([
  [1, "teste1"],
  ["1", "asdfasdf"],
  [true, "asdd"],
]);

// console.log(myMap);
// console.log(myMapWithConstructor);
// console.log(myMapWithConstructor.get(true));

deepStrictEqual(myMap.get(1), "one");
deepStrictEqual(myMap.get("Teste"), { number: "two" });
deepStrictEqual(myMap.get(true)(), "Three");

// ------------------- Utilitarios ------------------------------
const onlyReferenceWorks = { id: "TESTE" };
myMap.set(onlyReferenceWorks, { name: "asdfasd" });

deepStrictEqual(myMap.get({ id: "TESTE" }), undefined);
deepStrictEqual(myMap.get(onlyReferenceWorks), { name: "asdfasd" });
deepStrictEqual(
  JSON.stringify([...myMap]),
  JSON.stringify([
    [1, "one"],
    ["Teste", { number: "two" }],
    [true, null],
    [{ id: "TESTE" }, { name: "asdfasd" }],
  ])
);

// ------------------- Verificar tamanho ------------------------

deepStrictEqual(myMap.size, 4);

// ------------------- Verificar se possui a propriedade ----------

ok(myMap.has(onlyReferenceWorks));

// ------------------- Remover propriedade ------------------------

ok(myMap.delete(onlyReferenceWorks));

// -------------------- Iterar sobre ------------------------------

// for (const [key, value] of myMap) {
//   console.log(key, value);
// }

// -------------------- Limpar ----------------------------

myMap.clear();
deepStrictEqual([...myMap.keys()], []);
