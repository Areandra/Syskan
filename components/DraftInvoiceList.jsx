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
      data={drafts}
      keyExtractor={item => item.key}
      renderItem={({ item }) => (
        <TouchableOpacity onLongPress={() => confirmDelete(item.key)} style={styles.card} onPress={() => onOpen(item.key)}>
          <Text style={styles.title}>{item.key}</Text>
          <Text>Pemasok: {item.data.header.pemasok}</Text>
          <Text>Sopir: {item.data.header.sopir}</Text>
          <Text>Item: {item.data.items.length}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  title: { fontWeight: 'bold' }
});

export default DraftInvoiceList;
