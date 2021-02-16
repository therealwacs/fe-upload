import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload.js'

 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyALLL3f0SOvR8ciQ2x1zoRm4VjfnDiekCk",
   authDomain: "fe-upload-cae27.firebaseapp.com",
   projectId: "fe-upload-cae27",
   storageBucket: "fe-upload-cae27.appspot.com",
   messagingSenderId: "379329277116",
   appId: "1:379329277116:web:ccba74fc724f395ee074b9"
 }
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()


upload('#file', {
	multiple: true,
	accept: ['.png', '.jpg', '.jpeg', '.gif'],
	onUpload(files, blocks) {
		files.forEach((file, index) => {
			const ref = storage.ref(`images/${file.name}`)
			const task = ref.put(file)
			task.on('state_changed', snapshot => {
				const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
				const block = blocks[index].querySelector('.preview-info-progress')
				block.textContent = percentage
				block.style.width = percentage
			}, error => {

			}, () => {
				task.snapshot.ref.getDownloadURL().then(url => {
					console.log('Download url', url)
				})
				console.log('Complete')
			})
		})
		// console.log('files', files)
	}
})
