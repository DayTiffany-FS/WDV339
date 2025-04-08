require('dotenv').config()
const express = require('express')

const app = express()

console.log(process.env)

app.listen(8001)