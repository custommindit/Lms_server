const express = require("express");
const app = express();
const port = 8753;
const path=require('path')
const mongoose = require("mongoose");
const router = require("./src/routes/index");
const cors = require("cors");
const http = require("http");
require('dotenv').config();

app.use(express.json());

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "300mb" }));
  app.use(router)
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.options('*', (req, res) => {
    res.sendStatus(200);
  });
  const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log("MongoDB connected: ", conn.connection.host);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };


const server = http.createServer(app);

server.setTimeout(10 * 60 * 1000);

connectDB().then(() => {
    server.listen(port, () => {
      console.log(`server is starting at port ${port}`);
    });
  });
