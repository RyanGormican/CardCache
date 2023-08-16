import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { database } from '../firebaseConfig'; // Make sure this points to your Firebase configuration

export const readData = (user, onDataFetched, onError) => {
  if (user && typeof onDataFetched === 'function' && typeof onError === 'function') {
    const collectionRef = collection(database, 'cardData');
    const q = query(collectionRef, where('sharedWith', 'array-contains', user.uid));

    onSnapshot(
      q,
      (data) => {
        const fetchedCards = data.docs.map((doc) => {
          const cardData = doc.data();
          return {
            ...cardData,
            id: doc.id,
            fileName: cardData?.fileName || "",
          };
        });
        onDataFetched(fetchedCards);
      },
      (error) => {
        console.error('Error fetching data:', error);
        onError(error);
      }
    );
  }
};
