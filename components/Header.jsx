import { View, Text, StyleSheet } from 'react-native';
import CircleButton from './button/CircleButton';
import NewUser from './modal/NewUser';
import NewSopir from './modal/NewSopir';
import { useState } from 'react';
import { useGlobal } from '../service/GlobalContext'

const Header = ({ title, navigate, navigation, back, pemasok, langganan, kembali }) => {
  const {visible, setVisible, visibleCar, setVisibleCar, setLoading} = useGlobal();
  return (
    <>
      {back && (<>
        <NewUser visible={visible} onDismiss={setVisible}/>
        <NewSopir visible={visibleCar} onDismiss={setVisibleCar}/>
        </>)}
      <View style ={header.container}>
        <View style={header.buttonContainer}>
          <CircleButton onPress={() => {
            if(back && !kembali) {
              navigation.navigate(navigate);
              setLoading(true);
            } else if (kembali) {
              navigation.goBack();
            } else {
              navigation.navigate('DraftInvoiceScreen');
            }
          }} iconName={back ? "arrow-left" : "edit-3"} style={optionalStyle.backButton} />  
          <Text style={header.text}>{title}</Text>
        </View>
        <View style={header.buttonContainer}>
          <CircleButton onPress={() => {langganan ? setVisible(true) : navigation.navigate('DraftInvoiceScreen')}} iconName={langganan ? "user-plus" : "user"} style={optionalStyle.backButton} />
          <CircleButton onPress={() => {pemasok ? setVisibleCar(true) : navigation.navigate('DraftInvoiceScreen')}} iconName={pemasok ? "truck" : "bell"} />
        </View>  
      </View>
    </>
  );
};

export default Header; 

const header = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    marginTop: 15,
    paddingHorizontal: 20,
    backgroundColor: '',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    fontWeight: 'regular',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});


const optionalStyle = {
  backButton: {
    marginRight: 10,
  },
};
