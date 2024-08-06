import React, { useEffect, useState } from 'react';
import { firestore, storage, auth } from '../lib/firebase';
import { useUserStore } from '../store/userStore';
import ChatList from './ChatList';

const Chat = () => {
  const user = useUserStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = firestore.collection('messages').orderBy('createdAt').onSnapshot((snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message && !image) return;

    const newMessage = {
      text: message,
      uid: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      imageUrl: null,
    };

    if (image) {
      const imageRef = storage.ref(`images/${image.name}`);
      await imageRef.put(image);
      newMessage.imageUrl = await imageRef.getDownloadURL();
    }

    await firestore.collection('messages').add(newMessage);

    setMessage('');
    setImage(null);
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <p>{msg.text}</p>
            {msg.imageUrl && <img src={msg.imageUrl} alt="Sent" />}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
