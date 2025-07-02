// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import { API_KEY } from '../config';

// const BASE_URL = 'https://www.alphavantage.co/query';

// const SearchBar = ({ navigation }) => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!query) {
//       setResults([]);
//       return;
//     }

//     const timeout = setTimeout(() => {
//       fetchResults(query);
//     }, 500); // debounce

//     return () => clearTimeout(timeout);
//   }, [query]);

//   const fetchResults = async (keyword) => {
//     setLoading(true);
//     try {
//       const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${API_KEY}`;
//       const res = await fetch(url);
//       const json = await res.json();
//       const matches = json.bestMatches || [];

//       setResults(
//         matches.map((item) => ({
//           symbol: item['1. symbol'],
//           name: item['2. name'],
//         }))
//       );
//     } catch (err) {
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSelect = (symbol) => {
//     setQuery('');
//     setResults([]);
//     navigation.navigate('Product', { symbol });
//   };

//   return (
//     <View style={styles.wrapper}>
//       <View style={styles.inputWrapper}>
//         <Icon name="search" size={18} color="#999" style={{ marginHorizontal: 8 }} />
//         <TextInput
//           placeholder="Search stocks..."
//           value={query}
//           onChangeText={setQuery}
//           style={styles.input}
//         />
//       </View>

//       {query.length > 0 && (
//         <View style={styles.dropdown}>
//           {loading ? (
//             <ActivityIndicator size="small" />
//           ) : (
//             <FlatList
//               data={results}
//               keyExtractor={(item) => item.symbol}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.resultItem}
//                   onPress={() => onSelect(item.symbol)}
//                 >
//                   <Text style={styles.resultSymbol}>{item.symbol}</Text>
//                   <Text style={styles.resultName}>{item.name}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     zIndex: 1000,
//     marginBottom: 12,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     alignItems: 'center',
//     paddingHorizontal: 4,
//     height: 40,
//   },
//   input: {
//     flex: 1,
//     fontSize: 14,
//     paddingVertical: 8,
//   },
//   dropdown: {
//     backgroundColor: '#fff',
//     marginTop: 4,
//     borderRadius: 8,
//     elevation: 3,
//     maxHeight: 250,
//   },
//   resultItem: {
//     padding: 10,
//     borderBottomWidth: 0.5,
//     borderColor: '#eee',
//   },
//   resultSymbol: {
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   resultName: {
//     fontSize: 12,
//     color: '#666',
//   },
// });

// export default SearchBar;

import React, { useState, useEffect } from 'react';
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
import { API_KEY } from '../config';
import { useTheme } from '../utils/ThemeContext';

const BASE_URL = 'https://www.alphavantage.co/query';

const SearchBar = ({ navigation }) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchResults(query);
    }, 500); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  const fetchResults = async (keyword) => {
    setLoading(true);
    try {
      const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();
      const matches = json.bestMatches || [];

      setResults(
        matches.map((item) => ({
          symbol: item['1. symbol'],
          name: item['2. name'],
        }))
      );
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

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
