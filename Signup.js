import React, { useState } from 'react';
import { auth, firestore, storage } from '../lib/firebase';
import { useUserStore } from '../store/userStore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(null);
  const fetchUserInfo = useUserStore((state) => state.fetchUserInfo);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Handle avatar upload
      if (avatar) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, avatar);
        const avatarURL = await getDownloadURL(avatarRef);

        // Save user info to Firestore
        await setDoc(doc(firestore, 'users', user.uid), {
          username,
          avatarURL,
          online: false,
        });
      } else {
        // Save user info to Firestore without avatar
        await setDoc(doc(firestore, 'users', user.uid), {
          username,
          avatarURL: '',
          online: false,
        });
      }

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
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
