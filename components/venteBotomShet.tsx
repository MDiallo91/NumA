import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, Pressable, Alert, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AvisVenteService from '@/services/avisVenteService';


type Props = {
  ventes?: any[] | null;
  refSheet: React.RefObject<BottomSheet|null>;
};

const VenteBottomSheet = ({  refSheet }: Props) => {

    const [loading, setLoading] = useState(false);  //un loader qui tourne pandant le chargement: il est dans handleSubmit
    const [ventes, setVentes] = useState<any[] | null>(null);
    
//hook pour la mise a jour des donnee apres anulation de vente
   useEffect(() => {
      AvisVenteService.getVentesCitoyen()
        .then((ventes) => {
          setVentes(ventes);
        })
        .catch((err) => {
          console.error("Erreur de récupération des ventes :", err);
        });
    }, []);


  const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('BottomSheet index:', index);
    
  }, []);

  //fonction de mise a jour
  const loadVentes = async () => {
    try {
      const ventes = await AvisVenteService.getVentesCitoyen();
      setVentes(ventes);
    } catch (err) {
      console.error("Erreur de récupération des ventes :", err);
    }
  };

  useEffect(() => {
      loadVentes();
    }, []);


  return (
    <BottomSheet
      ref={refSheet}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>Liste des ventes</Text>
        {ventes && ventes.length > 0 ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            {ventes.map((item) => (
              <View key={item.vente.id.toString()} style={styles.item}>

                <View style={styles.ramassageInfoView}>
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={20}
                    color="green"
                  />
                  <Text style={styles.label}>Type déchets:</Text>
                  <View style={{display:"flex",flexDirection:'row',width:"60%",justifyContent:"space-between"}}>
                     <Text>{item.vente.dechet.nom}</Text>
                          
                    {/* //Bouton pour annuler une vente si l'acheteur ne paie pas */}
                     {item.vente?.acheteur != null ? (
                      <Pressable
                        onPress={async () => {
                          // console.log("bouton presser  ",item.vente.id)
                          
                          try {
                          
                            const result = await AvisVenteService.annulerVente(item.vente.id); // on passe l'objet complet si la fonction attend AvisVente
                            console.log("Message:", result.message);
                            console.log("Status:", result.status);

                            Alert.alert("Annulation", result.message);
                            await loadVentes();
                          } catch (error) {
                            console.error("Erreur lors de l’annulation :", error);
                          } finally {
                          }
                        }}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={20}
                          color="red"
                          style={{ fontWeight: "bold" }}
                        />
                      </Pressable>
                    ) : (
                      <Text></Text>
                    )}
                        
                  </View>
                  
                </View>

                <View style={styles.ramassageInfoView}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={20}
                    color="green"
                  />
                  <Text style={styles.label}>Statut:</Text>
                  <Text>{item.vente.statut}</Text>
                </View>
                
                <View style={styles.ramassageInfoView}>
                 <MaterialCommunityIcons
                    name="counter"
                    size={20}
                    color="green"
                  />
                  <Text style={styles.label}>Quantite:</Text>
                  <Text>{item.vente.qte}</Text>
                </View>

              <View style={styles.ramassageInfoView}>
                 <MaterialCommunityIcons
                    name="account-outline"
                    size={20}
                    color="green"
                  />
                <Text style={styles.label}>Acheteur:</Text>
                {item.vente?.acheteur!= null  ? (
                  <Text>{item.acheteur[0].name}</Text>
                ) : (
                  <Text>Aucun</Text>
                )}
              </View>


                <View style={styles.ramassageInfoView}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="green"
                  />
                  <Text style={styles.label}>Date:</Text>
                  <Text>{new Date(item.vente.created_at).toLocaleDateString()}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text>Aucun ramassage disponible</Text>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    marginBottom:20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: 'green',
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
  },
  icons: {
    marginRight: 6,
  },
  ramassageInfoView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    marginLeft: 4,
    marginRight: 4,
  },
});

export default VenteBottomSheet;
