import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { db } from '../../service/firebase/firebaseConfig';
import { addDoc, doc, getDoc, setDoc } from 'firebase/firestore';

const getTanggalInfo = () => {
  const now = new Date();
  const hariArray = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const hari = hariArray[now.getDay()];
  const jam = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  const tanggal = now.toISOString().split('T')[0];
  return { hari, jam, tanggal };
};

export default function InvoiceInputModal({ currentTab, visible, onClose }) {
  const [pemasok, setPemasok] = useState('');
  const [sopir, setSopir] = useState('');
  const [ikan, setIkan] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [harga, setHarga] = useState('');
  const [kualitas, setKualitas] = useState('');

const handleSubmit = async () => {
  const { hari, jam, tanggal } = getTanggalInfo();

  const header = {
    hari,
    jam,
    tanggal,
    key: `Manual ${pemasok} ${sopir} ${hari} ${tanggal} ${jam}`,
    pemasok,
    sopir,
  };

  const item = {
    ikan,
    jumlah: parseInt(jumlah),
    harga,
    kualitas,
    langganan: currentTab,
  };

  const counterRef = doc(db, `users/${currentTab}/counters/invoices`);

  let count = 1;
  try {
    const snapshot = await getDoc(counterRef);
    if (snapshot.exists()) {
      count = snapshot.data().count + 1;
    }

    // Update atau buat counter baru
    await setDoc(counterRef, { count }, { merge: true });
    // Simpan invoice dengan ID otomatis

    await setDoc(doc(db, `users/${currentTab}/invoices/${header.key} ${currentTab} ${count}`), { header, item });

    onClose();
  } catch (error) {
    console.error('Gagal menyimpan invoice:', error);
  }
};

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Input Invoice</Text>

          <TextInput
            placeholder="Pemasok"
            value={pemasok}
            onChangeText={setPemasok}
            style={styles.input}
          />
          <TextInput
            placeholder="Sopir"
            value={sopir}
            onChangeText={setSopir}
            style={styles.input}
          />
          <TextInput
            placeholder="Jenis Ikan"
            value={ikan}
            onChangeText={setIkan}
            style={styles.input}
          />
          <TextInput
            placeholder="Jumlah"
            value={jumlah}
            onChangeText={setJumlah}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Harga"
            value={harga}
            onChangeText={setHarga}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Kualitas"
            value={kualitas}
            onChangeText={setKualitas}
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
