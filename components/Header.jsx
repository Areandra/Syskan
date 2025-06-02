import { View, Text, StyleSheet } from 'react-native';
import CircleButton from './button/CircleButton';

const Header = ({ title, navigation, buttonOne = {}, buttonTwo = {}, buttonThree = {} }) => {
  return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <CircleButton 
            onPress={() => { 
              if (buttonOne.back) {
                navigation.goBack();
              } else if (buttonOne.navigate) {
                navigation.navigate(buttonOne.navigate);
              }
            }} 
            iconName={buttonOne.icon || 'arrow-left'} 
            style={styles.backButton} 
          />  
          <Text style={styles.text}>{title}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <CircleButton 
            onPress={() => { 
              if (buttonTwo.modal && typeof buttonTwo.onPress === 'function') {
                buttonTwo.onPress();
              } else if (buttonTwo.navigate) {
                navigation.navigate(buttonTwo.navigate);
              }
            }} 
            iconName={buttonTwo.icon || 'plus'} 
            style={styles.backButton} 
          />

          <CircleButton 
            onPress={() => { 
              if (buttonThree.modal && typeof buttonThree.onPress === 'function') {
                buttonThree.onPress();
              } else if (buttonThree.navigate) {
                navigation.navigate(buttonThree.navigate);
              }
            }} 
            iconName={buttonThree.icon || 'plus'} 
            style={styles.backButton} 
          />
        </View>  
      </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    marginTop: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
});
