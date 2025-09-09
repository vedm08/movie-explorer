import { Client, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // ✅ use this for Appwrite Cloud
  .setProject("68baa21c00337c9c583b"); // 🔑 replace with your Project ID

export const databases = new Databases(client);

export const DATABASE_ID = "68baa24d003953465935";     // movies_db
export const COLLECTION_ID = "movies"; // movies
