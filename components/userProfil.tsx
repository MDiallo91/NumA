import {View,Text,StyleSheet} from "react-native"
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';

import { Image, type ImageSource } from "expo-image";
import React from "react";

type Props = {
  imgSource?: ImageSource;
  selectedImage?: string;
};
const img=require('@/assets/images/bg-profil.jpg');

export default function UserProfil({ imgSource, selectedImage }: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  return <Image source={img} style={styles.image} />;
}                   

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    padding:0,
    borderRadius:50,
    marginLeft:"auto",
    marginRight:"auto",
    marginTop:4,

  },
});
    


