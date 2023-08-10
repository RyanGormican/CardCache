import React, {useState, useEffect} from 'react';
import { Icon } from '@iconify/react';
import { useParams, useNavigate} from 'react-router-dom';
import {getStorage,ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {updateDoc, doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import {Modal, Input, Checkbox} from 'antd';
import { getAuth, signOut } from 'firebase/auth';

export default function Card() {
let params=useParams();
let navigate = useNavigate();
let auth= getAuth();
const [selectedSort, setSelectedSort] = useState(''); 
const [cards, setCards]= useState([]);
const [search, setSearch] = useState('');
const [cardName, setCardName]= useState (''); 
const [selectedFile, setSelectedFile] = useState([]);
const [deleteModalVisible, setDeleteModalVisible] = useState(false);
const [searchModalVisible, setSearchModalVisible] = useState(false);
const [fileToDelete, setFileToDelete] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const storage = getStorage();
	const databaseRef = doc(database, 'cardData', params?.id)
	
	const [fileTypes, setFileTypes] = useState({
		png: true,
		jpg: true,
		jpeg: true,
		gif: true,
		bmp: true,
		pdf: true,
	})
	const handleDragOver = (e) => {
  e.preventDefault();
};

const handleDrop = (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  setSelectedFile(files[0]);
};
	const sortByOption = (option) => {
   switch (option) {
      case 'name':
         return (a, b) => a.fileName.localeCompare(b.fileName);
      case 'size':
         return (a, b) => a.fileSize - b.fileSize;
      case 'time':
         return (a, b) => a.creationTimestamp - b.creationTimestamp;
      default:
         return () => 0;
   }
};


	const filterByType = (card) => {
		const extension = card.fileName.split('.').pop();
		return fileTypes[extension];
	};

	const toggleCheck = ( fileType) =>
	{
	setFileTypes((prevValues) => ({
		...prevValues,
		[fileType]: !prevValues[fileType],
	}));
	};
	const deleteFile = (fileName) => {
  const updatedFileLinks = cards.filter((card) => card.fileName !== fileName);
  updateDoc(databaseRef, { fileLink: updatedFileLinks });
};
const filteredCards = cards
   .filter((card) => card.fileName.toLowerCase().includes(search.toLowerCase()))
   .filter(filterByType)
   .sort(sortByOption(selectedSort)); // Apply sorting based on selectedSort

	const showDeleteModal = (fileName) => {
	setFileToDelete(fileName);
	setDeleteModalVisible(true);
	}
	const showSearchModal = () =>
	{
		setSearchModalVisible(true);
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
		setSearchModalVisible(false);
	}
	const handleFile = (event) => {
  setSelectedFile(event.target.files[0]);
	};

	const getFile = () => {
	if (!selectedFile.name){
		return;
	}
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
			fileName:  selectedFile.name,
			fileSize: selectedFile.size,
			creationTimstamp: Date.now(),
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
			<div className='folder-title'>
			<input type="text" placeholder="Search files..." value={search} onChange={(e)=> setSearch(e.target.value)} />
			<Icon icon="mdi:eye-outline" height="30" onClick={showSearchModal}/>
			</div>
	<div className='grid-parent'>
  {filteredCards?.length > 0 ? (
    filteredCards?.map((card) => {

	  if (card.downloadURL === '' || card.fileName === '') {
        return null; 
      }
      const isImage = /\.(png|jpg|jpeg|gif|bmp)$/i.test(card.fileName);
      return (
        <div className='grid-child'>
          {card?.downloadURL !== '' ? (
            <React.Fragment>
              {isImage ? (
                <img
                  className='image-preview'
                  src={card.downloadURL}
                  alt='image'
                />
              ) : (
                ''
              )}
              <h5 onClick={() => openFile(card.downloadURL)}>
                {card.fileName}
              </h5>
              <Icon
                icon='jam:trash'
                height='30'
                onClick={() => showDeleteModal(card.fileName)}
              />
            </React.Fragment>
          ) : (
            ''
          )}
        </div>
      );
    })
  ) : (
    <p>No files found.</p>
  )}
</div>


			<Modal 
			title="Add a file" 
			open={isModalVisible} 
			onOk={getFile}
			onCancel = {handleCancel} 
			centered
			>
			<div className="file-drop" onDrop={handleDrop} onDragOver={handleDragOver}>
    <p>Drag and drop files here or click to select</p>
  </div>
   <input
      type="file"
      name="myfile"
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

	  		 <Modal
		title={`Advanced Search`}
        visible={searchModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        centered
      >
	     <div className="sort-dropdown">
      <span>Sort by:</span>
      <select
         value={selectedSort}
         onChange={(e) => setSelectedSort(e.target.value)}
      >
         <option value="">None</option>
         <option value="name">File Name</option>
         <option value="size">File Size</option>
         <option value="time">Time Added</option>
      </select>
   </div>

       {Object.keys(fileTypes).map((fileType) => (
          <div key={fileType}>
            <Checkbox
              checked={fileTypes[fileType]}
              onChange={() => toggleCheck(fileType)}
            >
              {fileType}
            </Checkbox>
          </div>
        ))}
      </Modal>

		</div>
	)
}