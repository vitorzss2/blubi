// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, update, remove } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  databaseURL: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Export Firebase auth and database functions
export { auth, database, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };

// User-based CRUD operations
export const createItem = async (userId, item) => {
  const newItemRef = ref(database, 'users/' + userId + '/items/' + Date.now());
  await set(newItemRef, {
    name: item.name,
    description: item.description,
  });
};

export const readItems = async (userId) => {
  const itemsRef = ref(database, 'users/' + userId + '/items');
  const snapshot = await get(itemsRef);
  const data = snapshot.val();
  return data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
};

export const updateItem = async (userId, id, updatedItem) => {
  const itemRef = ref(database, 'users/' + userId + '/items/' + id);
  await update(itemRef, updatedItem);
};

export const deleteItem = async (userId, id) => {
  const itemRef = ref(database, 'users/' + userId + '/items/' + id);
  await remove(itemRef);
};
