const express = require("express");
const { Pool } = require("pg");
const { pipeline } = require("node:stream/promises");
const { createWriteStream } = require("node:fs");

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

async function* breakLines(data) {
  for await (const line of data) {
    const breakedLine = `${line.toString()}\n`;
    yield breakedLine;
  }
}

app.get("/", async (req, res) => {
  try {
    await pipeline(getRows, breakLines, res);
    // res.status(200).send("tudo ok");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao enviar resposta");
  }
});

const port = 4001;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
