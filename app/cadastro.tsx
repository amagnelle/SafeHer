import { ThemedView } from "@/components/themed-view";
import { salvarUsuario } from "@/src/models/firebase";
import { useState } from "react";
import {
  Button,
  Modal,
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

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !conSenha || !cpf || !num) {
      showModal("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nome.length < 10 || nome.length > 60) {
      showModal("Erro", "O nome deve conter entre 10 e 60 caracteres.");
      return;
    }

    if (!emailRegex.test(email)) {
      showModal("Erro", "Email inválido.");
      return;
    }

    if (senha.length < 6) {
      showModal("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== conSenha) {
      showModal("Erro", "As senhas não coincidem.");
      return;
    }

    const cpfOnlyDigits = cpf.replace(/\D/g, "");
    if (cpfOnlyDigits.length !== 11) {
      showModal("Erro", "CPF deve conter 11 dígitos.");
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

      showModal("Sucesso", "Cadastro realizado com sucesso!");
    } catch (error) {
      showModal("Erro", "Erro ao cadastrar usuário.");
    }
  };
  return (
    <ThemedView style={styles.container}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Cadastro</Text>

      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Nome Completo"
        style={styles.input}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
      />

      <TextInput
        value={senha}
        onChangeText={setSenha}
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        value={conSenha}
        onChangeText={setConSenha}
        placeholder="Confirme sua Senha"
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        value={cpf}
        onChangeText={setCpf}
        placeholder="CPF"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        value={num}
        onChangeText={setNum}
        placeholder="Número de Celular"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Button title="Cadastrar" onPress={handleCadastro} />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  input: {
    width: 300,
    height: 60,
    margin: 5,
    borderWidth: 0.5,
    padding: 15,
    borderRadius: 20,
    borderColor: "#800080",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#800080",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
