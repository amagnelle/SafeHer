import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db, } from "../src/models/firebaseConfig";




export const buscarUsuario = async (telefone: string) => {
  const ref = doc(db, "telefones", telefone);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data(); // Retorna só o que tiver em "telefones/{telefone}"
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




export const excluirContato = async (contatoId: string) => {
  const user = auth.currentUser;
  if (!user) return;
  await deleteDoc(
    doc(db,"users",user.uid, "contatos", contatoId)
  );
};

export const editarContato = async (contatoId: string, dados:{nome?: string;telefone?:string}) =>{
  const user = auth.currentUser;

  if(!user){
    console.log("Usuário não autenticado");
    return; 
  }
  try{
    const ref = doc (db, "users", user.uid, "contatos", contatoId);
    
    await updateDoc(ref, dados);

    console.log("Contato atualizado!")
  } catch(error){
    console.error("erro ao editar", error);
  }
}




export type Contato = {
  id: string;
  nome: string;
  telefone: string;
};