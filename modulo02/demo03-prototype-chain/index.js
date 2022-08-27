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
Manager.prototype.monthlyBonus = () => "monthlyBonus";

// Podemos chamar via prototype, mas se tentar chamar direto da erro!
// console.log("Manager.prototype.salary()", Manager.salary());
console.log("Manager.prototype.salary()", Manager.prototype.salary());

// Se não chamar utilizar o "new" , o primeiro __proto__ vai ser sempre
//a instancia de Function, sem herdar nossas classes.
// Para acessar as classes sem  new, pode acessar direto via prototype
console.log(
  "Manager.prototype.__proto__ === Supervisor.prototype",
  Manager.prototype.__proto__ === Supervisor.prototype
);
deepStrictEqual(Manager.prototype.__proto__, Supervisor.prototype);

// Quando chamamos com o "new", o __proto__ recebe o prototype atual do objeto
console.log(
  "new Manager().__proto__: %s, new Maganer().salary: %s",
  new Manager().__proto__,
  new Manager().salary()
);
console.log(
  "Supervisor.prototype === new Manager().__proto__.__proto__",
  Supervisor.prototype === new Manager().__proto__.__proto__
);
deepStrictEqual(Supervisor.prototype, new Manager().__proto__.__proto__);

const manager = new Manager();
console.log("Manager Salary:", manager.salary());
console.log("Manager Profit Share:", manager.profitShare());
console.log("Manager Monthly Bonus:", manager.monthlyBonus());
deepStrictEqual(manager.__proto__, Manager.prototype);
deepStrictEqual(manager.__proto__.__proto__, Supervisor.prototype);
deepStrictEqual(manager.__proto__.__proto__.__proto__, Employee.prototype);
deepStrictEqual(
  manager.__proto__.__proto__.__proto__.__proto__,
  Object.prototype
);
deepStrictEqual(
  manager.__proto__.__proto__.__proto__.__proto__.__proto__,
  null
);
