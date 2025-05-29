import { collection, addDoc, del } from 'firebase/firestore';
import { db } from './firebaseConfig';

const createInvoice = async (userId, invoiceData) => {
  try {
    await addDoc(collection(db, 'users', userId, 'purchases'), invoiceData);
    console.log('Invoice added successfully');
  } catch (error) {
    console.error('Error adding invoice:', error);
  }
};

const deleteInvoice = async (userId, invoiceId) => {
  try {
    await de
  }
}