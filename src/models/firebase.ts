import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const salvarUsuario = async (dados: any) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            dados.email,
            dados.senha
        ); 

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            nome: dados.nome,
            email: dados.email,
            cpf:dados.cpf,
            telefone: dados.telefone,
        });

        console.log("Usuário cadastrado com sucesso!");
        } catch (error: any) {
    console.log("ERRO FIREBASE:", error);

    if (error.code === "auth/email-already-in-use") {
        throw new Error("Email já está em uso.");
    }

    if (error.code === "auth/invalid-email") {
        throw new Error("Email inválido.");
    }

    throw error; // mantém o erro real
}}