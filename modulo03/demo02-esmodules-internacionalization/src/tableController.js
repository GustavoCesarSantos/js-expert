import Chalk from "chalk";
import ChalkTable from "chalk-table";

import Person from "./person.js";

export default class TableController {
  constructor() {
    this.data = {};
    this.print = {};
  }

  initializeTable(database, language) {
    this.data = database.map((item) => new Person(item).formatted(language));
    const table = ChalkTable(this.getTableOptions(), this.data);
    this.print = console.draft(table);
  }

  updateTable(newItem) {
    this.data.push(newItem);
    this.print(ChalkTable(this.getTableOptions, this.data));
  }

  getTableOptions() {
    return {
      leftPad: 2,
      columns: [
        { field: "id", name: Chalk.cyan("ID") },
        { field: "vehicles", name: Chalk.cyan("Vehicles") },
        { field: "kmTraveled", name: Chalk.cyan("Km Traveled") },
        { field: "from", name: Chalk.cyan("From") },
        { field: "to", name: Chalk.cyan("To") },
      ],
    };
  }
}
