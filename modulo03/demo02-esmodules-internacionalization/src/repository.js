import { writeFile, readFile } from "fs/promises";

export const save = async (person) => {
  const { pathname: pathToDatabase } = new URL(
    "./../database.json",
    import.meta.url
  );
  const currentData = JSON.parse(await readFile(pathToDatabase));
  currentData.push(person);
  await writeFile(pathToDatabase, JSON.stringify(currentData));
};
