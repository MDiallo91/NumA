
export class Utilisateur{
    id?:number;
    name?:string;
    email:string;
    quartier?:Quartier;
    telephone?:string;
    langue?:Langue;
    role?:string;
    pointCr?:string;
    password:string;
    points?:number;
    latitude?:number;
    longitude?:number;

    constructor(
        id:number,
        name:string,
        email:string,
        quartier:Quartier,
        telephone:string,
        langue:Langue,
        role:string,
        pointCr:string,
        password:string,
        points:number,
        latitude:number,
        longitude:number,

    ){
        this.id=id;
        this.name=name;
        this.email=email;
        this.quartier=quartier;
        this.telephone=telephone;
        this.langue=langue;
        this.role="client";
        this.pointCr=pointCr;
        this.password=password;
        this.points=points;
        this.latitude=latitude;
        this.longitude=longitude;
    }

}

export class Ville{
    id:number;
    nom:string
    constructor(nom:string,id:number,){
        this.id=id;
        this.nom=nom
    }
}

export class Tutoriel{
    id:number;
    titre:string;
    langue:Langue;
    urlTutoriel:string;

    constructor(
        id:number,
        titre:string,
        langue:Langue,
        urlTutoriel:string

    ){
        this.id=id;
        this.titre=titre
        this.langue=langue
        this.urlTutoriel=urlTutoriel
    }

}

export class Recompense{
    id:number;
    titre:string;
    description:string;
    pointRequis:number;
    imageUrl:string

    constructor(
        id:number,
        titre:string,
        description:string,
        pointRequis:number,
        imageUrl:string,

    ){
        this.id=id;
        this.titre=titre
        this.description=description
        this.pointRequis=pointRequis
        this.imageUrl=imageUrl
    }

}


export class Quartier {
    id:number;
    nom:string;
    ville:Ville;
    constructor(id:number,nom:string,ville:Ville) {
        this.id=id;
        this.nom=nom;
        this.ville=ville
    }
}

// a revoir
export class Discussion{
    id:number;
    vendeur:Utilisateur;
    acheteur:Utilisateur;
    message:string;
    constructor(
        id:number,
        vendeur:Utilisateur,
        acheteur:Utilisateur,
        message:string,
    ){
        this.id=id;
        this.vendeur=vendeur;
        this.acheteur=acheteur;
        this.message=message;
    }
}

export class DemandeRamassage{
    id:number;
    poinCollecte:PoinCollecteRecyclage;
    typeDechet:TypeDechet;
    detePrevus:Date;
    statut?:boolean
    constructor(
        id:number,
        poinCollecte:PoinCollecteRecyclage,
        typeDechet:TypeDechet,
        detePrevus:Date,
    ){
        this.id=id;
        this.poinCollecte=poinCollecte;
        this.typeDechet=typeDechet;
        this.detePrevus=detePrevus;
    }
}

export class Langue{
    id:number;
    nom:string;
    constructor(
        id:number,
        nom:string,
    ){
        this.id=id;
        this.nom=nom;
    }
}

export class PoinCollecteRecyclage{
    id:number;
    descriptif:string;
    latitude:number;
    longitude:number;
    type:string;
    responsable:string;
    constructor(
        id:number,
        descriptif:string,
        latitude:number,
        longitude:number,
        type:string,
        responsable:Utilisateur,
    ){
        this.id=id;
        this.descriptif=descriptif;
        this.latitude=latitude;
        this.longitude=longitude;
        this.type=type;
        this.responsable="responsable";
    }
}

export class TypeDechet{
    id:number;
    nom:string;
    constructor(
        id:number,
        nom:string,
    ){
        this.id=id;
        this.nom=nom;
    }
}

export class AvisVente{
    id:number;
    typeDechet:TypeDechet;
    qte?:number;
    statut?:string;
    vendeur?:number;
    acheteur?:number;
    constructor(
        id:number,
        typeDechet:TypeDechet,
        qte:number,
        statut:string,
    ){
        this.id=id;
        this.typeDechet=typeDechet;
        this.typeDechet=typeDechet;
        this.typeDechet=typeDechet;
        this.typeDechet=typeDechet;
    }
}

export class Abonnement{
    id:number;
    type:string;
    duree:number;
    prix:number;
    constructor(
        id:number,
        type:string,
        duree:number,
        prix:number,
    ){
        this.id=id;
        this.type=type;
        this.duree=duree;
        this.prix=prix;
    }
}



