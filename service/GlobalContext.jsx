import { createContext, useContext, useState } from 'react'

const GlobalContext = createContext();

export const GlobalProvider = ({children}) => {
  const [type, setType] = useState('Penjualan');
  const [currentTab, setCurrentTab] = useState('Beranda');
  const [isAtTop, setIsAtTop] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleCar, setVisibleCar] = useState(false);
  const [visibleHeader, setVisibleHeader] = useState(false);
  const [visibleKualitasGlobal, setVisibleKualitasGlobal] = useState();
  const [visibleHarga, setVisibleHarga] = useState(false);
  const [peringatan, setPeringatan] = useState(false);
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [listHarga, setListHarga] = useState({});
  const [hargaMap, setHargaMap] = useState({});
  
  return (
    <GlobalContext.Provider
      value = {{
        type,
        setType,
        currentTab,
        setCurrentTab,
        isAtTop,
        setIsAtTop,
        visible,
        setVisible,
        visibleCar,
        setVisibleCar,
        visibleHeader,
        setVisibleHeader,
        visibleHarga,
        setVisibleHarga,
        visibleKualitasGlobal,
        setVisibleKualitasGlobal,
        peringatan,
        setPeringatan,
        pesan,
        setPesan,
        loading,
        setLoading,
        listHarga,
        setListHarga,
        hargaMap, 
        setHargaMap,
        update,
        setUpdate,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalContext);