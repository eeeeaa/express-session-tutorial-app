const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();

/*
cookie: 
-> stored in browser/client-side, 
-> small data,
-> can't/shouldn't stored private information,
session: 
-> stored in server-side, 
-> larger data,
-> can stored private info since its in the database,
*/

//use mongoDB for session storage
const MongoStore = require("connect-mongo");

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

const app = express();
const mongoDb = process.env.ATLAS_URI || "";
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: MongoStore.create({ mongoUrl: mongoDb, collectionName: "sessions" }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/", (req, res, next) => {
  //can add custom data in cookie session
  if (req.session.viewCount) {
    req.session.viewCount += 1;
  } else {
    req.session.viewCount = 1;
  }
  res.send(`Hello world, view count: ${req.session.viewCount}`);
});

app.listen(normalizePort(process.env.PORT || "3000"), () =>
  console.log("app listening on port 3000!")
);
