import ReadLine from "readline";

export default class ReadLineHelper {
  createInterface() {
    return ReadLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
}
