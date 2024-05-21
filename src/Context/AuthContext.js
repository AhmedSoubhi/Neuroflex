import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../Firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function logout() {
  return auth.signOut();
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Adding state for selected user
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log("Login successful, user:", userCredential.user);
      })
      .catch(error => {
        console.error("Login failed:", error);
        throw error;  // Consider handling this more gracefully in your UI
      });
  }
  
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    if (currentUser) {
      return currentUser.updateEmail(email);
    }
  }

  function updatePassword(password) {
    if (currentUser) {
      return currentUser.updatePassword(password);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        getDoc(docRef)
          .then(userDoc => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              // Check for displayName and other essential data
              if (!userData.displayName) {
                console.warn("User must complete profile.");
                setCurrentUser({ ...user, profileIncomplete: true });
              } else {
                setCurrentUser({ ...user, ...userData });
              }
            } else {
              console.warn("User document does not exist, prompting profile completion.");
              setCurrentUser({ ...user, profileIncomplete: true });
            }
          })
          .catch(error => {
            console.error("Error fetching user document:", error);
            setCurrentUser(user); // Set user but handle missing data case
          })
          .finally(() => setLoading(false));
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);
  

  const value = {
    currentUser,
    selectedUser, // Provide selectedUser state
    setSelectedUser, // Provide function to update selectedUser
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
