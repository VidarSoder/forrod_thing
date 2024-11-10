import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';


export const getAuthInstance = () => {
    return auth;
};

export const sendPasswordResetEmailFirebase = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        throw error;
    }
};

export const signInWithEmailAndPasswordFirebase = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const signOutUserFirebase = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

export const onAuthStateChangedFirebase = (callback) => {
    return onAuthStateChanged(auth, callback);
};

