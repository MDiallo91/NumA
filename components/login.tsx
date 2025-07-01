import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet,ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { router, useNavigation ,useRouter} from 'expo-router';
import Inscription from './inscription';
import Toast from 'react-native-toast-message';
import UtilisateurService from '@/services/userService';
import { Utilisateur } from '@/src/models/models';  
import AsyncStorage from '@react-native-async-storage/async-storage';


// Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('L’email est requis'),
  password: Yup.string().min(4, 'Mot de passe trop court').required('Mot de passe requis'),
});

export default function Login() {

  const [users, setUserts]=useState<Utilisateur|null>(null)

  const [loading, setLoading] = useState(false);  //un loader qui tourne pandant le chargement: il est dans handleSubmit
  const nativation=useNavigation(); 

  
  
  const handleFormSubmit  = async (values:Utilisateur) => {
    setLoading(true);
    console.log('Données envoyées:', values);
  
    await UtilisateurService.login({
      email: values.email,
      password: values.password,
    })
      .then(async({ token, message, status }) => {
        console.log("Token:", token);
        console.log("Message:", message);
        console.log("Status:", status);
  
        // TODO: Stocker le token dans AsyncStorage si nécessaire
        await AsyncStorage.setItem('auth_token', token);
        console.log('Token stocké:', token);
  
        Toast.show({
          type: 'success',
          text1: message,
          text2: 'Bienvenue sur l’application ',
        });
        if(status===200){
          router.push('/'); // redirection après succès
        }
       
      })
      .catch(err => {
        console.error("Erreur de connexion:", err);
        Toast.show({
          type: 'error',
          text1: 'Erreur de connexion',
          text2: 'Vérifiez vos informations',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{  email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit} 
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
           
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}  
              editable={!loading}  
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              editable={!loading}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <Button  onPress={() => handleSubmit()} title="Connexion" />
          </View>
        )}
      </Formik>
      <View style={styles.inscription}></View>
      <Button color="green"  onPress={() => router.push('/inscriptionScreen')} title="S'inscrire" />
      {loading && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
     
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    marginTop:10,
    width:300
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 30,
  },
  error: {
    color: 'orange',
    marginBottom: 10,
  },
  inscription:{
    paddingTop:20
  },
});
