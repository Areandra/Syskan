import { Modal,View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from "react-native";

const SetHarga = ({visible, onDismiss, onChangeText, data }) => {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onDismiss}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atur Harga Ikan</Text>
            <ScrollView>
              {Object.entries(data).map(([key, value]) => (
                <View key={key} style={styles.hargaRow}>
                  <Text style={styles.hargaLabel}>{key}</Text>
                  <TextInput
                    style={styles.hargaInput}
                    keyboardType="numeric"
                    placeholder="Rp"
                    value={String(value)}
                    onChangeText={(text) => onChangeText(key, text)}
                  />
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <Text style={styles.closeText}>Simpan & Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: '20%', left: 0, right: 0, bottom: '20%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    borderRadius: 16,
    alignSelf: 'center',
    backdropFilter: 'blur(10px)',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hargaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(225, 225, 225, 0.08)',
    borderRadius: 12,
  },
  hargaLabel: {
    fontSize: 16,
    color: 'white',
  },
  hargaInput: {
    backgroundColor: 'rgba(225, 225, 225, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: 'white',
  },
  hargaValue: {
    fontSize: 16,
    color: 'white',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#f5a8c6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: {
    fontWeight: 'bold',
    color: '#fff',
  }
})

export default SetHarga;