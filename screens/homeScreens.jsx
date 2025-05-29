import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default function HomeScreens({ isAtTop}) {
  return (
    <LinearGradient
      colors={['#0C324D', '#061b29', '#020202']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
      >
        <Header title="Home Screen"/>
        <Debt curency="Rp" amount="1.400" isAtTop={isAtTop} />
        <InvoiceCard isAtTop={isAtTop}/>
    </LinearGradient>
  );
}

const Header = ({ title }) => {
  return (
      <View style ={header.container}>
        <View style={header.buttonContainer}>
          <CircleButton onPress={() => alert('Settings Pressed')} iconName="arrow-back-outline" style={optionalStyle.backButton} />  
          <Text style={header.text}>{title}</Text>
        </View>
        <View style={header.buttonContainer}>
          <CircleButton onPress={() => alert('Search Pressed')} iconName="search-outline" style={optionalStyle.backButton} />
          <CircleButton onPress={() => alert('Notifications Pressed')} iconName="notifications-outline" />
        </View>  
      </View>
  );
};

const Debt = ({ curency, amount, isAtTop}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isAtTop ? 0 : 1),  // fade out kalau isAtTop true
      transform: [
        {
          translateY: withTiming(isAtTop ? 20 : 0),  // geser ke bawah sedikit
        },
      ],
    };
  }, [isAtTop]);

  const formatNumber = () => {
    const raw = amount.toString().replace(/\D/g, '');
    const numeric = parseInt(raw || '0', 10); 
    const padded = ('000000' + numeric).slice(-6); // 6 digit manual
    const part1 = padded.slice(0, 3); // "001"
    const part2 = padded.slice(3);    // "400"

    return { part1, part2 };
  }
  const { part1, part2 } = formatNumber(1400);

  return (
    <View style={DebtStyle.container}>
      <View style = {DebtStyle.amount}>
        <Text style = {[DebtStyle.sideText, {color:'white'}]}>{curency}</Text>
        <Text style = {DebtStyle.centerText}>{part1}</Text>
        <Text style = {[DebtStyle.centerText, {color: 'grey'}]}>.{part2}</Text>
        <Text style = {DebtStyle.sideText}>.000</Text>
      </View>
      <Animated.View style={[DebtStyle.information, animatedStyle]}>
        <CircleInformation title="Role" subTitle="Serkertaris" iconName="wallet-outline" size={24} color="#007bff" />
        <CircleInformation title="Type" subTitle="Penjualan" iconName="cash-outline" size={24} color="#28a745" />
        <CircleInformation title="Jangka" subTitle="Bulan" iconName="card-outline" size={24} color="#ffc107" />
      </Animated.View>
    </View>
  );
}

const CircleInformation = ({ title, subTitle, iconName, size, color }) => {
  const CircleIcon = ({iconName}) => {
    return (
      <View style={{ borderRadius: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 10, width: size + 20, }}>
        <Ionicon name={iconName} size={size} color={'grey'} />
      </View>
    );
  }
  return (
    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: size + 40}}>
        <CircleIcon iconName={iconName}/>
        <View style={{marginTop: 10, alignItems: 'center'}}>
          <Text style={{fontSize: 16, color: 'white' }}>{title}</Text>
          <Text style={{fontSize: 14, color: 'grey'}}>{subTitle}</Text>
        </View>
    </View>
  );
}


const CircleButton = ({ onPress, iconName, style }) => {
  return (
    <TouchableOpacity style={[header.button, style]} onPress={onPress}>
      <Ionicon name={iconName} size={18} color="#fff" />
    </TouchableOpacity>
  );
};

const InvoiceCard = ({isAtTop}) => {
  const [type, setType] = useState('penjualan'); // default type
  const changeType = () => {
    if (type === 'penjualan') {
      setType('pembelian');
    }
    else {
      setType('penjualan');
    }
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isAtTop ? 0 : 1),  // fade out kalau isAtTop true
      transform: [
        {
          translateY: withTiming(isAtTop ?  50: 0),  // geser ke bawah sedikit
        },
      ],
    };
  }, [isAtTop]);
  return (
    <Animated.View style={[invoiceCardStyles.container, animatedStyle]}>
      {/* Side Buttons */}
      <View style={invoiceCardStyles.sideButtons}>
        <TouchableOpacity disabled={type === 'penjualan'} onPress={changeType} style={[invoiceCardStyles.statusButton, { backgroundColor: type ==='penjualan' ? '#6fffa4' : '#fff176' }]}>
          <Ionicons name="checkmark-circle" size={24} color="#000" />
          <Text style={invoiceCardStyles.sideText}>Penjualan</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={type === 'pembelian'} onPress={changeType} style={[invoiceCardStyles.statusButton, { backgroundColor: type === 'penjualan' ? '#fff176' : '#6fffa4' }]}>
          <MaterialIcons name="credit-card" size={24} color="#000" />
          <Text style={invoiceCardStyles.sideText}>Pembelian</Text>
        </TouchableOpacity>
      </View>

      {/* Invoice Info */}
      <View style={invoiceCardStyles.invoiceBox}>
        <View>
        <View style={invoiceCardStyles.daysContainer}>
          <Ionicons name="hourglass-outline" size={18} color="#fff" />
          <Text style={invoiceCardStyles.daysText}>8 Detik Lalu</Text>
        </View>
        <View>
          <Text style={invoiceCardStyles.balanceLabel}>Ikan Di Belakang:</Text>
          <Text style={invoiceCardStyles.balanceAmount}>5 Mobil</Text>
        </View>
        </View>
        <TouchableOpacity style={invoiceCardStyles.payButton}>
          <Text style={invoiceCardStyles.payButtonText}>Update Info</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const invoiceCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  sideButtons: {
    flexDirection: 'row',
  },
  statusButton: {
    marginRight:5,
    width: 65,
    height: 250,
    borderRadius: 30,
    marginBottom: 12,
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignItems: 'center',
  },
  sideText: {
    fontSize: 14,
    fontWeight: '500',
    transform: [{ rotate: '-90deg' }],
    marginBottom: 20,
  },
  invoiceBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 30,
    height: 250,
    flex: 1,
    justifyContent: 'space-between',
  },
  daysContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 18,
    alignSelf: 'flex-start',
  },
  daysText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
  },
  balanceLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const optionalStyle = {
  backButton: {
    marginRight: 10,
  },
};

const DebtStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  amount: {
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  sideText: {
    fontSize: 24,
    color: 'grey',
    
  },
  centerText: {
    color: 'white',
    fontSize: 68,
    fontWeight: '600'
  },
  information: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    backgroundColor: '',
    paddingHorizontal: 40,
    borderRadius: 10,
    margin: 0,
  },
});

const header = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    marginTop: 15,
    paddingHorizontal: 20,
    backgroundColor: '',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    fontWeight: 'regular',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 18,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // transparan putih
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'start',
  },
});