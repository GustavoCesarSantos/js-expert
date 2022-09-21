import mocha from "mocha";
const { describe, it } = mocha;
import chai from "chai";
const { expect } = chai;
import sinon from "sinon";
const { createSandbox } = sinon;

import TableController from "../src/tableController.js";

class ChalkTableHelperDummy {
  static createTable() {}
}

class DraftLogHelperDummy {
  static addListener() {}
  static draft() {
    return () => {};
  }
}

class ChalkHelperDummy {
  static createTable() {}
  static setColumnName() {
    return "teste";
  }
}

const database = [
  {
    id: 1,
    vehicles: ["Motocicleta", "Carro", "Caminhão"],
    kmTraveled: 10,
    from: "2009-09-09",
    to: "2020-08-09",
  },
];
const default_lang = "pt-BR";
let sandbox = {};

describe("Table Controller", () => {
  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a table controller", () => {
    const table = new TableController(
      ChalkTableHelperDummy,
      DraftLogHelperDummy,
      ChalkHelperDummy
    );
    expect(table.data).to.be.deep.equal({});
    expect(table.print).to.be.deep.equal({});
    expect(table.chalkTableHelper).to.not.be.deep.equal({});
    expect(table.draftLogHelper).to.not.be.deep.equal({});
    expect(table.chalkHelper).to.not.be.deep.equal({});
  });

  it("should initialize a table", () => {
    const table = new TableController(
      ChalkTableHelperDummy,
      DraftLogHelperDummy,
      ChalkHelperDummy
    );
    sandbox.stub(table, table.getTableOptions.name);
    table.initializeTable(database, default_lang);
    expect(table.data).to.not.be.deep.equal({});
    expect(table.print).to.not.be.deep.equal({});
  });

  it("should update the table", () => {
    const table = new TableController(
      ChalkTableHelperDummy,
      DraftLogHelperDummy,
      ChalkHelperDummy
    );
    table.initializeTable(database, default_lang);
    table.updateTable({});
    expect(table.data).to.have.length(2);
  });

  it("should return table options", () => {
    const table = new TableController(
      ChalkTableHelperDummy,
      DraftLogHelperDummy,
      ChalkHelperDummy
    );
    const options = table.getTableOptions();
    const expected = {
      leftPad: 2,
      columns: [
        { field: "id", name: "teste" },
        { field: "vehicles", name: "teste" },
        { field: "kmTraveled", name: "teste" },
        { field: "from", name: "teste" },
        { field: "to", name: "teste" },
      ],
    };
    expect(options).to.be.deep.equal(expected);
  });
});
