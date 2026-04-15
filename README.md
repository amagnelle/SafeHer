# SafeHer








Aplicativo mobile de segurança para envio rápido de alertas de emergência com localização em tempo real.

#  Sobre o Projeto

O SafeHer é um aplicativo mobile desenvolvido com o objetivo de aumentar a segurança dos usuários em situações de risco.

A aplicação permite o envio imediato de um pedido de socorro para contatos de confiança, incluindo a localização atual do usuário.

#  Objetivo
🚨 Enviar alertas de emergência rapidamente
📍 Compartilhar localização em tempo real
👥 Facilitar contato com pessoas de confiança
⚠️ Problema

# Muitas pessoas enfrentam situações de risco no dia a dia, como:

Assédio
Perseguição
Violência
Insegurança em locais públicos

Em momentos críticos, o tempo é essencial — o SafeHer busca reduzir o tempo de reação e facilitar o pedido de ajuda.

#  Público-Alvo
Mulheres
Estudantes
Pessoas que caminham sozinhas
Usuários que buscam mais segurança
#  Funcionalidades
🔴 Botão SOS

Envio imediato de alerta para contatos cadastrados.

📍 Compartilhamento de Localização
Captura latitude e longitude via GPS
Envio de link com localização em tempo real
👤 Contatos de Emergência
Cadastro de contatos confiáveis
Notificação automática em caso de emergência
🕒 Histórico de Alertas
Registro de data e hora
Armazenamento da localização
Status dos alertas enviados
#  Fluxo do Aplicativo
<img width="519" height="922" alt="mermaid-diagram" src="https://github.com/user-attachments/assets/62bebd52-df0c-4e82-abc7-54e086002412" />

# Tecnologias
📱 Mobile
React Native
# Backend & Serviços
Firebase
📚 Recursos utilizados do Firebase
Firebase Authentication (autenticação de usuários)
Cloud Firestore (banco de dados em tempo real)
Firebase Cloud Messaging (notificações) (opcional)
📚 Bibliotecas
Expo Location
Expo SMS
# Estrutura do Banco de Dados (Firestore)
👤 users
{
  "id": "string",
  "nome": "string",
  "email": "string",
  "telefone": "string"
}
📞 contacts
{
  "id": "string",
  "user_id": "string",
  "nome": "string",
  "telefone": "string"
}
🚨 alerts
{
  "id": "string",
  "user_id": "string",
  "latitude": "number",
  "longitude": "number",
  "data": "timestamp",
  "status": "string"
}
# Diferenciais

✨ Envio rápido de alertas
📡 Localização em tempo real
🔥 Integração com Firebase (tempo real + escalabilidade)
📱 Uso de recursos nativos do celular
🎯 Interface simples e direta
❤️ Impacto social positivo

📌 Status do Projeto

🚧 Em desenvolvimento (projeto acadêmico)

⚙️ Como Rodar o Projeto
# Clone o repositório
git clone https://github.com/seu-usuario/safeher.git

# Acesse a pasta
cd safeher

# Instale as dependências
npm install

# Inicie o projeto
npm start
🔐 Configuração do Firebase
Crie um projeto no Firebase
Ative:
Authentication
Firestore Database
Adicione suas credenciais no projeto:
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};
