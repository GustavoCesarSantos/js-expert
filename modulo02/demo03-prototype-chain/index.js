const { deepStrictEqual } = require("assert");

const obj = {};
const arr = [];
const fn = () => {};

//Internamente objetos literais viram funções explicitas
console.log("new Object is {}? ", new Object().__proto__ === {}.__proto__);
deepStrictEqual(new Object().__proto__, {}.__proto__);

//__proto__ é a referencia do objeto pai que possui as propriedades que o filho possui
//prototype é onde estão todas a propriedades e métodos do objeto pai.
console.log(
  "obj.__proto__ is equal a Object.prototype? ",
  obj.__proto__ === Object.prototype
);
deepStrictEqual(obj.__proto__, Object.prototype);

console.log(
  "arr.__proto__ is equal a Array.prototype? ",
  arr.__proto__ === Array.prototype
);
deepStrictEqual(arr.__proto__, Array.prototype);

console.log(
  "fn.__proto__ is equal a Function.prototype? ",
  fn.__proto__ === Function.prototype
);
deepStrictEqual(fn.__proto__, Function.prototype);

//O __proto__ de Object.prototype é null
console.log(
  "O __proto__ de Object.prototype é null? ",
  obj.__proto__.__proto__ === null
);
deepStrictEqual(obj.__proto__.__proto__, null);

// ------------------------------------------------------------------------
console.log(
  "-------------------------------------------------------------------"
);

// ES5
function Employee() {}
Employee.prototype.salary = () => "salary**";

function Supervisor() {}
//Criando herança de Employee
Supervisor.prototype = Object.create(Employee.prototype);
Supervisor.prototype.profitShare = () => "profitShare**";

function Manager() {}
Manager.prototype = Object.create(Supervisor.prototype);
Supervisor.prototype.monthlyBonus = () => "monthlyBonus";
