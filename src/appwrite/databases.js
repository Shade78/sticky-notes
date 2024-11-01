/* more readable use of build-in methods of Appwrite web SDK
 for example check init function in NotesPage.jsx */

import { databases, collections } from "./config";
import { ID } from "appwrite";

const db = {};

// https://www.youtube.com/watch?v=1ip2aljprvg
collections.forEach((collection) => {
  db[collection.name] = {
    create: async (payload, id = ID.unique()) => {
      return await databases.createDocument(
        collection.dbId,
        collection.id,
        id,
        payload
      );
    },
    update: async (id, payload) => {
      return await databases.updateDocument(
        collection.dbId,
        collection.id,
        id,
        payload
      );
    },
    delete: async (id) => {
      return await databases.deleteDocument(collection.dbId, collection.id, id);
    },
    get: async (id) => {
      return await databases.getDocument(collection.dbId, collection.id, id);
    },
    list: async (queries) => {
      return await databases.listDocuments(
        collection.dbId,
        collection.id,
        queries
      );
    },
  };
});

export { db };
