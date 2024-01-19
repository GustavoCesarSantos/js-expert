import UploadHandler from "../../../src/utils/uploadHandler";
import TestUtil from "../../_util/testUtil";

describe("#UploadHandler test suite", () => {
  const ioObj = {
    to: (id) => ioObj,
    emit: (event, message) => {},
  };

  describe("registerEvents", () => {
    test("should call onFile and onFinish on Busboy instance", () => {
      const uploadHandler = new UploadHandler({
        io: ioObj,
        socketId: "1",
      });
      const fileStream = TestUtil.generateReadableStream([
        "chunk01",
        "chunk02",
        "chunk03",
      ]);
      jest.spyOn(uploadHandler, uploadHandler.onFile.name).mockResolvedValue();
      const headers = {
        "Content-Type": "multipart/form-data; boundary=",
      };
      const onFinish = jest.fn();
      const busboyInstance = uploadHandler.registerEvents(headers, onFinish);
      busboyInstance.emit("file", "fieldname", fileStream, "filename.txt");
      expect(uploadHandler.onFile).toHaveBeenCalled();
    });
  });
});
