import { addDoc, collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { auth, db, } from "../src/models/firebaseConfig";


export const buscarUsuario = async (telefone: string) => {
  const q = query(
    //Coleta da lista de usuários
    collection(db, "users"),
    //Lista se o telefone importado existe ou não no banco de dados
    where("telefone", "==", telefone)
  );

  const snapshot = await getDocs(q);
  // condição para verificar se existe ou não se existir salva na nova tabela
  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data();
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
  const user = auth.currentUser;

  if (!user) {
    callback([]);
    return () => {};
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
};


export type Contato = {
  id: string;
  nome: string;
  telefone: string;
};