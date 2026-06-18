import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// AQUI: Importando diretamente do seu arquivo contato.ts
import {
  buscarUsuario,
  Contato,
  editarContato,
  excluirContato,
  listarContatos,
  salvarContato,
} from "@/services/contatos";

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nome, setNome] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [excluirId, setExcluirId] = useState<string | null>(null);

  useEffect(() => {
    // Usando a sua função do contato.ts
    const unsubscribe = listarContatos((lista) => {
      setContatos(lista);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const salvarContatoFinal = async () => {
    const telefoneLimpo = telefone.replace(/\D/g, "");

    if (!telefoneLimpo) {
      showModal("Erro", "Digite um telefone");
      return;
    }

    if (!nome) {
      showModal("Erro", "Digite um nome");
      return;
    }

    try {
      if (editandoId) {
        // EDITAR
        await editarContato(editandoId, {
          nome,
          telefone: telefoneLimpo,
        });
      } else {
        const usuario = await buscarUsuario(telefoneLimpo);

        if (!usuario) {
          showModal("Erro", "Número não cadastrado");
          return;
        }

        await salvarContato(nome, telefoneLimpo, usuario.uid);
      }

      // reset
      setTelefone("");
      setNome("");
      setEditandoId(null);
      setExcluirId(null);
      setModalVisible(false);
    } catch (err) {
      console.log(err);
      showModal("Erro", "Falha ao salvar");
    }
  };

  const abrirModalExcluir = (contato: Contato) => {
    setEditandoId(null);

    setExcluirId(contato.id);

    setModalTitle("Excluir contato");
    setModalMessage(`Tem certeza que deseja excluir ${contato.nome}?`);
    setModalVisible(true);
  };

  const confirmarExclusao = async () => {
    if (!excluirId) return;

    try {
      await excluirContato(excluirId);

      setExcluirId(null);
      setModalVisible(false);
    } catch (err) {
      console.log(err);
      showModal("Erro", "Falha ao excluir");
    }
  };

  const abrirModalEditar = (contato: Contato) => {
    setExcluirId(null);

    setNome(contato.nome);
    setTelefone(contato.telefone);
    setEditandoId(contato.id);

    setModalTitle("Editar contato");
    setModalMessage("Altere os dados abaixo:");
    setModalVisible(true);
  };

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const abrirModalSalvar = () => {
    setEditandoId(null);
    setExcluirId(null);
    setNome("");
    setTelefone("");

    showModal("Novo contato", "Digite os dados do contato de segurança");
  };

  const renderContato = ({ item }: { item: Contato }) => (
    <View style={styles.contatoCard}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>
          {item.nome.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.contatoInfo}>
        <Text style={styles.contatoNome}>{item.nome}</Text>
        <Text style={styles.contatoTelefone}>{item.telefone}</Text>
        <Text style={styles.contatoStatus}>Contato de confiança</Text>
      </View>

      <View style={styles.actionsArea}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => abrirModalEditar(item)}
        >
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteAction]}
          onPress={() => abrirModalExcluir(item)}
        >
          <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/fundo.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />

          <Text style={styles.title}>Meus Contatos</Text>

          <Text style={styles.subtitle}>
            Pessoas de confiança para receber seus alertas.
          </Text>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={contatos}
            keyExtractor={(item) => item.id}
            renderItem={renderContato}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Nenhum contato ainda</Text>
                <Text style={styles.emptyText}>
                  Adicione uma pessoa de confiança para receber seus alertas.
                </Text>
              </View>
            }
          />
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={abrirModalSalvar}
        >
          <Text style={styles.primaryText}>Adicionar contato</Text>
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

            {!excluirId && (
              <>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Digite o telefone"
                  placeholderTextColor="rgba(255,255,255,0.48)"
                  value={telefone}
                  onChangeText={setTelefone}
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.modalInput}
                  placeholder="Digite o nome"
                  placeholderTextColor="rgba(255,255,255,0.48)"
                  value={nome}
                  onChangeText={setNome}
                />
              </>
            )}

            <TouchableOpacity
              style={[
                styles.modalButton,
                excluirId && styles.modalDeleteButton,
              ]}
              onPress={excluirId ? confirmarExclusao : salvarContatoFinal}
            >
              <Text style={styles.modalButtonText}>
                {excluirId ? "Excluir" : "Confirmar"}
              </Text>
            </TouchableOpacity>

            {/* FECHAR */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
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
    backgroundColor: "rgba(8, 0, 24, 0.62)",
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 34,
  },

  header: {
    alignItems: "center",
    marginBottom: 26,
  },

  logoImage: {
    width: 76,
    height: 76,
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  listContainer: {
    flex: 1,
    width: "100%",
  },

  listContent: {
    paddingBottom: 20,
  },

  contatoCard: {
    width: "100%",
    minHeight: 118,
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 16,
    borderRadius: 24,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
  },

  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(168,85,247,0.24)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  contatoInfo: {
    flex: 1,
  },

  contatoNome: {
    fontSize: 19,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  contatoTelefone: {
    fontSize: 14,
    color: "rgba(255,255,255,0.72)",
    marginTop: 4,
  },

  contatoStatus: {
    fontSize: 12,
    color: "#C084FC",
    marginTop: 6,
    fontWeight: "700",
  },

  actionsArea: {
    alignItems: "flex-end",
    gap: 8,
  },

  actionButton: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  actionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  deleteAction: {
    backgroundColor: "rgba(225,29,72,0.12)",
    borderColor: "rgba(225,29,72,0.24)",
  },

  deleteText: {
    color: "#FB7185",
    fontSize: 12,
    fontWeight: "800",
  },

  emptyContainer: {
    marginTop: 70,
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  emptyText: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  primaryButton: {
    width: "100%",
    height: 60,
    backgroundColor: "#A855F7",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 17,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.70)",
    paddingHorizontal: 24,
  },

  modalContainer: {
    width: "100%",
    maxWidth: 360,
    padding: 24,
    backgroundColor: "#1E1233",
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },

  modalMessage: {
    fontSize: 14,
    color: "rgba(255,255,255,0.68)",
    marginBottom: 18,
    textAlign: "center",
    lineHeight: 20,
  },

  modalInput: {
    width: "100%",
    height: 56,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    borderRadius: 18,
    paddingHorizontal: 18,
    color: "#FFFFFF",
    marginBottom: 12,
  },

  modalButton: {
    width: "100%",
    height: 54,
    backgroundColor: "#A855F7",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  modalDeleteButton: {
    backgroundColor: "#E11D48",
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },

  closeButton: {
    width: "100%",
    height: 52,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonText: {
    color: "rgba(255,255,255,0.82)",
    fontWeight: "800",
  },
});
