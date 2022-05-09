import express from "express";
// import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRouter from "./routes/user.js";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); // this cors should always b above the routes

app.use("/posts", postRoutes); // this says every route in the routes is gonna start with 'posts' e.g localhost:5000/posts
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("APP IS RUNNING");
}); // Just a message we get in the browser to check know the server is running

// https://www.mongodb.com/cloud/atlas

const CONNECTION_URL =
  "mongodb+srv://Muhammad-fasih:malik0000>1993@cluster0.cvtbr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) //{..} is optional to avoid from errors
  .then(() =>
    app.listen(PORT, console.log(`server is running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));

// mongoose.set("useFindAndModify", false); //this makes showers that we dont get warnings in the console
