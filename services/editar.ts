import {
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential, // <-- Alterado aqui
    updatePassword,
    User,
    verifyBeforeUpdateEmail
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../src/models/firebaseConfig";

/**
 * FUNÇÃO PARA TROCAR O EMAIL
 * Altera o e-mail no Auth e atualiza o Firestore mantendo o fluxo do cadastro.
 */
export async function atualizarEmail(
    novoEmail: string,
    senhaAtual: string
): Promise<void> {
    const user: User | null = auth.currentUser;

    if (!user || !user.email) {
        throw new Error("Usuário não autenticado");
    }

    const emailAntigo = user.email;

    // 1. Reautenticação obrigatória
    const credential = EmailAuthProvider.credential(
        emailAntigo,
        senhaAtual
    );
    await reauthenticateWithCredential(user, credential);

    // 2. ENVIA O E-MAIL DE VERIFICAÇÃO PRIMEIRO
    // O Firebase vai enviar o link para o 'novoEmail'. 
    await verifyBeforeUpdateEmail(user, novoEmail);
    console.log("1/2: E-mail de verificação enviado para o novo endereço!");

    // 3. ATUALIZA O FIRESTORE
    // Nota: Como o verifyBeforeUpdateEmail aguarda a confirmação no link para mudar o Auth,
    // o ideal é atualizar o Firestore aqui se você quer que o app já reflita a intenção de mudança,
    // ou usar um Cloud Function/Trigger para atualizar o Firestore só quando o Auth mudar de fato.
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
        email: novoEmail
    });
    console.log("2/2: Firestore atualizado com o novo e-mail!");
}

/**
 * FUNÇÃO PARA TROCAR A SENHA
 */
export async function atualizarSenha(
    senhaAtual: string,
    novaSenha: string,
): Promise<void> {
    const user: User | null = auth.currentUser;
    if (!user || !user.email) {
        throw new Error("Usuário não encontrado");
    }
    
    const credential = EmailAuthProvider.credential(
        user.email,
        senhaAtual
    );

    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, novaSenha);
}

/**
 * FUNÇÃO PARA EXCLUIR CONTA
 */
export async function excluirConta(
    senhaAtual: string
): Promise<void> {
    const user: User | null = auth.currentUser;

    if (!user || !user.email) {
        throw new Error("Usuário não autenticado");
    }

    const credential = EmailAuthProvider.credential(
        user.email,
        senhaAtual
    );

    await reauthenticateWithCredential(user, credential);

    await deleteUser(user);
}