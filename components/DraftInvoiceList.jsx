import { FlatList, Alert, Text, TouchableOpacity, StyleSheet, View } from 'react-native';

const DraftInvoiceList = ({ drafts, onOpen, onDelete }) => {
      const confirmDelete = (key) => {
    Alert.alert(
      'Hapus Draft',
      'Yakin ingin menghapus draft ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => onDelete(key) }
      ]
    );
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={drafts}
      keyExtractor={item => item.key}
      renderItem={({ item }) => (
        <TouchableOpacity onLongPress={() => confirmDelete(item.key)} style={styles.card} onPress={() => onOpen(item.key)}>
          <Text style={styles.title}>{item.key}</Text>
          <Text style={{color: 'white'}}>{item.data.header.pemasok}</Text>
          <Text style={{color: 'white'}}>Sopir: {item.data.header.sopir}</Text>
          <Text style={{color: 'white'}}>Muatan: {item.data.items.length} Gabus</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12 
  },
  title: { fontWeight: 'bold', color: 'white', }
});

export default DraftInvoiceList;
