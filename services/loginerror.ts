import { auth } from "@/src/models/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

// Traduz códigos de erro do Firebase para mensagens amigáveis em português
export function traduzirErrorFirebase(code: string): string {
  switch (code) {
    case "auth/user-not-found":
      return "Usuário não encontrado. Verifique o e-mail digitado.";
    case "auth/wrong-password":
      return "Senha incorreta. Tente novamente.";
    case "auth/invalid-email":
      return "E-mail inválido. Verifique o formato do e-mail.";
    case "auth/too-many-requests":
      return "Muitas tentativas de login. Tente novamente mais tarde.";
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado.";
    case "auth/weak-password":
      return "Senha fraca. Use pelo menos 6 caracteres.";
    default:
      return "Ocorreu um erro desconhecido. Tente novamente.";
  }
}

// Função de login com tratamento de erro melhorado
export async function loginComErroTratado(email: string, senha: string) {
  try {
    if (!email || !senha) {
      throw new Error("Preencha todos os campos");
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error: any) {
    const code =
      typeof error?.code === "string"
        ? error.code
        : typeof error?.message === "string"
        ? error.message.match(/auth\/[-a-z]+/i)?.[0]
        : undefined;

    if (code) {
      const mensagem = traduzirErrorFirebase(code.toLowerCase());
      throw new Error(mensagem);
    }

    // Se for erro customizado ou outro tipo de erro, passa como está
    throw new Error(error?.message ?? "Ocorreu um erro ao fazer login.");
  }
}
