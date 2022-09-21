export default class TerminalController {
  constructor(tableController, readlineHelper) {
    this.terminal = {};
    this.tableController = tableController;
    this.readlineHelper = readlineHelper;
  }

  initializeTerminal(database, language) {
    this.terminal = this.readlineHelper.createInterface();
    this.tableController.initializeTable(database, language);
  }

  closeTerminal() {
    this.terminal.close();
  }

  question(msg = "") {
    return new Promise((resolve) => this.terminal.question(msg, resolve));
  }
}
