import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Ramassage from '@/components/ramassge';
import Ventes from '@/components/vente';

export default function VenteScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ventes />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

