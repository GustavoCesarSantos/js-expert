export default class ConnectionManager {
  constructor({ apiUrl }) {
    this.apiUrl = apiUrl;
  }

  async currentFile() {
    const files = await (await fetch(this.apiUrl)).json();
    return files;
  }
}
