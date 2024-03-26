import express from "express";
// import fs from "fs";
import db from "./database.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/markers", async (req, res) => {
  try {
    const connection = await db.getConnection();
    console.log("Database Connected");
    const [rows, fields] = await connection.query("SELECT * FROM hospital");
    res.status(200).json({
      data: rows,
      message: "Success fetching markers data",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching markers data" });
  }
});

// app.post("/simpan", (req, res) => {
//   const koordinat = req.body.koordinat; // Assuming 'data' is the name of the input field
//   let existingData = [];
//   try {
//     existingData = JSON.parse(fs.readFileSync("data.json"));
//   } catch (error) {
//     console.error("Error reading existing data:", error);
//   }

//   existingData.push(koordinat);
//   fs.appendFile("data.json", JSON.stringify(existingData), (err) => {
//     if (err) {
//       console.error("Error writing to file:", err);
//       res.status(500).send("Error saving data");
//     } else {
//       console.log("Data saved successfully");
//       res.status(200).json({ message: "Data saved successfully" });
//     }
//   });
// });

// app.post("/simpan", (req, res) => {
//   const koordinat = req.body; // Assuming 'koordinat' is sent in the request body
//   // console.log(koordinat);
//   // Write data to a JSON file named 'data.json'
//   fs.writeFile("data.txt", JSON.stringify(koordinat), (err) => {
//     if (err) {
//       console.error("Error writing to file:", err);
//       res.status(500).json({ message: "Error saving data" });
//     } else {
//       console.log("Data saved successfully");
//       res.status(200).json({ message: "Data saved successfully" });
//     }
//   });
// });

// //Define a route to handle the GET request
// app.get("/baca", (req, res) => {
//   // Read data from the 'data.json' file
//   fs.readFile("data.txt", "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading file:", err);
//       res.status(500).json({ message: "Error reading data" });
//     } else {
//       const jsonData = JSON.parse(data);
//       res.status(200).json(jsonData);
//     }
//   });
// });
// //Delete Data
// app.delete("/hapus", (req, res) => {
//   fs.writeFile("data.txt", "[]", (err) => {
//     if (err) {
//       res.status(500).json({ message: "Error deleting data" });
//     } else {
//       res.status(200).json({ message: "Data deleted successfully" });
//     }
//   });
// });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
