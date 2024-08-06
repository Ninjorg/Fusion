import React from 'react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;