/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CoinItem, {ICoinItem, rowItem} from '../CoinItem/CoinItem';
import {Overlay} from 'react-native-elements';
import Error from '../Error';

export const appColors = {
  white: '#fefdff',
  green: '#5AAA95',
  red: '#d16666',
  blue: '#416788',
  darkblue: '#153243',
};

export const Home = () => {
  const [render, setRender] = useState<{
    coins: ICoinItem[];
    loading: boolean;
    error: boolean;
  }>({
    coins: [],
    loading: true,
    error: false,
  });
  const [coinItem, setCoinItem] = useState<{
    itemData?: ICoinItemData;
    loading: boolean;
    error: boolean;
  }>({
    itemData: undefined,
    loading: false,
    error: false,
  });
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [pageData, setPageData] = useState<{
    page: number;
    per_page: number;
  }>({
    page: 1,
    per_page: 10,
  });

  interface ICoinItemData {
    name: string;
    symbol: string;
    hashing_algorithm: string;
    description: string;
    genesis_date: string;
    homepage: string;
    market_cap_euro: number;
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (per_page = 10, page = 1) => {
    let data = [];
    if (!render.loading) {
      setRender({...render, loading: true});
    }
    try {
      let fetchData = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=false`,
      );

      data = await fetchData.json();

      setRender({
        loading: false,
        coins: data,
        error: data.length ? false : true,
      });
    } catch (error) {
      setRender({loading: false, coins: [], error: true});
    }
  };

  const fetchOneItem = async (id: string) => {
    setOverlayVisible(true);
    setCoinItem({loading: true, itemData: undefined, error: false});
    try {
      let fetchData = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}`,
      );
      let data = await fetchData.json();

      let coin = {
        name: data.name,
        symbol: data.symbol,
        hashing_algorithm: data.hashing_algorithm,
        description: data.description.en,
        genesis_date: data.genesis_date,
        homepage: data.links.homepage[0],
        market_cap_euro: data.market_data.market_cap.eur,
      };

      setCoinItem({
        itemData: coin,
        loading: false,
        error: false,
      });
    } catch (error) {
      setCoinItem({
        itemData: undefined,
        loading: false,
        error: true,
      });
    }
  };

  const CoinItemOne = (title: string, data?: string | number) => {
    let titleStyle = {
      fontSize: 10,
    };
    let dataStyle = {
      fontSize: 15,
      color: appColors.darkblue,
    };
    return (
      <View style={styles.itemRow}>
        <Text style={titleStyle}>{title}</Text>
        <Text style={dataStyle}>{data ?? '-'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {pageData.page !== 1 && !render.error && (
        <TouchableOpacity
          style={styles.goBack}
          onPress={() => {
            setPageData({page: 1, per_page: 10});
            fetchItems(10, 1);
          }}>
          <Text style={{padding: 6.5, color: appColors.white}}>
            Back to page 1
          </Text>
        </TouchableOpacity>
      )}
      <View style={styles.body}>
        <FlatList
          data={render.coins}
          scrollEnabled
          style={{width: '100%'}}
          ListHeaderComponent={() => {
            return (
              <View style={styles.headerComponent}>
                {rowItem('Image', true)}
                {rowItem('Name', true)}
                {rowItem('Symbol', true)}
                {rowItem('Current price', true)}
                {rowItem('24h lowest price', true)}
                {rowItem('24h highest price', true)}
              </View>
            );
          }}
          renderItem={({item}) => {
            return (
              <CoinItem
                coin={item}
                onCoinPress={(id: string) => {
                  fetchOneItem(id);
                }}
              />
            );
          }}
        />

        <Overlay
          overlayStyle={styles.overlay}
          isVisible={overlayVisible}
          onBackdropPress={() => setOverlayVisible(false)}>
          {coinItem.itemData === undefined && !coinItem.error && (
            <ActivityIndicator />
          )}
          {coinItem.itemData !== undefined && (
            <View style={styles.scrollViewContainer}>
              {coinItem.error && <Error />}
              {!coinItem.error && (
                <ScrollView style={styles.sw}>
                  {CoinItemOne('Name', coinItem.itemData?.name)}
                  {CoinItemOne('Symbol', coinItem.itemData?.symbol)}
                  {CoinItemOne(
                    'Hashing algorithm',
                    coinItem.itemData?.hashing_algorithm,
                  )}

                  {CoinItemOne(
                    'EUR market cap',
                    coinItem.itemData?.market_cap_euro,
                  )}
                  {CoinItemOne('Homepage', coinItem.itemData?.homepage)}
                  {CoinItemOne('Genesis date', coinItem.itemData?.genesis_date)}
                  {CoinItemOne('Description', coinItem.itemData?.description)}
                </ScrollView>
              )}
            </View>
          )}
          {coinItem.error && <Error />}
        </Overlay>
      </View>

      <TouchableOpacity
        onPress={() => {
          setPageData({...pageData, page: pageData.page + 1});
          fetchItems(10, pageData.page + 1);
        }}
        style={styles.showMore}>
        {render.loading ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator color={appColors.white} />
          </View>
        ) : (
          <Text style={{padding: 6.5, color: appColors.white}}>
            Show 10 more
          </Text>
        )}
      </TouchableOpacity>

      {render.error && <Error />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3EBF2',
  },
  header: {
    flex: 0.1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1245',
  },
  body: {
    flex: 0.8,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 0.1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1245',
  },
  headerComponent: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#000',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 5,
  },
  overlay: {
    width: '50%',
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  itemRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 5,
  },
  showMore: {
    backgroundColor: appColors.green,
    position: 'absolute',
    width: 150,
    height: 35,
    bottom: 8,
    left: '50%',
    borderColor: '#000',
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [
      {
        translateX: -75,
      },
    ],
  },
  scrollViewContainer: {
    width: '100%',
    height: '100%',
  },
  goBack: {
    position: 'absolute',
    left: 15,
    top: 5,
    borderColor: '#000',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    backgroundColor: appColors.green,
  },
  sw: {
    flexGrow: 1,
    height: '100%',
    width: '100%',
  },
  error: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
