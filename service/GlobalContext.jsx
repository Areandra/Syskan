import { createContext, useContext, useState } from 'react'

const GlobalContext = createContext();

export const GlobalProvider = ({children}) => {
  const [type, setType] = useState('Penjualan');
  const [currentTab, setCurrentTab] = useState('Beranda');
  const [isAtTop, setIsAtTop] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleCar, setVisibleCar] = useState(false);
  const [visibleHeader, setVisibleHeader] = useState(false);
  const [visibleKualitas, setVisibleKualitas] = useState(false);
  const [visibleHarga, setVisibleHarga] = useState(false);
  const [peringatan, setPeringatan] = useState(false);
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(true);
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
        visibleKualitas,
        setVisibleKualitas,
        peringatan,
        setPeringatan,
        pesan,
        setPesan,
        loading,
        setLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalContext);