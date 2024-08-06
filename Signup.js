import React, { useState } from 'react';
import { auth, firestore, storage } from '../lib/firebase';
import { useUserStore } from '../store/userStore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const fetchUserInfo = useUserStore((state) => state.fetchUserInfo);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      let avatarUrl = '';
      if (avatar) {
        const avatarRef = storage.ref(`avatars/${userId}`);
        await avatarRef.put(avatar);
        avatarUrl = await avatarRef.getDownloadURL();
      }

      await firestore.collection('users').doc(userId).set({
        email,
        avatar: avatarUrl,
        username: email.split('@')[0] // Simple username logic
      });

      fetchUserInfo();
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
