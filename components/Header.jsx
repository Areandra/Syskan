import { View, Text, StyleSheet } from 'react-native';
import CircleButton from './button/CircleButton';

const Header = ({ title, navigation, back, pemasok, langganan }) => {
  return (
      <View style ={header.container}>
        <View style={header.buttonContainer}>
          <CircleButton onPress={() => {back ? navigation.goBack() : navigation.navigate('DraftInvoiceScreen')}} iconName={back ? "arrow-left" : "edit-3"} style={optionalStyle.backButton} />  
          <Text style={header.text}>{title}</Text>
        </View>
        <View style={header.buttonContainer}>
          <CircleButton onPress={() => alert('Search Pressed')} iconName={langganan ? "user" : "user"} style={optionalStyle.backButton} />
          <CircleButton onPress={() => alert('Notifications Pressed')} iconName="bell" />
        </View>  
      </View>
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
