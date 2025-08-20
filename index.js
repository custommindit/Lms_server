const express = require("express");
const app = express();
const port = 8753;
const path=require('path')
const mongoose = require("mongoose");
const router = require("./src/routes/index");
const cors = require("cors");
const http = require("http");
const multer = require('multer');


require('dotenv').config();

app.use(express.json());

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "2048mb" }));
  app.use(router)
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  
  app.options('*', (req, res) => {
    res.sendStatus(200);
  });
//  const connectDB = async () => {
  //  try {
    //  const conn = await mongoose.connect(process.env.MONGO_URL);
     // console.log("MongoDB connected: ", conn.connection.host);
   // } catch (error) {
    //  console.log(error);
    //  process.exit(1);
   // }
 // };
const connectDB = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // 10 ثواني أقصى وقت يحاول فيه الاتصال
      });
      console.log("✅ MongoDB connected: ", conn.connection.host);
      return; // لو اتصل خلاص اخرج
    } catch (error) {
      console.error(`❌ MongoDB connection error: ${error.message}`);
      retries -= 1;
      console.log(`🔄 إعادة المحاولة... باقي ${retries} محاولات`);

      if (retries === 0) {
        console.error("⛔ فشل الاتصال بقاعدة البيانات بعد كل المحاولات");
        process.exit(1); // اخر حل لو فشل في كل المحاولات
      }

      // استنى delay قبل ما تجرب تاني
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};


const server = http.createServer(app);
server.keepAliveTimeout = 19 * 60 * 1000; // 30 minutes
server.headersTimeout = 20 * 60 * 1000; // Should be longer than keepAliveTimeout
server.setTimeout(20 * 60 * 1000);
app.use((req, res, next) => {
  req.setTimeout(20 * 60 * 1000); // 20 minutes
  res.setTimeout(20 * 60 * 1000); // 20 minutes
  next();
});
connectDB().then(() => {
    server.listen(port, () => {
      console.log(`server is starting at port ${port}`);
    });
  });
