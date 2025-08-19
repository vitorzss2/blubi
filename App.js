// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import { auth, createItem, readItems, updateItem, deleteItem, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from './firebase';

// Main App Component
const App = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [editingItem, setEditingItem] = useState(null);  // Store the item being edited

  // Handle authentication state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Fetch items for the current user
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const data = await readItems(user.uid);
        setItems(data);
      };
      fetchData();
    }
  }, [user]);

  // Handle user registration
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Handle user login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Create a new item for the logged-in user
  const handleCreate = async () => {
    if (!name || !description) {
      Alert.alert('Error', 'Please fill out both fields.');
      return;
    }
    if (user) {
      await createItem(user.uid, { name, description });
      setName('');
      setDescription('');
      const data = await readItems(user.uid);
      setItems(data);
    }
  };

  // Handle editing an item
  const handleEdit = (item) => {
    setEditingItem(item);  // Set the item being edited
    setName(item.name);
    setDescription(item.description);
  };

  // Handle updating an item
  const handleUpdate = async () => {
    if (!name || !description) {
      Alert.alert('Error', 'Please fill out both fields.');
      return;
    }
    if (user && editingItem) {
      await updateItem(user.uid, editingItem.id, { name, description });
      setEditingItem(null);  // Reset editingItem
      setName('');
      setDescription('');
      const data = await readItems(user.uid);
      setItems(data);
    }
  };

  // Handle deleting an item
  const handleDelete = async (id) => {
    if (user) {
      await deleteItem(user.uid, id);
      const data = await readItems(user.uid);
      setItems(data);
    }
  };

  return (
    <View style={{ padding: 20, alignContent: 'center', justifyContent: 'center', flex:1, padding: 20, gap: 10 }}>
      {user ? (
        <>
        <View style={{  padding:10, borderWidth: 1,}}>
        <Text style={{ paddingBottom: 10}} >Hello {user.email}!</Text>
          <TextInput
            placeholder="Item Name"
            value={name}
            onChangeText={setName}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
          />
          <TextInput
            placeholder="Item Description"
            value={description}
            onChangeText={setDescription}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
          />
          {editingItem ? (
            <Button title="Update Item" onPress={handleUpdate} />  // Update button when editing
          ) : (
            <Button title="Create Item" onPress={handleCreate} />  // Create button when not editing
          )}
          </View>
          {items != [] ?    <FlatList 
          style={{  flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1,  gap:4}}
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{  borderWidth: 1, padding: 10, margin: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text>{item.description}</Text>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: 'center', alignItems: 'center', gap:4}}>
                <Button title="Edit" onPress={() => handleEdit(item)} />
                <Button title="Delete" color="#b51222" onPress={() => handleDelete(item.id)} />
                </View>
              </View>
            )}
          /> : <Text>Loading...</Text>}
          <Button title="Logout" color="#b51222" onPress={handleLogout} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
          />
          {isRegistering ? (
            <>
              <Button title="Register" onPress={handleRegister} />
              <Button title="Already have an account? Login" onPress={() => setIsRegistering(false)} />
            </>
          ) : (
            <>
              <Button title="Login" onPress={handleLogin} />
              <Button title="Don't have an account? Register" onPress={() => setIsRegistering(true)} />
            </>
          )}
        </>
      )}
    </View>
  );
};

export default App;
