import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../src/models/firebaseConfig";

export async function buscarPerfil() {
  const user = auth.currentUser;

  if (!user) return null;

  const docRef = doc(db, "usuarios", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return docSnap.data();
}