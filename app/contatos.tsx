import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Contato, buscarUsuario, listarContatos, salvarContato } from "../services/contatos";



export default function App() {
  const [telefone, setTelefone] = useState("");
  const [nome, setNome] = useState("");
  const [contatos, setContatos] = useState<Contato[]>([]);
  const buscar = async () => {
    const telefoneLimpo = telefone.replace(/\D/g, "");

    const resultado = await buscarUsuario(telefoneLimpo);

    if (resultado) {
      setNome(resultado.nome);
    } else {
      setNome("Não encontrado");
    }
  };

  const salvar = async () => {
    if (!nome || nome === "Não encontrado") return;

    const telefoneLimpo = telefone.replace(/\D/g, "");

    await salvarContato(nome, telefoneLimpo);
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

      <Button title="Buscar" onPress={buscar} />

      <Text style={{ marginTop: 20 }}>
        {nome}
      </Text>

      <Button title="Salvar Contato" onPress={salvar} />
    </View>
  );
 
}


const styles = StyleSheet.create({
    back: {
    backgroundColor: "rgb(255, 255, 255)"
  },
})