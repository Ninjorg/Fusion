// src/App.js
import React, { useEffect, useState } from 'react';
import { auth, firestore } from './lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const App = () => {
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        navigate('/login'); // Redirect to login if not authenticated
      }
    });

    // Clean up authentication listener
    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user) return; // User must be authenticated to fetch chats

    // Create a reference to the Firestore collection
    const chatCollection = collection(firestore, 'chats');

    // Set up a real-time listener
    const unsubscribe = onSnapshot(chatCollection, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatList);
    }, (error) => {
      console.error("Error fetching chats: ", error);
    });

    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      <h2>Chats</h2>
      {user ? (
        <ul>
          {chats.map((chat) => (
            <li key={chat.id}>{chat.title}</li>
          ))}
        </ul>
      ) : (
        <p>Please log in to see chats.</p>
      )}
    </div>
  );
};

export default App;
