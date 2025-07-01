import { TypeDechet } from "../src/models/models";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://numambhgn.alwaysdata.net/api/";

export default class DechetService {
  // Headers avec token récupéré 
  private static async getHeaders() {
    const token = await AsyncStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  //Lister les types de déchets
  static async getDechets(): Promise<TypeDechet[]> {
    const headers = await this.getHeaders();
    return fetch(`${BASE_URL}dechet/liste`, { headers })
      .then(res => res.json())
      .then(json => json.data)
      .catch(this.handleError);
  }

  // Créer un nouveau type de déchet
  static async addDechet(dechet: TypeDechet): Promise<{ status: number; message: string }> {
    const headers = await this.getHeaders();
    return fetch(`${BASE_URL}dechet/create`, {
      method: "POST",
      headers,
      body: JSON.stringify({ dechet }),
    })
      .then(res => res.json())
      .catch(this.handleError);
  }

  // Modifier un type de déchet
  static async updateDechet(id: number): Promise<{ status: number; message: string }> {
    const headers = await this.getHeaders();
    return fetch(`${BASE_URL}dechet/edit/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({  }),
    })
      .then(res => res.json())
      .catch(this.handleError);
  }

  // Gestion d'erreur simple
  static handleError(error: any): void {
    console.error("Erreur DechetService :", error);
  }
}
