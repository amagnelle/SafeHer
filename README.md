# SafeHer

Aplicativo mobile desenvolvido em React Native com Expo e Firebase voltado para o acionamento rápido de contatos de confiança em situações de emergência.

O projeto permite autenticação de usuários, gerenciamento de contatos, envio de alertas SOS, compartilhamento da localização em tempo real, registro do trajeto percorrido e recebimento de notificações dentro do aplicativo.

---

## 🎥 Demonstração

[▶️ Assistir à demonstração do SafeHer](https://youtu.be/PJJFo5OTOtc?is=opnf_1W4XTdiMVfJ)
# Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- Expo Router
- Firebase Authentication
- Cloud Firestore
- Google Maps (react-native-maps)
- Expo Location
- Expo Notifications

---

# Funcionalidades

## Autenticação

- Cadastro de usuários com e-mail e senha
- Login utilizando Firebase Authentication
- Verificação de e-mail após o cadastro
- Logout da conta
- Persistência da sessão do usuário

---

## Cadastro de Usuário

Durante o cadastro são armazenados:

- Nome
- E-mail
- CPF
- Telefone

O sistema realiza validação de:

- Nome
- E-mail
- CPF
- Telefone
- Senha

Antes de concluir o cadastro.

---

## Tela Inicial

Ao abrir o aplicativo o usuário encontra:

- Apresentação do SafeHer
- Solicitação das permissões necessárias
- Acesso para Login
- Acesso para Cadastro

As permissões solicitadas são:

- Localização
- Notificações

---

## Botão SOS

O aplicativo possui um botão principal para acionamento do alerta de emergência.

Ao iniciar um SOS:

- Um alerta é criado no Firestore;
- A localização atual é obtida;
- O trajeto começa a ser registrado;
- Os contatos cadastrados recebem uma notificação;
- O mapa passa a acompanhar o deslocamento do usuário.

Ao encerrar o SOS:

- O alerta é finalizado;
- O registro do trajeto é encerrado.

---

## Localização

O aplicativo utiliza a localização do dispositivo para:

- Exibir a posição atual;
- Registrar o deslocamento durante um alerta;
- Desenhar o trajeto percorrido no mapa.

O mapa é implementado utilizando Google Maps através da biblioteca react-native-maps.

---

## Contatos de Confiança

O usuário pode:

- Adicionar contatos
- Editar contatos
- Excluir contatos

Os contatos ficam armazenados no Firebase Firestore.

---

## Histórico

O aplicativo possui uma tela destinada ao histórico dos alertas registrados pelo usuário.

---

## Notificações

O projeto possui suporte às notificações utilizando Expo Notifications.

Entre os recursos implementados estão:

- Registro do Push Token
- Recebimento de notificações
- Exibição das notificações dentro do aplicativo

---

## Perfil

A tela de perfil permite visualizar e atualizar informações da conta.

Também estão disponíveis opções relacionadas à autenticação do usuário.

---

# Estrutura do Projeto

```
app/
│
├── index.tsx
├── login.tsx
├── cadastro.tsx
├── botao.tsx
├── contatos.tsx
├── notificacoes.tsx
├── historico.tsx
├── perfil.tsx
└── alerta/
    └── [id].tsx

components/
├── SOSmap.tsx
├── PermissionIntroModal.tsx
└── ...

services/
├── contatos.ts
├── editar.ts
├── notification.ts
├── perfil.ts
├── pushNotifications.ts
├── regex.ts
└── sosService.ts

src/
└── models/
    ├── firebase.ts
    └── firebaseConfig.ts
```

---

# Firebase

O projeto utiliza o Firebase para:

- Authentication
- Cloud Firestore

Os dados armazenados incluem:

## users

Informações do usuário autenticado.

Exemplo:

- Nome
- E-mail
- CPF
- Telefone
- Data de criação
- Status da verificação de e-mail

## telefones

Relaciona números de telefone aos respectivos usuários.

## alertas

Armazena os alertas SOS iniciados pelos usuários.

---

# Bibliotecas Principais

- expo-router
- firebase
- react-native-maps
- expo-location
- expo-notifications
- expo-linear-gradient
- react-native-gesture-handler
- react-native-reanimated

---

# Interface

O aplicativo possui telas para:

- Apresentação
- Login
- Cadastro
- Botão SOS
- Contatos
- Histórico
- Notificações
- Perfil
- Visualização de Alertas

---

# Execução

## Instalar dependências

```bash
npm install
```

## Executar

```bash
npx expo start
```

ou

```bash
npm start
```

---

# Desenvolvido com

- React Native
- Expo
- Firebase
- TypeScript
