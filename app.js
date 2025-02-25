const express = require("express");
const app = express();
const port = 5500;
const path = require("path");
const dbConnection = require('./db/dbConfig')

// Middleware to serve uploaded images
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.send("welcome to etu's project");
});

async function start() {
    try {
    const result = await dbConnection.execute("select 'test'") 
    app.listen(port)
    console.log("database established")
    console.log(`listening on ${port}`)
}
    catch (error) {
        console.log(error.message)
    }
}

start()



// User routes middleware
const userRoutes = require("./routes/userRoute");
app.use("/api/users", userRoutes);

// Image routes middleware
const imageRoutes = require("./routes/imageupload");
app.use("/api/image", imageRoutes);


