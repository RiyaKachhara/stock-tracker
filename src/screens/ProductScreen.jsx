
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
