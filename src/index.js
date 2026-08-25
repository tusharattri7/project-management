import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/databaseConn.js";
// .ENV
dotenv.config({
  path: "./.env",
});

// EXPRESS SETTING:
const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", error);
    process.exit(1);
  });
