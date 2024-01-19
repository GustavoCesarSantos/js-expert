const express = require("express");
const { Pool } = require("pg");
const { pipeline } = require("node:stream/promises");

const app = express();
app.use(express.json());

const pgConfig = {
  user: "seu_usuario",
  host: "localhost",
  database: "seu_usuario",
  password: "sua_senha",
  port: 5432,
};
const pool = new Pool({
  host: pgConfig.host,
  user: pgConfig.user,
  password: pgConfig.password,
  port: pgConfig.port,
  database: pgConfig.database,
});

async function* getRows() {
  pool.connect();
  const query = "SELECT * FROM sua_tabela LIMIT 1000000";
  const { rows } = await pool.query(query);
  for (const item of rows) {
    yield JSON.stringify(item);
  }
}

function sendResponse(response) {
  async function* writeData(data) {
    for await (const item of data) {
      response.write(JSON.stringify(JSON.parse(item)));
    }
    response.end();
  }
  return writeData.bind(this);
}

app.get("/", async (req, res) => {
  try {
    await pipeline(getRows, sendResponse(res));
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao enviar resposta");
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
