import Person from "./person.js";

export default class TableController {
  constructor(chalkTableHelper, draftLogHelper, chalkHelper) {
    this.data = {};
    this.print = {};
    this.chalkTableHelper = chalkTableHelper;
    this.draftLogHelper = draftLogHelper;
    this.chalkHelper = chalkHelper;
  }

  initializeTable(database, language) {
    this.draftLogHelper.addListener();
    this.data = database.map((item) => new Person(item).formatted(language));
    const table = this.chalkTableHelper.createTable(
      this.getTableOptions(),
      this.data
    );
    this.print = this.draftLogHelper.draft(table);
  }

  updateTable(newItem) {
    this.data.push(newItem);
    this.print(
      this.chalkTableHelper.createTable(this.getTableOptions(), this.data)
    );
  }

  getTableOptions() {
    return {
      leftPad: 2,
      columns: [
        { field: "id", name: this.chalkHelper.setColumnName("cyan", "ID") },
        {
          field: "vehicles",
          name: this.chalkHelper.setColumnName("cyan", "Vehicles"),
        },
        {
          field: "kmTraveled",
          name: this.chalkHelper.setColumnName("cyan", "Km Traveled"),
        },
        { field: "from", name: this.chalkHelper.setColumnName("cyan", "From") },
        { field: "to", name: this.chalkHelper.setColumnName("cyan", "To") },
      ],
    };
  }
}
