import { useState } from "react";
import {
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Contatos() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleSendMessage = async () => {
    if (!nome.trim() || !email.trim() || !assunto.trim() || !mensagem.trim()) {
      showModal("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      // Simulação de envio
      console.log("Enviando:", { nome, email, assunto, mensagem });
      showModal("Sucesso", "Sua mensagem foi enviada com sucesso!");
      
      setNome("");
      setEmail("");
      setAssunto("");
      setMensagem("");
    } catch (error) {
      showModal("Erro", "Erro ao enviar mensagem.");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/fundo.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Contatos</Text>

        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Nome Completo"
          placeholderTextColor="#ccc"
          style={styles.input}
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#ccc"
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          value={assunto}
          onChangeText={setAssunto}
          placeholder="Assunto"
          placeholderTextColor="#ccc"
          style={styles.input}
        />

        <TextInput
          value={mensagem}
          onChangeText={setMensagem}
          placeholder="Sua Mensagem"
          placeholderTextColor="#ccc"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSendMessage}>
          <Text style={styles.primaryText}>Enviar Mensagem</Text>
        </TouchableOpacity>
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
              onPress={() => setModalVisible(false)}
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
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    maxWidth: 350,
    height: 55,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  textArea: {
    height: 120,
    paddingVertical: 15,
  },

  primaryButton: {
    backgroundColor: "#5E2CA5",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 12,
    marginTop: 15,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },

  modalMessage: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 12,
    textAlign: "center",
  },

  modalButton: {
    backgroundColor: "#5E2CA5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
