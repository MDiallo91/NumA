import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import TutorielService from '@/services/tutoService';
import { Tutoriel } from '@/src/models/models';
import TutoVideo from './tutoVideo';
import YoutubeRedirect from './tutoVideo';

export default function Tutoruels() {
  const [tutoruels, setTutoruels] = useState<Tutoriel[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutos = async () => {
      try {
        const data = await TutorielService.getTutoByClient();
        setTutoruels(data);
      } catch (error) {
        console.error('Erreur chargement tutoriels :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="green" />
        <Text>Chargement des tutoriels...</Text>
      </View>
    );
  }

  if (!tutoruels || tutoruels.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Aucun tutoriel disponible.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {tutoruels.map((tuto) => (
      <YoutubeRedirect
        key={tuto.id}
        videoUrl={tuto.urlTutoriel}
        title={tuto?.titre}
        langue={tuto?.langue.nom}
      />
))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    margin:0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
