import { auth, db } from "@/src/models/firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";

export const enviarNotificacaoSOS = async (alertaId: string) => {
  const user = auth.currentUser;

  if (!user) {
    console.log("Usuário não logado");
    return;
  }

  const contatosRef = collection(db, "users", user.uid, "contatos");
  const contatosSnap = await getDocs(contatosRef);

  console.log("SOS acionado");

  for (const contato of contatosSnap.docs) {
    const dados = contato.data();

    console.log("contato:", dados);

    if (!dados.contatoUid) {
      console.log("contato sem UID");
      continue;
    }

    console.log("➡️ enviando para:", dados.contatoUid);

    await addDoc(collection(db, "users", dados.contatoUid, "notificacoes"), {
      titulo: "SOS Ativado",
      mensagem: "Um contato seu acionou um alerta SOS.",
      alertaId,
      remetenteUid: user.uid,
      remetenteNome: user.displayName || "",
      lida: false,

      criadaEm: new Date(),
    });
  }
};
