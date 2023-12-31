import fs from "node:fs/promises";
import prettyBytes from "pretty-bytes";

export class FileHelper {
  static async getFilesStatus(folder) {
    const files = await fs.readdir(folder);
    const statuses = await Promise.all(
      files.map((file) => fs.stat(`${folder}/${file}`))
    );
    const result = [];
    for (const fileIndex in files) {
      result.push({
        size: prettyBytes(statuses[fileIndex].size),
        lastModified: statuses[fileIndex].birthtime,
        owner: "system_user",
        file: files[fileIndex],
      });
    }
    return result;
  }
}
