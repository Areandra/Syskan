import { createContext, useContext, useState } from 'react'

const GlobalContext = createContext();

export const GlobalProvider = ({children}) => {
  const [type, setType] = useState('Penjualan');
  const [currentTab, setCurrentTab] = useState('Home');
  const [isAtTop, setIsAtTop] = useState(false);
  return (
    <GlobalContext.Provider
      value = {{
        type,
        setType,
        currentTab,
        setCurrentTab,
        isAtTop,
        setIsAtTop
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalContext);