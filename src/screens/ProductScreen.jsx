


// import { fetchTimeSeriesForRange } from '../api/fetchTimeSeriesForRange';
// import { fetchCompanyOverview } from "../api/alphaVantage";
// import { LineChart } from 'react-native-gifted-charts';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Toast from "react-native-toast-message";
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   Modal,
//   FlatList,
//   Pressable,
//   TextInput,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useTheme } from '../utils/ThemeContext';

// const ProductScreen = ({ route }) => {
//   const { symbol } = route.params;
//   const { theme } = useTheme();

//   const [loading, setLoading] = useState(true);
//   const [overview, setOverview] = useState(null);
//   const [error, setError] = useState(null);
//   const [watchlists, setWatchlists] = useState([]);
//   const [selectModalVisible, setSelectModalVisible] = useState(false);
//   const [createModalVisible, setCreateModalVisible] = useState(false);
//   const [newListName, setNewListName] = useState("");
//   const [chartData, setChartData] = useState([]);
//   const [selectedRange, setSelectedRange] = useState('1M');
//   const [chartLoading, setChartLoading] = useState(false);
//   const [isInWatchlist, setIsInWatchlist] = useState(false);

//   const loadChartDataForRange = async (range) => {
//     setChartLoading(true);
//     try {
//       const series = await fetchTimeSeriesForRange(symbol, range);
//       if (!series || series.length === 0) {
//         setError("Chart data unavailable.");
//         setChartData([]);
//         return;
//       }
//       const parsed = series.map(point => ({ value: point.close }));
//       setChartData(parsed);
//     } catch (err) {
//       setError("Failed to load chart data.");
//       setChartData([]);
//     } finally {
//       setChartLoading(false);
//     }
//   };

//   const checkIfInWatchlist = async (sym) => {
//     const saved = await AsyncStorage.getItem("WATCHLISTS");
//     if (!saved) return setIsInWatchlist(false);
//     const all = JSON.parse(saved);
//     const allItems = Object.values(all).flat();
//     const exists = allItems.some((item) => item.symbol === sym);
//     setIsInWatchlist(exists);
//   };

//   useEffect(() => {
//     async function loadData() {
//       const OVERVIEW_CACHE_KEY = `OVERVIEW_${symbol}`;
//       const OVERVIEW_CACHE_TIME_KEY = `OVERVIEW_TIME_${symbol}`;
//       const CACHE_EXPIRATION_MS = 5 * 60 * 1000;
//       const now = Date.now();

//       try {
//         let overviewData;
//         const cachedOverview = await AsyncStorage.getItem(OVERVIEW_CACHE_KEY);
//         const cachedOverviewTime = await AsyncStorage.getItem(OVERVIEW_CACHE_TIME_KEY);

//         if (cachedOverview && cachedOverviewTime && now - parseInt(cachedOverviewTime) < CACHE_EXPIRATION_MS) {
//           overviewData = JSON.parse(cachedOverview);
//         } else {
//           overviewData = await fetchCompanyOverview(symbol);
//           await AsyncStorage.setItem(OVERVIEW_CACHE_KEY, JSON.stringify(overviewData));
//           await AsyncStorage.setItem(OVERVIEW_CACHE_TIME_KEY, now.toString());
//         }
//         setOverview(overviewData);
//         await checkIfInWatchlist(symbol);
//         await loadChartDataForRange(selectedRange);
//       } catch (err) {
//         setError("Failed to load company info.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadData();
//   }, [symbol]);

//   const loadWatchlists = async () => {
//     const saved = await AsyncStorage.getItem("WATCHLISTS");
//     setWatchlists(saved ? Object.keys(JSON.parse(saved)) : []);
//   };

//   const saveToWatchlist = async (listName) => {
//     const saved = await AsyncStorage.getItem("WATCHLISTS");
//     const all = saved ? JSON.parse(saved) : {};
//     const list = all[listName] || [];
//     const already = list.some((i) => i.symbol === overview.Symbol);
//     if (already) {
//       Toast.show({ type: "info", text1: "Already Saved", text2: `Already in "${listName}"` });
//       setSelectModalVisible(false);
//       return;
//     }
//     const updated = { ...all, [listName]: [...list, { symbol: overview.Symbol, name: overview.Name }] };
//     await AsyncStorage.setItem("WATCHLISTS", JSON.stringify(updated));
//     await checkIfInWatchlist(symbol);
//     setSelectModalVisible(false);
//     Toast.show({ type: "success", text1: "Added", text2: `Saved to "${listName}"` });
//   };

//   const createNewWatchlist = async () => {
//     if (!newListName.trim()) return;
//     const saved = await AsyncStorage.getItem("WATCHLISTS");
//     const all = saved ? JSON.parse(saved) : {};
//     if (all[newListName]) {
//       Toast.show({ type: "info", text1: "Exists", text2: "A watchlist with this name already exists." });
//       return;
//     }
//     all[newListName] = [{ symbol: overview.Symbol, name: overview.Name }];
//     await AsyncStorage.setItem("WATCHLISTS", JSON.stringify(all));
//     await checkIfInWatchlist(symbol);
//     setCreateModalVisible(false);
//     setSelectModalVisible(false);
//     setNewListName("");
//     Toast.show({ type: "success", text1: "Created", text2: `Saved to "${newListName}"` });
//   };

//   if (loading) {
//     return (
//       <View style={[styles.center, { backgroundColor: theme.background }]}>
//         <ActivityIndicator size="large" />
//         <Text style={{ color: theme.text }}>Loading...</Text>
//       </View>
//     );
//   }

//   if (error || !overview || !overview.Name) {
//     return (
//       <View style={[styles.center, { backgroundColor: theme.background }]}>
//         <Text style={{ color: theme.text }}>{error || "No data available."}</Text>
//       </View>
//     );
//   }

//   return (
//     <>
//       <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
//         {/* <View style={styles.headerSection}>
//           <Text style={[styles.title, { color: theme.text }]}>{overview.Name}</Text>
//           <Text style={[styles.symbol, { color: theme.secondaryText }]}>{overview.Symbol}</Text>
//           <TouchableOpacity onPress={() => { loadWatchlists(); setSelectModalVisible(true); }} style={styles.bookmarkButton}>
//             <Icon name={isInWatchlist ? "bookmark" : "bookmark-border"} size={24} color={theme.accent} />
//           </TouchableOpacity>
//         </View> */}
//        <View style={[styles.headerSection]}>
//   <View style={{ flex: 1, paddingRight: 32 }}>
//     <Text
//       style={[styles.title, { color: theme.text }]}
//       numberOfLines={2}
//       adjustsFontSizeToFit
//     >
//       {overview.Name}
//     </Text>
//     <Text style={[styles.symbol, { color: theme.secondaryText }]}>
//       {overview.Symbol}
//     </Text>
//   </View>

//   <TouchableOpacity
//     onPress={() => {
//       loadWatchlists();
//       setSelectModalVisible(true);
//     }}
//     style={styles.bookmarkButton}
//   >
//     <Icon
//       name={isInWatchlist ? "bookmark" : "bookmark-border"}
//       size={24}
//       color={theme.accent}
//     />
//   </TouchableOpacity>
// </View>


//         <View style={[styles.chartWrapper, { backgroundColor: theme.card }]}>
//           {chartLoading ? (
//             <ActivityIndicator size="small" />
//           ) : chartData.length > 0 ? (
//             <LineChart
//               data={chartData}
//               curved
//               thickness={2}
//               color={theme.isDark ? '#1abc9c' : theme.accent}
//               hideDataPoints
//               initialSpacing={0}
//               spacing={10}
//               showYAxis={false}
//               showVerticalLines={false}
//               showXAxisIndices={false}
//               yAxisTextColor={theme.isDark ? '#ffffff' : '#333333'} 
//               showYAxisLines={false}
//               backgroundLinesColor="transparent"
//                rulesColor="transparent" 
//               areaChart
//               startFillColor={theme.accent}
//               endFillColor={theme.background}
//               startOpacity={0.2}
//               endOpacity={0}
//               isAnimated
//             />
//           ) : (
//             <Text style={{ textAlign: "center", marginTop: 10, color: theme.secondaryText }}>No chart data available</Text>
//           )}
//         </View>

//         <View style={styles.timeRange}>
//           {["1D", "1W", "1M", "3M", "6M", "1Y"].map((label) => (
//             <TouchableOpacity
//               key={label}
//               style={[
//                 styles.timeButton,
//                 { backgroundColor: theme.card },
//                 selectedRange === label && { backgroundColor: theme.accent }
//               ]}
//               onPress={() => {
//                 setSelectedRange(label);
//                 loadChartDataForRange(label);
//               }}
//             >
//               <Text
//                 style={[
//                   styles.timeText,
//                   { color: theme.text },
//                   selectedRange === label && { color: '#fff' }
//                 ]}
//               >
//                 {label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={[styles.aboutCard, { backgroundColor: theme.card }]}>
//           <Text style={[styles.aboutTitle, { color: theme.text }]}>About {overview.Name}</Text>
//           <Text style={[styles.description, { color: theme.secondaryText }]}>{overview.Description}</Text>

//           <View style={styles.chipRow}>
//             <Text style={styles.chip}>Industry: {overview.Industry}</Text>
//             <Text style={styles.chip}>Sector: {overview.Sector}</Text>
//           </View>

//           <View style={styles.statsRow}>
//             <View style={styles.statsItem}>
//               <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>52-Week Low</Text>
//               <Text style={[styles.statsValue, { color: theme.text }]}>${Number(overview["52WeekLow"]).toFixed(2)}</Text>
//             </View>
//             <View style={styles.statsItem}>
//               <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>52-Week High</Text>
//               <Text style={[styles.statsValue, { color: theme.text }]}>${Number(overview["52WeekHigh"]).toFixed(2)}</Text>
//             </View>
//           </View>

//           <View style={styles.divider} />

//           <View style={styles.statsGrid}>
//             <View style={styles.statsGridItem}>
//               <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>Market Cap</Text>
//               <Text style={[styles.statsValue, { color: theme.text }]}>
//                 $
//                 {Number(overview.MarketCapitalization) > 1e12
//                   ? (Number(overview.MarketCapitalization) / 1e12).toFixed(2) + "T"
//                   : (Number(overview.MarketCapitalization) / 1e9).toFixed(2) + "B"}
//               </Text>
//             </View>
//             <View style={styles.statsGridItem}>
//               <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>P/E Ratio</Text>
//               <Text style={[styles.statsValue, { color: theme.text }]}>{overview.PERatio || "N/A"}</Text>
//             </View>
//             <View style={styles.statsGridItem}>
//               <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>Beta</Text>
//               <Text style={[styles.statsValue, { color: theme.text }]}>{overview.Beta || "N/A"}</Text>
//             </View>
//             <View style={styles.statsGridItem}>
//               <Text style={[styles.statsLabel, { color: theme.secondaryText }]}>Dividend Yield</Text>
//               <Text style={[styles.statsValue, { color: theme.text }]}>
//                 {overview.DividendYield ? `${(parseFloat(overview.DividendYield) * 100).toFixed(2)}%` : "N/A"}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//           {/* Select Watchlist Modal */}
// <Modal
//   transparent
//   visible={selectModalVisible}
//   animationType="slide"
//   onRequestClose={() => setSelectModalVisible(false)}
// >
//   <View style={styles.modalOverlay}>
//     <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
//       <Text style={[styles.modalTitle, { color: theme.text }]}>Select Watchlist</Text>
//       <FlatList
//         data={watchlists}
//         keyExtractor={(item) => item}
//         renderItem={({ item }) => (
//           <Pressable
//             style={styles.modalItem}
//             onPress={() => saveToWatchlist(item)}
//           >
//             <Text style={{ color: theme.text }}>{item}</Text>
//           </Pressable>
//         )}
//         ListFooterComponent={
//           <>
//             <Pressable
//               style={[
//                 styles.modalItem,
//                 { borderTopWidth: 1, borderTopColor: theme.isDark ? "#444" : "#ccc" },
//               ]}
//               onPress={() => {
//                 setSelectModalVisible(false);
//                 setCreateModalVisible(true);
//               }}
//             >
//               <Text style={{ color: theme.accent }}>➕ Create New Watchlist</Text>
//             </Pressable>
//             <Pressable
//               onPress={() => setSelectModalVisible(false)}
//               style={styles.modalCancel}
//             >
//               <Text style={{ color: theme.accent }}>Cancel</Text>
//             </Pressable>
//           </>
//         }
//       />
//     </View>
//   </View>
// </Modal>

// {/* Create New Watchlist Modal */}
// <Modal
//   transparent
//   visible={createModalVisible}
//   animationType="slide"
//   onRequestClose={() => setCreateModalVisible(false)}
// >
//   <View style={styles.modalOverlay}>
//     <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
//       <Text style={[styles.modalTitle, { color: theme.text }]}>Create New Watchlist</Text>
//       <TextInput
//         placeholder="Enter watchlist name"
//         placeholderTextColor={theme.secondaryText}
//         value={newListName}
//         onChangeText={setNewListName}
//         style={[styles.input, {
//           color: theme.text,
//           borderColor: theme.isDark ? '#555' : '#ccc',
//           backgroundColor: theme.background,
//         }]}
//       />
//       <Pressable
//         style={[styles.modalItem, { justifyContent: "center" }]}
//         onPress={createNewWatchlist}
//       >
//         <Text style={{ color: theme.accent }}>Save</Text>
//       </Pressable>
//       <Pressable
//         onPress={() => setCreateModalVisible(false)}
//         style={styles.modalCancel}
//       >
//         <Text style={{ color: theme.accent }}>Cancel</Text>
//       </Pressable>
//     </View>
//   </View>
// </Modal>


//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 16 },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   headerSection: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "flex-start", // so it doesn't stretch vertically
//   marginBottom: 12,
// },

//   title: { fontSize: 24, fontWeight: "bold" },
//   symbol: { fontSize: 18, marginBottom: 6 },
//   description: { fontSize: 14, lineHeight: 20, marginVertical: 12 },
//   chartWrapper: {
//     borderRadius: 12,
//     padding: 12,
//     elevation: 3,
//     marginVertical: 12,
//   },
//   timeRange: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 16,
//   },
//   timeButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },
//   timeText: {
//     fontWeight: '500',
//   },
//   aboutCard: {
//     borderRadius: 12,
//     padding: 16,
//   },
//   aboutTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   chipRow: {
//     flexDirection: 'row',
//     gap: 8,
//     flexWrap: 'wrap',
//     marginTop: 12,
//     marginBottom: 12,
//   },
//   chip: {
//     backgroundColor: '#f7d9c7',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 16,
//     fontSize: 13,
//     color: '#765341',
//     fontFamily: 'sans-serif',
//   },
//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   statsItem: {
//     flex: 1,
//     alignItems: "center",
//   },
//   statsLabel: {
//     fontSize: 12,
//   },
//   statsValue: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginTop: 4,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#ccc",
//     marginVertical: 12,
//   },
//   statsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginLeft: "25%",
//     justifyContent: "space-between",
//     alignSelf: "center",
//     width: "90%",
//   },
//   statsGridItem: {
//     width: "47%",
//     marginBottom: 12,
//   },
//   bookmarkButton: {
//     position: "absolute",
//     right: 0,
//     top: 0,
//   },
//   modalOverlay: {
//   flex: 1,
//   backgroundColor: "rgba(0,0,0,0.4)",
//   justifyContent: "flex-end",
// },
// modalContent: {
//   padding: 16,
//   borderTopLeftRadius: 8,
//   borderTopRightRadius: 8,
// },
// modalTitle: {
//   fontSize: 18,
//   fontWeight: "bold",
//   marginBottom: 8,
// },
// modalItem: {
//   paddingVertical: 12,
// },
// modalCancel: {
//   paddingVertical: 12,
//   alignItems: "center",
// },
// input: {
//   borderWidth: 1,
//   padding: 10,
//   borderRadius: 6,
//   marginBottom: 12,
// },

// });

// export default ProductScreen;



import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { fetchTimeSeriesForRange } from '../api/fetchTimeSeriesForRange';
import { fetchCompanyOverview } from '../api/alphaVantage';
import { useTheme } from '../utils/ThemeContext';
import ProductHeader from '../components/Product/ProductHeader';
import ProductChart from '../components/Product/ProductChart';
import TimeRangeSelector from '../components/Product/TimeRangeSelector';
import ProductAbout from '../components/Product/ProductAbout';
import SelectWatchlistModal from '../components/Product/SelectWatchlistModal';
import CreateWatchlistModal from '../components/Product/CreateWatchlistModal';

const ProductScreen = ({ route }) => {
  const { symbol } = route.params;
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);
  const [watchlists, setWatchlists] = useState([]);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [chartData, setChartData] = useState([]);
  const [selectedRange, setSelectedRange] = useState('1M');
  const [chartLoading, setChartLoading] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const checkIfInWatchlist = async (sym) => {
    const saved = await AsyncStorage.getItem('WATCHLISTS');
    if (!saved) return setIsInWatchlist(false);
    const all = JSON.parse(saved);
    const allItems = Object.values(all).flat();
    const exists = allItems.some((item) => item.symbol === sym);
    setIsInWatchlist(exists);
  };

  const loadWatchlists = async () => {
    const saved = await AsyncStorage.getItem('WATCHLISTS');
    setWatchlists(saved ? Object.keys(JSON.parse(saved)) : []);
  };

  const saveToWatchlist = async (listName) => {
    const saved = await AsyncStorage.getItem('WATCHLISTS');
    const all = saved ? JSON.parse(saved) : {};
    const list = all[listName] || [];
    const already = list.some((i) => i.symbol === overview.Symbol);
    if (already) {
      Toast.show({ type: 'info', text1: 'Already Saved', text2: `Already in "${listName}"` });
      setSelectModalVisible(false);
      return;
    }
    const updated = { ...all, [listName]: [...list, { symbol: overview.Symbol, name: overview.Name }] };
    await AsyncStorage.setItem('WATCHLISTS', JSON.stringify(updated));
    await checkIfInWatchlist(symbol);
    setSelectModalVisible(false);
    Toast.show({ type: 'success', text1: 'Added', text2: `Saved to "${listName}"` });
  };

  const createNewWatchlist = async () => {
    if (!newListName.trim()) return;
    const saved = await AsyncStorage.getItem('WATCHLISTS');
    const all = saved ? JSON.parse(saved) : {};
    if (all[newListName]) {
      Toast.show({ type: 'info', text1: 'Exists', text2: 'A watchlist with this name already exists.' });
      return;
    }
    all[newListName] = [{ symbol: overview.Symbol, name: overview.Name }];
    await AsyncStorage.setItem('WATCHLISTS', JSON.stringify(all));
    await checkIfInWatchlist(symbol);
    setCreateModalVisible(false);
    setSelectModalVisible(false);
    setNewListName('');
    Toast.show({ type: 'success', text1: 'Created', text2: `Saved to "${newListName}"` });
  };

  const loadChartDataForRange = async (range) => {
    setChartLoading(true);
    try {
      const series = await fetchTimeSeriesForRange(symbol, range);
      if (!series || series.length === 0) {
        setError('Chart data unavailable.');
        setChartData([]);
        return;
      }
      const parsed = series.map((point) => ({ value: point.close }));
      setChartData(parsed);
    } catch (err) {
      setError('Failed to load chart data.');
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      const OVERVIEW_CACHE_KEY = `OVERVIEW_${symbol}`;
      const OVERVIEW_CACHE_TIME_KEY = `OVERVIEW_TIME_${symbol}`;
      const CACHE_EXPIRATION_MS = 5 * 60 * 1000;
      const now = Date.now();

      try {
        let overviewData;
        const cachedOverview = await AsyncStorage.getItem(OVERVIEW_CACHE_KEY);
        const cachedOverviewTime = await AsyncStorage.getItem(OVERVIEW_CACHE_TIME_KEY);

        if (cachedOverview && cachedOverviewTime && now - parseInt(cachedOverviewTime) < CACHE_EXPIRATION_MS) {
          overviewData = JSON.parse(cachedOverview);
        } else {
          overviewData = await fetchCompanyOverview(symbol);
          await AsyncStorage.setItem(OVERVIEW_CACHE_KEY, JSON.stringify(overviewData));
          await AsyncStorage.setItem(OVERVIEW_CACHE_TIME_KEY, now.toString());
        }
        setOverview(overviewData);
        await checkIfInWatchlist(symbol);
        await loadChartDataForRange(selectedRange);
      } catch (err) {
        setError('Failed to load company info.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [symbol]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}> 
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !overview || !overview.Name) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}> 
        <Text style={{ color: theme.text }}>{error || 'No data available.'}</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.background }}>
        <ProductHeader
          overview={overview}
          isInWatchlist={isInWatchlist}
          onBookmarkPress={() => {
            loadWatchlists();
            setSelectModalVisible(true);
          }}
          theme={theme}
        />
        <ProductChart chartData={chartData} chartLoading={chartLoading} theme={theme} />
        <TimeRangeSelector
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          loadChartDataForRange={loadChartDataForRange}
          theme={theme}
        />
        <ProductAbout overview={overview} theme={theme} />
      </ScrollView>

      <SelectWatchlistModal
        visible={selectModalVisible}
        onClose={() => setSelectModalVisible(false)}
        watchlists={watchlists}
        saveToWatchlist={saveToWatchlist}
        onCreateNewPress={() => {
          setSelectModalVisible(false);
          setCreateModalVisible(true);
        }}
        theme={theme}
      />

      <CreateWatchlistModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreate={createNewWatchlist}
        newListName={newListName}
        setNewListName={setNewListName}
        theme={theme}
      />
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductScreen;
