import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../service/firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const InvoiceHeaderForm = ({ onSubmit }) => {
  const [pemasok, setPemasok] = useState('');
  const [sopir, setSopir] = useState('');
  const tanggal = new Date().toISOString().split('T')[0];
  const [pemasokList, setPemasokList] = useState([]);

  useEffect(() => {
    fetchPemasok();
  }, []);

  const handleSubmit = () => {
    if (pemasok && sopir) {
      const key = `Masuk ${pemasok} ${sopir} ${tanggal}`;
      onSubmit({ key, pemasok, sopir, tanggal });
      console.log('Header submitted:', { key, pemasok, sopir, tanggal });
    }
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

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Pemasok</Text>
      <Picker selectedValue={pemasok} onValueChange={setPemasok}>
        <Picker.Item label="--Pilih--" value="" />
        {pemasokList.map((langganan) => (
          <Picker.Item key={langganan.value} label={langganan.label} value={langganan.value} />
        ))}
      </Picker>

      <Text style={styles.label}>Sopir</Text>
      <Picker selectedValue={sopir} onValueChange={setSopir}>
        <Picker.Item label="--Pilih--" value="" />
        <Picker.Item label="Sopir A" value="Sopir A" />
        <Picker.Item label="Sopir B" value="Sopir B" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Lanjutkan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fff', borderRadius: 12 },
  label: { fontWeight: 'bold', marginTop: 10 },
  button: { marginTop: 20, backgroundColor: '#f5a8c6', padding: 12, borderRadius: 8 },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: 'bold' }
});

export default InvoiceHeaderForm;
