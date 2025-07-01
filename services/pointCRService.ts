import {PoinCollecteRecyclage} from "../src/models/models"
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://numambhgn.alwaysdata.net/api/";


export default class PointCollecteService {

   // Headers avec token récupéré 
      private static async getHeaders() {
        const token = await AsyncStorage.getItem("auth_token");
        return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
      }
  //recuperer tous les points de collectes pour que l'utilisateur demande un ramassage
    static async getPoinCollecteRecyclages(): Promise<PoinCollecteRecyclage[]> {
      const headers = await this.getHeaders();
      return fetch(`${BASE_URL}pointC/liste`, {
        method: "GET",
        headers,
      })
        .then(response => response.json())
        .then(json => json.data) 
        .catch(error => this.handleError(error));
    }

    //recuperer tous les point de recyclage pour l'affichage au map
      static async getPointRecyclages(): Promise<PoinCollecteRecyclage[]> {
      const headers = await this.getHeaders();
      return fetch(`${BASE_URL}pointR/liste`, {
        method: "GET",
        headers,
      })
        .then(response => response.json())
        .then(json => json.data) 
        .catch(error => this.handleError(error));
    }
  
    static getPoinCollecteRecyclage(id: any): Promise<PoinCollecteRecyclage | null> {
      return fetch(`${BASE_URL}${id}/`)
        .then(response => response.json())
        .then(data => (this.isEmpty(data) ? null : data))
        .catch(error => this.handleError(error));
    }
  
    static updatePoinCollecteRecyclage(poinCollecteRecyclage: PoinCollecteRecyclage): Promise<PoinCollecteRecyclage> {
      return fetch(`${BASE_URL}${poinCollecteRecyclage.id}/`, {
        method: "PUT",
        body: JSON.stringify(poinCollecteRecyclage),
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  
    static deletePoinCollecteRecyclage(poinCollecteRecyclage: PoinCollecteRecyclage): Promise<{}> {
      return fetch(`${BASE_URL}${poinCollecteRecyclage.id}/`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  
    static addPoinCollecteRecyclage(poinCollecteRecyclage: PoinCollecteRecyclage): Promise<PoinCollecteRecyclage> {
      return fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(poinCollecteRecyclage),
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
  