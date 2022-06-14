const app = express();
import express from "express";
import cors from "cors";
import morgan from "morgan";

import {componentModule} from "../src/components/index.js"

app.use(express.static("public"));

app.use(morgan("dev"));
app.use(express.json({ limit: "32mb", extended: true }));
app.use(express.urlencoded({ limit: "32mb", extended: true }));


app.use(cors());


app.use("/api/user", componentModule.userModule.routes)
app.use("/api/product", componentModule.productModule.routes)

export default app;
