const express = require("express");
const cors = require("cors");
const app = express();

const { MongoClient, ObjectId } = require("mongodb");
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

let data;
app.get("/api/notes", async (_, res) => {
  try {
    await client.connect();
    const db = client.db("ProjectsDB");
    const collection = db.collection("Notes");

    data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

app.use(express.json());
app.delete("/api/delNotes/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("ProjectsDB");
    const collection = db.collection("Notes");
    const id = new ObjectId(req.params.id);
    await collection.deleteOne({ _id: id });
    data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.log("Error: ", error);
  }
});

app.post("/api/addNote", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("ProjectsDB");
    const collection = db.collection("Notes");
    await collection.insertOne({ title: "", body: "" });

    data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.log("Error: ", error);
  }
});

app.patch("/api/updateNote/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("ProjectsDB");
    const collection = db.collection("Notes");

    const { newTitle, newBody } = req.body;

    const id = new ObjectId(req.params.id);
    const filter = { _id: id };
    const updateDoc = {
      $set: {
        title: newTitle,
        body: newBody,
      },
    };

    await collection.updateOne(filter, updateDoc);
    res.json(await collection.find().toArray());
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}...`);
});
