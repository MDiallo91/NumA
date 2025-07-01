import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Button, StyleSheet,TextInput,
  Platform, Pressable, ActivityIndicator
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AvisVente, PoinCollecteRecyclage, TypeDechet } from '../src/models/models';
import PointCollecteService from '@/services/pointCRService';
import DechetService from '@/services/dechetService';
import RamassageService from '@/services/ramassageService';
import Toast from 'react-native-toast-message';
import BottomSheet from '@gorhom/bottom-sheet';
import RamassageBottomSheet from '@/components/buttomSheet';
import AvisVenteService from '@/services/avisVenteService';
import VenteBottomSheet from './venteBotomShet';


const validationSchema = Yup.object().shape({
  typeDechet: Yup.string().required("Le type de déchet est requis"),
  qte: Yup.number().required("Le point de collecte est requis"),
});

export default function Ventes() {
  const [showPicker, setShowPicker] = useState(false);
  const [pointCollectes, setPointCollect] = useState<PoinCollecteRecyclage[] | null>(null);
  const [dechets, setDechets] = useState<TypeDechet[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [Ventes, setVentes] = useState<any[] | null>(null);

  // Référence du bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    PointCollecteService.getPoinCollecteRecyclages().then(setPointCollect);
    DechetService.getDechets().then(setDechets);
  }, []);


  useEffect(() => {
    AvisVenteService.getVentesCitoyen()
      .then((ventes) => {
        setVentes(ventes);
      })
      .catch((err) => {
        console.error("Erreur de récupération des ventes :", err);
      });
  }, []);

  useEffect(() => {
    // console.log("liste de vente :", Ventes);
  }, [Ventes]);


    const showRamassageListe = () => {
      bottomSheetRef.current?.snapToIndex(1); // 50%
    };

  const handleFormSubmit = async (value: any) => {
    // console.log("les ventes",value)
    try {
      setLoading(true);
      const { message, status } = await AvisVenteService.addVente(value);

      if (status === 200) {
        Toast.show({
          type: 'success',
          text1: message,
          text2: 'Ajout effectué avec succès',
        });

        // Rafraîchir la liste
        const nouvelles = await AvisVenteService.getVentesCitoyen();
        setVentes(nouvelles);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: message || 'Une erreur est survenue',
        });
      }
    } catch (err) {
      console.error("Erreur:", err);
      Toast.show({
        type: 'error',
        text1: 'Erreur de connexion',
        text2: 'Vérifiez vos informations',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ typeDechet: '', qte: '', }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View>
            <View style={styles.input}>
              <Picker
                selectedValue={values.typeDechet}
                onValueChange={handleChange('typeDechet')}
              >
                <Picker.Item label="Type de déchet" value="" />
                {dechets?.map((d) => (
                  <Picker.Item key={d.id} label={d.nom} value={d.id.toString()} />
                ))}
              </Picker>
            </View>
            {touched.typeDechet && errors.typeDechet && (
              <Text style={styles.error}>{errors.typeDechet}</Text>
            )}

            <View >
              <TextInput
                style={styles.input}
                placeholder="Quantité"
                keyboardType="numeric" // ou "number-pad"
                onChangeText={handleChange('qte')}
                editable={!loading}
                value={values.qte}
              />                  

            </View>
            {touched.qte && errors.qte && (
              <Text style={styles.error}>{errors.qte}</Text>
            )}

           
            <Button
              title={loading ? "Envoi..." : "Envoyer"}
              color="green"
              onPress={handleSubmit as any}
              disabled={loading}
            />

            {loading && (
              <View style={{ marginTop: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="green" />
              </View>
            )}
          </View>
        )}
      </Formik>

     <View style={{ marginTop: 30 }}>
      <Pressable style={styles.button} onPress={showRamassageListe}>
        <Text style={styles.buttonText}>Voir plus</Text>
      </Pressable>
    </View>

      {/* BottomSheet pour afficher les demandes */}
      <VenteBottomSheet refSheet={bottomSheetRef} ventes={Ventes || []} />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10,
  },
  error: {
    color: 'red', marginBottom: 10,
  },
  label: {
    marginBottom: 10, fontWeight: 'bold',
  },
  dateButton: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8,
    backgroundColor: '#f5f5f5', alignItems: 'center', marginBottom: 20
  },
  dateText: {
    fontSize: 16, color: '#333',
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
