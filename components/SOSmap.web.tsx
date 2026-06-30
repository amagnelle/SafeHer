import { StyleSheet, Text, View } from "react-native";

export default function SOSMap() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa indisponível na versão web</Text>
      <Text style={styles.text}>
        O rastreamento em tempo real funciona na versão mobile do aplicativo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 20,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#581C87",
    marginBottom: 8,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    color: "#6B21A8",
    textAlign: "center",
  },
});