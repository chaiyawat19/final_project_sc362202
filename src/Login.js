import { useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";
import ClassroomInfo from './ClassroomInfo'
function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          // ดึงข้อมูลจาก Firestore ถ้ามี
          setUserData(docSnap.data());
        } else {
          // ถ้าไม่มีข้อมูลใน Firestore อาจเป็นผู้ใช้ที่สมัครด้วยวิธีอื่น
          setUserData({
            displayName: user.displayName || "User",
            email: user.email || "No email",
            photoURL: user.photoURL || "https://via.placeholder.com/150",
          });
        }
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const SignUpUsingGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, displayName, email, photoURL } = result.user;

      // บันทึกข้อมูลลง Firestore ถ้ายังไม่มี
      const userRef = doc(db, "Users", uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          displayName,
          email,
          photoURL,
        });
      }

      setUserData({ displayName, email, photoURL });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const Logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="Login">
      {!isLoggedIn && (
        <button onClick={SignUpUsingGoogle} type="button" className="login-with-google-btn">
          Sign in with Google
        </button>
      )}

      {isLoggedIn && userData && (
        <>
          <div className="wrLoginer">
            <div className="profile-card js-profile-card">
              <div className="profile-card__img">
                <img
                  src={userData.photoURL || "https://via.placeholder.com/150"}
                  alt="profile"
                  style={{ borderRadius: "50%" }}
                />
              </div>

              <div className="profile-card__cnt js-profile-cnt">
                <div className="profile-card__name">{userData.displayName}</div>
                <div className="profile-card__txt">{userData.email}</div>
                <button onClick={null}>แก้ไขข้อมูล</button>
                <div className="profile-card-loc"></div>
                <div className="profile-card-ctr">
                  <button className="profile-card__button button--orange" onClick={Logout}>
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ClassroomInfo/>
        </>
      )}
    </div>
  );
}

export default Login;
