import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Ramassage from '@/components/ramassge';

export default function RamassageScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ramassage />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

