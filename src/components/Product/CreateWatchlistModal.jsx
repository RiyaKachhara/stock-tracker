import React from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

const CreateWatchlistModal = ({
  visible,
  onClose,
  onCreate,
  newListName,
  setNewListName,
  theme,
}) => (
  <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Create New Watchlist</Text>
        <TextInput
          placeholder="Enter watchlist name"
          placeholderTextColor={theme.secondaryText}
          value={newListName}
          onChangeText={setNewListName}
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.isDark ? '#555' : '#ccc',
              backgroundColor: theme.background,
            },
          ]}
        />
        <Pressable style={[styles.modalItem, { justifyContent: 'center' }]} onPress={onCreate}>
          <Text style={{ color: theme.accent }}>Save</Text>
        </Pressable>
        <Pressable onPress={onClose} style={styles.modalCancel}>
          <Text style={{ color: theme.accent }}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalCancel: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});

export default CreateWatchlistModal;
