const { rejects, deepStrictEqual } = require("node:assert");

const errors = require("./src/errors");
const File = require("./src/file");

(async () => {
  {
    const filePath = "./mocks/emptyFile-invalid.csv";
    const rejection = new Error(errors.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);
    await rejects(result, rejection);
  }
  {
    const filePath = "./mocks/fourItems-invalid.csv";
    const rejection = new Error(errors.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);
    await rejects(result, rejection);
  }
  {
    const filePath = "./mocks/threeItems-valid.csv";
    const result = await File.csvToJson(filePath);
    expected = [
      {
        name: "teste",
        id: 123,
        birthDay: 2002,
        profession: "Software Developer",
      },
      {
        name: "teste2",
        id: 124,
        birthDay: 1992,
        profession: "Software Developer II",
      },
      {
        name: "teste3",
        id: 125,
        birthDay: 1982,
        profession: "Software Developer III",
      },
    ];
    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
})();
