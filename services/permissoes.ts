import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

type ResultadoPermissao<T = undefined> = {
  ok: boolean;
  status: string;
  message: string;
  data?: T;
};

export async function pedirPermissaoLocalizacao(): Promise<
  ResultadoPermissao<Location.LocationObjectCoords>
> {
  try {
    const { status, canAskAgain } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return {
        ok: false,
        status,
        message: canAskAgain
          ? "Permissão de localização negada."
          : "Permissão de localização negada permanentemente. Ative nas configurações do dispositivo.",
      };
    }

    const location = await Location.getCurrentPositionAsync({});

    return {
      ok: true,
      status,
      message: "Permissão de localização concedida.",
      data: location.coords,
    };
  } catch {
    return {
      ok: false,
      status: "error",
      message: "Erro ao solicitar permissão de localização.",
    };
  }
}

export async function pedirPermissaoNotificacao(): Promise<
  ResultadoPermissao
> {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const permissaoAtual = await Notifications.getPermissionsAsync();
    let finalStatus = permissaoAtual.status;

    if (finalStatus !== "granted") {
      const novaPermissao = await Notifications.requestPermissionsAsync();
      finalStatus = novaPermissao.status;
    }

    if (finalStatus !== "granted") {
      return {
        ok: false,
        status: finalStatus,
        message: "Permissão de notificação negada.",
      };
    }

    return {
      ok: true,
      status: finalStatus,
      message: "Permissão de notificação concedida.",
    };
  } catch {
    return {
      ok: false,
      status: "error",
      message: "Erro ao solicitar permissão de notificação.",
    };
  }
}

export async function enviarNotificacaoTeste(): Promise<
  ResultadoPermissao
> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "SafeHer",
        body: "Notificações funcionando com sucesso.",
      },
      trigger: null,
    });

    return {
      ok: true,
      status: "scheduled",
      message: "Notificação de teste enviada.",
    };
  } catch {
    return {
      ok: false,
      status: "error",
      message: "Erro ao enviar notificação de teste.",
    };
  }
}