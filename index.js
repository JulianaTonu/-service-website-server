const express =require("express")
const cors =require("cors")
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

console.log('user',process.env.DB_USER)
console.log('password',process.env.DB_PASSWORD)



const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rpina.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
    const serviceCollection = client.db("smileSeekersDb").collection("services");
    const reviewCollection = client.db("smileSeekersDb").collection("reviews");


    //create service
    app.post('/services',async(req,res)=>{
        const service=req.body;
        console.log(service)
        const result =await serviceCollection.insertOne(service)
        res.send(result)
    })

    //create review
    app.post('/reviews',async(req,res)=>{
        const review=req.body;
        console.log(review)
        const result =await reviewCollection.insertOne(review)
        res.send(result)
    })

    //read all services
   app.get('/services', async(req,res)=>{
    const query ={}
    const cursor =serviceCollection.find(query)
    const services =await cursor.toArray()
    res.send(services)
})
   app.get('/', async(req,res)=>{
    const query ={}
    const cursor =serviceCollection.find(query)
    const services =await cursor.limit(3).toArray()
    res.send(services)
})

//read single data
app.get('/services/:id', async(req, res)=>{
    const id =req.params.id;
    const query ={_id:ObjectId(id)};
    const service =await serviceCollection.findOne(query)
    res.send(service);
})

}
finally{

}
}

run().catch(err=>console.error(err))



app.get('/', (req, res)=>{
    res.send("smile seekers is running on port")
})

app.listen(port, ()=>{
    console.log(`smile seekers is running on port ${port}`)
})