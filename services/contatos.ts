import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../src/models/firebaseConfig";

export const buscarUsuario = async (telefone: string) => {
  const ref = doc(db, "telefones", telefone);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  const data = snap.data();

  return {
    uid: data.uid,
    telefone: data.telefone,
  };
};
export const salvarContato = async (
  nome: string,
  telefone: string,
  contatoUid: string,
) => {
  const user = auth.currentUser;

  if (!user) return;

  await addDoc(collection(db, "users", user.uid, "contatos"), {
    nome,
    telefone,
    contatoUid,
  });
};

export const listarContatos = (callback: (contatos: any[]) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      callback([]);
      return;
    }

    const ref = collection(db, "users", user.uid, "contatos");

    return onSnapshot(ref, (snapshot) => {
      const contatos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(contatos);
    });
  });
};

export const excluirContato = async (contatoId: string) => {
  const user = auth.currentUser;
  if (!user) return;

  await deleteDoc(doc(db, "users", user.uid, "contatos", contatoId));
};

export const editarContato = async (
  contatoId: string,
  dados: { nome?: string; telefone?: string; contatoUid?: string },
) => {
  const user = auth.currentUser;
  if (!user) return;

  await updateDoc(doc(db, "users", user.uid, "contatos", contatoId), dados);
};
export type Contato = {
  id: string;
  nome: string;
  telefone: string;
  contatoUid?: string;
};
