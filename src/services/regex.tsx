
//Nome contendo entre 10 e 60 caracteres
export const validarNome =(nome: string): boolean => {
    return nome.trim().length >= 10 && nome.trim().length <= 60;
};
//Regex completo do e-mail
export const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
//Senha para o mínimo 6 caracteres
export const validarSenha = (senha:string): boolean => {
    const regex = /^.{6,}$/;
    return regex.test(senha);
};
//Cpf com máscara. Exemplo: 000.000.000.00
export const validarCPFformatado = (cpf:string): boolean => {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
};
//Onze dígitos formatado para o telefone
export const validarTelefoneFormatado = (telefone:string): boolean => {
    const regex = /^\d{11}$/;
    return regex.test(telefone)
};

