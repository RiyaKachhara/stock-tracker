

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../utils/ThemeContext';
import { fetchSymbolSearch } from '../api/searchApi';
import debounce from 'lodash.debounce';

const SearchBar = ({ navigation }) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedFetchResults = useCallback(
    debounce(async (keyword) => {
      setLoading(true);
      try {
        const data = await fetchSymbolSearch(keyword);
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    debouncedFetchResults(query);
  }, [query]);

  const onSelect = (symbol) => {
    setQuery('');
    setResults([]);
    navigation.navigate('Product', { symbol });
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputWrapper, { backgroundColor: theme.card }]}>
        <Icon name="search" size={18} color={theme.secondaryText} style={{ marginHorizontal: 8 }} />
        <TextInput
          placeholder="Search stocks..."
          placeholderTextColor={theme.secondaryText}
          value={query}
          onChangeText={setQuery}
          style={[styles.input, { color: theme.text }]}
        />
      </View>

      {query.length > 0 && (
        <View style={[styles.dropdown, { backgroundColor: theme.card }]}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.text} />
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.symbol}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.resultItem, { borderColor: theme.border || '#333' }]}
                  onPress={() => onSelect(item.symbol)}
                >
                  <Text style={[styles.resultSymbol, { color: theme.text }]}>
                    {item.symbol}
                  </Text>
                  <Text style={[styles.resultName, { color: theme.secondaryText }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 1000,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 4,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  dropdown: {
    marginTop: 4,
    borderRadius: 8,
    elevation: 3,
    maxHeight: 250,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 0.5,
  },
  resultSymbol: {
    fontWeight: '600',
    fontSize: 14,
  },
  resultName: {
    fontSize: 12,
  },
});

export default SearchBar;
