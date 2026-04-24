//Nome contendo entre 10 e 60 caracteres
export const validarNome = (nome: string): boolean => {
  return nome.trim().length >= 10 && nome.trim().length <= 60;
};
//Regex completo do e-mail
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
//Senha para o mínimo 6 caracteres
export const validarSenha = (senha: string): boolean => {
  const regex = /^.{6,}$/;
  return regex.test(senha);
};
//Cpf com máscara. Exemplo: 000.000.000-00
export const validarCPFformatado = (cpf: string): boolean => {
  // valida formato primeiro
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!regex.test(cpf)) return false;

  // remove máscara
  cpf = cpf.replace(/\D/g, "");

  // elimina sequências inválidas
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  // 1º dígito
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto >= 10) resto = 0;

  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  // 2º dígito
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto >= 10) resto = 0;

  return resto === parseInt(cpf.substring(10, 11));
};

// Valida número de telefone com 11 dígitos
export const validarTelefoneFormatado = (telefone: string): boolean => {
  const numero = telefone.replace(/\D/g, "");
  return numero.length === 11 && /^\d{11}$/.test(numero);
};
