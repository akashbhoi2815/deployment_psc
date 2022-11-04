const express = require('express');
const app = express();
require("dotenv").config()
app.use(express.json());

const PORT = process.env.PORT || 8500;

app.get("/",(req,res)=>{
    res.send("Hello form Back-end Api")
})




app.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT}`);
})