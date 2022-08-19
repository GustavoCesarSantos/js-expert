const { readFile } = require("node:fs/promises");
const { join } = require("node:path");

const errors = require("./errors");
const User = require("./user");

const DEFAULT_OPTIONS = {
  maxLines: 3,
  fields: ["id", "name", "age", "profession"],
};

class File {
  static async csvToJson(filePath) {
    const content = await this.getFileContent(filePath);
    const validation = this.isValid(content);
    if (!validation.result) throw new Error(validation.error);
    const parsedContent = this.parseCSVToJson(content);
    return parsedContent;
  }

  static async getFileContent(filePath) {
    // const fileName = join(__dirname, filePath);
    return (await readFile(filePath)).toString("utf8");
  }

  static isValid(csvString, options = DEFAULT_OPTIONS) {
    const [header, ...contents] = csvString.split("\n");
    const isAHeaderValid = header === options.fields.join(",");
    if (!isAHeaderValid) {
      return {
        error: errors.FILE_FIELDS_ERROR_MESSAGE,
        result: false,
      };
    }
    const isAContentLengthAccepted =
      contents.length > 0 && contents.length <= options.maxLines;
    if (!isAContentLengthAccepted) {
      return {
        error: errors.FILE_LENGTH_ERROR_MESSAGE,
        result: false,
      };
    }

    return { result: true };
  }

  static parseCSVToJson(csvString) {
    const lines = csvString.split("\n");
    const firstLine = lines.shift();
    const header = firstLine.split(",");
    const jsonContents = lines.map((line) => {
      const columns = line.split(",");
      let result = {};
      for (const index in columns) {
        result[header[index]] = columns[index];
      }
      return new User(result);
    });
    return jsonContents;
  }
}

module.exports = File;
