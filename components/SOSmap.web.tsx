import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SOSMapProps {
  onEndAlert: () => void;
}

export default function SOSMap({ onEndAlert }: SOSMapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa indisponível</Text>

      <Text style={styles.text}>
        O rastreamento em tempo real funciona apenas no aplicativo móvel.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onEndAlert}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  text: {
    marginTop: 10,
    textAlign: "center",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#7E22CE",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});