import {View,Text,StyleSheet,Button} from "react-native"
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { Router, useRouter } from "expo-router";
import React from "react";




export default function Options () {
  const router=useRouter();
    return(
        <View style={styles.wrapper}>

            <Text onPress={() => router.push('/(tabs)/gestion/ramassageScreen')}  style={styles.text}>Ramassage</Text>
             <Text onPress={() => router.push('/(tabs)/gestion/venteScreen')}  style={styles.text}>Vente</Text>
            <Text onPress={() => router.push('/(tabs)/gestion/recompenseScree')}  style={styles.text}>Recompenses</Text>
            <Text onPress={() => router.push('/(tabs)/gestion/mapScreen')}  style={styles.text}>Carte</Text>
            <Text onPress={() => router.push('/(tabs)/gestion/tutoScreen')}  style={styles.text}>Tutoriels</Text>
        </View>
    )
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor:"white",
    margin:0,
    paddingTop:40,
  
  },
  text: {
    backgroundColor:"green",
    fontSize:23,
    textAlign:"center",
    marginTop:5,
    marginBottom:20,
    margin:0,
    paddingLeft:20,
    paddingRight:20,
    padding:13,
    color:"white",
    fontWeight:"bold",
    borderRadius:10,
    cursor:"pointer",
    width:300


  },
});
