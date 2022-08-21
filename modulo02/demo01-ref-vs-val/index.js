//Artigo de referencia:
//https://levelup.gitconnected.com/understanding-call-stack-and-heap-memory-in-js-e34bf8d3c3a4

const { deepStrictEqual } = require("assert");

//O tipo primitivo gera uma nova referencia em memória a cada mudança no valor
//como visto no exemplo acima, ao adicionar mais 1 à variavel counter, uma nova
// referencia em memória é criada para guardar o novo valor
let counter = 0;
const counter2 = counter;
counter++;
deepStrictEqual(counter, 1);
deepStrictEqual(counter2, 0);

//O tipo mutavel como arrays e objetos geram uma referencia em memória para
//guardar seu valor, diferente dos tipos primitivos, ao ocorrem mudanças de valor
// nos tipos mutaveis, a referencia em memória não muda.
const item = { xpto: 0 };
const item2 = item;
item.xpto = 1;
//item === { xpto = 1 }
//item2 === { xpto = 1 }
deepStrictEqual(item, { xpto: 1 });
deepStrictEqual(item2, { xpto: 1 });
