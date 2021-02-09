'use strict';

import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from "./upload";

const firebaseConfig = {
    apiKey: "AIzaSyAiT8vl2njhqY0-6HKPDwumk96Qe9Nn65g",
    authDomain: "fe-upload-c75c0.firebaseapp.com",
    projectId: "fe-upload-c75c0",
    storageBucket: "fe-upload-c75c0.appspot.com",
    messagingSenderId: "316114019861",
    appId: "1:316114019861:web:f1b3312177f88494da101c"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`);
            const task = ref.put(file);
            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
                const block = blocks[index].querySelector('.uploader__preview-info-progress');
                block.textContent = percentage;
                block.style.width = percentage;
            }, error => {
                console.log(error)
            }, () => {

                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download Url', url)
                })
            })
        })
    }
});
