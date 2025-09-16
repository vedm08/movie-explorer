import { Client, Databases, Models } from "appwrite";

// Initialize client
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string) // e.g. "https://cloud.appwrite.io/v1"
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string); // your Project ID

// Export Databases instance
export const databases = new Databases(client);

// Export IDs from .env
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
export const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string;

// ✅ Define a strongly typed Movie document
export interface MovieDocument extends Models.Document {
  title: string;
  director: string;
  release_year: number;
}
