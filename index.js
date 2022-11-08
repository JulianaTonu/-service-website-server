const express =require("express")
const cors =require("cors")
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


app.get('/', (req, res)=>{
    res.send("smile seekers is running on port")
})

app.listen(port, ()=>{
    console.log(`smile seekers is running on port ${port}`)
})