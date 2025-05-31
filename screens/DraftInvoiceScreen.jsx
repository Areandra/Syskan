import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllDrafts, saveDraft } from '../utils/storage';
import DraftInvoiceList from '../components/DraftInvoiceList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient';

const DraftInvoiceScreen = () => {
  const [drafts, setDrafts] = useState([]);
  const navigation = useNavigation();

  const fetchDrafts = async () => {
    const all = await getAllDrafts();
    setDrafts(all);
    console.log('Drafts fetched:', all);
  };

  const handleDelete = async (key) => {
    await AsyncStorage.removeItem(key);
    setDrafts(prev => prev.filter(d => d.key !== key));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchDrafts);
    return unsubscribe;
  }, [navigation]);

  return (
    <LinearGradient
            colors={['#0C324D', '#061b29', '#020202']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          >
    <Header title="Daftar Draft Invoice" navigation={navigation} back={true} pemasok={true} langganan={true} />
    <ScrollView style={styles.container}>
      <DraftInvoiceList
        drafts={drafts}
        onOpen={key => navigation.navigate('NewInvoiceScreen', { draftKey: key })}
        onDelete={handleDelete}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('NewInvoiceScreen')}>
        <Text style={styles.addButtonText}>+ Tambah Draft Baru</Text>
      </TouchableOpacity>
    </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
  },
  headerRow: { marginBottom: 20, flex: 1 },
  backButton: { marginBottom: 10 },
  backText: { fontSize: 16, color: '#f5a8c6' },
  addButton: {
    marginTop: 20,
    backgroundColor: '#f5a8c6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default DraftInvoiceScreen;
