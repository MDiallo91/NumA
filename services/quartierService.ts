import { Quartier } from "../src/models/models";

const BASE_URL = "https://numambhgn.alwaysdata.net/api/";
const TOKEN = "VOTRE_TOKEN_ICI"; 

export default class QuartierService {

  static async getQuartiers(): Promise<Quartier[]> {
    return fetch(`${BASE_URL}quartier/liste`)
      .then(res => res.json())
      .then(json => json.data)
      .catch(this.handleError);
  }

  static async addQuartier(quartier: Pick<Quartier, "nom">): Promise<any> {
    return fetch(`${BASE_URL}quartier/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(quartier), 
    })
      .then(res => res.json())
      .catch(this.handleError);
  }

  static async updateQuartier(quartier: Quartier): Promise<any> {
    return fetch(`${BASE_URL}quartier/edit/${quartier.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ nom: quartier.nom }),
    })
      .then(res => res.json())
      .catch(this.handleError);
  }

  static async deleteQuartier(id: number): Promise<any> {
    return fetch(`${BASE_URL}quartier/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then(res => res.json())
      .catch(this.handleError);
  }

  static handleError(error: any): void {
    console.error("Erreur QuartierService:", error);
  }
}
