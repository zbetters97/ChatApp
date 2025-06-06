import { auth, db } from "src/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export function useAuth() {
  async function signup(displayname, email, password, setError) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser = userCredentials.user;

      const newUserData = {
        displayname: displayname.toLowerCase(),
        email: email.toLowerCase(),
        createdAt: new Date(),
      };

      const userRef = doc(db, "users", newUser.uid);
      await setDoc(userRef, newUserData);

      return true;
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("The email address is already in use.");
      } else {
        setError("Something went wrong! Please review fields.");
      }

      return false;
    }
  }

  async function usernameAvailable(username) {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", "==", username.toLowerCase())
      );
      const snapshot = await getDocs(q);

      return snapshot.empty;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function login(email, password, setError) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("The email or password is incorrect.");
      } else {
        setError("Something went wrong! Please try again.");
      }

      return false;
    }
  }

  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (!result.user) return false;

      const user = result.user?.reloadUserInfo;

      const uid = user["uid"] || user.localId;
      const displayname = user.displayName;
      const email = user.email;

      const newUserData = {
        displayname: displayname.toLowerCase(),
        email: email.toLowerCase(),
        createdAt: new Date(),
      };

      const fetchedUser = await getUserById(uid);

      if (!fetchedUser) {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, newUserData);
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  function logout() {
    return signOut(auth);
  }

  async function checkIfEmailExists(email) {
    const emailAccounts = await fetchSignInMethodsForEmail(auth, email);
    return emailAccounts.length > 0;
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function getUserById(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) return null;

      const user = userDoc.data();
      return {
        uid: userRef.id,
        ...user,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserByUsername(username) {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", "==", username.toLowerCase())
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      const userRef = snapshot.docs[0].ref;
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) return null;

      const user = userDoc.data();

      return {
        uid: userRef.id,
        ...user,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async function searchByName(name, currentUserId) {
    try {
      if (name.trim() === "") return [];

      name = name.toLowerCase();

      const end = name.replace(/.$/, (c) =>
        String.fromCharCode(c.charCodeAt(0) + 1)
      );

      const usersRef = collection(db, "users");

      const qName = query(
        usersRef,
        where("displayname", ">=", name),
        where("displayname", "<", end)
      );

      const qEmail = query(
        usersRef,
        where("email", ">=", name),
        where("email", "<", end)
      );

      const queryName = await getDocs(qName);
      const queryEmail = await getDocs(qEmail);

      const nameUsers = queryName.docs.map((doc) => {
        return {
          uid: doc.id,
          ...doc.data(),
        };
      });

      const emailUsers = queryEmail.docs.map((doc) => {
        return {
          uid: doc.id,
          ...doc.data(),
        };
      });

      const filteredUsers = [
        ...new Map(
          [...nameUsers, ...emailUsers].map((user) => [user.uid, user])
        ).values(),
      ].filter((user) => user.uid !== currentUserId);

      return filteredUsers;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    signup,
    usernameAvailable,
    login,
    loginWithGoogle,
    logout,
    checkIfEmailExists,
    resetPassword,

    getUserById,
    getUserByUsername,
    searchByName,
  };
}
