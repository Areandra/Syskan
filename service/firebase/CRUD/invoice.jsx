import { collection, setDoc, remove, updateDoc, ref } from 'firebase/firestore';
import { db } from './firebaseConfig';

const createInvoice = async (userId, invoiceData) => {
  try {
    await addDoc(collection(db, 'users', userId, 'invoices'), invoiceData);
    console.log('Invoice added successfully');
  } catch (error) {
    console.error('Error adding invoice:', error);
  }
};

const readInvoices = async (userId) => {
  try {
    const invoicesSnapshot = await getDocs(collection(db, 'users', userId, 'invoices'));
    const invoices = invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return invoices;
  } catch (error) {
    console.error('Error reading invoices:', error);
    return [];
  }
};

const updateInvoice = async (userId, invoiceId, updatedData) => {
  try {
    const invoiceRef = doc(db, 'users', userId, 'invoices', invoiceId);
    await updateDoc(invoiceRef, updatedData);
    console.log('Invoice updated successfully');
  } catch (error) {
    console.error('Error updating invoice:', error);
  }
};

const deleteInvoice = (userId, invoiceId) => {
  const db = getDatabase();
  const invoiceRef = ref(db, `users/${userId}/invoices/${invoiceId}`);

  remove(invoiceRef)
    .then(() => {
      console.log('Invoice deleted successfully');
    })
    .catch((error) => {
      console.error('Error deleting invoice:', error);
    });
};