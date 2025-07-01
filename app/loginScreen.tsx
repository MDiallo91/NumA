import Login from '@/components/login';
import { StyleSheet, View,Text ,Button} from 'react-native';
import { Image } from "expo-image";
import { router } from 'expo-router';
import React from 'react';
export default function MapScreen() {
  const img = require('@/assets/images/logoNumA.jpg');

  return (
    <View style={styles.wrapper}>
      <View style={styles.imageContainer}>
        <Image source={img} style={styles.image} />
      </View>

      <View style={styles.formContainer}>
        <Login />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "green",
    alignItems: 'center',
    paddingTop: 60, // espace en haut pour ne pas coller à la bordure
  },
  imageContainer: {
    elevation: 5,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  image: {
    height: 100,
    width: 300,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    padding:0,
    margin:0,
    flex:1/2
  },

});
