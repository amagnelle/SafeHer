
import {
  validarCPFformatado,
  validarEmail,
  validarNome,
  validarSenha,
  validarTelefoneFormatado,
} from "@/services/regex";
import { salvarUsuario } from "@/src/models/firebase";
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

  //formatação com máscara do telefone
  const formatarTelefone = (valor: string): string => {
  const numero = valor.replace(/\D/g, "").slice(0, 11);

  if (numero.length <= 10) {
    return numero
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    return numero
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
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
      showModal("Sucesso", "Cadastro realizado. Acesse seu e-mail e confirme sua conta antes de entrar.");
    } catch (error: any) {
      showModal("Erro", error.message);
}


  };

  return (
    <ImageBackground
      source={require("@/assets/images/fundo.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Cadastro</Text>

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
          value={senha}
          onChangeText={setSenha}
          placeholder="Senha"
          placeholderTextColor="#ccc"
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          value={conSenha}
          onChangeText={setConSenha}
          placeholder="Confirme sua Senha"
          placeholderTextColor="#ccc"
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          value={cpf}
          onChangeText={(value) => setCpf(formataCPF(value))} //Aplicação quando o usuário digita o cpf para formatar com a máscara
          placeholder="CPF"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          value={formatarTelefone(num)}
          onChangeText={(text) => setNum(text.replace(/\D/g, "").slice(0, 11))}
          placeholder="Número de Celular"
          placeholderTextColor="#ccc"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleCadastro}>
          <Text style={styles.primaryText}>Cadastrar</Text>
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
