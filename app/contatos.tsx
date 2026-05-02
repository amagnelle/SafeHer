import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { buscarUsuario, Contato, listarContatos, salvarContato } from "../services/contatos";



export default function App() {
  const [telefone, setTelefone] = useState("");
  const [nome, setNome] = useState("");
  const [contatos, setContatos] = useState<Contato[]>([]);
 


    

  const salvar = async () => {
  const telefoneLimpo = telefone.replace(/\D/g, "");

  if (!telefoneLimpo) return;

  const resultado = await buscarUsuario(telefoneLimpo);

  if (!resultado) return;

  await salvarContato(resultado.nome, telefoneLimpo);

  setTelefone("");
  setNome("");
};
 useEffect(() =>{
    const unsub = listarContatos(setContatos);
    return unsub;
  }, []);

  return (
    <View style={styles.back}>
      <FlatList
       data={contatos}
       keyExtractor={(item) => item.id}
       renderItem={({ item }) => (
         <View style={{ padding: 10 }}>
           <Text>{item.nome}</Text>
           <Text>{item.telefone}</Text>
         </View>
       )}
     />
      <TextInput
        placeholder="Digite o telefone"
        value={telefone}
        onChangeText={setTelefone}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      

      <Text style={{ marginTop: 20 }}>
        {nome}
      </Text>

     <Button
  title="Salvar Contato"
  onPress={() => {
    console.log("clicou");
    salvar();
  }}
/>
    </View>
  );
 
}


const styles = StyleSheet.create({
    back: {
    margin: 10,
    backgroundColor: "rgb(255, 255, 255)"
  },
})