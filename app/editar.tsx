import React, { useState } from "react";

import {
    Alert,
    Button,
    TextInput,
    View
} from "react-native";

import { atualizarEmail } from "../services/editar";

export default function AlterarEmail() {

    const [novoEmail, setNovoEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleAtualizarEmail() {

        try {

            await atualizarEmail(
                novoEmail,
                senha
            );

            Alert.alert(
                "Sucesso",
                "Email de verificação enviado"
            );

        } catch (error: any) {

            switch (error.code) {

                case "auth/requires-recent-login":
                    Alert.alert(
                        "Erro",
                        "Faça login novamente"
                    );
                    break;

                case "auth/email-already-in-use":
                    Alert.alert(
                        "Erro",
                        "Esse email já está em uso"
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
                value={senha}
                onChangeText={setSenha}
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

        </View>
    );
}