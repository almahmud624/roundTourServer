const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 7000;

// Middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4ieih.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("RoundTour");
        const packagesCollection = database.collection("packages");
        const orderCollection = database.collection('orders');

        // GET packages API
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        // ADD order API 
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.json(result);
        })

        // GET order API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })
        // post API
        app.post('/packages', async (req, res) => {
            const newPackage = req.body;
            const result = await packagesCollection.insertOne(newPackage);
            res.send(result);
        })

        // DELETE API 
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            console.log('delete id', result);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Round Tour Server is Running');
})

app.listen(port, () => {
    console.log('Round Tour server run on', port, 'port');
})