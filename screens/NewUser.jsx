import { setDoc, doc, addDoc, collection } from "firebase/firestore";
import React from "react";
import { Alert } from "react-native";
import { db } from "../service/firebase/firebaseConfig";
import { removeDraft } from "../service/storage/draftManager";

const NewUser = () => {
    const handleSubmit = async () => {
    try {
      if (mode === 'user') {
        await setDoc(doc(db, 'users', name), {
          name,
          role,
        });
      } else {
        // Simpan semua item draft ke database
        for (const item of draftItems) {
          const { userId, ...invoice } = item;
          await addDoc(collection(db, 'users', userId, 'invoices'), {
            ...invoice,
            key: draftKey,
          });
        }
        await removeDraft(draftKey);
        setDraftItems([]);
      }
      onDismiss();
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Gagal menyimpan data');
    }
  };

    return (
        <>
            <TextInput
                label="Nama (ID)"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <RNPickerSelect
                onValueChange={(value) => setRole(value)}
                items={[
                  { label: 'Boss', value: 'Boss' },
                  { label: 'Pemasok', value: 'Pemasok' },
                  { label: 'Sekretaris', value: 'Sekretaris' },
                  { label: 'Anggota', value: 'Anggota' },
                  { label: 'Langganan', value: 'Langganan' },
                ]}
                placeholder={{ label: 'Pilih Role', value: null }}
                style={pickerSelectStyles}
              />
        </>
    )
}