import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { Utilisateur } from '@/src/models/models';
import UtilisateurService from '@/services/userService';
import { Langue ,Quartier} from '@/src/models/models';
import LangueService from '@/services/langueService';
import Toast from 'react-native-toast-message';
import QuartierService from '@/services/quartierService';
import Autocomplete from 'react-native-autocomplete-input';





// Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Le nom est requis'),
  email: Yup.string().email('Email invalide').required('L’email est requis'),
  telephone: Yup.string().required('Le téléphone est requis'),
  langue: Yup.string().required("La langue est requise"),
});


export default function Inscription() {

    const [langues, setLangue]=useState<Langue[]|null>(null) //recuperer les langues
    const [quartiers, seetQuartier]=useState<Quartier[]|null>(null) //recuperer les quartiers

    const [loading, setLoading] = useState(false);  //un loader qui tourne pandant le chargement: il est dans handleSubmit
  

  
  //hook pour recuperer les langues
  useEffect(() => {
    LangueService.getLangues()
      .then((langues) => {
        setLangue(langues);              // met à jour le state
        console.log("Les langues récupérées :", langues);  // log après récupération
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des langues :", error);
      });
  }, []);

  //hook de recupereation des quartiers
  useEffect(() => {
    QuartierService.getQuartiers()
      .then((quartiers) => {
        seetQuartier(quartiers); 
        // console.log("Liste des quartiers :", quartiers);
      })
      .catch((error) => console.error("Erreur chargement quartiers :", error));
  }, []);
  
  

  const handleFormSubmit = async (value: any) => {
    // console.log("les info saisies", value)
    try {
      const {  message, status } = await UtilisateurService.addUtilisateur(value);
  
      console.log("Message:", message);
      console.log("Status:", status);
    
  
      // Afficher toast de succès
      Toast.show({
        type: 'success',
        text1: message,
        text2: 'Bienvenue sur l’application ',
      });
  
      if (status === 200) {
        router.push('/loginScreen'); // redirection après succès
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      Toast.show({
        type: 'error',
        text1: 'Erreur de connexion',
        text2: 'Vérifiez vos informations',
      });
    } finally {
      setLoading(false); // uniquement si setLoading existe dans ce scope
    }
  };
  

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{name:"", email: '', telephone: '',adresse:"",langue:'',role:'client' }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit} 
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
           
            <TextInput
              style={styles.input}
              placeholder="Nom "
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
            <View style={styles.inputLangue}>
            <Picker
              selectedValue={values.langue}
              onValueChange={handleChange('adresse')}
            >
              <Picker.Item label="Choisir une adresse" value="" />
              {quartiers?.map((quartier) => (
                <Picker.Item
                  key={quartier.id}
                  label={`${quartier.nom }- ${quartier.ville.nom}`}
                  value={quartier.id.toString()} // Important : convertir en string
                />
              ))}
            </Picker>

            </View>

            <TextInput
              style={styles.input}
              placeholder="Telephon "
              onChangeText={handleChange('telephone')}
              onBlur={handleBlur('telephone')}
              value={values.telephone}
            />
            {touched.telephone && errors.telephone && <Text style={styles.error}>{errors.telephone}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <View style={styles.inputLangue}>
            <Picker
              selectedValue={values.langue}
              onValueChange={handleChange('langue')}
            >
              <Picker.Item label="Choisir une langue" value="" />
              {langues?.map((langue) => (
                <Picker.Item
                  key={langue.id}
                  label={langue.nom}
                  value={langue.id.toString()} // Important : convertir en string
                />
              ))}
            </Picker>

            </View>
            {touched.langue && errors.langue && <Text style={styles.error}>{errors.langue}</Text>}

            <Button onPress={() => { console.log("Soumission..."); handleSubmit(); }} title="S'inscrire" />

          </View>
        )}
      </Formik>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  inputLangue: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 0,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
