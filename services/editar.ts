import {
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
    updatePassword,
    User,
    verifyBeforeUpdateEmail
} from "firebase/auth";

const auth = getAuth();


//Função para trocar o Email
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

//Trocar Senha
export async function atualizarSenha(
    senhaAtual:string,
    novaSenha: string,
): Promise<void>{
    const user: User | null = auth.currentUser;
    if (!user || !user.email){
        throw new Error("Usuário não encontrado");
    }
    const credential = EmailAuthProvider.credential(
        user.email,
        senhaAtual
    );

    await reauthenticateWithCredential(
        user,
        credential
    );

    // Atualiza senha
    await updatePassword(
        user,
        novaSenha
    );
}
