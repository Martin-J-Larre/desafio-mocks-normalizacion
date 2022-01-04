import { MongoClient } from "mongodb";
const uri = "mongodb://localhost/ecommerce";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

await client.connect();

const messagesCollection = client.db("challenge-normalization").collection("messages");

export { messagesCollection };