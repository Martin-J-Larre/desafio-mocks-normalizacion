import { MongoClient } from "mongodb";
// const uri =

// !cambiar Uri
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

await client.connect();

const messagesCollection = client.db("challenge-normalization").collection("messages");

export { messagesCollection };