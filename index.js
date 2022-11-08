const express =require("express")
const cors =require("cors")
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

    //read all services
   app.get('/services', async(req,res)=>{
    const query ={}
    const cursor =serviceCollection.find(query)
    const services =await cursor.toArray()
    res.send(services)
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