import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllDrafts, saveDraft } from '../utils/storage';
import DraftInvoiceList from '../components/DraftInvoiceList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import NewUser from  '../components/modal/NewUser'
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useGlobal } from '../service/GlobalContext'

const DraftInvoiceScreen = () => {
  const [drafts, setDrafts] = useState([]);
  const navigation = useNavigation();
  const {visible, setVisible, visibleCar, setVisibleCar, visibleHeader ,setVisibleHeader} = useGlobal();
  
  const fetchDrafts = async () => {
    const all = await getAllDrafts();
    setDrafts(all);
  };

  const handleDelete = async (key) => {
    await AsyncStorage.removeItem(key);
    setDrafts(prev => prev.filter(d => d.key !== key));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchDrafts);
    return unsubscribe;
  }, [navigation]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(visible||visibleCar||visibleHeader ? 0 : 1),  // fade out kalau isAtTop true
      transform: [
        {
          translateY: withTiming(visible||visibleCar||visibleHeader ? 20 : 0),  // geser ke bawah sedikit
        },
      ],
      zIndex: 1,
    };
  }, [visible, visibleCar, visibleHeader]);

const handleDeleteAllDraft = async () => {
  try {
    const keys = drafts.map(d => d.key);
    await AsyncStorage.multiRemove(keys);
    setDrafts([]);
    alert('Semua draft berhasil dihapus');
  } catch (error) {
    console.error('Gagal menghapus semua draft:', error);
    alert('Gagal menghapus semua draft');
  }
};

  return (
    <>
    <LinearGradient
            colors={['#0C324D', '#061b29', '#020202']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          >
    <Header title="Draft Invoice" navigate={'HomeScreen'} navigation={navigation} back={true} pemasok={true} langganan={true} />
    <View style={styles.container} >
      <View style={{flex:1}}>
      {(!visible && !visibleCar && !visibleHeader) && (
      <Animated.View style={animatedStyle}>
      <DraftInvoiceList
        drafts={drafts}
        onOpen={key => navigation.navigate('NewInvoiceScreen', { draftKey: key })}
        onDelete={handleDelete}
      />
      </Animated.View>
    )}
      </View>
      {(!visible && !visibleCar && !visibleHeader) && (
      <Animated.View style={animatedStyle}>
      <TouchableOpacity style={[styles.payButton, {marginTop: 20,}]} onPress={() => [navigation.navigate('NewInvoiceScreen'), setVisibleHeader(true)]}>
          <Text style={styles.payButtonText}>Tambah Draft Baru</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.payButton, {backgroundColor:'#6fffa4'}]} onPress={() => navigation.navigate('NewInvoiceScreen')}>
          <Text style={styles.payButtonText}>Save All Draft</Text>
      </TouchableOpacity>
    </Animated.View>
    )}
    </View>
    </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginTop: 20,
    marginHorizontal: 10,
    borderRadius: 35,
  },
  headerRow: { marginBottom: 20, flex: 1 },
  backButton: { marginBottom: 10 },
  backText: { fontSize: 16, color: '#f5a8c6' },
  payButton: {
    backgroundColor: '#fff176',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DraftInvoiceScreen;
