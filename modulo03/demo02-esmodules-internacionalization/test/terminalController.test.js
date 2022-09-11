import mocha from "mocha";
const { describe, it } = mocha;
import chai from "chai";
const { expect } = chai;
import sinon from "sinon";
const { createSandbox } = sinon;

import TerminalController from "../src/terminalController.js";

class TableControllerDummy {
  initializeTable(database, language) {}

  updateTable(newItem) {}

  getTableOptions() {
    return {};
  }
}

class ReadLineHelperDummy {
  createInterface() {
    return {
      close: () => this.close(),
      question: async () => this.question(),
    };
  }

  close() {}

  async question(msg) {
    return;
  }
}

let sandbox = {};

describe("Terminal Controller", () => {
  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a terminal controller", () => {
    const table = new TableControllerDummy();
    const readline = new ReadLineHelperDummy();
    const terminal = new TerminalController(table, readline);
    const expected = {
      terminal: {},
    };
    expect(terminal.terminal).to.be.deep.equal(expected.terminal);
  });

  it("should initialize terminal", () => {
    const table = new TableControllerDummy();
    const readline = new ReadLineHelperDummy();
    const terminal = new TerminalController(table, readline);
    const spyResult = sandbox.spy(table, table.initializeTable.name);
    terminal.initializeTerminal({}, "teste");
    expect(terminal.terminal).to.be.not.equal({});
    expect(spyResult.callCount).to.be.deep.equal(1);
  });

  it("should call close terminal", () => {
    const table = new TableControllerDummy();
    const readline = new ReadLineHelperDummy();
    const terminal = new TerminalController(table, readline);
    terminal.initializeTerminal({}, "teste");
    const spyResult = sandbox.spy(readline, readline.close.name);
    terminal.closeTerminal();
    expect(spyResult.callCount).to.be.deep.equal(1);
  });

  it("should make a question", async () => {
    const table = new TableControllerDummy();
    const readline = new ReadLineHelperDummy();
    const terminal = new TerminalController(table, readline);
    terminal.initializeTerminal({}, "teste");
    const spyResult = sandbox.spy(readline, readline.question.name);
    terminal.question("teste");
    expect(spyResult.callCount).to.be.deep.equal(1);
  });

  it("should send a empty message when message param hasn't pass", () => {
    const table = new TableControllerDummy();
    const readline = new ReadLineHelperDummy();
    const terminal = new TerminalController(table, readline);
    terminal.initializeTerminal({}, "teste");
    const spyResult = sandbox.spy(readline, readline.question.name);
    terminal.question();
    expect(spyResult.callCount).to.be.deep.equal(1);
  });
});
