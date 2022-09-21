import Chalk from "chalk";

export default class ChalkHelper {
  static setColumnName(color, columnName) {
    return Chalk[color](columnName);
  }
}
