import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import InvoiceHeaderForm from '../components/InvoiceHeaderForm';
import InvoiceItemRow from '../components/InvoiceItemRow';
import { getDraftByKey, saveDraft, deleteDraft } from '../utils/storage';
import { db } from '../service/firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const NewInvoiceScreen = ({ route, navigation }) => {
  const [header, setHeader] = useState(null);
  const [items, setItems] = useState([]);
  const [draftKey, setDraftKey] = useState(route.params?.draftKey || null);

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
      });
    }
  }, [draftKey]);

  const addItem = () => setItems([...items, { langganan: '', ikan: '', jumlah: 1 }]);

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

const handleSubmitToFirestore = async () => {
  if (!isValidInvoice()) {
    Alert.alert("Gagal", "Pastikan semua data sudah diisi dan jumlah minimal 1.");
    return;
  }

  try {
    await setDoc(doc(db, 'invoices', draftKey), {
      header,
      items
    });
    
    await deleteDraft(draftKey); // fungsi hapus dari AsyncStorage
    navigation.navigate('DraftInvoiceScreen');
  } catch (error) {
    console.error("Error menyimpan ke Firestore:", error);
    Alert.alert("Error", "Gagal menyimpan invoice ke Firestore.");
  }
};


  if (!header) return <InvoiceHeaderForm onSubmit={handleHeaderSubmit} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tambah Item</Text>
      {items.map((item, idx) => (
        <InvoiceItemRow key={idx} item={item} index={idx} onUpdate={updateItem} onDelete={deleteItem} />
      ))}
      <TouchableOpacity style={styles.addBtn} onPress={addItem}>
        <Text style={styles.addBtnText}>+ Tambah Item</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitToFirestore}>
        <Text style={styles.addBtnText}>Selesai & Simpan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  addBtn: { backgroundColor: '#f5a8c6', padding: 10, borderRadius: 8, marginVertical: 10 },
  submitBtn: { backgroundColor: '#4caf50', padding: 10, borderRadius: 8, marginBottom: 20 },
  addBtnText: { textAlign: 'center', color: '#fff' }
});

export default NewInvoiceScreen;
