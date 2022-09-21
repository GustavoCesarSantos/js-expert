import ChalkTable from "chalk-table";

export default class ChalkTableHelper {
  static createTable(options, data) {
    return ChalkTable(options, data);
  }
}
