9999999999999999; // 10000000000000000
true + 2; // 3
"21" + true; // '21true'
"21" - true; // 20
//'21' -- 1 // 22
0.1 + 0.2 === 0.3; // false
3 > 2 > 1; // false
3 > 2 >= 1; // true
"B" + "a" + +"a" + "a"; // BaNaNa

// -----------------------------------------------------------

console.assert(String(123) === "123", "Explicit conversion string");
console.assert(123 + "" === "123", "Implicit conversion string");

// -----------------------------------------------------------

const item = {
  name: "Teste",
  age: 23,
  //Se o tipo da conversão for string, vai chamar esta função toString() primeiro e se falhar chama o valueOf()
  toString() {
    return `Name: ${this.name}, Age: ${this.age}`;
  },
  //Se o tipo da conversão for number, vai chamar esta função valueOf() primeiro e se falhar chama o toString()
  valueOf() {
    return 007;
  },
  //Se implementada, essa função tem prioridade em relação ao toString() e valueOf()
  [Symbol.toPrimitive](coercionType) {
    console.log("Trying to convert to: ", coercionType);
    const types = {
      string: JSON.stringify(this),
      number: "007",
    };
    return types[coercionType];
  },
};

console.log(String(item));
console.log(Number(item));

console.assert(item + 0 === '{"name":"ErickWendel","age":25}0');
// console.log('!!item is true?', !!item)
console.assert(!!item);

// console.log('string.concat', 'Ae'.concat(item))
console.assert("Ae".concat(item) === 'Ae{"name":"ErickWendel","age":25}');

// console.log('implicit + explicit coercion (using ==)', item == String(item))
console.assert(item == String(item));

const item2 = { ...item, name: "Zézin", age: 20 };
// console.log('New Object', item2)
console.assert(item2.name === "Zézin" && item2.age === 20);
