// ConfirmModal.tsx
import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

type ConfirmModalProps = {
  visible: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ visible, message = "Vulez-vous ajouter votre position ?", onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.buttonRow}>
            <Button title="Annuler" onPress={onCancel} color="red" />
            <Button title="Confirmer" onPress={onConfirm} color="green" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 280,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
