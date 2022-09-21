import DraftLog from "draftlog";

export default class DraftLogHelper {
  static addListener() {
    DraftLog(console).addLineListener(process.stdin);
  }

  static draft(table) {
    return console.draft(table);
  }
}
