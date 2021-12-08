const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// user: mydbuser1
// pass: thgb258B54HhdDwS


const uri = "mongodb+srv://mydbuser1:thgb258B54HhdDwS@cluster0.8qcwn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("FoodMaster");
        const usersCollection = database.collection("users");
   
        // get api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);

            console.log('load user with id: ', id);
            res.send(user);
        })

        // post api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);

            console.log('get new user', req.body);
            console.log('added user', newUser);
            res.json(result);
        })

        // delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);

            console.log('deleting user with id', result);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})