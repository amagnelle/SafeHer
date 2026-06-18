import { auth, db } from "@/src/models/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { createContext, useContext, useEffect } from "react";
import { Alert } from "react-native";

type NotificationContextType = {};

export const NotificationContext = createContext<NotificationContextType>(
  {} as NotificationContextType,
);

export const NotificationProvider = ({ children }: any) => {
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      console.log("Usuário autenticado:", user?.uid);

      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }

      if (!user) return;

      const notifRef = collection(db, "users", user.uid, "notificacoes");
      const q = query(notifRef, orderBy("criadaEm", "desc"));

      console.log(`Escutando users/${user.uid}/notificacoes`);

      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        console.log("Snapshot recebido:", snapshot.size);

        snapshot.docChanges().forEach((change) => {
          console.log("Tipo da mudança:", change.type);

          if (change.type === "added") {
            const data = change.doc.data();

            console.log("Nova notificação:", data);

            Alert.alert(data.titulo || "Nova notificação", data.mensagem || "");
          }
        });
      });
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
