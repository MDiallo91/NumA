import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Button, StyleSheet,
  Platform, Pressable, ActivityIndicator
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DemandeRamassage, PoinCollecteRecyclage, TypeDechet } from '../src/models/models';
import PointCollecteService from '@/services/pointCRService';
import DechetService from '@/services/dechetService';
import RamassageService from '@/services/ramassageService';
import Toast from 'react-native-toast-message';
import BottomSheet from '@gorhom/bottom-sheet';
import RamassageBottomSheet from '@/components/buttomSheet';

const validationSchema = Yup.object().shape({
  typeDechet: Yup.string().required("Le type de déchet est requis"),
  pointCollecte: Yup.string().required("Le point de collecte est requis"),
  datePrevue: Yup.date().required("La date est requise"),
});

export default function Ramassage() {
  const [showPicker, setShowPicker] = useState(false);
  const [pointCollectes, setPointCollect] = useState<PoinCollecteRecyclage[] | null>(null);
  const [dechets, setDechets] = useState<TypeDechet[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [ramassageListes, setRamassageListes] = useState<any[] | null>(null);

  // Référence du bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    PointCollecteService.getPoinCollecteRecyclages().then(setPointCollect);
    DechetService.getDechets().then(setDechets);
  }, []);

  useEffect(() => {
    RamassageService.getRamassages().then(setRamassageListes);
  }, []);

  const showRamassageListe = () => {
    bottomSheetRef.current?.snapToIndex(1); // 50%
  };

  const handleFormSubmit = async (value: any) => {
    try {
      setLoading(true);
      const { message, status } = await RamassageService.addRamassage(value);

      if (status === 200) {
        Toast.show({
          type: 'success',
          text1: message,
          text2: 'Ajout effectué avec succès',
        });

        // Rafraîchir la liste
        const nouvelles = await RamassageService.getRamassages();
        setRamassageListes(nouvelles);
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
        initialValues={{ typeDechet: '', pointCollecte: '', datePrevue: new Date() }}
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

            <View style={styles.input}>
              <Picker
                selectedValue={values.pointCollecte}
                onValueChange={handleChange('pointCollecte')}
              >
                <Picker.Item label="Point de collecte" value="" />
                {pointCollectes?.map((p) => (
                  <Picker.Item key={p.id} label={p.descriptif} value={p.id.toString()} />
                ))}
              </Picker>
            </View>
            {touched.pointCollecte && errors.pointCollecte && (
              <Text style={styles.error}>{errors.pointCollecte}</Text>
            )}

            <Text style={styles.label}>Date de ramassage :</Text>
            <Pressable onPress={() => setShowPicker(true)} style={styles.dateButton}>
              <Text style={styles.dateText}>
                {values.datePrevue.toLocaleDateString()}
              </Text>
            </Pressable>

            {showPicker && (
              <DateTimePicker
                value={values.datePrevue}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) setFieldValue('datePrevue', selectedDate);
                }}
              />
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
      <RamassageBottomSheet refSheet={bottomSheetRef} ramassages={ramassageListes || []} />
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
