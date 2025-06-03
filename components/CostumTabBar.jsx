import { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, FlatList, Alert } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, interpolate, Extrapolate, runOnJS, } from 'react-native-reanimated';
import { useEffect } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useGlobal } from '../service/GlobalContext';
import { db } from '../service/firebase/firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';
import CircleButton from './button/CircleButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function ItemList({ data }) {
  const { currentTab, setUpdate } = useGlobal();
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const deleteSelectedItems = async () => {
    if (selectedIds.length === 0) {
      Alert.alert("Tidak ada item yang dipilih");
      return;
    }

    Alert.alert(
      "Konfirmasi",
      `Hapus ${selectedIds.length} item terpilih?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const deletePromises = selectedIds.map(id => {
                const docRef = doc(db, "users", currentTab, "invoices", id);
                return deleteDoc(docRef);
              });

              await Promise.all(deletePromises);
              setSelectedIds([]);
              setUpdate(prev => !prev);
              console.log("✅ Item berhasil dihapus");
            } catch (error) {
              console.error("❌ Gagal menghapus:", error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelectItem(item.id)}
        style={[
          card.itemContainer,
          isSelected && { backgroundColor: '#1243754a', borderWidth: 1, borderColor: 'white' },
        ]}
      >
        <Text style={card.sopir}>{item.header.pemasok} {item.header.sopir}</Text>
        <Text style={card.name}>
          {item.item.ikan} {item.item.kualitas === 'Bagus' ? '' : item.item.kualitas}
        </Text>
        <Text style={card.price}>Rp. {Number(item.item.harga).toLocaleString('id-ID')}.000,00</Text>
        <View style={card.locationContainer}>
          <Text style={[card.location, {color: 'white'}]}>{item.item.jumlah} <Text style={card.location}>Gabus</Text></Text>
          <Text style={card.store}>{item.header.hari}, <Text style={{color: 'grey'}}>{item.header.tanggal},</Text> {item.header.jam}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const totalGabus = (data) => data.reduce((sum, item) => sum + item.item.jumlah, 0);

  return (
    <View style={card.container}>
      {data && (
        <View style={{ width: '100%' }}>
          <Text style={card.title}>{data[0].userName}</Text>
          <View style={card.rowContainer}>
            <Text style={card.title}>{totalGabus(data)} <Text style={{color: 'grey', fontSize: 18,}}>Items</Text></Text>
            <View style={card.buttonContainer}>
              <CircleButton
                onPress={deleteSelectedItems}
                iconName="trash-2"
                style={{ marginRight: 10 }}
              />
              <CircleButton
                onPress={() => setVisiblePlus(true)}
                iconName="plus"
              />
            </View>
          </View>
        </View>
      )}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={card.listContainer}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const card = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 50,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  listContainer: {
    paddingBottom: 0,
    flexGrow: 1,
  },
  itemContainer: {
    marginBottom: 2,
    padding: 20,
    backgroundColor: 'rgba(80, 80, 80, 0.3)',
    borderRadius: 30,
  },
  sopir: {
    fontSize: 14,
    color: 'white',
  },
  name: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 500,
    marginVertical: 20,
  },
  price: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    fontSize: 14,
    color: '#888',
  },
  store: {
    fontSize: 14,
    color: 'white',
  },
});

const dataContoh = [
  {
    key: 'Masuk SGT Udin Senin 2025-06-02 18:00',
    hari: 'Senin',
    jam: '18:00',
    pemasok: 'SGT',
    sopir: 'Udin',
    tanggal: '2025-06-02',
    items: [
      {
        langganan: 'Dayat',
        ikan: 'Tuna',
        jumlah: 1,
        harga: '2000',
        kualitas: 'Bagus',
      },
      {
        langganan: 'Dayat',
        ikan: 'Kerapu',
        jumlah: 1,
        harga: '1500',
        kualitas: 'Bagus',
      },
      {
        langganan: 'Dayat',
        ikan: 'Kerapu',
        jumlah: 1,
        harga: '1500',
        kualitas: 'Bagus',
      },
    ],
  },
  // Bisa ditambahkan dokumen lain
];

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

function groupByKey(items) {
  return items.reduce((acc, item) => {
    if (!acc[item.key]) acc[item.key] = [];
    acc[item.key].push(item);
    return acc;
  }, {});
}

function InvoiceList() {
  const [selectedIkan, setSelectedIkan] = useState(null);

  if (!selectedIkan) {
    const grouped = groupByKey(getRingkasanIkan(dataContoh));

    return (
      <ScrollView contentContainerStyle={styles1.container}>
        {Object.entries(grouped).map(([key, items]) => (
          <View key={key} style={styles1.groupContainer}>
            <Text style={styles1.groupTitle}>Draft Key: {key}</Text>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onLongPress={() => setSelectedIkan(item.ikan)}
                style={styles1.itemRow}
              >
                <Text style={styles1.cell}>{item.ikan}</Text>
                <Text style={styles1.cell}>({item.kualitas})</Text>
                <Text style={styles1.cell}>Qty: {item.total}</Text>
                <Text style={styles1.cell}>Rp {item.harga}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  }

  // Filter hanya item yang sesuai selected ikan
  const groupedByKey = dataContoh
    .map((doc) => {
      const filteredItems = doc.items.filter(item => item.ikan === selectedIkan);
      if (filteredItems.length === 0) return null;
      return { ...doc, items: filteredItems };
    })
    .filter(Boolean);

  return (
    <FlatList
      data={groupedByKey}
      keyExtractor={(item) => item.key}
      contentContainerStyle={styles1.container}
      renderItem={({ item: doc }) => (
        <View style={styles1.docContainer}>
          {/* Header */}
          <View style={styles1.headerRow}>
            <Text style={styles1.headerText}>Pemasok: {doc.pemasok}</Text>
            <Text style={styles1.headerText}>Sopir: {doc.sopir}</Text>
            <Text style={styles1.headerText}>{doc.hari}, {doc.tanggal}</Text>
            <Text style={styles1.headerText}>Jam: {doc.jam}</Text>
          </View>

          {/* List item detail */}
          <FlatList
            data={doc.items}
            keyExtractor={(_, index) => `${doc.key}_${index}`}
            renderItem={({ item }) => (
              <View style={styles1.itemRow}>
                <Text style={styles1.cell}>{item.langganan}</Text>
                <Text style={styles1.cell}>{item.ikan}</Text>
                <Text style={styles1.cell}>Qty: {item.jumlah}</Text>
                <Text style={styles1.cell}>Rp {item.harga}</Text>
                <Text style={styles1.cell}>{item.kualitas}</Text>
              </View>
            )}
          />
        </View>
      )}
      ListFooterComponent={() => (
        <TouchableOpacity
          style={{ marginTop: 16, alignSelf: 'center' }}
          onPress={() => setSelectedIkan(null)}
        >
          <Text style={{ color: 'blue' }}>← Kembali</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles1 = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
  },
  docContainer: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  headerText: {
    fontWeight: 'bold',
    marginRight: 12,
  },
  itemList: {
    flexDirection: 'column',
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 6,
    gap: 10,
  },
  cell: {
    fontSize: 14,
    minWidth: 60,
  },
});


export default function CustomTabBar({ routes, loading, tabData }) {
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);
  const expandedY = -SCREEN_HEIGHT * 0.59 + 36;
  const collapsedY = 0;
  const halfExpandedY = expandedY / 10;
  const { currentTab, setCurrentTab } = useGlobal();
  const { setIsAtTop } = useGlobal();
  const onReachedTop = () => setIsAtTop(true);
  const setCollapsed = () => setIsAtTop(false);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const newTranslateY = Math.max(expandedY, Math.min(collapsedY, startY.value + event.translationY));
      translateY.value = newTranslateY;

      if (newTranslateY <= halfExpandedY) {
        runOnJS(onReachedTop)();
      } else {
        runOnJS(setCollapsed)();
      }
    })
    .onEnd(() => {
      if (translateY.value < halfExpandedY) {
        translateY.value = withTiming(expandedY, undefined, (finished) => {
          if (finished) runOnJS(onReachedTop)();
        });
      } else {
        translateY.value = withTiming(collapsedY, undefined, (finished) => {
          if (finished) runOnJS(setCollapsed)();
        });
      }
    });

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const progressValues = useRef(
    routes.reduce((acc, route) => {
      acc[route.key] = useSharedValue(currentTab === route.key ? 1 : 0);
      return acc;
    }, {})
  ).current;

  useEffect(() => {
    routes.forEach((route) => {
      const isFocused = currentTab === route.key;
      progressValues[route.key].value = withTiming(isFocused ? 1 : 0, { duration: 300 });
    });
  }, [currentTab]);

  const gestureOverlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.gestureOverlay, gestureOverlayStyle]} />
      </GestureDetector>

      <Animated.View style={[styles.tabBarContainer, containerAnimatedStyle]}>
        <View style={{width: '88%', left: 8, zIndex:10}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.tabBar}>
              {routes?.map((route) => {
                const isFocused = currentTab === route.key;
                const progress = progressValues[route.key];

                const animatedIconStyle = useAnimatedStyle(() => ({
                  transform: [
                    { translateY: interpolate(progress.value, [0, 1], [4.5,29], Extrapolate.CLAMP) },
                    { scale: interpolate(progress.value, [0, 1], [1, 1.3], Extrapolate.CLAMP) },
                  ],
                }));

                const animatedCircleStyle = useAnimatedStyle(() => ({
                  opacity: progress.value,
                  transform: [
                    { translateY: interpolate(progress.value, [0, 1], [10, 13.9], Extrapolate.CLAMP) },
                    { scale: interpolate(progress.value, [0, 1], [1, 1.3], Extrapolate.CLAMP) },
                  ],
                }));

                return (
                  <TouchableOpacity
                    key={route.key}
                    onPress={() => setCurrentTab(route.key)}
                    style={styles.tabButton}
                    activeOpacity={0.7}
                  >
                    <Animated.View style={animatedIconStyle}>
                      <Animated.Text style={{ color: isFocused ? '#fff' : '#888', fontSize: 16 }}>{route.title}</Animated.Text>
                    </Animated.View>
                    <Animated.View style={[styles.circle, animatedCircleStyle]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View style={styles.bar}>
          { currentTab === 'Beranda' 
            ? ( <InvoiceList /> )
            : ( <ItemList data={tabData[currentTab]} /> )
          }
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: -SCREEN_HEIGHT * 0.59,
    left: 0,
    right: 0,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
    width: '100%',
    zIndex: 10,
  },
  scrollContainer: {
    paddingHorizontal: 0,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 30,
    height: 80,
    alignItems: 'center',
  },
  tabButton: {
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  circle: {
    position: 'absolute',
    top: 10,
    width: 90,
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: '55%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    opacity: 0,
    zIndex: -1,
  },
  bar: {
    // Removed position absolute and bottom negative
    height: SCREEN_HEIGHT * 0.58 + 35,
    left: '2.5%',
    right: 0,
    width: '95%',
    borderTopLeftRadius: '0%',
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    flexGrow: 1,
  },  
  gestureOverlay: {
    position: 'absolute',
    bottom: 105,
    left: 0,
    right: 0,
    height: 50, // sama dengan tinggi tab bar
    backgroundColor: 'transparent',
    zIndex: 20,
  },
});

