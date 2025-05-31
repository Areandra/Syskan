import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CircleButton = ({ onPress, iconName, style }) => {
  return (
    <TouchableOpacity style={[header.button, style]} onPress={onPress}>
      <Feather name={iconName} size={18} color="#fff" />
    </TouchableOpacity>
  );
};

export default CircleButton;

const header = StyleSheet.create({
  button: {
    padding: 18,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // transparan putih
  },
});