import React, { useState } from 'react';
import { auth, firestore } from '../lib/firebase';
import { useUserStore } from '../store/userStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fetchUserInfo = useUserStore((state) => state.fetchUserInfo);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      fetchUserInfo();
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        try {
          const userCredential = await auth.createUserWithEmailAndPassword(email, password);
          const userId = userCredential.user.uid;

          await firestore.collection('users').doc(userId).set({
            email,
            username: email.split('@')[0], // Simple username logic
          });

          fetchUserInfo();
        } catch (signupError) {
          console.error("Error signing up: ", signupError);
        }
      } else {
        console.error("Error logging in: ", error);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
