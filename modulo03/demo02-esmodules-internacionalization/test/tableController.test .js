// import mocha from "mocha";
// const { describe, it } = mocha;
// import chai from "chai";
// const { expect } = chai;
// import sinon from "sinon";
// const { spy, stub } = sinon;

// import TerminalController from "../src/terminalController.js";

// const database = [
//   {
//     id: 1,
//     vehicles: ["Motocicleta", "Carro", "Caminhão"],
//     kmTraveled: 10,
//     from: "2009-09-09",
//     to: "2020-08-09",
//   },
// ];
// const default_lang = "pt-BR";

// describe("Terminal Controller", () => {
//   it("should create a terminal controller", () => {
//     const terminal = new TerminalController();
//     const expected = {
//       terminal: {},
//       data: {},
//       print: {},
//     };
//     expect(terminal.terminal).to.be.deep.equal(expected.terminal);
//     expect(terminal.data).to.be.deep.equal(expected.data);
//     expect(terminal.print).to.be.deep.equal(expected.print);
//   });

//   it("should return table options", () => {
//     const terminal = new TerminalController();
//     const options = terminal.getTableOptions();
//     const expected = {
//       leftPad: 2,
//       columns: [
//         { field: "id", name: "\x1B[36mID\x1B[39m" },
//         { field: "vehicles", name: "\x1B[36mVehicles\x1B[39m" },
//         { field: "kmTraveled", name: "\x1B[36mKm Traveled\x1B[39m" },
//         { field: "from", name: "\x1B[36mFrom\x1B[39m" },
//         { field: "to", name: "\x1B[36mTo\x1B[39m" },
//       ],
//     };
//     expect(options).to.be.deep.equal(expected);
//   });
// });
