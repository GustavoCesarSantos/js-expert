import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { routes } from "./src/routes.js";
import swaggerDocument from "./docs/swagger.json" assert { type: "json" };

const app = express();
app.use(express.json());
const router = express.Router();
routes(router);
app.use(router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(process.env.PORT, () =>
  console.log(`Server run at port: ${process.env.PORT}`)
);
