import {
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
    User,
    verifyBeforeUpdateEmail
} from "firebase/auth";

const auth = getAuth();

export async function atualizarEmail(
    novoEmail: string,
    senhaAtual: string
): Promise<void> {

    const user: User | null = auth.currentUser;

    if (!user || !user.email) {
        throw new Error("Usuário não autenticado");
    }

    // Reautenticação
    const credential = EmailAuthProvider.credential(
        user.email,
        senhaAtual
    );

    await reauthenticateWithCredential(
        user,
        credential
    );

    // Atualiza email
    await verifyBeforeUpdateEmail(
        user,
        novoEmail
    );
}