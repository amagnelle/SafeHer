import { auth } from "@/src/models/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function loginComErroTratado(email: string, senha: string) {
  try {
    if (!email || !senha) {
      throw new Error("Preencha todos os campos");
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;

  } catch (error: any) {
  console.log("ERRO REAL:", error);

    const code = error?.code;

    // 🎯 TRATAMENTO SIMPLES E EFICAZ
    if (code === "auth/invalid-credential") {
      throw new Error("E-mail ou senha inválidos.");
    }

    if (code === "auth/network-request-failed") {
      throw new Error("Sem conexão com a internet.");
    }

    if (code === "auth/too-many-requests") {
      throw new Error("Muitas tentativas. Tente mais tarde.");
    }

    // fallback
    throw new Error("Não foi possível fazer login. Tente novamente.");
  }
}