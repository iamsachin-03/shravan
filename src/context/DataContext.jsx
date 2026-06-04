import React, { createContext, useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

export const DataContext = createContext();

const SESSION_KEY = 'shravan_agent_session';

const maskPhone = (phone = '') => {
  if (!phone) return 'Not configured';
  const value = String(phone);
  return `${value.slice(0, 2)}******${value.slice(-2)}`;
};

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userMonthlySummary, setUserMonthlySummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (!raw) {
        setLoading(false);
        return;
      }

      try {
        const session = JSON.parse(raw);
        const agentQuery = query(collection(db, 'agents'), where('agentId', '==', session.agentId), limit(1));
        const snapshot = await getDocs(agentQuery);

        if (!snapshot.empty) {
          const agentDoc = snapshot.docs[0];
          setUser({ id: agentDoc.id, ...agentDoc.data() });
        } else {
          window.localStorage.removeItem(SESSION_KEY);
        }
      } catch (error) {
        console.error('Failed to restore session', error);
        window.localStorage.removeItem(SESSION_KEY);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const fetchAgentData = async () => {
      if (!user?.agentId) {
        setUsers([]);
        setUserMonthlySummary([]);
        return;
      }

      const [usersSnapshot, summarySnapshot] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('agentId', '==', user.agentId))),
        getDocs(query(collection(db, 'userMonthlySummary'), where('agentId', '==', user.agentId), orderBy('updatedAt', 'desc'))),
      ]);

      setUsers(usersSnapshot.docs.map((docItem) => ({ ...docItem.data(), id: docItem.id })));
      setUserMonthlySummary(summarySnapshot.docs.map((docItem) => ({ ...docItem.data(), id: docItem.id })));
    };

    fetchAgentData();
  }, [user]);

  const login = async (agentId, password) => {
    const agentQuery = query(collection(db, 'agents'), where('agentId', '==', agentId), limit(1));
    const snapshot = await getDocs(agentQuery);

    if (snapshot.empty) {
      throw new Error('Agent ID not found');
    }

    const agentDoc = snapshot.docs[0];
    const agent = agentDoc.data();

    if (agent.isActive === false) {
      throw new Error('This agent account is inactive');
    }

    const matches = agent.passwordHash
      ? await bcrypt.compare(password, agent.passwordHash)
      : password === agent.password;

    if (!matches) {
      throw new Error('Invalid password');
    }

    const sessionUser = { id: agentDoc.id, ...agent };
    setUser(sessionUser);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({ agentId: agent.agentId }));
    return sessionUser;
  };

  const logout = () => {
    setUser(null);
    setUsers([]);
    setUserMonthlySummary([]);
    window.localStorage.removeItem(SESSION_KEY);
  };

  const requestPasswordReset = async (agentId) => {
    const agentQuery = query(collection(db, 'agents'), where('agentId', '==', agentId), limit(1));
    const snapshot = await getDocs(agentQuery);

    if (snapshot.empty) {
      throw new Error('Agent ID not found');
    }

    const agentDoc = snapshot.docs[0];
    const agent = agentDoc.data();
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));

    await addDoc(collection(db, 'otpResets'), {
      agentDocId: agentDoc.id,
      agentId: agent.agentId,
      otpCode,
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000)),
      verifiedAt: null,
      createdAt: Timestamp.now(),
    });

    return {
      maskedPhone: maskPhone(agent.adminPhone || agent.mobileNumber),
      otpPreview: otpCode,
    };
  };

  const resetPassword = async (agentId, otpCode, newPassword) => {
    const agentQuery = query(collection(db, 'agents'), where('agentId', '==', agentId), limit(1));
    const agentSnapshot = await getDocs(agentQuery);

    if (agentSnapshot.empty) {
      throw new Error('Agent ID not found');
    }

    const agentDoc = agentSnapshot.docs[0];
    const otpQuery = query(
      collection(db, 'otpResets'),
      where('agentId', '==', agentId),
      where('otpCode', '==', otpCode),
      where('verifiedAt', '==', null),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const otpSnapshot = await getDocs(otpQuery);
    if (otpSnapshot.empty) {
      throw new Error('OTP is invalid');
    }

    const otpDoc = otpSnapshot.docs[0];
    const otp = otpDoc.data();
    const expiresAt = otp.expiresAt?.toDate?.() || new Date(0);

    if (expiresAt.getTime() < Date.now()) {
      throw new Error('OTP has expired');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await Promise.all([
      updateDoc(agentDoc.ref, {
        passwordHash,
        password: null,
        updatedAt: Timestamp.now(),
      }),
      updateDoc(otpDoc.ref, {
        verifiedAt: Timestamp.now(),
      }),
    ]);
  };

  return (
    <DataContext.Provider
      value={{
        user,
        users,
        userMonthlySummary,
        loading,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
        setUsers,
        setUserMonthlySummary,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};