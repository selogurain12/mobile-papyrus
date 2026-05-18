import { type ApiFetcherArgs, type AppRouter, tsRestFetchApi } from "@ts-rest/core";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { papyrusContract } from "../../../packages/src/contracts/index.contract";
import { localStorageBasePrefixVariable } from "../local-storage-base-prefix-variable";

const apiUrl = "https://papyrus-xxdv.onrender.com";

async function getIdTokenAsync(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(localStorageBasePrefixVariable("idToken"));
  } catch (error) {
    console.error("Erreur lors de la récupération du token :", error);
    return null;
  }
}

export function createClient<Tcontract extends AppRouter>(contract: Tcontract) {
  return initTsrReactQuery(contract, {
    baseUrl: apiUrl,

    baseHeaders: {},

    api: async (args: ApiFetcherArgs) => {
      const idToken = await getIdTokenAsync();

      if (!idToken) {
        throw new Error("No id token");
      }

      return tsRestFetchApi({
        ...args,
        headers: {
          ...args.headers,
          Authorization: `Bearer ${idToken}`,
        },
      });
    },
  });
}

export type PapyrusClient = ReturnType<typeof createClient<typeof papyrusContract>>;

export const clientFile: PapyrusClient = createClient(papyrusContract);
