const express = require("express"); //server hosting (npm install express)
const app = express(); //using express functions
const mongoose = require("mongoose"); //for database
const port = process.env.PORT || 5000; // port
const { MONGOURI } = require("./config/keys");

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  
mongoose.connection.on("connected", () => {
  console.log("successfully connected to mongo yeshhhhh");
});
  
mongoose.connection.on("error", (err) => {
  console.log("Error occured",err);
});

  
require("./models/user"); //
require("./models/post");

app.use(express.json());

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));


// wBmwgNz3nXzfIZBl
if(process.env.NODE_ENV=="production"){
  app.use(express.static('client/build'))
  const path=require('path')
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

app.listen(port, () => {
  console.log(`listening at port ${port}..........`);
});