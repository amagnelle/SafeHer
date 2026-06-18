import {
  validarCPFformatado,
  validarEmail,
  validarNome,
  validarSenha,
  validarTelefoneFormatado,
} from "@/services/regex";
import { salvarUsuario } from "@/src/models/firebase";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [conSenha, setConSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [num, setNum] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConSenha, setMostrarConSenha] = useState(false);

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const formataCPF = (value: string) => {
    const numeros = value.replace(/\D/g, "");

    if (numeros.length <= 3) {
      return numeros;
    } else if (numeros.length <= 6) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    } else if (numeros.length <= 9) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    } else {
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
    }
  };

  const handleCadastro = async () => {
    if (!nome.trim()) {
      showModal("Erro", "Nome é obrigatório.");
      return;
    }

    if (!validarNome(nome)) {
      showModal("Erro", "Nome deve ter entre 10 e 60 caracteres.");
      return;
    }

    if (!email.trim()) {
      showModal("Erro", "Email é obrigatório.");
      return;
    }

    if (!validarEmail(email)) {
      showModal("Erro", "Email inválido.");
      return;
    }

    if (!senha.trim()) {
      showModal("Erro", "Senha é obrigatória.");
      return;
    }

    if (!validarSenha(senha)) {
      showModal("Erro", "Senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (!conSenha.trim()) {
      showModal("Erro", "Confirmação de senha é obrigatória.");
      return;
    }

    if (senha !== conSenha) {
      showModal("Erro", "Senhas não coincidem.");
      return;
    }

    if (!cpf.trim()) {
      showModal("Erro", "CPF é obrigatório.");
      return;
    }

    if (!validarCPFformatado(cpf)) {
      showModal("Erro", "Digite o seu CPF.");
      return;
    }

    if (!num.trim()) {
      showModal("Erro", "Telefone é obrigatório.");
      return;
    }

    if (!validarTelefoneFormatado(num)) {
      showModal("Erro", "Telefone inválido.");
      return;
    }

    try {
      await salvarUsuario({
        nome,
        email,
        senha,
        cpf,
        telefone: num,
      });

      setCadastroSucesso(true);
      showModal("Sucesso", "Cadastro realizado com sucesso!");
    } catch {
      setCadastroSucesso(false);
      showModal("Erro", "Erro ao cadastrar usuário.");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/corSolida.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />

            <Text style={styles.title}>Criar sua conta</Text>

            <Text style={styles.subtitle}>
              Vamos começar a cuidar da sua segurança.
            </Text>

            <View style={styles.formCard}>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Nome completo"
                placeholderTextColor="rgba(255,255,255,0.55)"
                style={styles.input}
              />

              <View style={styles.inputDivider} />

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="E-mail"
                placeholderTextColor="rgba(255,255,255,0.55)"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.inputDivider} />

              <View style={styles.passwordRow}>
                <TextInput
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Senha"
                  placeholderTextColor="rgba(255,255,255,0.55)"
                  secureTextEntry={!mostrarSenha}
                  style={styles.passwordInput}
                />

                <TouchableOpacity
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                >
                  <Text style={styles.eyeText}>
                    {mostrarSenha ? "Ocultar" : "Ver"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputDivider} />

              <View style={styles.passwordRow}>
                <TextInput
                  value={conSenha}
                  onChangeText={setConSenha}
                  placeholder="Confirmar senha"
                  placeholderTextColor="rgba(255,255,255,0.55)"
                  secureTextEntry={!mostrarConSenha}
                  style={styles.passwordInput}
                />

                <TouchableOpacity
                  onPress={() => setMostrarConSenha(!mostrarConSenha)}
                >
                  <Text style={styles.eyeText}>
                    {mostrarConSenha ? "Ocultar" : "Ver"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputDivider} />

              <TextInput
                value={cpf}
                onChangeText={(value) => setCpf(formataCPF(value))}
                placeholder="CPF"
                placeholderTextColor="rgba(255,255,255,0.55)"
                keyboardType="numeric"
                style={styles.input}
              />

              <View style={styles.inputDivider} />

              <TextInput
                value={num}
                onChangeText={setNum}
                placeholder="Número de celular"
                placeholderTextColor="rgba(255,255,255,0.55)"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            <TouchableOpacity style={styles.termsRow}>
              <View style={styles.checkbox} />
              <Text style={styles.termsText}>
                Li e aceito os Termos de Uso e Política de Privacidade
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCadastro}
            >
              <Text style={styles.primaryText}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginText}>
                Já tem conta? <Text style={styles.loginHighlight}>Entrar</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);

                if (cadastroSucesso) {
                  router.push("/login");
                }
              }}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(8, 0, 24, 0.54)",
    paddingHorizontal: 24,
  },

  keyboardView: {
    flex: 5,
    width: "100%",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 74,
    paddingBottom: 42,
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    top: 58,
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 40,
    fontWeight: "300",
  },

  logoImage: {
    width: 200,
    height: 200,
    marginBottom: 14,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },

  subtitle: {
    color: "rgba(255,255,255,0.72)",
    marginTop: 7,
    marginBottom: 28,
    textAlign: "center",
    fontSize: 14,
  },

  formCard: {
    width: "100%",
    maxWidth: 370,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    marginBottom: 16,
  },

  input: {
    width: "100%",
    height: 52,
    paddingHorizontal: 20,
    color: "#FFFFFF",
    fontSize: 15,
  },

  inputDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginHorizontal: 18,
  },

  passwordRow: {
    width: "100%",
    height: 52,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
  },

  eyeText: {
    color: "#C084FC",
    fontSize: 13,
    fontWeight: "800",
  },

  termsRow: {
    width: "100%",
    maxWidth: 370,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#C084FC",
    marginRight: 10,
    marginTop: 2,
  },

  termsText: {
    flex: 1,
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    lineHeight: 17,
  },

  primaryButton: {
    width: "100%",
    maxWidth: 370,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#A855F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  loginText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
  },

  loginHighlight: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  modalContainer: {
    width: "82%",
    maxWidth: 330,
    padding: 24,
    backgroundColor: "#1E1233",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 15,
    color: "rgba(255,255,255,0.72)",
    marginBottom: 18,
    textAlign: "center",
    lineHeight: 21,
  },

  modalButton: {
    backgroundColor: "#A855F7",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 14,
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
