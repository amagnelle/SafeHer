import { ThemedView } from "@/components/themed-view";
import { salvarUsuario } from "@/src/models/firebase";
import {
  validarCPFformatado,
  validarEmail,
  validarNome,
  validarSenha,
  validarTelefoneFormatado,
} from "@/src/models/regex";
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

//Formatação do Cpf com máscara. exemplo: 000.000.000-00
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
    // Validar Nome
    if (!nome.trim()) {
      showModal("Erro", "Nome é obrigatório.");
      return;
    }
    if (!validarNome(nome)) {
      showModal("Erro", "Nome deve ter entre 10 e 60 caracteres.");
      return;
    }

    // Validar Email
    if (!email.trim()) {
      showModal("Erro", "Email é obrigatório.");
      return;
    }
    if (!validarEmail(email)) {
      showModal("Erro", "Email inválido.");
      return;
    }

    // Validar Senha
    if (!senha.trim()) {
      showModal("Erro", "Senha é obrigatória.");
      return;
    }
    if (!validarSenha(senha)) {
      showModal("Erro", "Senha deve ter no mínimo 6 caracteres.");
      return;
    }

    // Validar Confirmar Senha
    if (!conSenha.trim()) {
      showModal("Erro", "Confirmação de senha é obrigatória.");
      return;
    }

    // Validar se as senhas coincidem
    if (senha !== conSenha) {
      showModal("Erro", "Senhas não coincidem.");
      return;
    }

    // Validar CPF
    if (!cpf.trim()) {
      showModal("Erro", "CPF é obrigatório.");
      return;
    }
    if (!validarCPFformatado(cpf)) {
      showModal("Erro", "Digite o seu CPF.");
      return;
    }

    // Validar Telefone
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

      showModal("Sucesso", "Cadastro realizado com sucesso!");
    } catch {
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
        onChangeText={(value) => setCpf(formataCPF(value))} //Aplicação quando o usuário digita o cpf para formatar com a máscara
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
