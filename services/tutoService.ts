import {Tutoriel} from "../src/models/models"

import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://numambhgn.alwaysdata.net/api/";


export default class TutorielService {
   // Headers avec token récupéré 
   private static async getHeaders() {
    const token = await AsyncStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    }

    static async getTutos(): Promise<Tutoriel[]> {
      const headers = await this.getHeaders();
      return fetch(`${BASE_URL}tutoriel/liste`, {
        method: "GET",
        headers: headers,
      })
        .then(async (response) => {
          const json = await response.json();
          if (!response.ok) throw new Error(json.message || "Erreur serveur");
          return json.data;
        })
        .catch((error) => {
          console.error("Erreur dans getTutos:", error);
          throw error;
        })}
  

      static async getTutoByClient(): Promise<Tutoriel[]> {
      const headers = await this.getHeaders();
      return fetch(`${BASE_URL}tutoriel/listeLangue`, {
        method: "GET",
        headers: headers,
      })
        .then(async (response) => {
          const json = await response.json();
          if (!response.ok) throw new Error(json.message || "Erreur serveur");
          return json.data;
        })
        .catch((error) => {
          console.error("Erreur dans getTutos:", error);
          throw error;
        })}
  
    static getTuto(id: any): Promise<Tutoriel| null> {
      return fetch(`${BASE_URL}${id}/tutoriel/liste`)
        .then(response => response.json())
        .then(data => (this.isEmpty(data) ? null : data))
        .catch(error => this.handleError(error));
    }
  
    static updateUtilisateur(tutoriel: Tutoriel): Promise<Tutoriel> {
      return fetch(`${BASE_URL}${tutoriel.id}/`, {
        method: "PUT",
        body: JSON.stringify(tutoriel),
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  
    static deletTutoruel(tutoruel: Tutoriel): Promise<{}> {
      return fetch(`${BASE_URL}${tutoruel.id}/`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  
    static addUtilisateur(tutoruel:Tutoriel): Promise<Tutoriel> {
      return fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(tutoruel),
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  
    static isEmpty(data: Object): boolean {
      return Object.keys(data).length === 0;
    }
  
    static handleError(error: Error): void {
      console.error(error);
    }
  }
  