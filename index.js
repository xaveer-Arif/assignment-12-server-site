const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
// const { application } = require('express');
const ObjectId = require('mongodb').ObjectId


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
        const usersCollection = database.collection('users')
        const reviewCollection = database.collection('review')


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
        // get data from order
        app.get('/myorder', async(req,res) => {
            const data = req.query.email
            const email = {email:data}
            const cursor = await myOrder.find(email).toArray();
            res.json(cursor)
             
        })
        // delete data from order
        app.delete('/delete/:id', async(req, res) => {
            const query = req.params.id;
            const cursor = {_id: ObjectId(query)}
            const result = await myOrder.deleteOne(cursor)
            console.log(result)
            res.json(result)

        })
        // save user data in database
        app.post('/users', async(req, res) => {
            const data = req.body;
            const result = await usersCollection.insertOne(data)
            console.log('command',result)
            res.json(result)
        })
        // update  user to admin
        app.put('/users/admin', async(req, res) => {
            const user = req.body;
            const filter = {email: user.email}
            const updateData = {$set: {role:'Admin'}}
            const result = await usersCollection.updateOne(filter, updateData)
            res.json(result)
        })
        // add data to allAppartment
        app.post('/addproduct', async(req, res) => {
            const data = req.body
            console.log(data)
            const result = await allCollection.insertOne(data)
            console.log('aita my order command', result)
            res.json(result)
        })
        // delete product in manage product
        app.delete('/deleteProduct/:id', async(req, res) => {
            const query = req.params.id;
            const cursor = {_id: ObjectId(query)}
            const result = await allCollection.deleteOne(cursor)
            console.log(result)
            res.json(result)

        })
        // get all order
        app.get('/allorder', async(req,res) => {
            // const data = req.query.email
            // const email = {email:data}
            const cursor = await myOrder.find({}).toArray();
            res.json(cursor)
             
        })
        // delete order in manage order
        app.delete('/deleteOrder/:id', async(req, res) => {
            const query = req.params.id;
            const cursor = {_id: ObjectId(query)}
            const result = await myOrder.deleteOne(cursor)
            console.log(result)
            res.json(result)
        })
        // update status
        app.put('/status', async(req, res) => {
            const query = req.body.id
            const filter = {_id: ObjectId(query)}
            const updateData = {$set: {status:'Order Accepted'}}
            const result = await myOrder.updateOne(filter, updateData)
            res.json(result)
        })
        // service for home
        app.get('/homeService', async(req, res) => {
            // const data = req.query.email
            const query = {display:'home'}
            console.log(query)
            const cursor = await allCollection.find(query).toArray();
            res.json(cursor)
        })
        // admin user
        app.get('/userAdmin/:email', async(req,res) => {
            const email = req.params.email;
            const query = {email:email}
            const user = await usersCollection.findOne(query)
            console.log(user)
            let isAdmin = false;
            if(user.role === 'Admin'){
                isAdmin = true
            }
            else{
                isAdmin = false
            }
            res.json({admin:isAdmin})
        })
        // post review
        app.post('/review', async(req, res) => {
            const data = req.body;
            const result = await reviewCollection.insertOne(data)
            console.log('command', result)
            res.json(result)
        })
        app.get('/comments', async(req,res) => {
            // const data = req.query.email
            // const email = {email:data}
            const cursor = await reviewCollection.find({}).toArray();
            res.json(cursor)
             
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