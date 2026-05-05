import { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// AQUI: Importando diretamente do seu arquivo contato.ts
import { listarContatos, Contato } from "@/services/contato"; 

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

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

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const renderContato = ({ item }: { item: Contato }) => (
    <View style={styles.contatoCard}>
      <View style={styles.contatoInfo}>
        <Text style={styles.contatoNome}>{item.nome}</Text>
        <Text style={styles.contatoTelefone}>{item.telefone}</Text>
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
        <Text style={styles.title}>Contatos Salvos</Text>

        <View style={styles.listContainer}>
          <FlatList
            data={contatos}
            keyExtractor={(item) => item.id}
            renderItem={renderContato}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum contato encontrado.</Text>
              </View>
            }
          />
        </View>

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => showModal("Info", `Você tem ${contatos.length} contatos.`)}
        >
          <Text style={styles.primaryText}>Ver Status</Text>
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
  container: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  listContainer: { flex: 1, width: "100%", maxWidth: 400 },
  listContent: { paddingBottom: 20 },
  contatoCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  contatoInfo: { flex: 1 },
  contatoNome: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  contatoTelefone: { fontSize: 14, color: "#ccc", marginTop: 4 },
  emptyContainer: { marginTop: 50, alignItems: "center" },
  emptyText: { color: "#ccc", fontSize: 16, fontStyle: "italic" },
  primaryButton: {
    backgroundColor: "#5E2CA5",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  primaryText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  modalMessage: { fontSize: 16, color: "#ccc", marginBottom: 12, textAlign: "center" },
  modalButton: { backgroundColor: "#5E2CA5", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});
