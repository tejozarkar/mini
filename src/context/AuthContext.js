import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from '@firebase/auth';
import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../service/firebase';

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return () => unsubscribe;
    }, []);

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const updateUserProfile = (displayName, photoURL = null) => {
        let obj;
        if (photoURL) obj = { displayName, photoURL }
        else obj = { displayName }
        return updateProfile(auth.currentUser, obj);
    }

    const logout = () => {
        return signOut(auth);
    }

    const value = {
        signup,
        login,
        logout,
        currentUser,
        updateUserProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
