

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../utils/ThemeContext';
import ProductHeader from '../components/Product/ProductHeader';
import ProductChart from '../components/Product/ProductChart';
import TimeRangeSelector from '../components/Product/TimeRangeSelector';
import ProductAbout from '../components/Product/ProductAbout';
import SelectWatchlistModal from '../components/Product/SelectWatchlistModal';
import CreateWatchlistModal from '../components/Product/CreateWatchlistModal';

import { useProductData } from '../hooks/useProductData';
import { useChartData } from '../hooks/useChartData';
import { StocksStackParamList } from '../navigation/StocksStackNavigator';

import { ThemeType } from '../utils/theme';

type Props = NativeStackScreenProps<StocksStackParamList, 'Product'>;

const ProductScreen: React.FC<Props> = ({ route }) => {
  const { symbol } = route.params;
  const { theme, isDark } = useTheme();

  const [selectedRange, setSelectedRange] = useState<string>('1M');
  const [watchlists, setWatchlists] = useState<string[]>([]);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  const {
    overview,
    loading,
    error,
    isInWatchlist,
    setIsInWatchlist,
  } = useProductData(symbol);

  const {
    chartData,
    chartLoading,
  } = useChartData(symbol, selectedRange);

  const loadWatchlists = async () => {
    const saved = await AsyncStorage.getItem('WATCHLISTS');
    setWatchlists(saved ? Object.keys(JSON.parse(saved)) : []);
  };

  const saveToWatchlist = async (listName: string) => {
    if (!overview) return;

    const saved = await AsyncStorage.getItem('WATCHLISTS');
    const all = saved ? JSON.parse(saved) : {};
    const list = all[listName] || [];

    const already = list.some((i: any) => i.symbol === overview!.Symbol);
    if (already) {
      Toast.show({ type: 'info', text1: 'Already Saved', text2: `Already in "${listName}"` });
      setSelectModalVisible(false);
      return;
    }

    const updated = {
      ...all,
      [listName]: [...list, { symbol: overview!.Symbol, name: overview!.Name }],
    };

    await AsyncStorage.setItem('WATCHLISTS', JSON.stringify(updated));
    setIsInWatchlist(true);
    setSelectModalVisible(false);
    Toast.show({ type: 'success', text1: 'Added', text2: `Saved to "${listName}"` });
  };

  const createNewWatchlist = async () => {
    if (!newListName.trim() || !overview) return;

    const saved = await AsyncStorage.getItem('WATCHLISTS');
    const all = saved ? JSON.parse(saved) : {};

    if (all[newListName]) {
      Toast.show({
        type: 'info',
        text1: 'Exists',
        text2: 'A watchlist with this name already exists.',
      });
      return;
    }

    all[newListName] = [{ symbol: overview!.Symbol, name: overview!.Name }];
    await AsyncStorage.setItem('WATCHLISTS', JSON.stringify(all));
    setIsInWatchlist(true);
    setCreateModalVisible(false);
    setSelectModalVisible(false);
    setNewListName('');
    Toast.show({ type: 'success', text1: 'Created', text2: `Saved to "${newListName}"` });
  };

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
