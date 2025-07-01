import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

type Props = {
  videoUrl: string;  
  title: string;
  langue: any;
};

export default function YoutubeRedirect({ videoUrl, title,langue }: Props) {
  const openYoutube = async () => {
    // Vérifier si l'url est ouvrable
    const supported = await Linking.canOpenURL(videoUrl);
    if (supported) {
      await Linking.openURL(videoUrl);
    } else {
      Alert.alert("Impossible d'ouvrir le lien", "URL non supportée : " + videoUrl);
    }
  };

  return (
    <Pressable style={styles.container} onPress={openYoutube}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name="youtube" size={40} color="red" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{langue}</Text>
      <Text style={styles.subtitle}>Appuyez pour regarder sur YouTube</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal:0,
  },
  iconWrapper: {
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
});
