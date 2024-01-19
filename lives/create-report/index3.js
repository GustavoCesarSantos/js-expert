const { createWriteStream } = require("node:fs");
const { pipeline } = require("node:stream/promises");
const { Transform } = require("node:stream");

const express = require("express");
const { Pool } = require("pg");
const QueryStream = require("pg-query-stream");

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

app.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM sua_tabela LIMIT $1";
    const queryStream = new QueryStream(query, [1000000], { batchSize: 1000 });
    const transformStream = new Transform({
      objectMode: true,
      transform(row, encoding, callback) {
        callback(
          null,
          `id: ${row.id}, campo1: ${row.campo1}, campo2: ${row.campo2}\n`
        );
      },
    });
    const fileWriteStream = createWriteStream("output.csv");
    const client = await pool.connect();
    const stream = client.query(queryStream);
    await pipeline(stream, transformStream, fileWriteStream);
    //   res.setHeader("Content-Type", "text/csv");
    //   res.setHeader("Content-Disposition", "attachment; filename=output.csv");
    //   res.attachment("output.csv");
    console.info("Finished");
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao enviar resposta");
  }
});

const port = 4002;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
