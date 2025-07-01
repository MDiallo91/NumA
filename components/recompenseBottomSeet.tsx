import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, Pressable, Alert, ActivityIndicator, Image } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AvisVenteService from '@/services/avisVenteService';
import RecompenseService from '@/services/recompenseService';
import { Recompense } from '@/src/models/models';


type Props = {
  ventes?: any[] | null;
  refSheet: React.RefObject<BottomSheet|null>;
};

const RecompenseBottomSheet = ({  refSheet }: Props) => {

    const [loading, setLoading] = useState(false);  //un loader qui tourne pandant le chargement: il est dans handleSubmit
    const [recompenses, setRecompenses] = useState<Recompense[] | null>(null);
    
//hook pour la mise a jour des donnee apres anulation de vente
   useEffect(() => {
      RecompenseService.getRecompenseCitoyen()
        .then((recompenses) => {
          setRecompenses(recompenses);
          console.log("liste recompenses",recompenses)
        })
        .catch((err) => {
          console.error("Erreur de récupération des recompense :", err);
        });
    }, []);


  const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('BottomSheet index:', index);
    
  }, []);

  //fonction de mise a jour
  const loadRecompenses = async () => {
    try {
      const ventes = await RecompenseService.getRecompenseCitoyen();
      setRecompenses(recompenses);
    } catch (err) {
      console.error("Erreur de récupération des recompense :", err);
    }
  };

  useEffect(() => {
      loadRecompenses();
    }, []);


  return (
    <BottomSheet
      ref={refSheet}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>Recompense obtenues</Text>
        {recompenses && recompenses.length > 0 ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            {recompenses.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={{backgroundColor:'',width:'80%'}}>

                  <View style={styles.ramassageInfoView}>
                    <MaterialCommunityIcons
                      name="gold"
                      size={20}
                      color="green"
                    />
                    <Text style={styles.label}>Description:</Text>
                    <View style={{display:"flex",flexDirection:'row',width:"60%",justifyContent:"space-between"}}>
                      <Text>{item.description}</Text>    
                    </View>
                  </View>

                  <View style={styles.ramassageInfoView}>
                    <MaterialCommunityIcons
                      name="trophy-outline"
                      size={20}
                      color="green"
                    />
                    <Text style={styles.label}>Recompense:</Text>
                    <Text>{item.titre}</Text>
                  </View>
                  
                  <View style={styles.ramassageInfoView}>
                  <MaterialCommunityIcons
                      name="medal-outline"
                      size={20}
                      color="green"
                      
                    />
                    <Text style={styles.label}>Point requis:</Text>
                    <Text>{item.pointRequis}</Text>
                  </View>
                </View>
                <View style={{backgroundColor:'',}}>
                 <Image source={{ uri: item.imageUrl }} style={styles.icon} />
                  
                </View>

              </View>
              
            ))}
          </ScrollView>
        ) : (
          <Text>Aucune recompense disponible</Text>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
  padding: 20,
  paddingBottom: 40,

  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  item: {
    padding: 2,
    borderBottomWidth: 1,
    borderColor: 'green',
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
    display:"flex",
    flexDirection:"row"
    
  },
  icons: {
    marginRight: 0,
    
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
  icon:{
    padding:3,
    height:70,
    width:70,
    borderRadius:5,
    elevation:5,
    margin:0,
    
  },
});

export default RecompenseBottomSheet;
