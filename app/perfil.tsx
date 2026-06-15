import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../src/models/firebaseConfig";

export default function Perfil() {
  const router = useRouter();
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [telefone, setTelefone] = useState("");
const [criadoEm, setCriadoEm] = useState("");


useEffect(() => {
  const carregarUsuario = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();

        setNome(dados.nome || "");
        setEmail(dados.email || "");
        setTelefone(dados.telefone || "");
        setCriadoEm(dados.criadoEm || "");
      }
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
    }
  };
  carregarUsuario();
}, []);
const dataMembro = criadoEm
  ? new Date(criadoEm).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    })
  : "";
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.notification}>
            <Feather name="bell" size={22} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.title}>Meu Perfil</Text>

          <Text style={styles.subtitle}>
            Gerencie suas informações e preferências do SafeHer.
          </Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://i.pravatar.cc/300?img=32",
              }}
              style={styles.avatar}
            />

            <TouchableOpacity style={styles.cameraButton}>
              <Feather name="camera" size={15} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>
            {nome || "Usuário"}
          </Text>

          <View style={styles.memberContainer}>
            <View style={styles.dot} />
            <Text style={styles.memberText}>
  {dataMembro
    ? `Membro desde ${dataMembro}`
    : "Membro desde recentemente"}
</Text>
          </View>

          {/* EMAIL */}
          <TouchableOpacity style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons
                name="email-outline"
                size={22}
                color="#7B2CBF"
              />

              <View style={styles.infoText}>
                <Text style={styles.label}>E-mail</Text>
                <Text style={styles.value}>
                {email || "Sem e-mail"}
              </Text>
              </View>
            </View>

            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          {/* TELEFONE */}
          <TouchableOpacity style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <Feather name="phone" size={20} color="#7B2CBF" />

              <View style={styles.infoText}>
                <Text style={styles.label}>Telefone</Text>
                <Text style={styles.value}>
                {telefone || "Sem telefone"}
              </Text>
              </View>
            </View>

            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* SEGURANÇA */}
        <Text style={styles.sectionTitle}>Conta e Segurança</Text>

        <View style={styles.securityCard}>
          <Opcao
            icone="email-edit-outline"
            titulo="Alterar e-mail"
            descricao="Atualize seu endereço de e-mail"
          />

          <Opcao
            icone="lock-outline"
            titulo="Alterar senha"
            descricao="Mantenha sua conta segura"
          />

          <Opcao
            icone="shield-check-outline"
            titulo="Verificação em duas etapas"
            descricao="Ative uma camada extra de segurança"
            status="Inativo"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Opcao({
  icone,
  titulo,
  descricao,
  status,
}: {
  icone: any;
  titulo: string;
  descricao: string;
  status?: string;
}) {
  return (
    <TouchableOpacity style={styles.option}>
      <View style={styles.optionLeft}>
        <MaterialCommunityIcons name={icone} size={22} color="#7B2CBF" />

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.optionTitle}>{titulo}</Text>
          <Text style={styles.optionDescription}>{descricao}</Text>
        </View>
      </View>

      <View style={styles.optionRight}>
        {status && <Text style={styles.status}>{status}</Text>}

        <Feather name="chevron-right" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  header: {
    backgroundColor: "#7B2CBF",
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 120,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },

  notification: {
    position: "absolute",
    top: 60,
    right: 20,
  },

  title: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 15,
  },

  subtitle: {
    color: "#E5D8FF",
    fontSize: 14,
    marginTop: 5,
  },

  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 18,
    marginTop: -50,
    borderRadius: 22,
    padding: 20,
    elevation: 4,
  },

  avatarContainer: {
    alignItems: "center",
    marginTop: -65,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#7B2CBF",
  },

  cameraButton: {
    position: "absolute",
    bottom: 5,
    right: 115,
    backgroundColor: "#7B2CBF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },

  memberContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7B2CBF",
    marginRight: 6,
  },

  memberText: {
    color: "#777",
    fontSize: 13,
  },

  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
  },

  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    marginLeft: 12,
  },

  label: {
    color: "#888",
    fontSize: 12,
  },

  value: {
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
  },

  sectionTitle: {
    marginTop: 20,
    marginHorizontal: 22,
    marginBottom: 10,
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },

  securityCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 18,
    marginBottom: 30,
    borderRadius: 22,
    overflow: "hidden",
  },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  optionDescription: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  status: {
    color: "#E74C3C",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 8,
  },
});
