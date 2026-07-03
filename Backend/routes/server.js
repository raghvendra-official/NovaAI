//App
import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

//For Backend and frontend communication
app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);
//Mongoose

main()
  .then((res) => {
    console.log("connected with database");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_DB_URL);
}

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
