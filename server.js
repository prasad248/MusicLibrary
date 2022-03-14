const express = require('express');

const app = express();

const db = require("./models");

app.use(express.json());

app.use(express.urlencoded({extended:true}));

require ('./routers/router')(app)


db.sequelize.sync({ force: true })
.then(() => {
  console.log("Drop and re-sync db.");
})
.catch(err=>{
    console.log('error'+err)
})

app.get('/', (req,res)=>{
    res.json({message: "hello"})
});

app.listen(8080,()=>{
    console.log('server is running')
})