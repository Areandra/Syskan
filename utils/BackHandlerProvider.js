import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useGlobal } from '../service/GlobalContext'; // sesuaikan

export default function BackHandlerProvider() {
  const {
    visible, setVisible,
    visibleCar, setVisibleCar,
    visibleHeader, setVisibleHeader,
    visibleHarga, setVisibleHarga,
    visibleKualitas, setVisibleKualitas,
    loading
  } = useGlobal();

  const isAnyModalVisible = () => {
    return (
      visible ||
      visibleCar ||
      visibleHeader ||
      visibleHarga ||
      visibleKualitas
    );
  };


  useEffect(() => {
    const onBackPress = () => {
      if (isAnyModalVisible()) {
        return false; // back press handled, jangan keluar app
      }
      // Kalau tidak ada modal aktif, return true agar back tombol diblokir juga
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      subscription.remove();
    };
  }, [
    visible, visibleCar, visibleHeader, visibleHarga, visibleKualitas, loading,
  ]);

  return null;
}