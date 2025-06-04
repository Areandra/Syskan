import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Modal, TextInput } from 'react-native';
import CircleButton from './button/CircleButton';
import { useGlobal } from '../service/GlobalContext';

function getRingkasanIkan(data) {
  const ringkasan = {};

  data.forEach(doc => {
    doc.items.forEach(item => {
      const key = `${item.ikan} (${item.kualitas})`;
      if (!ringkasan[key]) {
        ringkasan[key] = {
          ikan: item.ikan,
          kualitas: item.kualitas,
          total: 0,
          harga: item.harga,
        };
      }
      ringkasan[key].total += item.jumlah;
    });
  });

  return Object.values(ringkasan);
}

export default function InvoiceList({dataContoh}) {
  const { type, currentTab } = useGlobal();
  const [selectedIkan, setSelectedIkan] = useState(null);
  const [itemDimensions, setItemDimensions] = useState({ width: 0, height: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    pemasok: '',
    sopir: '',
    tanggal: ''
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  useEffect(() => {
  if (type !== 'Penjualan') {
    setFilterCriteria(prev => ({
      ...prev,
      pemasok: currentTab !== 'Beranda' ? currentTab : ''
    }));
  }
}, [currentTab]);

  const filterData = (data) => {
    return data.filter(doc => {
      const matchesSearch = searchQuery === '' || 
        doc.pemasok.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.items.some(item => 
          item.ikan.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesPemasok = filterCriteria.pemasok === '' || 
        doc.pemasok.toLowerCase().includes(filterCriteria.pemasok.toLowerCase());
      
      const matchesSopir = filterCriteria.sopir === '' || 
        doc.sopir.toLowerCase().includes(filterCriteria.sopir.toLowerCase());
      
      const matchesTanggal = filterCriteria.tanggal === '' || 
        doc.tanggal.includes(filterCriteria.tanggal);
      
      return matchesSearch && matchesPemasok && matchesSopir && matchesTanggal;
    });
  };

  const filteredData = filterData(dataContoh);

  const renderItem = ({ item: doc }) => {
    const ringkasan = getRingkasanIkan([doc]); // Ringkasan per draft
    const totalGabus = (ringkasan) => ringkasan.reduce((sum, item) => sum + item.total, 0);

    return (
      <View
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setItemDimensions({ width, height });
        }}
        style={[
          styles.groupContainer,
          itemDimensions.width > 0 && {
            borderRadius: Math.min(itemDimensions.width, itemDimensions.height) / 6
          }
        ]}
      >
        <Text style={styles.groupTitle}>
          {doc.pemasok} <Text style={{ fontSize: 12 }}>{doc.sopir}</Text>
        </Text>

        {ringkasan.map((item, index) => (
          <TouchableOpacity
            key={`${doc.key}_${index}`}
            onLongPress={() => setSelectedIkan({ ikan: item.ikan, key: doc.key })}
            style={styles.itemRow}
          >
            <Text style={styles.cell}>{item.ikan}</Text>
            <Text style={styles.cell}>({item.kualitas})</Text>
            <Text style={styles.cell}>Qty: {item.total}</Text>
            <Text style={styles.cell}>Rp {Number(item.harga).toLocaleString('id-ID')}</Text>
          </TouchableOpacity>
        ))}
        <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
           <Text style={[styles.location, {color: 'white'}]}>{totalGabus(ringkasan)} <Text style={styles.location}>Gabus</Text></Text>
           <Text style={styles.store}>
              {doc.hari}, <Text style={{ color: 'grey' }}>{doc.tanggal}</Text> : {doc.jam}
           </Text>
        </View>
      </View>
    );
  };

  if (!selectedIkan) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Aktivitas Terakhir</Text>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{filteredData.length} <Text style={{ color: 'grey', fontSize: 18 }}>Partai</Text></Text>
            <View style={styles.buttonContainer}>
              <CircleButton iconName="trash-2" style={{ marginRight: 10 }} />
              <CircleButton iconName="filter" onPress={() => setShowFilterModal(true)} />
            </View>
          </View>
        </View>    
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.listContentContainer}
          style={styles.listContainer}
        />
        <Modal
            visible={showFilterModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowFilterModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Filter Data</Text>
                
                <Text style={styles.filterLabel}>Pemasok:</Text>
                <TextInput
                  style={styles.filterInput}
                  value={filterCriteria.pemasok}
                  onChangeText={text => setFilterCriteria({...filterCriteria, pemasok: text})}
                />
                
                <Text style={styles.filterLabel}>Sopir:</Text>
                <TextInput
                  style={styles.filterInput}
                  value={filterCriteria.sopir}
                  onChangeText={text => setFilterCriteria({...filterCriteria, sopir: text})}
                />
                
                <Text style={styles.filterLabel}>Tanggal (YYYY-MM-DD):</Text>
                <TextInput
                  style={styles.filterInput}
                  value={filterCriteria.tanggal}
                  onChangeText={text => setFilterCriteria({...filterCriteria, tanggal: text})}
                  placeholder="2025-06-02"
                />
                
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => setShowFilterModal(false)}
                >
                  <Text style={styles.applyButtonText}>Terapkan Filter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
      </View>   
    );
  }

  // Jika sudah memilih ikan
  const groupedByKey = dataContoh
    .filter(doc => doc.key === selectedIkan.key)
    .map(doc => {
      const filteredItems = doc.items.filter(item => item.ikan === selectedIkan.ikan);
      return { ...doc, items: filteredItems };
    });

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={groupedByKey}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContentContainer}
        style={[styles.listContainer, {marginTop: 16}]}
        renderItem={({ item: doc }) => (
          <View style={styles.docContainer}>
            {/* Header Draft */}
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>Pemasok: {doc.pemasok}</Text>
              <Text style={styles.headerText}>Sopir: {doc.sopir}</Text>
              <Text style={styles.headerText}>{doc.hari}, {doc.tanggal}</Text>
              <Text style={styles.headerText}>Jam: {doc.jam}</Text>
            </View>

            {/* Detail item */}
            <FlatList
              data={doc.items}
              keyExtractor={(_, index) => `${doc.key}_${index}`}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Text style={styles.cell}>{item.langganan}</Text>
                  <Text style={styles.cell}>{item.ikan}</Text>
                  <Text style={styles.cell}>Qty: {item.jumlah}</Text>
                  <Text style={styles.cell}>Rp {Number(item.harga).toLocaleString('id-ID')}</Text>
                  <Text style={styles.cell}>{item.kualitas}</Text>
                </View>
              )}
            />
          </View>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedIkan(null)}
          >
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212'
  },
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    padding: 16,
    paddingBottom: 0,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  groupContainer: {
    marginBottom: 2,
    padding: 25,
    backgroundColor: 'rgba(80, 80, 80, 0.3)',
  },
  docContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(80, 80, 80, 0.3)',
    borderRadius: 20,
    padding: 16,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
    marginVertical: 20,
  },
  store: {
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
  },
  groupTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: 'white',
  },
  headerText: {
    fontSize: 14,
    color: 'white',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(240, 240, 240, 0.09)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  cell: {
    fontSize: 13,
    color: 'white',
    flexShrink: 1,
    paddingHorizontal: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 16,
    alignSelf: 'center',
    padding: 12,
    backgroundColor: 'rgba(80, 80, 80, 0.5)',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterLabel: {
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  filterInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 5,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
