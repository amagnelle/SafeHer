import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.logo}>SafeHer</Text>
        <Text style={styles.bell}>🔔</Text>
      </View>

      {/* texto */}
      <View style={styles.textContainer}>
        <Text style={styles.hello}>
          Olá, <Text style={styles.name}>Nelle</Text>
        </Text>
        <Text style={styles.sub}>
          Bem-vinda ao seu espaço de segurança.
        </Text>
      </View>

      {/* botão SOS */}
      <TouchableOpacity style={styles.sosButton}>
        <Text style={styles.sosText}>SOS</Text>
        <Text style={styles.sosSub}>Ação rápida</Text>
      </TouchableOpacity>

      {/* cards */}
      <View style={styles.cards}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contatos</Text>
          <Text style={styles.cardLink}>Configurar</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Histórico</Text>
          <Text style={styles.cardLink}>Ver histórico</Text>
        </View>
      </View>

      {/* botão sair */}
      <TouchableOpacity style={styles.logout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bell: {
    fontSize: 24,
  },
  textContainer: {
    marginBottom: 30,
  },
  hello: {
    fontSize: 18,
  },
  name: {
    fontWeight: 'bold',
  },
  sub: {
    fontSize: 14,
    color: '#666',
  },
  sosButton: {
    backgroundColor: '#ff0000',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  sosText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sosSub: {
    color: '#fff',
    fontSize: 14,
  },
  cards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  card: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardLink: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 5,
  },
  logout: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
  },
});