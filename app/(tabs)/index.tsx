import { View, StyleSheet, Text,ImageBackground,Dimensions } from 'react-native';
import { GestureHandlerRootView} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import TutorielService from '@/services/tutoService';
import Tutoruels from '@/components/tuto';
import { AvisVente, Tutoriel, Utilisateur } from '@/src/models/models';
import UtilisateurService from '@/services/userService';
import AvisVenteService from '@/services/avisVenteService';
import { useIsFocused } from '@react-navigation/native';
//eliminer les log
console.log = () => {};
console.warn = () => {};
console.error = () => {};
console.info = () => {};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function Index() {

  const [tutoruels,setTuturuels]=useState<Tutoriel[]|null>(null) //recuperation de nombre de tutoruels
  const [collecteurs,setCollecteurs]=useState<Utilisateur[]|null>(null) //recuperation de nombre de collecteurs
  const [resEntreprise,setResEntreprise]=useState<Utilisateur[]|null>(null) //recuperation de nombre de responsable d'entreprise
  const [avisVentes,setAvisVentes]=useState<AvisVente[]|null>(null) //recuperation de nombre avis de vente
  const [pointLoc,setPointLoc]=useState<Utilisateur|null>(null) //recuperation des points et coordonnee
  const isFocused = useIsFocused();
  

  useEffect(()=>{
    TutorielService.getTutos()
    .then((tutoruels)=>{
      setTuturuels(tutoruels)
      // console.log("liste tutos", tutoruels)
    })
    .catch((error) => console.error("Erreur chargement quartiers :", error));
  }, []);

  useEffect(()=>{
    UtilisateurService.getCollecteurs()
    .then((collecteurs)=>{
      setCollecteurs(collecteurs)
      // console.log("liste collecte", collecteurs)
    })
    .catch((error) => console.error("Erreur chargement quartiers :", error));
  }, []);

  useEffect(()=>{
    UtilisateurService.getEntreprises()
    .then((resEntreprise)=>{
      setResEntreprise(resEntreprise)
      // console.log("liste entreprise", resEntreprise)
    })
    .catch((error) => console.error("Erreur chargement quartiers :", error));
  }, []);

  
  useEffect(()=>{
    AvisVenteService.getVentesCitoyen()
    .then((avisVentes)=>{
      setAvisVentes(avisVentes)
      // console.log("liste avis", avisVentes)
    })
    .catch((error) => console.error("Erreur chargement quartiers :", error));
  }, []);

  useEffect(()=>{
    UtilisateurService.getPoinLoc()
    .then((pointLoc)=>{
      setPointLoc(pointLoc)
      console.log("liste point", pointLoc)
    })
    .catch((error) => console.error("Erreur chargement quartiers :", error));
  }, [isFocused]);


  return (
    <GestureHandlerRootView style={styles.container}>
<ScrollView contentContainerStyle={{ flexGrow: 1 ,alignItems:"center"}}>
{/* le topbar */}
        <ImageBackground
          source={require('@/assets/images/bg-dechet.jpg')}
          style={styles.background}
          resizeMode='cover'
        >
          <View style={styles.header}>
            <View style={styles.headerCircle}>
              <Ionicons name="diamond" color="green" size={30} />
            </View>
            <View style={styles.headerPoint}>
              <Text style={styles.headerText}>{pointLoc?.points} pts</Text>
            </View>
            <View style={styles.headerSepartor}></View>
          </View>
        </ImageBackground>

        <Text style={styles.chiffres}>Quelques chiffres</Text>

        <View style={styles.dashbord}>
          <View style={styles.dashbordColumn}>
            <View style={styles.dashbord1}>
              <MaterialCommunityIcons name="truck-delivery" size={50} color="white" />
              <Text style={styles.deashbor1Text}>{collecteurs?.length ?? 0}</Text>
              <Text style={styles.deashbor1TextContent}>Agents</Text>
            </View>
            <View style={styles.dashbord1}>
              <MaterialCommunityIcons name="office-building" size={50} color="white" />
              <Text style={styles.deashbor1Text}>{resEntreprise?.length ?? 0}</Text>
              <Text style={styles.deashbor1TextContent}>Entreprises</Text>
            </View>
          </View>
          <View style={styles.dashbordColumn}>
            <View style={styles.dashbord1} >
              <Ionicons name="play-circle" size={50} color="white" />
              <Text style={styles.deashbor1Text}>{tutoruels?.length ?? 0}</Text>
              <Text style={styles.deashbor1TextContent}>Tutoruels</Text>
            </View>
            <View style={styles.dashbord1}>
              <MaterialCommunityIcons name="shopping" size={50} color="white" />
              <Text style={styles.deashbor1Text}>{avisVentes?.length ?? 0}</Text>
              <Text style={styles.deashbor1TextContent}>Ventes</Text>
            </View>
          </View>
        </View>
   
        
      </ScrollView>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding:0,
    margin:0,
    
  },
 background: {
  width: screenWidth,
  height: screenHeight * 0.22, // 30% de l'écran
  justifyContent: "center",
  borderRadius: 20,
  padding:0,
  margin:0,
},
  overlay:{
  },

  header: {
    flex: 1 ,
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor:'rgba(0,0,0, 0.4)',

  },

  headerText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },

  chiffres: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  dashbord: {
    flex: 1 / 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    margin: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },

  dashbordColumn: {
    flexDirection: 'column',
  },

  dashbord1: {
    width: 120,
    height: 130,
    backgroundColor: '#156A15',
    margin: 15, 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position:"relative",
    elevation:5,
  },

  headerCircle: {
    position:"absolute",
    top:10,
    left:20,
    marginBottom:30,
    padding:5,
   
   
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerPoint: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position:"absolute",
    bottom:20,
    right:10,
    padding: 2,
    
  },

 deashbor1Text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deashbor1TextContent: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerContainer: {
    flex: 1 / 4,
    alignItems: 'center',
  },

  headerSepartor: {
    height: "10%",
    backgroundColor: 'white',
    width: '96%',
    position: "absolute",
    bottom: 0,
    left: screenWidth / 2,
    transform: [{ translateX: -(0.9 * screenWidth) / 2 }],    padding: 0,
    margin: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  }
  
});
