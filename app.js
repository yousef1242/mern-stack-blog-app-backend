const express = require("express");
const dotenv = require("dotenv");
const { connectMongodb } = require("./config/connectMongodb");
const authRoute = require("./routes/authRoute");
const { errorHandler, notFound } = require("./middlewares/error");
const cors = require("cors");
const app = express();

//access file .env
dotenv.config();

//access mongodb
connectMongodb();

//midlewares
app.use(express.json());

//Cors Policy
app.use(
  cors({
    origin: [
        "http://localhost:3000",
        "https://mern-stack-blog-app.onrender.com"
    ],
  })
);

//routes
app.use("/", authRoute);
app.use("/", require("./routes/usersRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

// error handler middleware
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server is running");
  }
});