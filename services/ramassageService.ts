import { DemandeRamassage } from "../src/models/models";
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

  // ✅ 1. Liste des ramassages
  static async getRamassages(): Promise<DemandeRamassage[]> {
    const headers = await this.getHeaders();
    try {
      const response = await fetch(`${BASE_URL}demande/listeParCitoyen`, {
        headers,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${text}`);
      }

      const json = await response.json();
      return json.data as DemandeRamassage[];
    } catch (error) {
      this.handleError(error as Error);
      return [];
    }
  }

  // ✅ 2. Ramassage par ID
  static async getRamassage(id: any): Promise<DemandeRamassage | null> {
    try {
      const response = await fetch(`${BASE_URL}${id}/`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${text}`);
      }

      const data = await response.json();
      return this.isEmpty(data) ? null : data;
    } catch (error) {
      this.handleError(error as Error);
      return null;
    }
  }

  // ✅ 3. Mise à jour
  static async updateRamasage(ramassage: DemandeRamassage): Promise<DemandeRamassage> {
    try {
      const response = await fetch(`${BASE_URL}${ramassage.id}/`, {
        method: "PUT",
        body: JSON.stringify(ramassage),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${text}`);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  // ✅ 4. Suppression
  static async deleteRamassage(ramassage: DemandeRamassage): Promise<{}> {
    try {
      const response = await fetch(`${BASE_URL}${ramassage.id}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${text}`);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error as Error);
      return {};
    }
  }

  // ✅ 5. Ajout d’une demande
  static async addRamassage(
    ramassage: DemandeRamassage
  ): Promise<{ status: number; message: string }> {
    try {
      const headers = await this.getHeaders();

      const response = await fetch(`${BASE_URL}demande/create`, {
        method: "POST",
        body: JSON.stringify(ramassage),
        headers,
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        this.logDev("Erreur de parsing JSON:", jsonError);
      }

      return {
        status: response.status,
        message: data?.message || "Demande envoyée",
      };
    } catch (error) {
      this.handleError(error as Error);
      return {
        status: 500,
        message: "Une erreur est survenue",
      };
    }
  }

  // ✅ 6. Validation d'une demande
  static async demandeValder(id: number): Promise<{ status: number; data: any }> {
    try {
      const headers = await this.getHeaders();

      const response = await fetch(`${BASE_URL}demande/valider/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({}), // certains serveurs exigent un body même vide
      });

      const contentType = response.headers.get("content-type");
      let data: any = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const raw = await response.text();
        throw new Error(`Réponse non-JSON : ${raw}`);
      }

      if (!response.ok) {
        throw new Error(data?.message || "Erreur lors de la validation");
      }

      return {
        status: response.status,
        data,
      };
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  // ✅ Vérifie si un objet est vide
  static isEmpty(data: Object): boolean {
    return Object.keys(data).length === 0;
  }

  // ✅ Log erreur sécurisé
  static handleError(error: Error): void {
    if (process.env.NODE_ENV === "development") {
      console.error("Erreur RamassageService:", error.message || error);
    }
  }

  // ✅ Log uniquement en dev
  static logDev(...args: any[]) {
    if (process.env.NODE_ENV === "development") {
      console.log(...args);
    }
  }
}
