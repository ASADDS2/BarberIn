// server imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/auth.js";
// link passport
import passport from "passport";
import "./passport.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// routes
app.use("/auth", router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server run to http://localhost:${PORT}`));
