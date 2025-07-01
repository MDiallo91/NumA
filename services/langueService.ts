import {Langue} from "../src/models/models"

const BASE_URL = "https://numambhgn.alwaysdata.net/api/";


export default class LangueService {
  static getLangues(): Promise<Langue[]> {
    return fetch(`${BASE_URL}langue/liste`)
      .then(response => response.json())
      .then(json => {
        console.log("Réponse langues:", json); 
        return json.data; // Extraire seulement les langues
      })
      .catch(error => {
        this.handleError(error);
        return []; // retourne un tableau vide en cas d'erreur
      });
  }
  
    static getLangue(id: any): Promise<Langue| null> {
      return fetch(`${BASE_URL}${id}/`)
        .then(response => response.json())
        .then(data => (this.isEmpty(data) ? null : data))
        .catch(error => this.handleError(error));
    }
  
    static updateUtilisateur(langue: Langue): Promise<Langue> {
      return fetch(`${BASE_URL}${langue.id}/`, {
        method: "PUT",
        body: JSON.stringify(langue),
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  
    static deletTutoruel(langue: Langue): Promise<{}> {
      return fetch(`${BASE_URL}${langue.id}/`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
  
    static addUtilisateur(langue:Langue): Promise<Langue> {
      return fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(langue),
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
  