// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
console.log("!!! VERCEL IS ACTUALLY USING THIS URI:", uri); 
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve client across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for every import
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
