import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore"; 

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userMonthlySummary, setUserMonthlySummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUser({ ...userDoc.data(), id: userDoc.id });
        } else {
          const newUser = {
            email: user.email,
            role: 'staff',
          };
          const docRef = await addDoc(collection(db, "users"), newUser);
          setUser({ ...newUser, id: docRef.id });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, "users"));
      setUsers(usersCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    const fetchUserMonthlySummary = async () => {
      const summaryCollection = await getDocs(collection(db, "userMonthlySummary"));
      setUserMonthlySummary(summaryCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchUsers();
    fetchUserMonthlySummary();
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = {
        email: userCredential.user.email,
        role: 'staff',
    };
    await addDoc(collection(db, "users"), newUser);
  };

  const logout = () => {
    signOut(auth);
  };

  const value = {
    user,
    login,
    logout,
    signup,
    users,
    setUsers,
    userMonthlySummary,
    setUserMonthlySummary,
    loading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
