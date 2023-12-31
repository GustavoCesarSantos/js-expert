import { describe, test, expect, jest } from "@jest/globals";
import fs from "node:fs/promises";

import { FileHelper } from "../../../src/utils/fileHelper";

describe("File helper", () => {
  describe("getFilesStatus", () => {
    test("it should return files statuses in correct format", async () => {
      const fileStats = {
        dev: 2080,
        mode: 33188,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 210217,
        size: 337522,
        blocks: 664,
        atimeMs: 1703819600255.185,
        mtimeMs: 1703819595425.1868,
        ctimeMs: 1703819595425.1868,
        birthtimeMs: 1703819594855.1868,
        atime: "2023-12-29T03:13:20.255Z",
        mtime: "2023-12-29T03:13:15.425Z",
        ctime: "2023-12-29T03:13:15.425Z",
        birthtime: "2023-12-29T03:13:14.855Z",
      };
      const mockUser = "system_user";
      const filename = "file.png";
      jest.spyOn(fs, fs.readdir.name).mockResolvedValue([filename]);
      jest.spyOn(fs, fs.stat.name).mockResolvedValue(fileStats);
      const result = await FileHelper.getFilesStatus("/tmp");
      const expectedResult = [
        {
          size: "338 kB",
          lastModified: fileStats.birthtime,
          owner: mockUser,
          file: filename,
        },
      ];
      expect(fs.stat).toHaveBeenCalledWith(`/tmp/${filename}`);
      expect(result).toMatchObject(expectedResult);
    });
  });
});
