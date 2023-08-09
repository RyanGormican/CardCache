import React, {useState, useEffect} from 'react';
import { Icon } from '@iconify/react';
import { useParams, useNavigate} from 'react-router-dom';
import {getStorage,ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {updateDoc, doc, onSnapshot, collection } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import {Modal, Input} from 'antd';
export default function Card() {
let params=useParams();
let navigate = useNavigate();
const [cards, setCards]= useState([]);
const [cardName, setCardName]= useState (''); 
const [selectedFile, setSelectedFile] = useState([]);
const [deleteModalVisible, setDeleteModalVisible] = useState(false);
const [fileToDelete, setFileToDelete] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const storage = getStorage();
	const databaseRef = doc(database, 'cardData', params?.id)



	const deleteFile = (fileName) => {
  const updatedFileLinks = cards.filter((card) => card.fileName !== fileName);
  updateDoc(databaseRef, { fileLink: updatedFileLinks });
};

	const showDeleteModal = (fileName) => {
	setFileToDelete(fileName);
	setDeleteModalVisible(true);
	}
	const hideDeleteModal = () => {
		setFileToDelete('');
		setDeleteModalVisible(false);
	}
	const confirmDelete = () => {
		if (fileToDelete) {
			deleteFile(fileToDelete);
			hideDeleteModal();
		}
	}
	const showModal = () => {
		setIsModalVisible(true);
	}
		const handleCancel = () => {
		setIsModalVisible(false);
	}
	const handleFile = (event) => {
  setSelectedFile(event.target.files[0]);
	};

	const getFile = () => {
	if (!selectedFile.name){
		return;
	}
	console.log(selectedFile);
	const fileRef = ref(storage, selectedFile.name);
	const uploadTask = uploadBytesResumable(fileRef, selectedFile);
	uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {

		setIsModalVisible(false);
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
		updateDoc(databaseRef,{
			fileLink: [...cards, {
			downloadURL: downloadURL,
			fileName:  selectedFile.name
			}]
		})
    });
  }
)

	}

	const readData = () => {
  onSnapshot(databaseRef, (snapshot) => {
    const data = snapshot.data();
    if (data) {
      setCards(data.fileLink);
      setCardName(data.cardName);
    }
  });
};

	const openFile = (downloadURL) => {
		window.open(downloadURL, '_blank');
	} 

	const goHome = () => {
		navigate('/drive')
	}
	useEffect(() => {
		readData();
	}, [])

	return (
		<div> 
			<div className= 'return' onClick= {goHome}>
			<Icon icon="icon-park-outline:return" height="60" />
			</div>
			<div className='icon-container'>
				<div class="upload-btn">
					<Icon icon="mdi:file-document-add-outline" height="60" onClick={showModal} />
				</div> 
			</div> 
			<div className='folder-title'>
			<h1>{cardName} </h1>
			</div>
			<div className= 'grid-parent'>
				{cards?.map((card)=> {
				 const isImage = /\.(png|jpg|jpeg|gif|bmp)$/i.test(card.fileName);
					return (
					<>
						{card.downloadURL !== '' ? (
						
						<div className='grid-child'>
							{isImage ? (
							<img className='image-preview' src={card.downloadURL} alt='image' />
							) : ( 
							""
							)}
							<h5 onClick={()=> openFile(card.downloadURL)}>{card.fileName} </h5>
							<Icon icon="jam:trash" height="30" onClick={() => showDeleteModal(card.fileName)} />
						</div> 
						) : (
						""
						)}
					</>
						

					)
				})}
			</div> 

			<Modal 
			title="Add a file" 
			open={isModalVisible} 
			onOk={getFile}
			onCancel = {handleCancel} 
			centered
			>
				<input placeholder="Select your file..." 
				name="myfile"
				type="file"
				onChange={handleFile}
				/>
			</Modal>
			
			 <Modal
		title={`Delete file`}
        visible={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={hideDeleteModal}
        centered
      >
        <p>Are you sure you want to delete {fileToDelete}?</p>
      </Modal>

		</div>
	)
}