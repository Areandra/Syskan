import NewUser from '../components/modal/NewUser';
import NewSopir from '../components/modal/NewSopir';
import { useGlobal } from '../service/GlobalContext';
import { View } from 'react-native';
import SetHarga from '../components/modal/SetHarga';

const ModalProvider = () => {
    const { 
        visible,
        setVisible,
        visibleCar,
        setVisibleCar,
        visibleHarga,
        setVisibleHarga,
        setListHarga,
        hargaMap, 
        setHargaMap, 
    }  = useGlobal();
    return (
        <View style={{flex:1, position: 'absolute'}}>
            <NewUser visible={visible} onDismiss={() => setVisible(false)} />
            <NewSopir visible={visibleCar} onDismiss={() => setVisibleCar(false)} />
            <SetHarga 
                visible={visibleHarga} 
                onDismiss={() => setVisibleHarga(false)} 
                onChangeText={(key, text) => {
                    const newHargaMap = { ...hargaMap, [key]: text };
                    setHargaMap(newHargaMap);
                    setListHarga(newHargaMap);
                }} 
                data={hargaMap}
            />
        </View>
    )
}

export default ModalProvider;