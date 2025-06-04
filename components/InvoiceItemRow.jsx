import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../service/firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';
import { useGlobal } from '../service/GlobalContext';

const kualitasColors = {
  Bagus: 'rgba(255, 255, 255, 0.05)',
  Bermalam: 'rgba(255, 222, 56, 0.3)',
  Barnes: '#ffd6d6',
};

const InvoiceItemRow = ({ item, index, onUpdate, onDelete, listHarga }) => {
  const [langgananList, setLanggananList] = useState([]);
  const [langgananOpen, setLanggananOpen] = useState(false);
  const [ikanOpen, setIkanOpen] = useState(false);
  const [visibleKualitas, setVisibleKualitas] = useState(false);
  const [open, setOpen] = useState(false);
  const {setVisibleKualitasGlobal} = useGlobal();

  useEffect(() => {
    fetchLangganan();
  }, []);

  useEffect(() => {
    setVisibleKualitasGlobal(visibleKualitas);
  }, [visibleKualitas]);
  
  useEffect(() => {
    if (ikanOpen || langgananOpen) setOpen(true);
    else setOpen(false);
  }, [ikanOpen, langgananOpen]);

  const fetchLangganan = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'Langganan'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      label: doc.data().name,
      value: doc.id,
    }));
    setLanggananList(data);
  };

  const handleChange = (field, value) => {
    onUpdate(index, { ...item, [field]: value });
  };

useEffect(() => {
  console.log('Checking harga untuk:', item.ikan, item.kualitas);
  const key = `${item.ikan} ${item.kualitas}`;
  const hargaBaru = listHarga?.[key];
  console.log('Harga ditemukan:', hargaBaru);

  if (hargaBaru !== undefined && item.harga !== hargaBaru) {
    handleChange('harga', hargaBaru);
  }
}, [item.ikan, item.kualitas, listHarga]);

  
  return (
    <TouchableOpacity
      onLongPress={() => setVisibleKualitas(true)}
      activeOpacity={0.8}
      style={[styles.row, {zIndex: open ? 999: 0 ,backgroundColor: kualitasColors[item.kualitas] || '#fff' }]}
    >
      <View style={{ flexDirection: 'row', zIndex: 999, overflow: 'visible', }}>
        <View style={{ flex: 1, marginRight: 4, overflow: 'visible', }}>
          <DropDownPicker
            open={langgananOpen}
            value={item.langganan}
            items={langgananList}
            setOpen={setLanggananOpen}
            setValue={val => handleChange('langganan', val())}
            placeholder="Langganan"
            style={styles.dropdown}
            dropdownDirection="AUTO"
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={3000}
            zIndexInverse={1000}
            textStyle={styles.textPicker}
            maxHeight={200}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 4 }}>
          <DropDownPicker
            open={ikanOpen}
            value={item.ikan}
            items={[
              { label: 'Tuna', value: 'Tuna' },
              { label: 'Kerapu', value: 'Kerapu' },
              { label: 'Cakalang', value: 'Cakalang' },
            ]}
            setOpen={setIkanOpen}
            setValue={val => handleChange('ikan', val())}
            placeholder="Ikan"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={3000}
            zIndexInverse={1000}
            textStyle={styles.textPicker}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <View style={{ flex:1,}}>
          <TouchableOpacity style={{paddingHorizontal: 8, width: 32 ,}} onPress={() => onDelete(index)}>
          <Feather name="trash" size={18} color='white'/>
        </TouchableOpacity>
        </View>
        <View style={styles.counter}>
          <TouchableOpacity onPress={() => handleChange('jumlah', Math.max(0, item.jumlah - 1))}>
            <Text style={styles.counterDecreButton}>–</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{item.jumlah}</Text>
          <TouchableOpacity onPress={() => handleChange('jumlah', item.jumlah + 1)}>
            <Text style={styles.counterIncreButton}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal 
        visible={visibleKualitas} 
        transparent 
        animationType="slide"
        onRequestClose={() => setVisibleKualitas(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Pilih Kualitas Ikan</Text>
            {['Bagus', 'Bermalam', 'Barnes', 'Spesial 1', 'Spesial 2', 'Spesial 3'].map(k => (
              <Pressable key={k} onPress={() => {
                handleChange('kualitas', k);
                setVisibleKualitas(false);
              }} style={styles.modalOption}>
                <Text>{k}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: { fontWeight: 'bold', color: 'white', },
  row: {
    flexDirection: 'column',
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12 ,
    alignItems: 'center',
    overflow: 'visible',
  },
  dropdown: {
    backgroundColor: 'rgba(225, 225, 225, 0.08)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 0,
  },
  dropdownContainer: {
    backgroundColor: 'grey',
    borderRadius: 12,
    position: 'absolute',
    zIndex: 9999,
    borderWidth: 0,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    paddingHorizontal: 6,
  },
  counterIncreButton: {
    fontSize: 30,
    paddingHorizontal: 8,
    color: '#6fffa4',
  },
  counterDecreButton: {
    fontSize: 30,
    paddingHorizontal: 8,
    color: '#fff176',
  },
  counterText: {
    fontSize: 16,
    color: 'white',
    paddingHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    borderRadius: 16,
    alignSelf: 'center',
    backdropFilter: 'blur(10px)',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOption: {
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(225, 225, 225, 0.08)',
    borderRadius: 12,
  },
  textPicker: {
    color: 'white',
  },
});

export default InvoiceItemRow;