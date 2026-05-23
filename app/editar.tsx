import React, { useState } from "react";

import {
    Alert,
    Button,
    TextInput,
    View
} from "react-native";

import {
    atualizarEmail,
    atualizarSenha
} from "../services/editar";

export default function EditarConta() {

    const [novoEmail, setNovoEmail] = useState("");

    const [senhaAtual, setSenhaAtual] = useState("");

    const [novaSenha, setNovaSenha] = useState("");

    async function handleAtualizarEmail() {

        try {

            await atualizarEmail(
                novoEmail,
                senhaAtual
            );

            Alert.alert(
                "Sucesso",
                "Email de verificação enviado"
            );

        } catch (error: any) {

            switch (error.code) {

                case "auth/email-already-in-use":
                    Alert.alert(
                        "Erro",
                        "Email já está em uso"
                    );
                    break;

                case "auth/invalid-email":
                    Alert.alert(
                        "Erro",
                        "Email inválido"
                    );
                    break;

                case "auth/wrong-password":
                    Alert.alert(
                        "Erro",
                        "Senha incorreta"
                    );
                    break;

                default:
                    Alert.alert(
                        "Erro",
                        error.message
                    );
            }
        }
    }

    async function handleAtualizarSenha() {

        try {

            await atualizarSenha(
                senhaAtual,
                novaSenha
            );

            Alert.alert(
                "Sucesso",
                "Senha alterada"
            );

        } catch (error: any) {

            switch (error.code) {

                case "auth/wrong-password":
                    Alert.alert(
                        "Erro",
                        "Senha atual incorreta"
                    );
                    break;

                case "auth/weak-password":
                    Alert.alert(
                        "Erro",
                        "Senha muito fraca"
                    );
                    break;

                default:
                    Alert.alert(
                        "Erro",
                        error.message
                    );
            }
        }
    }

    return (

        <View
            style={{
                backgroundColor:"#fff",
                flex: 1,
                justifyContent: "center",
                padding: 20,
                gap: 10
            }}
        >

            <TextInput
                placeholder="Novo email"
                value={novoEmail}
                onChangeText={setNovoEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 8
                }}
            />

            <TextInput
                placeholder="Senha atual"
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                secureTextEntry
                style={{
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 8
                }}
            />

            <Button
                title="Alterar Email"
                onPress={handleAtualizarEmail}
            />

            <TextInput
                placeholder="Nova senha"
                value={novaSenha}
                onChangeText={setNovaSenha}
                secureTextEntry
                style={{
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 8,
                    marginTop: 20
                }}
            />

            <Button
                title="Alterar Senha"
                onPress={handleAtualizarSenha}
            />

        </View>
    );
}