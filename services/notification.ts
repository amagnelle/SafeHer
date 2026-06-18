import { auth, db } from "@/src/models/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  alertaId: string;
  remetenteUid: string;
  remetenteNome: string;
  lida: boolean;
  criadaEm: string;
}

export const enviarNotificacaoSOS = async (alertaId: string) => {
  const user = auth.currentUser;

  if (!user) return;

  // Busca os dados do usuário
  const usuarioRef = doc(db, "users", user.uid);
  const usuarioSnap = await getDoc(usuarioRef);

  const nomeUsuario = usuarioSnap.exists()
    ? usuarioSnap.data().nome
    : "Contato";

  const contatosRef = collection(db, "users", user.uid, "contatos");

  const contatosSnap = await getDocs(contatosRef);

  for (const contato of contatosSnap.docs) {
    const dados = contato.data();

    if (!dados.contatoUid) continue;

    await addDoc(collection(db, "users", dados.contatoUid, "notificacoes"), {
      titulo: `Alerta de ${nomeUsuario}`,
      mensagem: "Toque para acompanhar a localização em tempo real.",
      alertaId,
      remetenteUid: user.uid,
      remetenteNome: nomeUsuario,
      lida: false,
      criadaEm: serverTimestamp(),
    });
  }
};

export const escutarNotificacoes = (
  callback: (lista: Notificacao[]) => void,
) => {
  const user = auth.currentUser;

  if (!user) return () => {};

  const ref = query(
    collection(db, "users", user.uid, "notificacoes"),
    orderBy("criadaEm", "desc"),
  );

  return onSnapshot(ref, (snapshot) => {
    const notificacoes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notificacao[];

    callback(notificacoes);
  });
};

export const marcarNotificacaoComoLida = async (notificacaoId: string) => {
  const user = auth.currentUser;

  if (!user) return;

  const notificacaoRef = doc(
    db,
    "users",
    user.uid,
    "notificacoes",
    notificacaoId,
  );

  await updateDoc(notificacaoRef, {
    lida: true,
  });
};

export const marcarTodasNotificacoesComoLidas = async () => {
  const user = auth.currentUser;

  if (!user) return;

  const notificacoesRef = collection(db, "users", user.uid, "notificacoes");

  const snapshot = await getDocs(notificacoesRef);

  const batch = writeBatch(db);

  snapshot.docs.forEach((documento) => {
    const dados = documento.data();

    if (dados.lida === false) {
      batch.update(documento.ref, {
        lida: true,
      });
    }
  });

  await batch.commit();
};
