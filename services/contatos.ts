import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../src/models/firebaseConfig";

export const buscarUsuario = async(telefone: string) => {
   const q = query(
    collection(db, "users"),
    where("telefone", "==", telefone)
   );
   const snapshot = await getDocs(q);
   if (snapshot.empty){
    return null; 
   }
   return snapshot.docs[0].data();
};


