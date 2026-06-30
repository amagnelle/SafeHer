import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  atualizarEmail,
  atualizarSenha,
  excluirConta,
} from "../services/editar";
import { auth, db } from "../src/models/firebaseConfig";

const { width, height } = Dimensions.get("window");

export default function Perfil() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [criadoEm, setCriadoEm] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [modalEmail, setModalEmail] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  async function handleExcluirConta() {
  try {
    await excluirConta(senhaAtual);

    // Limpa o campo usado no modal
    setSenhaAtual("");

    // Fecha o modal de exclusão
    setModalExcluir(false);

    // Redireciona para a tela de login
    router.replace("/login");
  } catch (error: any) {
    switch (error.code) {
      case "auth/wrong-password":
        Alert.alert("Erro", "Senha incorreta");
        break;

      case "auth/requires-recent-login":
        Alert.alert("Erro", "Faça login novamente antes de excluir sua conta");
        break;

      default:
        Alert.alert("Erro", error.message);
    }
  }
}
  async function handleAtualizarEmail() {
    // 1. Validação simples antes de enviar
    if (!novoEmail || !senhaAtual) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    // 2. Evitar enviar o mesmo e-mail que já está na tela
    if (novoEmail.trim().toLowerCase() === email.trim().toLowerCase()) {
      Alert.alert(
        "Aviso",
        "O novo e-mail precisa ser diferente do e-mail atual.",
      );
      return;
    }

    try {
      console.log("Tentando atualizar e-mail para:", novoEmail);
      await atualizarEmail(novoEmail, senhaAtual);

      // Se chegou aqui, deu certo!
      setEmail(novoEmail);
      setNovoEmail("");
      setSenhaAtual("");
      setModalEmail(false);

      // No ambiente Web, o alert nativo funciona melhor como fallback:
      if (typeof window !== "undefined") {
        alert("E-mail atualizado com sucesso!");
      } else {
        Alert.alert("Sucesso", "E-mail atualizado com sucesso!");
      }
    } catch (error: any) {
      // ESSA LINHA É CRUCIAL: Se o botão "não fizer nada", abra o console do seu navegador (F12)
      // ou o terminal do VS Code. O erro real vai aparecer printado lá!
      console.error("Erro capturado no componente Perfil:", error);

      // Fallback para exibir o erro no navegador (localhost) se o Alert falhar
      const mensagemErro = error.message || "Erro desconhecido";

      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Erro: Este e-mail já está em uso por outra conta.");
          break;
        case "auth/invalid-email":
          alert("Erro: O formato do e-mail digitado é inválido.");
          break;
        case "auth/wrong-password":
          alert("Erro: A senha atual digitada está incorreta.");
          break;
        case "auth/requires-recent-login":
          alert(
            "Erro: Por segurança, faça login novamente antes de alterar o e-mail.",
          );
          break;
        default:
          alert("Erro: " + mensagemErro);
      }
    }
  }
  async function handleAtualizarSenha() {
    try {
      await atualizarSenha(senhaAtual, novaSenha);
      Alert.alert("Sucesso", "Senha alterada");
      setModalSenha(false); // Fecha o modal após o sucesso
    } catch (error: any) {
      switch (error.code) {
        case "auth/wrong-password":
          Alert.alert("Erro", "Senha atual incorreta");
          break;
        case "auth/weak-password":
          Alert.alert("Erro", "Senha muito fraca");
          break;
        default:
          Alert.alert("Erro", error.message);
      }
    }
  }

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          setNome(dados.nome || "");
          setEmail(dados.email || "");
          setTelefone(dados.telefone || "");
          setCriadoEm(dados.criadoEm || "");
        }
      } catch (error) {
        console.log("Erro ao carregar perfil:", error);
      }
    };
    carregarUsuario();
  }, []);

  const dataMembro = criadoEm
    ? new Date(criadoEm).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* CABEÇALHO */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.notification}>
              <Feather name="bell" size={22} color="#FFF" />
            </TouchableOpacity>

            <Text style={styles.title}>Meu Perfil</Text>
            <Text style={styles.subtitle}>
              Gerencie suas informações e preferências do SafeHer.
            </Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            <View style={styles.avatarContainer}></View>

            <Text style={styles.name}>{nome || "Usuário"}</Text>

            <View style={styles.memberContainer}>
              <View style={styles.dot} />
              <Text style={styles.memberText}>
                {dataMembro
                  ? `Membro desde ${dataMembro}`
                  : "Membro desde recentemente"}
              </Text>
            </View>

            {/* EMAIL */}
            <TouchableOpacity style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={22}
                  color="#C084FC"
                />
                <View style={styles.infoText}>
                  <Text style={styles.label}>E-mail</Text>
                  <Text style={styles.value}>{email || "Sem e-mail"}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.55)" />
            </TouchableOpacity>

            {/* TELEFONE */}
            <TouchableOpacity style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <Feather name="phone" size={20} color="#C084FC" />
                <View style={styles.infoText}>
                  <Text style={styles.label}>Telefone</Text>
                  <Text style={styles.value}>{telefone || "Sem telefone"}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.55)" />
            </TouchableOpacity>
          </View>

          {/* SEGURANÇA */}
          <Text style={styles.sectionTitle}>Conta e Segurança</Text>

          <View style={styles.securityCard}>
            {/* Passando o onPress direto para o componente customizado */}
            <Opcao
              icone="email-edit-outline"
              titulo="Alterar e-mail"
              descricao="Atualize seu endereço de e-mail"
              onPress={() => setModalEmail(true)}
            />

            <Opcao
              icone="lock-outline"
              titulo="Alterar senha"
              descricao="Mantenha sua conta segura"
              onPress={() => setModalSenha(true)}
            />

            <Opcao
              icone="delete-outline"
              titulo="Excluir conta"
              descricao="Excluir permanentemente sua conta"
              onPress={() => setModalExcluir(true)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <Modal visible={modalExcluir} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Excluir conta</Text>

            <Text style={{ marginBottom: 15, color: "#666" }}>
              Esta ação é permanente e não poderá ser desfeita.
            </Text>

            <TextInput
              placeholder="Digite sua senha"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity
              style={[styles.botao, { backgroundColor: "#E53935" }]}
              onPress={handleExcluirConta}
            >
              <Text style={{ color: "#FFF", fontWeight: "600" }}>
                Excluir conta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalExcluir(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Modal visible={modalEmail} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar E-mail</Text>

            <TextInput
              placeholder="Novo e-mail"
              value={novoEmail}
              onChangeText={setNovoEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Senha atual"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.botao}
              onPress={handleAtualizarEmail}
            >
              <Text style={{ color: "#FFF", fontWeight: "600" }}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalEmail(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalSenha} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>

            <TextInput
              placeholder="Senha atual"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              placeholder="Nova senha"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.botao}
              onPress={handleAtualizarSenha}
            >
              <Text style={{ color: "#FFF", fontWeight: "600" }}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalSenha(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

// Componente Opcao atualizado para aceitar a propriedade onPress
function Opcao({
  icone,
  titulo,
  descricao,
  status,
  onPress,
}: {
  icone: any;
  titulo: string;
  descricao: string;
  status?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.optionLeft}>
        <MaterialCommunityIcons name={icone} size={22} color="#C084FC" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.optionTitle}>{titulo}</Text>
          <Text style={styles.optionDescription}>{descricao}</Text>
        </View>
      </View>

      <View style={styles.optionRight}>
        {status && <Text style={styles.status}>{status}</Text>}
        <Feather name="chevron-right" size={20} color="#ccc0c0" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A0030",
  },

  header: {
    backgroundColor: "#210032",
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 70,
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 2,
  },

  notification: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 48,
  },

  subtitle: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 16,
    marginTop: 8,
    lineHeight: 22,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.10)",
    marginHorizontal: 22,
    marginTop: 28,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  avatarContainer: {
    alignItems: "center",
    marginTop: 0,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: "rgba(192,132,252,0.9)",
  },

  cameraButton: {
    position: "absolute",
    bottom: 4,
    right: 115,
    backgroundColor: "#A855F7",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#210032",
  },

  name: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  memberContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 22,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#A855F7",
    marginRight: 8,
  },

  memberText: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    fontWeight: "500",
  },

  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  infoText: {
    marginLeft: 14,
    flex: 1,
  },

  label: {
    color: "rgba(255,255,255,0.56)",
    fontSize: 13,
    marginBottom: 3,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  sectionTitle: {
    marginTop: 28,
    marginHorizontal: 26,
    marginBottom: 14,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  securityCard: {
    backgroundColor: "rgba(255,255,255,0.10)",
    marginHorizontal: 22,
    marginBottom: 34,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  optionDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.58)",
    marginTop: 4,
  },

  status: {
    color: "#FF4D6D",
    fontSize: 12,
    fontWeight: "800",
    marginRight: 8,
  },

  modalOverlay: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(5,0,12,0.78)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  modalContent: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#2A0A3D",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 16,
    color: "#FFFFFF",
  },

  input: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.78)",
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 12,
    color: "#FFFFFF",
    fontSize: 15,
  },

  botao: {
    backgroundColor: "#A855F7",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 6,
  },

  cancelar: {
    textAlign: "center",
    marginTop: 16,
    color: "#C084FC",
    fontWeight: "900",
  },
});