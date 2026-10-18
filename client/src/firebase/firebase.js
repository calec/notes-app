// The original Firebase project is no longer available, so auth and the users
// table now live in localStorage. The exported shape mirrors the subset of the
// Firebase SDK the app uses, so components didn't need to change.
import { read, write, seedDemoData } from '../utils/localStore';

const USERS_KEY = 'gn_users';
const SESSION_KEY = 'gn_session';

const authError = (code, message) => Promise.reject({ code, message });

seedDemoData();

const listeners = [];

const toAuthUser = (email) => {
  if (!email) return null;
  const user = read(USERS_KEY, {})[email];
  if (!user) return null;
  return {
    uid: user.uid,
    email,
    displayName: user.username,
    updatePassword: (password) => {
      const users = read(USERS_KEY, {});
      users[email].password = password;
      write(USERS_KEY, users);
      return Promise.resolve();
    },
  };
};

const setSession = (email) => {
  write(SESSION_KEY, email);
  auth.currentUser = toAuthUser(email);
  listeners.slice().forEach(cb => cb(auth.currentUser));
};

const auth = {
  currentUser: toAuthUser(read(SESSION_KEY, null)),

  onAuthStateChanged(cb) {
    listeners.push(cb);
    setTimeout(() => cb(auth.currentUser), 0);
    return () => {
      const i = listeners.indexOf(cb);
      if (i !== -1) listeners.splice(i, 1);
    };
  },

  createUserWithEmailAndPassword(email, password) {
    email = (email || '').trim().toLowerCase();
    const users = read(USERS_KEY, {});
    if (users[email]) return authError('auth/email-already-in-use', 'The email address is already in use by another account.');
    if (!password || password.length < 6) return authError('auth/weak-password', 'Password should be at least 6 characters.');
    users[email] = { uid: 'u_' + Date.now().toString(36), password, username: '' };
    write(USERS_KEY, users);
    setSession(email);
    return Promise.resolve({ user: auth.currentUser });
  },

  signInWithEmailAndPassword(email, password) {
    email = (email || '').trim().toLowerCase();
    const user = read(USERS_KEY, {})[email];
    if (!user || user.password !== password) return authError('auth/wrong-password', 'Invalid email or password.');
    setSession(email);
    return Promise.resolve({ user: auth.currentUser });
  },

  signOut() {
    setSession(null);
    return Promise.resolve();
  },

  sendPasswordResetEmail() {
    return Promise.resolve();
  },
};

const db = {
  ref(path) {
    const uid = path.split('/')[1];
    return {
      set(value) {
        const users = read(USERS_KEY, {});
        Object.keys(users).forEach(email => {
          if (users[email].uid === uid) users[email].username = value.username;
        });
        write(USERS_KEY, users);
        return Promise.resolve();
      },
      once() {
        const users = read(USERS_KEY, {});
        const byUid = {};
        Object.keys(users).forEach(email => {
          byUid[users[email].uid] = { email, username: users[email].username };
        });
        return Promise.resolve({ val: () => byUid });
      },
    };
  },
};

const firebase = { auth, db };

export {
  db,
  auth,
  firebase,
};
