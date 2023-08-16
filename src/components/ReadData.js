import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { database } from '../firebaseConfig';

export const readData = (user, onDataFetched, onError) => {
  if (user && typeof onDataFetched === 'function' && typeof onError === 'function') {
    const collectionRef = collection(database, 'cardData');
    const q = query(collectionRef, where('sharedWith', 'array-contains', user.uid));

    onSnapshot(
      q,
      (data) => {
        const fetchedCards = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        onDataFetched(fetchedCards);
      },
      (error) => {
        console.error('Error fetching data:', error);
        onError(error);
      }
    );
  }
};
