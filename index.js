const express =require("express")
const cors =require("cors")
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt =require('jsonwebtoken')
const app=express();
const port=process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

console.log('user',process.env.DB_USER)
console.log('password',process.env.DB_PASSWORD)


//mongodb
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rpina.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req,res,next){
    // console.log(req.headers.authorization)
    const authHeader =req.headers.authorization;
    if(!authHeader){
      return res.status(401).send({message:'unauthorized access'})
    }
const token =authHeader.split('')[1]
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
if(err){
    return res.status(401).send({message: 'unauthorized access'})
}
req.decoded =decoded;
next();
    })
}

async function run(){
try{
    const serviceCollection = client.db("smileSeekersDb").collection("services");
    const reviewCollection = client.db("smileSeekersDb").collection("reviews");

//jwt token

app.post('/jwt',(req,res)=>{
    const user=req.body;
    const token =jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10h'})
    res.send({token});
})
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
     //read all reviews
//    app.get('/reviews', async(req,res)=>{
//     const query ={}
//     const cursor =reviewCollection.find(query)
//     const reviews =await cursor.toArray()
//     res.send(reviews)
// })

app.get('/review/:id', async(req, res)=>{
    const id =req.params.id;
    const query ={_id:ObjectId(id)};
    const review =await reviewCollection.findOne(query)
    res.send(review);
})

app.get('/reviews',verifyJWT, async(req,res)=>{

    const decoded =req.decoded;
    console.log('inside reviews api' , decoded)
    if(decoded.email !== req.query.email){
        res.status(401).send({message: 'unauthorized access'})
    }
    let query={};
    // console.log(req.query)
    if(req.query.email ){
        query={
            email:req.query.email,
            

        }
    }
    const cursor=  reviewCollection.find(query)
    const reviews =await cursor.toArray()
    res.send(reviews)

})

app.get('/reviews/service', async(req,res)=>{

    let query={};
    console.log(req.query.servicename)

    if(req.query.servicename){
        query={
            servicename:req.query.servicename
        }
    }
    const cursor=  reviewCollection.find(query)
    const reviews =await cursor.toArray()
    res.send(reviews)

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

//delete reviews
app.delete('/reviews/:id', async(req,res)=>{
    const id =req.params.id;
    const query ={_id:ObjectId(id)}
    const result =await reviewCollection.deleteOne(query)
    res.send(result)
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