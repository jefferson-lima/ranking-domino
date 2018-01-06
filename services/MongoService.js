var MongoClient = require('mongodb').MongoClient;

module.exports = class MongoService {

  constructor(){
    this.url = 'mongodb://localhost:27017/domino';
    this.databaseName = 'domino';
  }

  async connect() {

    try{
      this.connection = await MongoClient.connect(this.url);
      this.database = this.connection.db(this.databaseName);
    }catch(err){
      console.log(err);
    }
  }

  async find(collectionName, filter){
    var collection = this.database.collection(collectionName);
    return collection.findOne(filter);

  }

  async list(collectionName){
    var collection = this.database.collection(collectionName);
    return await collection.find().toArray();
  }

  async save(collectionName, object){
    var collection = this.database.collection(collectionName);
    return collection.insertOne(object);
  }

  async aggregate(collectionName, filter){
    var collection = this.database.collection(collectionName);
    return await collection.aggregate(filter).toArray();
  }

  close(){
    this.connection.close();
  }

}
