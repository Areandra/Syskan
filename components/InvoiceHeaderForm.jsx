import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../service/firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import { useGlobal } from '../service/GlobalContext'

const InvoiceHeaderForm = ({ onSubmit, visible, onDismiss}) => {
  const hariList = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];
useState(null);
  const [pemasokOpen, setPemasokOpen] = useState(false);
  const [sopirOpen, setSopirOpen] = useState(false);
  const [pemasok, setPemasok] = useState('');
  const [sopir, setSopir] = useState('');
  const tanggal = new Date().toISOString().split('T')[0];
  const hari = hariList[new Date().getDay()];
  const jam = new Date().toTimeString().split(':').slice(0, 2).join(':');
  const [pemasokList, setPemasokList] = useState([]);
  const [sopirList, setSopirList] = useState([]);
  const { setVisibleHeader } = useGlobal();

  useEffect(() => {
    fetchPemasok();
  }, []);
  
  useEffect(() => {
    handlePemasokChange();
  }, [pemasok]);

  const fetchPemasok = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'Pemasok'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      label: doc.data().name,
      value: doc.data().name,
    }));
    setPemasokList(data);
  };

const handlePemasokChange = async () => {

  // 1. Cari ID berdasarkan nama
  const q = query(collection(db, 'users'), where('name', '==', pemasok));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const pemasokDoc = snapshot.docs[0]; // Ambil pertama saja
    const pemasokId = pemasokDoc.id;

    // 2. Fetch data sopir dari subkoleksi
    const sopirRef = collection(db, 'users', pemasokId, 'sopir');
    const sopirSnapshot = await getDocs(sopirRef);
    const sopirData = sopirSnapshot.docs.map(doc => ({
      label: doc.data().name,
      value: doc.data().name,
    }));

    setSopirList(sopirData);
  } else {
    console.warn('Pemasok tidak ditemukan');
    setSopirList([]);
  }
};

  const handleSubmit = () => {
    if (pemasok && sopir) {
      setVisibleHeader(false);
      const key = `Masuk ${pemasok} ${sopir} ${hari} ${tanggal} ${jam}`;
      onSubmit({ key, pemasok, sopir, hari, tanggal, jam });
    }
  };
  
  const onPemasokOpen = useCallback(() => {
    setSopirOpen(false);
  }, []);
  const onSopirOpen = useCallback(() => {
    setPemasokOpen(false);
  }, []);

return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.modal}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Tambah User Baru</Text>
       <DropDownPicker
        open={pemasokOpen}
        value={pemasok}
        items={pemasokList}
        setOpen={setPemasokOpen}
        setValue={setPemasok}
        placeholder="Pemasok"
        zIndex={3000}
        zIndexInverse={1000}
        style={styles.dropdown}
        textStyle={styles.textPicker}
        dropDownContainerStyle={styles.dropdownBox}
        onOpen={onPemasokOpen}
      />
       <DropDownPicker
        open={sopirOpen}
        value={sopir}
        items={sopirList}
        setOpen={setSopirOpen}
        setValue={setSopir}
        placeholder="Sopir"
        disabled={sopirList.length === 0}
        zIndex={2000}
        zIndexInverse={2000}
        style={styles.dropdown}
        textStyle={styles.textPicker}
        dropDownContainerStyle={styles.dropdownBox}
        onOpen={onSopirOpen}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Lanjutkan</Text>
      </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  container: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    borderRadius: 16,
    alignSelf: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: 'black',
  },
  dropdown: {
    backgroundColor: 'rgba(225, 225, 225, 0.08)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 0,
  },
  dropdownBox: {
    backgroundColor: 'grey',
    borderRadius: 12,
    borderWidth: 0,
  },
  button: {
    backgroundColor: '#34d399',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  label: { 
    fontWeight: 'bold', 
    marginTop: 10 
  },
  textPicker: {
    color: 'white',
  },
});

export default InvoiceHeaderForm;