import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllDrafts = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const draftKeys = keys.filter(k => k.startsWith('Masuk'));
  const items = await AsyncStorage.multiGet(draftKeys);
  return items.map(([key, value]) => ({ key, data: JSON.parse(value) }));
};

export const getDraftByKey = async (key) => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const saveDraft = async (key, data) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

export const deleteDraft = async (key) => {
  await AsyncStorage.removeItem(key);
};