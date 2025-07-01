import {AvisVente} from "../src/models/models"
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://numambhgn.alwaysdata.net/api/";


export default class AvisVenteService {

    // Headers avec token récupéré 
    private static async getHeaders() {
      const token = await AsyncStorage.getItem("auth_token");
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    }


    static async getVentesCitoyen(): Promise<AvisVente[]> {
    const headers = await this.getHeaders();
    try {
      const response = await fetch(`${BASE_URL}avis/AvisParCitoyen`, { headers });

      // Vérifie le status HTTP
      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const json = await response.json();

      // console.log("vente reçus:", json.data);

      if (!json.data) {
        throw new Error("Aucune donnée reçue");
      }

      return json.data as AvisVente[];
    } catch (error) {
      this.handleError(error as Error);
      return []; // retourne une liste vide en cas d’erreur
    }
  }

  
    static getvente(id: any): Promise<AvisVente| null> {
      return fetch(`${BASE_URL}${id}/`)
        .then(response => response.json())
        .then(data => (this.isEmpty(data) ? null : data))
        .catch(error => this.handleError(error));
    }
  
    static updateVente(vente: AvisVente): Promise<AvisVente> {
      return fetch(`${BASE_URL}${vente.id}/`, {
        method: "PUT",
        body: JSON.stringify(vente),
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  
    static deleteVente(vente: AvisVente): Promise<{}> {
      return fetch(`${BASE_URL}${vente.id}/`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }

    //Annuler un avis de vente si un acheteur ne paie pas afin que d'autre puisse le consulteé
     static async annulerVente(id: number): Promise<{ message: string; status: number }> {
        const headers = await this.getHeaders();

        try {
          const response = await fetch(`${BASE_URL}avis/annuler/${id}`, {
            method: "PUT",
            headers: {
              ...headers,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            // Erreur côté serveur
            const text = await response.text(); 
            // console.error("Réponse brute :", text);
            return {
              message: "Erreur lors de l’annulation de la vente.",
              status: response.status,
            };
          }

          const data = await response.json(); 
          return {
            message: data.message,
            status: response.status,
          };
        } catch (error) {
          console.error("Erreur réseau :", error);
          return {
            message: "Erreur réseau",
            status: 500,
          };
        }
      }





  // ajouter unde demande de ramassage
     static async addVente(vente: AvisVente): Promise<{ status: number; message: string }> {
  try {
    const headers = await this.getHeaders();

    const response = await fetch(`${BASE_URL}avis/create`, {
      method: "POST",
      body: JSON.stringify(vente),
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
    // console.log("Données reçues du backend:", data);

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
  