import React from 'react';
import { Modal, View, Text, FlatList, Pressable, StyleSheet } from 'react-native';

const SelectWatchlistModal = ({
  visible,
  onClose,
  watchlists,
  saveToWatchlist,
  onCreateNewPress,
  theme,
}) => (
  <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Select Watchlist</Text>
        <FlatList
          data={watchlists}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable style={styles.modalItem} onPress={() => saveToWatchlist(item)}>
              <Text style={{ color: theme.text }}>{item}</Text>
            </Pressable>
          )}
          ListFooterComponent={
            <>
              <Pressable
                style={[styles.modalItem, { borderTopWidth: 1, borderTopColor: theme.isDark ? '#444' : '#ccc' }]}
                onPress={onCreateNewPress}
              >
                <Text style={{ color: theme.accent }}>➕ Create New Watchlist</Text>
              </Pressable>
              <Pressable onPress={onClose} style={styles.modalCancel}>
                <Text style={{ color: theme.accent }}>Cancel</Text>
              </Pressable>
            </>
          }
        />
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
  modalItem: {
    paddingVertical: 12,
  },
  modalCancel: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});

export default SelectWatchlistModal;
