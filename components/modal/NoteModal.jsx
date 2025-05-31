import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Modal, Portal, Text, Button, TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../service/firebase/firebaseConfig';
import { addDoc, collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { getDraft, addToDraft, removeDraft, saveDraft  } from '../../service/storage/draftManager';

const ModalForm = ({ visible, onDismiss }) => {
  const [mode, setMode] = useState('user');
  const [step, setStep] = useState(1); // Tambah state untuk step
  const [name, setName] = useState('');
  const [jenisIkan, setJenisIkan] = useState('');
  const [jumlah, setJumlah] = useState(0);
  const [kualitas, setKualitas] = useState('Aman');
  const [selectedUser, setSelectedUser] = useState(null);
  const [langgananList, setLanggananList] = useState([]);
  const [pemasok, setPemasok] = useState('');
  const [sopir, setSopir] = useState('');
  const [masukKe, setMasukKe] = useState(1);
  const [draftKey, setDraftKey] = useState('');
  const [draftItems, setDraftItems] = useState([]);
  const [pemasokList, setPemasokList] = useState([]);
  const [role, setRole] = useState('Boss');

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (visible) {
      fetchLangganan();
      fetchPemasok();
      // Reset step ketika modal dibuka
      setStep(1);
    }
  }, [visible]);

const generateDraftKey = () => {
  return `Masuk ${pemasok} ${today} ${sopir} ke-${masukKe}`;
};


  const fetchLangganan = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'Langganan'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      label: doc.data().name,
      value: doc.id,
    }));
    setLanggananList(data);
  };

  const fetchPemasok = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'Pemasok'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      label: doc.data().name,
      value: doc.data().name,
    }));
    setPemasokList(data);
  };

const loadDraft = async (key) => {
  const draft = await getDraft(key);
  if (draft) {
    setDraftItems(draft.items || []);
  } else {
    setDraftItems([]);
  }
};

const handleNextStep = () => {
  if (!pemasok || !sopir || !masukKe) {
    Alert.alert('Error', 'Harap isi semua field header terlebih dahulu');
    return;
  }
  
  const key = generateDraftKey();
  const headerData = {
    pemasok,
    tanggal: today,
    sopir,
    masukKe
  };
  
  // Initialize draft dengan header
  saveDraft(key, headerData, []);
  setDraftKey(key);
  loadDraft(key);
  setStep(2);
};

  const handleAddToDraft = async () => {
  if (!selectedUser || !jenisIkan) {
    Alert.alert('Error', 'Harap pilih langganan dan isi jenis ikan');
    return;
  }
  
  const item = {
    langganan: selectedUser,
    jenisIkan,
    kualitas,
    jumlah,
  };
  
  await addToDraft(draftKey, item);
  loadDraft(draftKey);
  
  // Reset form
  setSelectedUser(null);
  setJenisIkan('');
  setJumlah(0);
  setKualitas('Aman');
};

  const handleSubmit = async () => {
    try {
        await setDoc(doc(db, 'users', name), {
          name,
          role,
        });
      onDismiss();
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Gagal menyimpan data');
    }
  };

  const confirmCancel = () => {
    if (mode === 'user' || step === 1) {
      onDismiss();
      return;
    }
    
    Alert.alert(
      'Batalkan Draft',
      'Apakah kamu yakin ingin membatalkan draft ini? Semua data akan hilang.',
      [
        { text: 'Tidak' },
        {
          text: 'Ya',
          onPress: async () => {
            await removeDraft(draftKey);
            setDraftItems([]);
            onDismiss();
          },
        },
      ]
    );
  };

  const renderHeaderForm = () => (
    <>
      <RNPickerSelect
        onValueChange={(value) => setPemasok(value)}
        items={pemasokList}
        placeholder={{ label: 'Pilih Pemasok', value: null }}
        style={pickerSelectStyles}
      />
      <TextInput
        label="Sopir"
        value={sopir}
        onChangeText={setSopir}
        style={styles.input}
      />
      <TextInput
        label="Masuk Ke-"
        value={String(masukKe)}
        onChangeText={(text) => setMasukKe(Number(text))}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleNextStep} style={{ marginTop: 20 }}>
        Lanjut ke Input Item
      </Button>
    </>
  );

  const renderItemForm = () => (
    <>
      <View style={styles.headerInfo}>
        <Text>Pemasok: {pemasok}</Text>
        <Text>Sopir: {sopir}</Text>
        <Text>Masuk Ke-: {masukKe}</Text>
      </View>
      
      <View style={styles.separator} />
      
      <RNPickerSelect
        onValueChange={(value) => setSelectedUser(value)}
        items={langgananList}
        placeholder={{ label: 'Pilih Langganan', value: null }}
        style={pickerSelectStyles}
      />
      <TextInput
        label="Jenis Ikan"
        value={jenisIkan}
        onChangeText={setJenisIkan}
        style={styles.input}
      />
      <TextInput
        label="Jumlah"
        value={String(jumlah)}
        onChangeText={(text) => setJumlah(Number(text))}
        keyboardType="numeric"
        style={styles.input}
      />
      <RNPickerSelect
        onValueChange={(value) => setKualitas(value)}
        items={[
          { label: 'Aman', value: 'Aman' },
          { label: 'Kurang', value: 'Kurang' },
          { label: 'Rusak', value: 'Rusak' },
        ]}
        placeholder={{ label: 'Pilih Kualitas', value: null }}
        style={pickerSelectStyles}
      />

      <Button mode="contained" onPress={handleAddToDraft} style={{ marginTop: 20 }}>
        Tambah ke Draft
      </Button>

      <Text style={styles.subtitle}>Daftar Draft Saat Ini ({draftItems.length} item)</Text>

      {draftItems.map((item, index) => (
        <View key={index} style={styles.draftItem}>
          <Text>{item.userId} - {item.jenisIkan} - {item.kualitas} - {item.jumlah}</Text>
        </View>
      ))}

      <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20 }}>
        Selesai dan Simpan
      </Button>
      <Button mode="outlined" onPress={() => setStep(1)} style={{ marginTop: 10 }}>
        Kembali ke Header
      </Button>
    </>
  );

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <ScrollView>
          <Text style={styles.title}>Mode: {mode === 'user' ? 'Tambah User' : 'Tambah Invoice'}</Text>
          
          <View style={styles.switchContainer}>
            <Button
              mode={mode === 'user' ? 'contained' : 'outlined'}
              onPress={() => setMode('user')}
              style={styles.switchButton}
              disabled={step === 2}
            >
              Tambah User
            </Button>
            <Button
              mode={mode === 'invoice' ? 'contained' : 'outlined'}
              onPress={() => setMode('invoice')}
              style={styles.switchButton}
              disabled={step === 2}
            >
              Tambah Invoice
            </Button>
          </View>

          {mode === 'user' ? (
            <>
              <TextInput
                label="Nama (ID)"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <RNPickerSelect
                onValueChange={(value) => setRole(value)}
                items={[
                  { label: 'Boss', value: 'Boss' },
                  { label: 'Pemasok', value: 'Pemasok' },
                  { label: 'Sekretaris', value: 'Sekretaris' },
                  { label: 'Anggota', value: 'Anggota' },
                  { label: 'Langganan', value: 'Langganan' },
                ]}
                placeholder={{ label: 'Pilih Role', value: null }}
                style={pickerSelectStyles}
              />
            </>
          ) : (
            <>
              {step === 1 ? renderHeaderForm() : renderItemForm()}
            </>
          )}
          
          <Button mode="outlined" onPress={confirmCancel} style={{ marginTop: 10 }}>
            Batal
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginVertical: 10,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginVertical: 10,
    backgroundColor: 'white',
  },
});

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  switchButton: {
    marginHorizontal: 5,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 10,
    backgroundColor: 'white',
  },
  draftItem: {
    marginVertical: 4,
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
  },
  headerInfo: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
});

export default ModalForm;