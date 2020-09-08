
// const MongoClient = require('mongodb').MongoClient;

// const uri = "mongodb+srv://amit:<password>@mearnfreeproj0.5nmil.mongodb.net/<dbname>?retryWrites=true&w=majority";

// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDb = async()=>{
    try {
        await mongoose.connect(db,{
            useNewUrlParser:true
        });
        console.log("Mongo db Fucked Brutually");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
module.exports = connectDb;