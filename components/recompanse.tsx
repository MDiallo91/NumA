import {View,Text,StyleSheet,Pressable, ActivityIndicator, Image} from "react-native"
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from "react";
import RecompenseService from "@/services/recompenseService";
import { Recompense } from "@/src/models/models";
import { FastField } from "formik";
import ConfirmModal from "./confirmationModal";
import Toast from "react-native-toast-message";
import RecompenseBottomSheet from "./recompenseBottomSeet";
import BottomSheet from "@gorhom/bottom-sheet";





export default function Recompenses () {

    const [recompenses,setRecompenses]=useState<Recompense[]|null>(null)
    const [loading,setLoading]=useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [recompenseId, setRecompenseId] = useState<number>();
    
      // Référence du bottom sheet
    const bottomSheetRef = useRef<BottomSheet>(null);
    const showRecompenseListe = () => {
      bottomSheetRef.current?.snapToIndex(0); // 50%
    };
    
    useEffect(()=>{
      RecompenseService.getRecompenses()
      .then((recompenses)=>{
        setRecompenses(recompenses)
        // console.log("liste de recompenses", recompenses)
      })
      .catch((Erreur)=>{
        console.error
      })
    },[])

    //les methode pours le confirmation de l'echange
     const handleConfirm = async () => {
        try {
          Toast.show({
            type: 'info',
            text1: 'Echange de point...',
            text2: 'Enchange en cours...',
          });
    

   
          // Envoie au backend avec lat/lon
          if(recompenseId){
          const { message, status: responseStatus } = await RecompenseService.getEchangePoint(recompenseId);
          

      
            if (responseStatus === 200) {
              Toast.show({
                type: 'success',
                text1: 'Info',
                text2: message || 'Echange effectuer avec succes !',
              });
            } else {
              Toast.show({
                type: 'error',
                text1: 'Échec',
                text2: message || 'La mise à jour a échoué.',
              });
            }
      
            setModalVisible(false);
          }
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


    return(
        <View style={styles.wrapper}>
           {recompenses ? (
              recompenses.map((recompense) => (
                <Pressable
                  key={recompense.id}
                  onPress={() => {
                    setRecompenseId(recompense.id);
                    setModalVisible(true);
                  }}
                >
                  <View style={styles.content}>
                    <Image source={{ uri: recompense.imageUrl }} style={styles.icon} />
                    <View>
                      <Text style={styles.text1}>{recompense.pointRequis}</Text>
                      <Text style={styles.text2}>Points</Text>
                      <Text style={styles.text3}>{recompense.description}</Text>
                    </View>
                  </View>

                </Pressable>
              ))
            ) : (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="green" />
                {/* <Text>Chargement des récompenses...</Text> */}
              </View>
            )}

           
            <View style={{ marginTop: 30 }}>
              <Pressable style={styles.button} onPress={showRecompenseListe}>
                <Text style={styles.buttonText}>Recompenses obtenues</Text>
              </Pressable>
            </View>

              {/* BottomSheet pour afficher les demandes */}
              {!modalVisible &&(
              <RecompenseBottomSheet refSheet={bottomSheetRef} ventes={recompenses || []} /> 

              )}

            <ConfirmModal
                visible={modalVisible}
                message="Voulez-vous echanger vos points ?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />

       </View>
    )
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor:"white",
    margin:0,
    flex: 1, padding: 10, paddingTop: 60,
  },
  text1: {
    color:"white",
    fontSize:30,
    fontWeight:"bold",
    textAlign:"center"
  },
  text2: {
    color:"white",
    fontSize:15,
    fontWeight:"bold",
    textAlign:"center"
  },
    text3: {
    color:"white",
    fontSize:15,
    textAlign:"center",
    fontStyle:"italic"
  },

  content:{
    fontSize:15,
    textAlign:"center",
    marginTop:15,
    marginBottom:5,
    padding:7,
    display:"flex",
    backgroundColor:"#0D6238",
    flexDirection:"row",
    elevation:5,
    borderRadius:10,
    width:"96%",
    margin:'auto',
    alignItems:"center",
    justifyContent:"space-around",
  },
  icon:{
    backgroundColor:"#0D6238",
    paddingTop:10,
    paddingBottom:10,
    padding:30,
    height:70,
    width:70,
    borderRadius:50,
    // elevation:5,
    margin:0,
    
  },
   loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

   button: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start', // comportement inline-block
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
