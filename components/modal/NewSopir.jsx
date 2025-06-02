import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../../service/firebase/firebaseConfig';
import { doc, setDoc, getDocs, getDoc, query, collection, where } from 'firebase/firestore';
import { useGlobal } from '../../service/GlobalContext';
import FloatingMessage from '../FloatingMessage'

const NewSopir = ({ visible, onDismiss }) => {
  const [pemasok, setPemasok] = useState('');
  const [name, setName] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [pemasokList, setPemasokList] = useState([]);
  const [peringatan, setPeringatan] = useState(false);
  const [pesan, setPesan] = useState(null);

  useEffect(() => {
    fetchPemasok();
  }, []);

  const fetchPemasok = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'Pemasok'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      label: doc.data().name,
      value: doc.data().name,
    }));
    setPemasokList(data);
  };
  
  const cekSopir = async (pemasok, name) => {
    const sopirRef = doc(db, 'users', pemasok, 'sopir', name);
    const sopirSnap = await getDoc(sopirRef);
    return sopirSnap.exists(); // true jika sudah ada
 };

  const handleSubmit = async () => {
    if (!name || !pemasok) {
      setPesan('Mohon Isi Field Yang Ada');
      setPeringatan(true);
      return;
    }
    const exists = await cekSopir(pemasok, name);
    if (exists) {
      setPesan('Data Sopir Sudah Ada');
      setPeringatan(true);
      return;
    }

    try {
      await setDoc(doc(db, 'users', pemasok, 'sopir', name), {
        name,
      });
      onDismiss(false); // tutup modal setelah submit
    } catch (error) {
      console.error('Error submitting data:', error);
      setPesan('Gagal menyimpan data');
      setPeringatan(true);
      return;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={() => onDismiss(false)}
    >
      <View style={styles.modal}>
      <FloatingMessage message={pesan} visible={peringatan} onHide={() => setPeringatan(false)} />
        <View style={styles.container}>
          <Text style={styles.headerText}>Tambah Sopir Baru</Text>

          <TextInput
            placeholder="Nama Sopir"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <DropDownPicker
            open={openDropdown}
            value={pemasok}
            items={pemasokList}
            setOpen={setOpenDropdown}
            setValue={setPemasok}
            setItems={setPemasokList}
            placeholder="Pemasok"
            style={styles.dropdown}
            textStyle={styles.textPicker}
            dropDownContainerStyle={styles.dropdownBox}
            zIndex={1000} // untuk posisi drop di atas modal
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Simpan</Text>
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
  textPicker: {
    color: 'white',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(225, 225, 225, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: 'white',
  },
  dropdown: {
    backgroundColor: 'rgba(225, 225, 225, 0.08)',
    borderRadius: 12,
    marginBottom: 12,
    color: 'white',
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
});

export default NewSopir;