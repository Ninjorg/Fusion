import React, { useEffect, useState } from 'react';
import { firestore } from '../lib/firebase'; // Ensure the path is correct
import { collection, getDocs, query, where } from 'firebase/firestore';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatCollection = collection(firestore, 'chats');
        const chatSnapshot = await getDocs(chatCollection);
        const chatList = chatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChats(chatList);
      } catch (error) {
        console.error("Error fetching chats: ", error);
      }
    };

    const fetchOnlineUsers = async () => {
      try {
        const userCollection = collection(firestore, 'users');
        const q = query(userCollection, where('online', '==', true));
        const userSnapshot = await getDocs(q);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOnlineUsers(userList);
      } catch (error) {
        console.error("Error fetching online users: ", error);
      }
    };

    fetchChats();
    fetchOnlineUsers();
  }, []);

  return (
    <div>
      <h2>Chats</h2>
      <div>
        <h3>Online Users</h3>
        <ul>
          {onlineUsers.map(user => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Chats</h3>
        <ul>
          {chats.map(chat => (
            <li key={chat.id}>{chat.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
