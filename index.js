require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();

    const database = client.db("simpleCrud");
    const userCollection = database.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollection.findOne(query);
      console.log(id);

      res.send(user);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("New User", user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const userMod = req.body;
      const updateDoc = {
        $set: {
          name: userMod.name,
          email: userMod.email,
          role: userMod.role,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/home", (req, res) => {
  res.send("Hello Home!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
