import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
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
  atualizarSenha
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

  async function handleAtualizarEmail() {
  // Validação simples antes de enviar
  if (!novoEmail || !senhaAtual) {
    Alert.alert("Erro", "Por favor, preencha todos os campos.");
    return;
  }

  try {
    await atualizarEmail(novoEmail, senhaAtual);

    // 1. Atualiza o estado local para refletir o novo e-mail na tela imediatamente
    // (Use isso se o seu serviço altera o e-mail na hora com updateEmail)
    setEmail(novoEmail); 

    // 2. Limpa os campos de input do modal para a próxima vez
    setNovoEmail("");
    setSenhaAtual("");

    // 3. Fecha o modal
    setModalEmail(false);

    Alert.alert(
      "Sucesso", 
      "E-mail atualizado com sucesso! (Se configurou verificação, cheque a nova caixa de entrada)."
    );

  } catch (error: any) {
    switch (error.code) {
      case "auth/email-already-in-use":
        Alert.alert("Erro", "Este e-mail já está em uso por outra conta.");
        break;
      case "auth/invalid-email":
        Alert.alert("Erro", "O formato do e-mail digitado é inválido.");
        break;
      case "auth/wrong-password":
        Alert.alert("Erro", "A senha atual digitada está incorreta.");
        break;
      case "auth/requires-recent-login":
        Alert.alert("Erro", "Por segurança, faça login novamente antes de alterar o e-mail.");
        break;
      default:
        Alert.alert("Erro", error.message);
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
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://i.pravatar.cc/300?img=32" }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Feather name="camera" size={15} color="#FFF" />
              </TouchableOpacity>
            </View>

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
                  color="#7B2CBF"
                />
                <View style={styles.infoText}>
                  <Text style={styles.label}>E-mail</Text>
                  <Text style={styles.value}>{email || "Sem e-mail"}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            {/* TELEFONE */}
            <TouchableOpacity style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <Feather name="phone" size={20} color="#7B2CBF" />
                <View style={styles.infoText}>
                  <Text style={styles.label}>Telefone</Text>
                  <Text style={styles.value}>{telefone || "Sem telefone"}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#999" />
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
              icone="shield-check-outline"
              titulo="Verificação em duas etapas"
              descricao="Ative uma camada extra de segurança"
              status="Inativo"
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* MODAIS RENDERIZADOS FORA DA SAFEAREA / SCROLLVIEW */}
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
    <TouchableOpacity style={styles.option} onPress={onPress} disabled={!onPress}>
      <View style={styles.optionLeft}>
        <MaterialCommunityIcons name={icone} size={22} color="#7B2CBF" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.optionTitle}>{titulo}</Text>
          <Text style={styles.optionDescription}>{descricao}</Text>
        </View>
      </View>

      <View style={styles.optionRight}>
        {status && <Text style={styles.status}>{status}</Text>}
        <Feather name="chevron-right" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  header: {
    backgroundColor: "#7B2CBF",
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 120,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  notification: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 15,
  },
  subtitle: {
    color: "#E5D8FF",
    fontSize: 14,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 18,
    marginTop: -50,
    borderRadius: 22,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -65,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "#7B2CBF",
  },
  cameraButton: {
    position: "absolute",
    bottom: 5,
    right: 115,
    backgroundColor: "#7B2CBF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  memberContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7B2CBF",
    marginRight: 6,
  },
  memberText: {
    color: "#777",
    fontSize: 13,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 12,
  },
  label: {
    color: "#888",
    fontSize: 12,
  },
  value: {
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
  },
  sectionTitle: {
    marginTop: 20,
    marginHorizontal: 22,
    marginBottom: 10,
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  securityCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 18,
    marginBottom: 30,
    borderRadius: 22,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  optionDescription: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  status: {
    color: "#E74C3C",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 8,
  },
  modalOverlay: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    color: "#333",
  },
  botao: {
    backgroundColor: "#7B2CBF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  cancelar: {
    textAlign: "center",
    marginTop: 15,
    color: "#666",
    fontWeight: "500",
  },
});