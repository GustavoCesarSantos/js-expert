import database from "../database.json" assert { type: "json" };
import Person from "./person.js";
import TableController from "./tableController.js";
import TerminalController from "./terminalController.js";
import { save } from "./repository.js";
import ReadLineHelper from "./readlineHelper";

const default_lang = "pt-BR";
const stop_term = ":q";
const table = new TableController();
const readline = new ReadLineHelper();
const terminal = new TerminalController(table, readline);
terminal.initializeTerminal(database, default_lang);
async function mainLoop() {
  try {
    const answer = await terminal.question("What ?");
    if (answer === stop_term) {
      terminal.closeTerminal();
      console.log("Terminal closed!!!");
      return;
    }
    const person = Person.generateInstanceFromString(answer);
    table.updateTable(person.formatted(default_lang));
    await save(person);
    return mainLoop();
  } catch (error) {
    console.error("Error: ", error);
    return mainLoop();
  }
}
await mainLoop();
