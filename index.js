const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://myNodeDbuser:E4f6fskQSC1Svo0Z@cluster0.eqb98.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

  try {
    await client.connect()

    const database = client.db("spraxa");
    const memberCollection = database.collection("allMember");

    const userCollection = database.collection("users")


    // post api
    app.post('/member', async (req, res) => {
      const newMember = req.body
      const result = await memberCollection.insertOne(newMember)
      res.json(result)

    })


    // get api for all member
    app.get('/allMember', async (req, res) => {
      let filter = { isDeleted: parseInt(req.query.isDeleted) };

      const cursor = memberCollection.find(filter)
      const result = await cursor.toArray()
      res.send(result)
      console.log(req.body)

    })
    // single member api
    app.get('/allMember/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await memberCollection.findOne(query)
      res.send(result)
    })

    // delete member list
    app.put('/allMembers/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body
      console.log(updatedUser);
      const query = { _id: ObjectId(id) }
      const options = { upsert: true };
      const doc = {
        $set: {
          isDeleted: updatedUser.isDeleted,

        },
      };
      const result = await memberCollection.updateOne(query, doc, options)
      console.log(result);
      res.json(result)


    })

    // update api
    app.put('/allMember/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body
      const query = { _id: ObjectId(id) }
      const options = { upsert: true };
      const doc = {
        $set: {
          name: updatedUser.name,
          address: updatedUser.address,
          email: updatedUser.address,
          contact: updatedUser.contact
        },
      };

      const result = await memberCollection.updateOne(query, doc, options)
      console.log(result);
      res.json(result)
    })


    // register user info post api

    app.post('/createUser', async (req, res) => {

      const newUser = req.body
      console.log(newUser)
      const result = await userCollection.insertOne(newUser)
      res.json(result)


    })

    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      const query = { email: email, pass1: password }
      const result = await userCollection.findOne(query)
      if (result) {
        res.send({ status: 200, message: "user logged in successfully" })
      }
      else {
        res.send({ message: "User not found", status: 404 })
      }

    })








  } finally {
    // await client.close()
  }

}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

// app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})