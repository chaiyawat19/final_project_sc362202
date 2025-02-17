// Login.js
import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from './firebase';  // Import auth, googleProvider, and signInWithPopup
import { Button } from '@mui/material';

function Login() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); // Use the googleProvider instance
      const user = result.user;
      setUser(user);
      console.log("Logged in user:", user);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <h2>Login with Google</h2>
      {!user ? (
        <Button onClick={handleLogin} variant="contained">
          Sign in with Google
        </Button>
      ) : (
        <div>
          <h3>Welcome, {user.displayName}</h3>
          <img src={user.photoURL} alt="User Avatar" />
        </div>
      )}
    </div>
  );
}

export default Login;
