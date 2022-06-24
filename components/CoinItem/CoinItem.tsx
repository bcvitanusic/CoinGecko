import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextStyle,
} from 'react-native';
import React from 'react';
import {appColors} from '../Home';

export interface ICoinItem {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  high_24h: number;
  low_24h: number;
  image: any;
}

interface Props {
  coin: ICoinItem;
  onCoinPress: Function;
}

export const rowItem = (text: string | number, bold?: boolean) => {
  let textStyle: TextStyle = {
    fontWeight: bold ? 'bold' : undefined,
    color: appColors.darkblue,
  };
  return (
    <View style={styles.rowItem}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

const CoinItem: React.FC<Props> = ({coin, onCoinPress}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onCoinPress(coin.id)}>
      <View style={styles.rowItem}>
        {coin.image ? (
          <Image
            style={styles.image}
            source={{
              uri: coin.image,
            }}
          />
        ) : (
          '-'
        )}
      </View>

      {rowItem(coin.name)}
      {rowItem(coin.symbol)}
      {rowItem(coin.current_price)}
      {rowItem(coin.low_24h)}
      {rowItem(coin.high_24h)}
    </TouchableOpacity>
  );
};

export default CoinItem;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: '#000',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '16.5%',
  },
  image: {
    width: 40,
    height: 40,
  },
});
