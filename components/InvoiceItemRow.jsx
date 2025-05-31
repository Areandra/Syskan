import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../service/firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const kualitasColors = {
  Bagus: '#d0f0c0',   // Hijau muda
  Sedang: '#fff5cc',  // Kuning muda
  Jelek: '#ffd6d6',   // Merah muda
};

const InvoiceItemRow = ({ item, index, onUpdate, onDelete }) => {
    useEffect(() => {
        fetchLangganan();
    }, []);

  const handleChange = (field, value) => {
    onUpdate(index, { ...item, [field]: value });
  };

    const [langgananList, setLanggananList] = useState([]);

    const fetchLangganan = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'Langganan'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        label: doc.data().name,
        value: doc.id,
      }));
      setLanggananList(data);
    };

  const handleLongPress = () => {
    Alert.alert(
      'Pilih Kualitas',
      'Pilih kualitas ikan:',
      [
        { text: 'Bagus', onPress: () => handleChange('kualitas', 'Bagus') },
        { text: 'Sedang', onPress: () => handleChange('kualitas', 'Sedang') },
        { text: 'Jelek', onPress: () => handleChange('kualitas', 'Jelek') },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={0.8}
      style={[styles.row, { backgroundColor: kualitasColors[item.kualitas] || '#fff' }]}
    >
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <Picker
        style={styles.picker}
        selectedValue={item.langganan}
        onValueChange={v => handleChange('langganan', v)}
      >
        <Picker.Item label="Pilih Langganan" value="" />
        {langgananList.map((langganan) => (
            <Picker.Item key={langganan.value} label={langganan.label} value={langganan.value} />
        ))}
      </Picker>

      <Picker
        style={styles.picker}
        selectedValue={item.ikan}
        onValueChange={v => handleChange('ikan', v)}
      >
        <Picker.Item label="Pilih Ikan" value="" />
        <Picker.Item label="Tuna" value="Tuna" />
      </Picker>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
      <View style={styles.counter}>
        <TouchableOpacity onPress={() => handleChange('jumlah', Math.max(0, item.jumlah - 1))}>
          <Text style={styles.counterButton}>–</Text>
        </TouchableOpacity>
        <Text style={styles.counterText}>{item.jumlah}</Text>
        <TouchableOpacity onPress={() => handleChange('jumlah', item.jumlah + 1)}>
          <Text style={styles.counterButton}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => onDelete(index)}>
        <Text style={styles.trash}>🗑️</Text>
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    flex: 1,
    height: 44,
    backgroundColor: '#f0f0f0',
    color: '#333',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  counterButton: {
    fontSize: 18,
    paddingHorizontal: 8,
    color: '#f5a8c6',
  },
  counterText: {
    fontSize: 16,
    paddingHorizontal: 4,
  },
  trash: {
    fontSize: 20,
    marginLeft: 10,
  },
});

export default InvoiceItemRow;
