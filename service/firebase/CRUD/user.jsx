import { collection, doc, setDoc, remove, updateDoc, ref } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const createUserData = async (userData) => {
  try {
    const userRef = doc(db, 'users', userData.name); // Referensi ke dokumen
    await setDoc(userRef, userData);
    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

export const readUserData = async () => {
  try {
    const invoicesSnapshot = await getDocs(collection(db, 'users'));
    const invoices = invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return invoices;
  } catch (error) {
    console.error('Error reading invoices:', error);
    return [];
  }
};

export const updateUserData = async (userId, updatedData) => {
  try {
    const invoiceRef = doc(db, 'users', userId);
    await updateDoc(invoiceRef, updatedData);
    console.log('Invoice updated successfully');
  } catch (error) {
    console.error('Error updating invoice:', error);
  }
};

export const deleteUserData = (userId) => {
  const db = getDatabase();
  const invoiceRef = ref(db, `users/${userId}}`);

  remove(invoiceRef)
    .then(() => {
      console.log('Invoice deleted successfully');
    })
    .catch((error) => {
      console.error('Error deleting invoice:', error);
    });
};