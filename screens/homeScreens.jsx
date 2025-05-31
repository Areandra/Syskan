import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useGlobal } from '../service/GlobalContext';
import CustomTabBar from '../components/CostumTabBar';
import Header from '../components/Header';

export default function HomeScreens({ isAtTop, navigation }) {
  return (
    <LinearGradient
      colors={['#0C324D', '#061b29', '#020202']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
      >
        <Header title="Home Screen" navigation={navigation}/>
        <Debt curency="Rp" amount="1.400" />
        <InvoiceCard isAtTop={isAtTop}/>
        <CustomTabBar />
    </LinearGradient>
  );
}

const Debt = ({ curency, amount}) => {
  const { isAtTop, type, currentTab } = useGlobal();
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
        <CircleInformation title="Role" subTitle="Serkertaris" iconName="award" size={24} />
        <CircleInformation title="Type" subTitle={type} iconName="activity" size={24} />
        <CircleInformation title="Anggota" subTitle={currentTab} iconName="user-check" size={24} />
      </Animated.View>
    </View>
  );
}

const CircleInformation = ({ title, subTitle, iconName, size }) => {
  const CircleIcon = ({iconName}) => {
    return (
      <View style={{ borderRadius: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 10, width: size + 20, }}>
        <Feather name={iconName} size={size} color='grey' />
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

const InvoiceCard = () => {
  const { type, setType, isAtTop } = useGlobal();
  const changeType = () => {
    if (type === 'Penjualan') {
      setType('Pembelian');
    }
    else {
      setType('Penjualan');
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
        <TouchableOpacity disabled={type === 'penjualan'} onPress={changeType} style={[invoiceCardStyles.statusButton, { backgroundColor: type ==='Penjualan' ? '#6fffa4' : '#fff176' }]}>
          <Ionicons name="checkmark-circle" size={24} color="#000" />
          <Text style={invoiceCardStyles.sideText}>Penjualan</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={type === 'Pembelian'} onPress={changeType} style={[invoiceCardStyles.statusButton, { backgroundColor: type === 'Penjualan' ? '#fff176' : '#6fffa4' }]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'start',
  },
});