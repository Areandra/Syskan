// draftManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Generate key untuk draft
export const generateDraftKey = ({ pemasok, tanggal, sopir, masukKe }) => {
  return `${pemasok}_${tanggal}_${sopir}_ke-${masukKe}`;
};

// Ambil semua draft
export const getAllDrafts = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const draftKeys = keys.filter(k => k.startsWith('draft_'));
  const entries = await AsyncStorage.multiGet(draftKeys);
  return entries.map(([key, value]) => ({
    key: key.replace('draft_', ''),
    data: JSON.parse(value),
  }));
};

// Ambil satu draft
export const getDraft = async (key) => {
  const value = await AsyncStorage.getItem(`draft_${key}`);
  return value ? JSON.parse(value) : null;
};

// Simpan draft (create/update)
export const saveDraft = async (key, headerData, items = []) => {
  const draftData = {
    header: headerData,
    items: items
  };
  await AsyncStorage.setItem(`draft_${key}`, JSON.stringify(draftData));
};

// Tambahkan item ke draft
export const addToDraft = async (key, item) => {
  const current = await getDraft(key) || { header: {}, items: [] };
  current.items.push(item);
  await saveDraft(key, current.header, current.items);
};

// Hapus draft
export const removeDraft = async (key) => {
  await AsyncStorage.removeItem(`draft_${key}`);
};

// Hapus semua draft
export const clearAllDrafts = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const draftKeys = keys.filter(k => k.startsWith('draft_'));
  await AsyncStorage.multiRemove(draftKeys);
};