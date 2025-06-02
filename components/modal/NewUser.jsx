import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../../service/firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const NewUser = ({ visible, onDismiss }) => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [roleItems, setRoleItems] = useState([
    { label: 'Pemasok', value: 'Pemasok' },
    { label: 'Anggota', value: 'Anggota' },
    { label: 'Langganan', value: 'Langganan' },
  ]);

  const handleSubmit = async () => {
    if (!name || !role) {
      Alert.alert("Error", "Nama dan Role harus diisi");
      return;
    }

    try {
      await setDoc(doc(db, 'users', name), {
        name,
        role,
      });
      setRole('');
      setName('');
      onDismiss(false); // tutup modal setelah submit
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Gagal menyimpan data');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={() => {
        onDismiss(false);
        setRole('');
        setName('');
      }}
    >
      <View style={styles.modal}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Tambah User Baru</Text>

          <TextInput
            placeholder="Nama Anggota"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <DropDownPicker
            open={openDropdown}
            value={role}
            items={roleItems}
            setOpen={setOpenDropdown}
            setValue={setRole}
            setItems={setRoleItems}
            placeholder="Peran"
            style={styles.dropdown}
            textStyle={styles.textPicker}
            dropDownContainerStyle={styles.dropdownBox}
            zIndex={1000} // untuk posisi drop di atas modal
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  container: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    borderRadius: 16,
    alignSelf: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(225, 225, 225, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: 'white',
  },
  dropdown: {
    backgroundColor: 'rgba(225, 225, 225, 0.08)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 0,
  },
  dropdownBox: {
    backgroundColor: 'grey',
    borderRadius: 12,
    borderWidth: 0,
  },
  button: {
    backgroundColor: '#34d399',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  textPicker: {
    color: 'white',
  },
});

export default NewUser;