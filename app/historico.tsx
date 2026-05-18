import { router } from "expo-router";
import {
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Historico() {
  const historico = [
    {
      id: "1",
      nome: "João",
      mensagem: "Ligação realizada  19:33",
    },
    {
      id: "2",
      nome: "Maria",
      mensagem: "Mensagem enviada  14:20",
    },
    {
      id: "3",
      nome: "Carlos",
      mensagem: "Contato salvo  10:15",
    },
  ];

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.msg}>{item.mensagem}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/fundo.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Seu Histórico</Text>

        <FlatList
          data={historico}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },

  nome: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  msg: {
    color: "#ccc",
    marginTop: 5,
  },

  button: {
    backgroundColor: "#5E2CA5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});