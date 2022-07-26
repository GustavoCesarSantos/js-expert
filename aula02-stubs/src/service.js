const https = require("node:https");

class Service {
  static async makeRequest(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        response.on("data", (data) => resolve(JSON.parse(data)));
        response.on("error", reject);
      });
    });
  }

  static async getPlanets(url) {
    const result = await this.makeRequest(url);
    return {
      name: result.name ?? "Não informado",
      surfaceWater: result.surface_water ?? "Não informado",
      appearedIn: result.films.length ?? "Não informado",
    };
  }
}

module.exports = Service;
