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
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const notifRef = collection(db, "users", user.uid, "notificacoes");

      const q = query(notifRef, orderBy("criadaEm", "desc"));

      // listener em tempo real
      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();

            Alert.alert(data.titulo || "Nova notificação", data.mensagem || "");
          }
        });
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
