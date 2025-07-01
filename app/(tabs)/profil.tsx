import ConfirmModal from '@/components/confirmationModal';
import UserProfil from '@/components/userProfil';
import DechetService from '@/services/dechetService';
import QuartierService from '@/services/quartierService';
import UtilisateurService from '@/services/userService';
import { Quartier, TypeDechet } from '@/src/models/models';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from "expo-location";
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function profil() {
 
  const [dechets, setDechets]=useState<TypeDechet[]|null>(null)
  const [quartiers, setQuartier]=useState<Quartier|null>(null)
  const [users, setUsers]=useState<any|null>(null)

  //gestion de la fenentre model
  const [modalVisible, setModalVisible] = useState(false);



  const handleConfirm = async () => {
    try {
      Toast.show({
        type: 'info',
        text1: 'Mise à jour...',
        text2: 'Géolocalisation en cours...',
      });

      // Demander la permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission refusée',
          text2: 'La géolocalisation est nécessaire pour continuer.',
        });
        return;
      }

      // Récupérer la position actuelle
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log("latitude",latitude)
      console.log("longitude",longitude)
      // Envoie au backend avec lat/lon
      const { message, status: responseStatus } = await UtilisateurService.updateGeoloc(latitude, longitude);

      if (responseStatus === 200) {
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: message || 'Géolocalisation mise à jour avec succès !',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Échec',
          text2: message || 'La mise à jour a échoué.',
        });
      }

      setModalVisible(false);
    } catch (error) {
      console.error("Erreur updateGeoloc:", error);

      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de contacter le serveur.',
      });

      setModalVisible(false);
    }
  };

  
  
  const handleCancel = () => {
    setModalVisible(false);
  };



  useEffect(() => {
    DechetService.getDechets().then((dechets) => {
      // console.log("Liste des déchets :", dechets);
    });

  }, []);
  useEffect(() => {
    QuartierService.getQuartiers().then((quartiers) => {
      // console.log("Liste des quartiers :", quartiers);
    });
  }, []);
   
  useEffect(()=>{
    UtilisateurService.getProfil()
    .then((users)=>{
      setUsers(users)
      // console.log("liste profil", users.data.telephone)
    })
    .catch((error) => console.error("Erreur chargement quartiers :", error));
  }, []);

  return (
    <ScrollView style={styles.scroller}>
     <View style={styles.wrapper}> 
      <Text style={styles.textTitle}>Profil</Text>
        <View style={styles.profilImg}>
          <View>
          <UserProfil/>
          </View>
        </View>
        <View>
        {users?.data?.name ? (
            <Text style={styles.name}>
              {users.data.name}
            </Text>
          ) : (
            <Text style={styles.name}>
              Anonyme
            </Text>
          )}
        
          {/* gestion de l'edition du user, la locasation de l'quartier... */}
          <View style={styles.viwTextWrapper}>
              <View style={styles.viwText}>
                <MaterialCommunityIcons style={styles.icons} name="account-edit-outline" size={25} color="white" />
                {/* //afficher l'address de l''email' */}
              {users?.data?.email ? (
                  <Text style={styles.otherText}>
                    {users.data.email}
                  </Text>
                  ) : (
                    <Text style={styles.otherText}>
                      Anonyme
                    </Text>
               )}
              </View>
              <MaterialIcons name="arrow-forward-ios" color="green" size={20} style={styles.iconsArrow} /> 
          </View>

          <View style={styles.viwTextWrapper}>
              <View style={styles.viwText}>
              <MaterialCommunityIcons name="phone-outline" size={25} color="white" style={styles.icons} />
              {/* //ajouter le telephone de l'utilisateur */}
                {users?.data?.telephone ? (
                  <Text style={styles.otherText}>
                    {users.data.telephone}
                  </Text>
                  ) : (
                    <Text style={styles.otherText}>
                      Anonyme
                    </Text>
               )}
              </View>
              <MaterialIcons name="arrow-forward-ios" color="green" size={20} style={styles.iconsArrow} /> 
          </View>

          <View style={styles.viwTextWrapper}>
              <View style={styles.viwText}>
              <MaterialCommunityIcons style={styles.icons} name="map-marker-outline" size={25} color="white" /> 
              {/* //afficher l'address de l'utilisateur */}
              {users?.data?.quartier ? (
                  <Text style={styles.otherText}>
                    {users.data.quartier.nom}-{ users.data.quartier.ville.nom}
                  </Text>
                  ) : (
                    <Text style={styles.otherText}>
                      Anonyme
                    </Text>
               )}
              </View>
              <MaterialIcons name="arrow-forward-ios" color="green" size={20} style={styles.iconsArrow} /> 
          </View>

          {/* //ajout de la langue */}
          <View style={styles.viwTextWrapper}>
              <View style={styles.viwText}>
              <MaterialCommunityIcons name="translate" size={25} color="white" style={styles.icons} />
              {/* //afficher langue de l'utilisateur */}
              {users?.data?.langue ? (
                  <Text style={styles.otherText}>
                    {users.data.langue.nom}
                  </Text>
                  ) : (
                    <Text style={styles.otherText}>
                      Anonyme
                    </Text>
               )}
              </View>
              <MaterialIcons name="arrow-forward-ios" color="green" size={20} style={styles.iconsArrow} /> 
          </View>
        </View>

        {/* //definir la positon */}
        <View style={styles.wrapperPosition}>
              <View style={styles.position}>
              <Button color="green"  onPress={() => setModalVisible(true)} title="Definir ma postion" />

              </View>
              {/* //modal de confirmation */}
              <ConfirmModal
                visible={modalVisible}
                message="Voulez-vous ajouter votre postion ?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
          </View>
            
      </View>  

          
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  wrapper:{

  },
  scroller:{
    backgroundColor:"white",
  },
  profilImg:{
    position:"relative",
    margin:0,
    marginBottom:15,
    backgroundColor:"white",
    flex:1

  },
  name:{
    color:"gray",
    textAlign:"center",
    padding:6,
    fontWeight:"bold",
    fontSize:20,
    backgroundColor:"white",
    marginTop:10,
    zIndex:1,
  },
  otherText:{
    color:"black",
    textAlign:"center",
    fontSize:17,
    marginLeft:5,
    paddingTop:3,
    paddingLeft:15,

  },
  textTitle:{
    textAlign:"center",
    fontSize:26,
    fontWeight:"bold",
    color:"gray",
    padding:5
  },
  viwText:{
      display:"flex",
      paddingHorizontal:20,
      flexDirection:"row",
      justifyContent:"flex-start",
      alignContent:"center",
      marginVertical:8,
  
  },
  icons:{
    backgroundColor:"green",
    borderRadius:50,
    padding:3,
  },
  iconsArrow:{
    paddingTop:15,
    paddingRight:10,
    direction:"rtl"
  },
  viwTextWrapper:{
    display:'flex',
    flexDirection:"row",
    justifyContent:"space-between",
  }, 
  position:{
    backgroundColor:"green",
    marginTop:4,
    borderRadius:10,
    elevation:5,
  },
  wrapperPosition:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"center"
  }

});
