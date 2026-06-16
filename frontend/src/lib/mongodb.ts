import mongoose from "mongoose";

const MONGODB_URI = "mongodb://root:example@localhost:27017/diario?authSource=admin";


export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);

  // Criar collection explicitamente
  const db = mongoose.connection;
  await db.collection("journal").createIndex({ createdAt: -1 });
}