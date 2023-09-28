import { Injectable } from '@angular/core';
// Import the functions you need from the SDKs you need
import { initializeApp } from '@firebase/app';
import { getAnalytics } from '@firebase/analytics';
import { environment } from 'src/environments/environment';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from '@firebase/firestore';
import { collection, addDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  db;

  constructor() {
    this.initial();
  }

  initial() {
    // Initialize Firebase
    const app = initializeApp(environment.firebase);
    const analytics = getAnalytics(app);

    // Initialize Cloud Firestore and get a reference to the service
    this.db = getFirestore(app);
  }

  async test() {
    try {
      const docRef = await addDoc(collection(this.db, 'users'), {
        first: 'Ada',
        last: 'Lovelace',
        born: 1815,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
}
