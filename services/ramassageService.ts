import {DemandeRamassage} from "../src/models/models"
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://numambhgn.alwaysdata.net/api/";


export default class RamassageService {

    // Headers avec token récupéré 
    private static async getHeaders() {
      const token = await AsyncStorage.getItem("auth_token");
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    }


    static async getRamassages(): Promise<DemandeRamassage[]> {
    const headers = await this.getHeaders();
    try {
      const response = await fetch(`${BASE_URL}demande/listeParCitoyen`, { headers });

      // Vérifie le status HTTP
      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const json = await response.json();

      // console.log("Ramassages reçus:", json.data);

      if (!json.data) {
        throw new Error("Aucune donnée reçue");
      }

      return json.data as DemandeRamassage[];
    } catch (error) {
      this.handleError(error as Error);
      return []; // retourne une liste vide en cas d’erreur
    }
  }

  
    static getRamassage(id: any): Promise<DemandeRamassage| null> {
      return fetch(`${BASE_URL}${id}/`)
        .then(response => response.json())
        .then(data => (this.isEmpty(data) ? null : data))
        .catch(error => this.handleError(error));
    }
  
    static updateRamasage(ramassage: DemandeRamassage): Promise<DemandeRamassage> {
      return fetch(`${BASE_URL}${ramassage.id}/`, {
        method: "PUT",
        body: JSON.stringify(ramassage),
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  
    static deleteRamassage(ramassage: DemandeRamassage): Promise<{}> {
      return fetch(`${BASE_URL}${ramassage.id}/`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  // ajouter unde demande de ramassage
     static async addRamassage(ramassage: DemandeRamassage): Promise<{ status: number; message: string }> {
  try {
    const headers = await this.getHeaders();

    const response = await fetch(`${BASE_URL}demande/create`, {
      method: "POST",
      body: JSON.stringify(ramassage),
      headers,
    });

    const text = await response.text();
    console.log("RAW response text:", text); 

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      console.error("Erreur de parsing JSON:", jsonError);
      data = {}; // fallback
    }

    console.log("Status code:", response.status);
    console.log("Données reçues du backend:", data);

    return {
      status: response.status,
      message: data.message || "Demande envoyée",
    };

  } catch (error) {
    console.error("Erreur dans addRamassage:", error);
    this.handleError(error as Error);
    return {
      status: 500,
      message: "Une erreur est survenue",
    };
  }
}



    static isEmpty(data: Object): boolean {
      return Object.keys(data).length === 0;
    }
  
    static handleError(error: Error): void {
      console.error(error);
    }
  }
  