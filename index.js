const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const errorChecker = require("./dataService");

//JSON File Path
const guestbookPath = path.join(__dirname, "public", "json", "guestbook.json");

//File Data Variable
try {
  var fileData = JSON.parse(fs.readFileSync(guestbookPath)) || [];
} catch (err) {
  console.log("Error Fetching Data From File");
}

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static("public"));

app.set("views", path.join(__dirname, "public", "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/guestbook", (req, res) => {
  res.render("guestbook", { data: fileData });
});

app.get("/newmessage", (req, res) => {
  res.render("newmessage", { statusMSG: "" });
});

app.get("/ajaxmessage", (req, res) => {
  res.render("ajaxmessage", { statusMSG: "" });
});

app.get("*", (req, res) => {
  res
    .status(404)
    .send(
      "We could not find the content you were looking for. \nPlease return to the start page"
    );
});

app.post("/newmessage", (req, res) => {
  // console.log(fileData)
  // console.log(req.body)
  let isUnique = false;

  let idCounter = fileData.length + 1;

  while (!isUnique) {
    isUnique = fileData.every((item) => item.id != idCounter.toString());
    if (!isUnique) {
      idCounter++; // Increment if not unique
    }
  }

  const date = new Date(); // Get the current date and time

  const formattedDate = date.toLocaleString("en-US", {
    weekday: "short", // Abbreviated weekday (Mon)
    year: "numeric", // Full numeric year (1993)
    month: "long", // Full month name (April)
    day: "numeric", // Day of the month with padding (05)
    hour: "2-digit", // Hour with padding (09)
    minute: "2-digit", // Minutes with padding (12)
    second: "2-digit", // Seconds with padding (01),
    timeZone: "UTC", // Specify UTC time zone
    timeZoneName: "short", // Abbreviated time zone name (GMT+0300)
  });

  let newData = {
    id: idCounter,
    username: req.body?.username,
    country: req.body?.country,
    message: req.body?.message,
    date: formattedDate,
  };

  // console.log(newData)

  let formData = newData;
  fileData.push(formData);
  fs.writeFileSync(guestbookPath, JSON.stringify(fileData), (err) => {
    if (err) {
      console.error("Error writing data file:", err);
      res.status(500).render("newmessage", { statusMSG: "Error saving data!" });
    }
  });
  res
    .status(200)
    .render("newmessage", { statusMSG: "Data Successfully Saved!" });
});

app.post("/ajaxmessage", (req, res) => {
  // console.log(fileData)
  // console.log(req.body);
  let isUnique = false;

  let idCounter = fileData.length + 1;

  while (!isUnique) {
    isUnique = fileData.every((item) => item.id != idCounter.toString());
    if (!isUnique) {
      idCounter++; // Increment if not unique
    }
  }

  const date = new Date(); // Get the current date and time

  const formattedDate = date.toLocaleString("en-US", {
    weekday: "short", // Abbreviated weekday (Mon)
    year: "numeric", // Full numeric year (1993)
    month: "long", // Full month name (April)
    day: "numeric", // Day of the month with padding (05)
    hour: "2-digit", // Hour with padding (09)
    minute: "2-digit", // Minutes with padding (12)
    second: "2-digit", // Seconds with padding (01),
    timeZone: "UTC", // Specify UTC time zone
    timeZoneName: "short", // Abbreviated time zone name (GMT+0300)
  });

  let newData = {
    id: idCounter,
    username: req.body?.username,
    country: req.body?.country,
    message: req.body?.message,
    date: formattedDate,
  };

  // console.log(newData);

  let formData = newData;
  fileData.push(formData);
  fs.writeFileSync(guestbookPath, JSON.stringify(fileData), (err) => {
    if (err) {
      console.error("Error writing data file:", err);
      res.status(500).json({ statusMSG: "Error saving data!" });
    }
  });
  res.status(200).json({ statusMSG: "Data Successfully Saved!" });
});

app.listen(port, () => {
  console.log(`Server is running at localhost, port ${port}`);
});
