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
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.listen(normalizePort(process.env.PORT || "3000"), () =>
  console.log("app listening on port 3000!")
);
