import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, } from 'react-native';
import InvoiceHeaderForm from '../components/InvoiceHeaderForm';
import InvoiceItemRow from '../components/InvoiceItemRow';
import { getDraftByKey, saveDraft, deleteDraft } from '../utils/storage';
import { db } from '../service/firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useGlobal } from '../service/GlobalContext'
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const NewInvoiceScreen = ({ route, navigation }) => {
  const [header, setHeader] = useState(null);
  const [items, setItems] = useState([]);
  const [draftKey, setDraftKey] = useState(route.params?.draftKey || null)
  const { visible, setVisible, visibleCar, setVisibleCar, visibleHeader, setVisibleHeader, visibleHarga, setVisibleHarga, listHarga, setHargaMap, visibleKualitasGlobal } = useGlobal()

  const isValidInvoice = () => {
    if (!header || !items.length) return false;
    for (let item of items) {
      if (!item.langganan || !item.ikan || item.jumlah <= 0) return false;
    }
    return true;
  };

  useEffect(() => {
    if (draftKey) {
      getDraftByKey(draftKey).then(data => {
        setHeader(data.header);
        setItems(data.items || []);
        setVisibleHeader(!data.header);
      });
    } else {
      setVisibleHeader(true);
    }
  }, [draftKey]);

  const addItem = () => setItems([...items, { langganan: '', ikan: '', jumlah: 1, kualitas: 'Bagus' }]);

  const updateItem = (index, updated) => {
    const newItems = [...items];
    newItems[index] = updated;
    setItems(newItems);
    saveDraft(draftKey, { header, items: newItems });
  };

  const deleteItem = index => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    saveDraft(draftKey, { header, items: newItems });
  };

  const handleHeaderSubmit = async (data) => {
    setHeader(data);
    setDraftKey(data.key);
    await saveDraft(data.key, { header: data, items: [] });
  };
  
  const getHargaOptions = () => {
    const map = {};
    items.forEach(({ ikan, kualitas }) => {
      if (ikan && kualitas) {
        const key = `${ikan} ${kualitas}`;
        if (!map[key]) map[key] = '';
      }
    });
    return map;
  };
  
  const handleHarga = () => {
    const newHargaMap = {};
    for (const item of items) {
      const key = `${item.ikan} ${item.kualitas}`;
      if (!newHargaMap[key]) {
        newHargaMap[key] = listHarga[key] || '';
      }
    }
    setHargaMap(newHargaMap);
    setVisibleHarga(true);
  };
  
  const handleSubmitToFirestore = async () => {  
    console.log('Data to Firestore:', JSON.stringify({ header, items }, null, 2));
    try {
      await setDoc(doc(db, 'invoice', draftKey), {
        header,
        items
      });
      let index = 0;
      for (const item of items) {
        const userId = item.langganan;
        await setDoc(doc(db, 'users', userId, 'invoices', `${draftKey} ${userId} ${++index}`), {
          header,
          item
        });
      }
      await deleteDraft(draftKey);
      navigation.navigate('DraftInvoiceScreen');
    } catch (error) {
      console.error("Error menyimpan ke Firestore:", error);
      Alert.alert("Error", "Gagal menyimpan invoice ke Firestore.");
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(visible || visibleCar || visibleHeader || visibleHarga || visibleKualitasGlobal ? 0 : 1),  // fade out kalau isAtTop true
      transform: [
        {
          translateY: withTiming(visible || visibleCar || visibleHeader || visibleHarga || visibleKualitasGlobal ? 20 : 0),  // geser ke bawah sedikit
        },
      ],
      zIndex: 1,
    };
  }, [visible, visibleCar, visibleHeader, visibleHarga, visibleKualitasGlobal]);

  return (
    <LinearGradient
      colors={['#0C324D', '#061b29', '#020202']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 , overflow: 'visible',}}
    >
      <InvoiceHeaderForm onSubmit={handleHeaderSubmit} visible={visibleHeader} onDismiss={() => [setVisibleHeader(false), navigation.goBack()]}/>
      <Header 
          title="Draft Invoice" 
          navigation={navigation}
          buttonOne={{
            back: true,
            icon: 'arrow-left'
          }}
          buttonTwo={{
            modal: true,
            icon: 'user-plus',
            onPress: () => setVisible(true)
          }}
          buttonThree={{
            modal: true,
            icon: 'truck',
            onPress: () => setVisibleCar(true)
          }}
        />
      <View style={[styles.container, {overflow: 'visible'}]} >
        <View style={{flex:1, overflow: 'visible',}}>
          <Animated.View style={[animatedStyle, {flex: 1, overflow: 'visible'}]}>
            <FlatList
              data={items}
              style={{ flex: 1,}}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={false}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item, index }) => (
                <InvoiceItemRow item={item} index={index} onUpdate={updateItem} onDelete={deleteItem} listHarga={listHarga}/>
              )}
            />
          </Animated.View>
        </View>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity style={[styles.payButton, {marginTop: 20, backgroundColor: '#fff176',}]} onLongPress={handleHarga} onPress={addItem}>
            <Text style={styles.payButtonText}>Tambah Pembeli</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.payButton, {backgroundColor:'#6fffa4'}]} onPress={handleSubmitToFirestore}>
            <Text style={styles.payButtonText}>Selesai Dan Simpan</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginTop: 20,
    marginHorizontal: 10,
    borderRadius: 35,
  },
  title: { 
    fontWeight: 'bold', 
    color: 'white', 
  },
  headerRow: { 
    marginBottom: 20, 
    flex: 1 
  },
  backButton: { 
    marginBottom: 10 
  },
  backText: { 
    fontSize: 16, 
    color: '#f5a8c6' 
  },
  payButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NewInvoiceScreen;
