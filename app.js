import express from 'express'
import path from 'node:path'
const __dirname = import.meta.dirname

const app = express()

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname + "/index.html"))
})

app.listen(300, ()=>{
    console.log('Server running on puertito', 300)
})
