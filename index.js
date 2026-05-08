require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

const cors = require("cors");
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();

    const database = client.db("simpleCrud");
    const collection = database.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = collection.find({});
      const allValues = await cursor.toArray();
      res.send(allValues);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
