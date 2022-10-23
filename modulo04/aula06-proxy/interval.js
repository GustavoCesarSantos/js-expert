const proxy = require("./proxy");
//-------------------------- Ordem de execução -------------------------------
// 1
// executa agora, agorinha, mas acaba com o ciclo de vida do node
process.nextTick(() => {
  proxy.counter = 2;
  console.log("[0]: nextTick");
});

// 2
// se quer que executa agora
setImmediate(() => {
  console.log("[1]: setImmediate", proxy.counter);
});

// 3
// futuro
setTimeout(() => {
  proxy.counter = 4;
  console.log("[2]: timeout");
}, 100);

// 4
// jajá e sempre!
setInterval(function () {
  proxy.counter += 1;
  console.log("[3]: setInterval");
  if (proxy.counter === 10) clearInterval(this);
}, 200);
