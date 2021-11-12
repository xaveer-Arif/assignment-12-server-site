const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const { application } = require('express');

const port = process.env.PORT || 5000;

// middle ware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vea3q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('Appartment-istria');
        const allCollection = database.collection('allAppartments')
        const myOrder = database.collection('myOrder')
        // find all
        app.get('/services', async(req, res)=> {
            const cursor = await allCollection.find({}).toArray();
            console.log(cursor)
            res.json(cursor) 
        })
        // post purchase order in myOrder
        app.post('/order', async(req, res) => {
            const data = req.body
            const result = await myOrder.insertOne(data)
            console.log('aita my order command', result)
            res.json(result)
        })

    }   
    finally{
        // await client.closes
    }

}
run().catch(console.dir);

app.get('/', (req, res)=> {
    console.log('command')
    res.send('hellow world')
})
app.listen(port, () => {
    console.log('listnig port', port)
})