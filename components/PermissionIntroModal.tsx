
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PermissionIntroModalProps {
  visible: boolean;
  onContinue: () => void;
  onClose: () => void;
}

export default function PermissionIntroModal({
  visible,
  onContinue,
  onClose,
}: PermissionIntroModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Bem-vinda ao SafeHer</Text>

          <Text style={styles.description}>
            Para que o aplicativo funcione corretamente em situações de emergência,
            precisamos de algumas permissões importantes.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📍 Localização</Text>
            <Text style={styles.cardText}>
              Compartilha sua localização em tempo real durante um alerta SOS.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔔 Notificações</Text>
            <Text style={styles.cardText}>
              Permite avisar seus contatos de confiança quando houver uma emergência.
            </Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Agora não</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={onContinue}>
              <Text style={styles.confirmText}>Permitir e continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
overlay: {
flex: 1,
backgroundColor: "rgba(0,0,0,0.55)",
justifyContent: "center",
alignItems: "center",
padding: 24,
},

modal: {
width: "100%",
maxWidth: 420,
backgroundColor: "#FFFFFF",
borderRadius: 28,
padding: 24,
},

title: {
fontSize: 24,
fontWeight: "900",
color: "#581C87",
textAlign: "center",
marginBottom: 12,
},

description: {
textAlign: "center",
color: "#6B7280",
lineHeight: 22,
marginBottom: 20,
},

card: {
backgroundColor: "#F3E8FF",
borderRadius: 18,
padding: 14,
marginBottom: 12,
},

cardTitle: {
fontSize: 16,
fontWeight: "800",
color: "#581C87",
marginBottom: 6,
},

cardText: {
color: "#6B7280",
lineHeight: 20,
},

buttons: {
flexDirection: "row",
justifyContent: "space-between",
marginTop: 12,
},

cancelButton: {
flex: 1,
marginRight: 8,
borderRadius: 16,
paddingVertical: 14,
alignItems: "center",
backgroundColor: "#E5E7EB",
},

confirmButton: {
flex: 1,
marginLeft: 8,
borderRadius: 16,
paddingVertical: 14,
alignItems: "center",
backgroundColor: "#A855F7",
},

cancelText: {
fontWeight: "700",
color: "#374151",
},

confirmText: {
fontWeight: "800",
color: "#FFFFFF",
},
});
