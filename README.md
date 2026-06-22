# SafeHer

Aplicativo mobile de segurança pessoal desenvolvido em React Native com Expo e Firebase.

O SafeHer foi criado para permitir que usuários acionem rapidamente contatos de confiança em situações de risco, compartilhando sua localização em tempo real e registrando seu trajeto durante uma emergência.

---

## Sobre o Projeto

O SafeHer nasceu da necessidade de fornecer uma forma rápida e eficiente de pedir ajuda em situações de vulnerabilidade.

Ao ativar o modo SOS, o aplicativo:

* Notifica contatos previamente cadastrados;
* Compartilha a localização em tempo real;
* Registra o trajeto percorrido durante o alerta;
* Permite que guardiões acompanhem a situação imediatamente.

---

## Objetivo

* Enviar alertas de emergência com rapidez;
* Compartilhar localização em tempo real;
* Facilitar o contato com pessoas de confiança;
* Aumentar a sensação de segurança dos usuários;
* Reduzir o tempo de resposta em situações críticas.

---

## Problema

Milhões de pessoas enfrentam diariamente situações de risco, como:

* Assédio
* Perseguição
* Violência
* Insegurança em locais públicos
* Deslocamentos noturnos

Em momentos críticos, cada segundo importa.

O SafeHer foi desenvolvido para tornar o pedido de ajuda mais rápido, simples e eficiente.

---

## Público-Alvo

* Mulheres
* Estudantes
* Pessoas que caminham sozinhas
* Trabalhadores em deslocamentos noturnos
* Qualquer pessoa que deseje aumentar sua segurança pessoal

---

## Funcionalidades

### Autenticação

* Cadastro de usuários
* Login seguro com Firebase Authentication
* Gerenciamento de sessão

### Sistema SOS

* Ativação rápida do alerta SOS
* Compartilhamento de localização em tempo real
* Registro automático do trajeto
* Encerramento manual do alerta

### Contatos de Confiança

* Cadastro de guardiões
* Edição de contatos
* Exclusão de contatos
* Validação de usuários cadastrados

### Notificações

* Recebimento de alertas SOS
* Histórico de notificações
* Marcação de notificações como lidas
* Marcar todas as notificações como lidas

### Histórico

* Registro de alertas enviados
* Registro de localização durante emergências
* Armazenamento de informações relevantes para acompanhamento

---

## Fluxo do Aplicativo

1. Usuário realiza login.
2. Usuário cadastra seus guardiões.
3. Em caso de emergência, ativa o botão SOS.
4. O aplicativo cria um alerta.
5. Os guardiões recebem uma notificação.
6. A localização passa a ser compartilhada em tempo real.
7. O trajeto é registrado no banco de dados.
8. O alerta pode ser encerrado quando a situação estiver segura.

---

## Tecnologias Utilizadas

### Mobile

* React Native
* Expo
* Expo Router
* TypeScript

### Backend e Serviços

* Firebase Authentication
* Cloud Firestore
* Firebase Cloud Messaging (em implementação)

### Localização

* Expo Location
* React Native Maps

### Interface

* Expo Linear Gradient
* React Native

---

## Arquitetura

```text
React Native (Expo)
        │
        ▼
Firebase Authentication
        │
        ▼
Cloud Firestore
        │
 ┌──────┴──────┐
 ▼             ▼
Alertas    Notificações
 ▼             ▼
Localização em Tempo Real
```

## Estrutura do Banco de Dados

### users

```json
{
  "nome": "string",
  "email": "string",
  "telefone": "string",
  "expoPushToken": "string"
}
```

### contatos

```json
{
  "nome": "string",
  "telefone": "string",
  "contatoUid": "string"
}
```

### notificacoes

```json
{
  "titulo": "string",
  "mensagem": "string",
  "alertaId": "string",
  "remetenteUid": "string",
  "remetenteNome": "string",
  "lida": false,
  "criadaEm": "timestamp"
}
```

### alertas

```json
{
  "userId": "string",
  "status": "ativo",
  "iniciadoEm": "timestamp",
  "encerradoEm": null,
  "ultimaLocalizacao": {}
}
```

### alertas/{alertaId}/trajeto

```json
{
  "latitude": "number",
  "longitude": "number",
  "accuracy": "number",
  "criadoEm": "timestamp"
}
```

## Diferenciais

* Compartilhamento contínuo da localização
* Registro completo do trajeto durante o alerta
* Notificações em tempo real
* Integração com Firebase
* Arquitetura escalável
* Interface otimizada para situações de emergência
* Foco em segurança preventiva

---

## Roadmap

### Concluído

* Cadastro de usuários
* Login
* Sistema SOS
* Compartilhamento de localização
* Cadastro de guardiões
* Notificações em tempo real
* Histórico de notificações
* Registro de trajetos

### Em desenvolvimento

* Push Notifications nativas
* Histórico completo de alertas
* Painel administrativo
* Compartilhamento externo de alertas
* Mapa de áreas de risco

---

## Status do Projeto

🚧 Em desenvolvimento

Projeto acadêmico desenvolvido para estudo de tecnologias mobile, geolocalização e sistemas de segurança pessoal.

---

## Como Executar o Projeto

### Clonar o repositório

```bash
git clone https://github.com/seu-usuario/safeher.git
```

### Entrar na pasta

```bash
cd safeher
```

### Instalar dependências

```bash
npm install
```

### Iniciar o projeto

```bash
npx expo start
```

---

## Configuração do Firebase

Crie um projeto no Firebase e habilite:

* Authentication
* Cloud Firestore
* Cloud Messaging (opcional)

Configure suas credenciais:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID",
};
```

---

## Autor

Desenvolvido por Alexssander TnS.

Projeto SafeHer — Tecnologia aplicada à segurança pessoal.
