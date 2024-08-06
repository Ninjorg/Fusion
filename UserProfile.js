import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = doc(firestore, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUser(userData);
        setUsername(userData.username);
        setAvatarURL(userData.avatarURL);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userDoc = doc(firestore, 'users', auth.currentUser.uid);

      let updatedData = { username };

      if (avatar) {
        const avatarRef = ref(storage, `avatars/${auth.currentUser.uid}`);
        await uploadBytes(avatarRef, avatar);
        const newAvatarURL = await getDownloadURL(avatarRef);
        updatedData.avatarURL = newAvatarURL;
      }

      await updateDoc(userDoc, updatedData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <form onSubmit={handleUpdate}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
        <button type="submit">Update Profile</button>
      </form>
      {avatarURL && <img src={avatarURL} alt="Avatar" style={{ width: '100px', height: '100px' }} />}
    </div>
  );
};

export default UserProfile;
