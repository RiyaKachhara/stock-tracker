
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../utils/ThemeContext";
import WatchlistItemCard from '../components/WatchlistItemCard';

const WatchlistDetailScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { listName } = route.params;
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    const saved = await AsyncStorage.getItem("WATCHLISTS");
    if (saved) {
      const all = JSON.parse(saved);
      setItems(all[listName] || []);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      async function load() {
        if (active) {
          await loadItems();
          setLoading(false);
        }
      }
      load();
      return () => {
        active = false;
      };
    }, [listName])
  );

  const removeItem = async (symbol) => {
    const saved = await AsyncStorage.getItem("WATCHLISTS");
    if (saved) {
      const all = JSON.parse(saved);
      const newItems = (all[listName] || []).filter(
        (item) => item.symbol !== symbol
      );
      all[listName] = newItems;
      await AsyncStorage.setItem("WATCHLISTS", JSON.stringify(all));
      setItems(newItems);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator />
        <Text style={{ color: theme.text }}>Loading...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>This watchlist is empty.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
  <WatchlistItemCard
    item={item}
    listName={listName}
    theme={theme}
    onNavigate={(symbol) => navigation.navigate('Product', { symbol })}
    onRemove={removeItem}
  />
);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{listName}</Text>
      <FlatList
        key={"2columns"}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.symbol}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  row: { justifyContent: "space-between" },
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flex: 0.48,
    elevation: 2,
  },
  symbol: { fontSize: 16, fontWeight: "600" },
  name: { fontSize: 14 },
  removeButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  removeButtonText: { color: "white", fontSize: 14 },
});

export default WatchlistDetailScreen;
