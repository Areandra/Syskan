import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Alert } from 'react-native';
import { useGlobal } from '../service/GlobalContext';
import { db } from '../service/firebase/firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';
import CircleButton from './button/CircleButton';
import InvoiceInputModal from './modal/NewManualInvoice';

export default function ItemList({ data }) {
  const { currentTab, setUpdate } = useGlobal();
  const [selectedIds, setSelectedIds] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);

  const toggleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const deleteSelectedItems = async () => {
    if (selectedIds.length === 0) {
      Alert.alert("Tidak ada item yang dipilih");
      return;
    }

    Alert.alert(
      "Konfirmasi",
      `Hapus ${selectedIds.length} item terpilih?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const deletePromises = selectedIds.map(id => {
                const docRef = doc(db, "users", currentTab, "invoices", id);
                return deleteDoc(docRef);
              });

              await Promise.all(deletePromises);
              setSelectedIds([]);
              setUpdate(prev => !prev);
            } catch (error) {
              console.error("❌ Gagal menghapus:", error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelectItem(item.id)}
        style={[
          card.itemContainer,
          isSelected && { backgroundColor: '#1243754a', borderWidth: 1, borderColor: 'white' },
        ]}
      >
        <Text style={card.sopir}>{item.header.pemasok} {item.header.sopir}</Text>
        <Text style={card.name}>
          {item.item.ikan} {item.item.kualitas === 'Bagus' ? '' : item.item.kualitas}
        </Text>
        <Text style={card.price}>Rp. {Number(item.item.harga).toLocaleString('id-ID')}.000,00</Text>
        <View style={card.locationContainer}>
          <Text style={[card.location, {color: 'white'}]}>{item.item.jumlah} <Text style={card.location}>Gabus</Text></Text>
          <Text style={card.store}>{item.header.hari}, <Text style={{color: 'grey'}}>{item.header.tanggal},</Text> {item.header.jam}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const totalGabus = (data) => data.reduce((sum, item) => sum + item.item.jumlah, 0);

  return (
    <View style={card.container}>
        <View style={{ width: '100%' }}>
          <Text style={card.title}>{currentTab}</Text>
          <View style={card.rowContainer}>
            <Text style={card.title}>{data ? totalGabus(data) : 0 } <Text style={{color: 'grey', fontSize: 18,}}>Items</Text></Text>
            <View style={card.buttonContainer}>
              <CircleButton
                onPress={deleteSelectedItems}
                iconName="percent"
                style={{ marginRight: 10 }}
              />
              <CircleButton
                onPress={deleteSelectedItems}
                iconName="trash-2"
                style={{ marginRight: 10 }}
              />
              <CircleButton
                onPress={() => setVisibleModal(true)}
                iconName="plus"
              />
            </View>
          </View>
        </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={card.listContainer}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      />
      <InvoiceInputModal currentTab={currentTab} visible={visibleModal} onClose={()=>{setVisibleModal(false)}} />
    </View>
  );
}

const card = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 50,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  listContainer: {
    paddingBottom: 0,
    flexGrow: 1,
  },
  itemContainer: {
    marginBottom: 2,
    padding: 20,
    backgroundColor: 'rgba(80, 80, 80, 0.3)',
    borderRadius: 30,
  },
  sopir: {
    fontSize: 14,
    color: 'white',
  },
  name: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 500,
    marginVertical: 20,
  },
  price: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    fontSize: 14,
    color: '#888',
  },
  store: {
    fontSize: 14,
    color: 'white',
  },
});