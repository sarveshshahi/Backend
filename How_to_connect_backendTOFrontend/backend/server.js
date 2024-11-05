// const express=required("express")
import express from "express";
// import cors from "cors"

const app=express();

// app.use(cors()) //allow to all request second wa on forntend procy
// app.get("/",(req,res)=>{
//     res.send("server is running")
// })

app.get("/api/jokes",(req,res)=>{
    const jokes=[{
        "id":1,
        "title":"this is a joke",
        "content":"you can smile"
    },{
        "id":2,
        "title":"this is a joke two",
        "content":"you can smile"
    },{
        "id":3,
        "title":"this is a three",
        "content":"you can laugh"
    },{
        "id":4,
        "title":"this is a joke foure",
        "content":"you can smile"
    },{
        "id":5,
        "title":"this is a five",
        "content":"you can smile"
    }]
    res.send(jokes)
})

const port=process.env.port || 3000


app.listen(port, ()=>{
console.log(`server is running at http://localhost:${port}`)
})