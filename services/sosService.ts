import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { auth, db } from "../src/models/firebaseConfig";



type Localizacao = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
};

export async function iniciarAlerta() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const alertaRef = await addDoc(collection(db, "alertas"), {
    userId: user.uid,
    status: "ativo",
    iniciadoEm: serverTimestamp(),
    encerradoEm: null,
    ultimaLocalizacao: null,
  });

  return alertaRef.id;
}

export async function salvarPontoDoTrajeto(
  alertaId: string,
  localizacao: Localizacao,
) {
  const pontoRef = doc(collection(db, "alertas", alertaId, "trajeto"));

  await setDoc(pontoRef, {
    latitude: localizacao.latitude,
    longitude: localizacao.longitude,
    accuracy: localizacao.accuracy ?? null,
    criadoEm: serverTimestamp(),
  });

  await updateDoc(doc(db, "alertas", alertaId), {
    ultimaLocalizacao: {
      latitude: localizacao.latitude,
      longitude: localizacao.longitude,
      accuracy: localizacao.accuracy ?? null,
      atualizadoEm: new Date().toISOString(),
    },
  });
}

export async function encerrarAlerta(alertaId: string) {
  await updateDoc(doc(db, "alertas", alertaId), {
    status: "encerrado",
    encerradoEm: serverTimestamp(),
  });
}
