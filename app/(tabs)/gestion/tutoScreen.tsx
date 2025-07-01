import { Image } from 'expo-image';
import { Platform, ScrollView, StyleSheet,View ,Text,Animated} from 'react-native';
import { useRouter } from 'expo-router';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Options from '@/components/options';
import { Dimensions } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { Background } from '@react-navigation/elements';
import Recompenses from '@/components/recompanse';
import Tutoruels from '@/components/tuto';
import Inscription from '@/components/inscription';



const screenWidth = Dimensions.get('window').width;

export default function TutoruelScreen() {

  const slideAnim = useRef(new Animated.Value(-100)).current; // position initiale au-dessus de l'écran
  
      useEffect(() => {
        Animated.timing(slideAnim, {
          toValue: 0, // se déplace à sa position normale
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, []);
  
  return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 ,alignItems:"center", backgroundColor:"white"}}>
          
          <Animated.View style={[ { transform: [{ translateY: slideAnim }] }]}>

          <Tutoruels/>
         
          </Animated.View>

      </ScrollView>
   

  );
}

const styles = StyleSheet.create({
  wrapper: {
      boxShadow:"3px 3px 2px gray",
      width: screenWidth,
      margin:5,
      padding:6,
      
  },
  text: {
    fontSize:20,
    textAlign:"center",
    marginTop:10,
    margin:0,
    padding:10,
    fontWeight:"bold",
    borderRadius:10,
  },
  ligne:{
    backgroundColor:"black",
    height:2,
    width:"100%",
  }
});
