import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db, } from "../src/models/firebaseConfig";




export const buscarUsuario = async (telefone: string) => {
  const ref = doc(db, "telefones", telefone);
  const snap = await getDoc(ref);

  console.log("TELEFONE SNAP:", snap.exists(), snap.data());

  if (!snap.exists()) return null;

  const { uid } = snap.data();

  const userSnap = await getDoc(doc(db, "users", uid));

  console.log("USER SNAP:", userSnap.exists(), userSnap.data());

  if (!userSnap.exists()) return null;

  return userSnap.data();
};


export const salvarContato = async (nome: string, telefone: string) => {
  const user = auth.currentUser;

  if (!user) {
    console.log("Usuário não cadastrado");
    return;
  }
//Salva o usuário na tabela contatos
  await addDoc(
    collection(db, "users", user.uid, "contatos"),
    {
      nome: nome,
      telefone: telefone,
    }
  );

  console.log("Contato salvo!");
};

export const listarContatos = (callback: (contatos: any[]) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      callback([]);
      return;
    }

    const ref = collection(db, "users", user.uid, "contatos");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const contatos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(contatos);
    });

    return unsubscribe;
  });
};


export type Contato = {
  id: string;
  nome: string;
  telefone: string;
};

export const excluirContato = async (contatoId: string) => {
  const user = auth.currentUser;
  if (!user) return;
  await deleteDoc(
    doc(db,"users",user.uid, "contatos", contatoId)
  );
};