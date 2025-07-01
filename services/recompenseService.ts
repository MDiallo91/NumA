import {Recompense} from "../src/models/models"
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://numambhgn.alwaysdata.net/api/";


export default class RecompenseService {

   // Headers avec token récupéré 
    private static async getHeaders() {
      const token = await AsyncStorage.getItem("auth_token");
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    }

     static async getRecompenses(): Promise<Recompense[]> {
        const headers = await this.getHeaders();
        try {
          const response = await fetch(`${BASE_URL}recompense/liste`, { headers });
    
          // Vérifie le status HTTP
          if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
          }
    
          const json = await response.json();
    
          // console.log("Recompense reçus:", json.data);
    
          if (!json.data) {
            throw new Error("Aucune donnée reçue");
          }
    
          return json.data as Recompense[];
        } catch (error) {
          this.handleError(error as Error);
          return []; // retourne une liste vide en cas d’erreur
        }
      }
    
  
    static async getEchangePoint(id:number): Promise<{message:string, status:number}> {
        const headers = await this.getHeaders();

        try {
          const response = await fetch(`${BASE_URL}recompense/echange/${id}`, {
            method: "GET",
            headers: {
              ...headers,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            // Erreur côté serveur
            const text = await response.text(); 
            console.error("Réponse brute :", text);
            return {
              message: "Erreur lors de l'echange.",
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

    
      
        static async getRecompenseCitoyen(): Promise<Recompense[]> {
        const headers = await this.getHeaders();
        try {
          const response = await fetch(`${BASE_URL}recompense/listeUser`, { headers });
    
          // Vérifie le status HTTP
          if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
          }
    
          const json = await response.json();
    
          // console.log("recompense reçus:", json.data);
    
          if (!json.data) {
            throw new Error("Aucune donnée reçue");
          }
    
          return json.data as Recompense[];
        } catch (error) {
          this.handleError(error as Error);
          return []; // retourne une liste vide en cas d’erreur
        }
      }
      

     static getTuto(id: any): Promise<Recompense| null> {
      return fetch(`${BASE_URL}${id}/`)
        .then(response => response.json())
        .then(data => (this.isEmpty(data) ? null : data))
        .catch(error => this.handleError(error));
    }
  
    static updateUtilisateur(recompense: Recompense): Promise<Recompense> {
      return fetch(`${BASE_URL}${recompense.id}/`, {
        method: "PUT",
        body: JSON.stringify(recompense),
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  
    static deletTutoruel(recompense: Recompense): Promise<{}> {
      return fetch(`${BASE_URL}${recompense.id}/`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  
    static addUtilisateur(recompense:Recompense): Promise<Recompense> {
      return fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(recompense),
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
  