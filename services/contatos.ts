import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db, } from "../src/models/firebaseConfig";

export const buscarUsuario = async (telefone: string) => {
  const q = query(
    collection(db, "users"),
    where("telefone", "==", telefone)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data();
};


export const salvarContato = async (nome: string, telefone: string) => {
  const user = auth.currentUser;

  if (!user) {
    console.log("Usuário não logado");
    return;
  }

  await addDoc(
    collection(db, "users", user.uid, "contatos"),
    {
      nome: nome,
      telefone: telefone,
    }
  );

  console.log("Contato salvo!");
};