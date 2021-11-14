const express = require('express');
const app = express();
const cors =require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ok4d4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
   try{
        await client.connect();
        const database = client.db('dialz_db');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('placed-order');
        const reviewCollection = database.collection('reviews');
        const addAdminCollection = database.collection('add-admin');


        //post Api
        app.post('/products', async (req,res) =>{
          const service = req.body;
          const result = await productCollection.insertOne(service);
          console.log(result);
          res.json(result);
        });
        //post Api for Placed order
        app.post('/placed-order', async (req, res)=>{
             const order = req.body;
             const result = await orderCollection.insertOne(order);
             console.log('hitting',order);
             res.json(result);
        });
        //post Api
        app.post('/reviews', async (req,res) =>{
          const service = req.body;
          const result = await reviewCollection.insertOne(service);
          console.log(result);
          res.json(result);
        });

        //post Api for admin
        app.post('/add-admin', async (req,res) =>{
          const service = req.body;
          const result = await addAdminCollection.insertOne(service);
          console.log(result);
          res.json(result);
        });

        //Get API 
        app.get('/products', async(req, res) =>{

          const cursor = productCollection.find({});
          const services = await cursor.toArray();
          res.send(services);
        });

        //Get API for all Order
        app.get('/placed-order', async(req, res) =>{

          const cursor = orderCollection.find({});
          const orders = await cursor.toArray();
          res.send(orders);
        });

        //Get API rivew 
        app.get('/reviews', async(req, res) =>{

          const cursor = reviewCollection.find({});
          const services = await cursor.toArray();
          res.send(services);
        });

        //Get API add-admin
        app.get('/add-admin', async(req, res) =>{

          const cursor = addAdminCollection.find({});
          const services = await cursor.toArray();
          res.send(services);
        });

        //Get orderas for a single user
        app.get('/placed-order', async (req, res) =>{
             const mail = req.query.email;
             console.log(mail);

             if (email){
                  query = {email: mail };
             
                  const cursor = orderCollection.find(query);
                  const orders =await cursor.toArray();
                  res.json(orders);    
            }
             
        })

        //Get Single Service
        app.get('/products/:id', async (req, res)=>{
             const id =req.params.id;
             const query = {_id:ObjectId(id)};
             const service = await productCollection.findOne(query);
             res.json(service);

        });
        //delete product
        app.delete('/products/:id', async(req, res)=> {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await productCollection.deleteOne(query);
  
          console.log("deleting user", id);
          console.log("delete done", result);
  
          res.json(result);
        })

        //delete order
        app.delete('/placed-order/:id', async(req, res)=> {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await orderCollection.deleteOne(query);
  
          console.log("deleting user", id);
          console.log("delete done", result);
  
          res.json(result);
        })
       
   }
   finally{
        //await client.close;
   }
}

run().catch(console.dir);


app.get('/', (req, res) => {
     res.send('Hello World!');
});
app.listen(port, () => {
     console.log(`Running app listening on port !`, port);
});