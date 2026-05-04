import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../models/firebaseConfig";

export const salvarUsuario = async (dados: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      dados.email,
      dados.senha,
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      nome: dados.nome,
      email: dados.email,
      cpf: dados.cpf,
      telefone: dados.telefone,
      emailVerificado: false,
      criadoEm: new Date().toISOString(),
    });

    await sendEmailVerification(user);

    console.log("Usuário cadastrado com sucesso!");

    return {
      ok: true,
      message:
        "Cadastro realizado. Verifique seu e-mail para ativação da conta.",
    };
  } catch (error: any) {
    console.log("ERRO FIREBASE:", error);

    if (error.code === "auth/email-already-in-use") {
      throw new Error("E-mail já está em uso.");
    }

    if (error.code === "auth/invalid-email") {
      throw new Error("E-mail inválido.");
    }

    if (error.code === "auth/weak-password") {
      throw new Error("A senha é muito fraca.");
    }

    throw new Error("Erro ao cadastrar usuário.");
  }
};

export const loginUsuario = async (email: string, senha: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    await user.reload();

    const emailVerificado = user.emailVerified === true;

    await updateDoc(doc(db, "users", user.uid), {
      emailVerificado,
      atualizadoEm: new Date().toISOString(),
    });

    if (!emailVerificado) {
      throw new Error("Seu e-mail ainda não foi verificado.");
    }

    return user;
  } catch (error: any) {
    if (error.message === "Seu e-mail ainda não foi verificado.") {
      throw error;
    }

    if (error.code === "auth/user-not-found") {
      throw new Error("Usuário não encontrado.");
    }

    if (error.code === "auth/wrong-password") {
      throw new Error("Senha incorreta.");
    }

    if (error.code === "auth/invalid-credential") {
      throw new Error("Credenciais inválidas.");
    }

    throw new Error("Erro ao fazer login.");
  }
};
