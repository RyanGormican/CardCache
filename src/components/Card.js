import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Button, Input, Tag } from 'antd';
import {Icon } from '@iconify/react';
import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Player from './Player';
import Search from './Search';
import AddCard from './AddCard';
import { database, storage } from '../firebaseConfig';
export default function Card() {
  const params = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const databaseRef = doc(database, 'cardData', params?.id);

  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [cardName, setCardName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState('');
  const [fileToView, setFileToView] = useState(null);
  const [comment, setComment] = useState('');
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [view,setView] = useState('grid');
  const [tag, setTag]= useState('');
  const handleFilterChange = (filteredCards) => {
    setFilteredCards(filteredCards);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    setSelectedFile(files[0]);
    getFile();
  };

  const openCommentsModal = (file) => {
    setFileToView(file);
    setCommentsModalVisible(true);
  };

  const addComment = () => {
    if (comment.trim() === '') {
      return;
    }

    const updatedFileToView = {
      ...fileToView,
      comments: [
        ...(fileToView.comments || []),
        {
          text: comment,
          userId: auth.currentUser.uid,
          creationTimestamp: Date.now(),
        },
      ],
    };


    const updatedCards = cards.map((card) =>
      card.fileName === fileToView.fileName ? updatedFileToView : card
    );

    updateCards(updatedCards);

    setComment('');
  };

    const addTag = () => {
    if (tag.trim() === '') {
      return;
    }

    const updatedFileToView = {
      ...fileToView,
      tags: [
        ...(fileToView.tags || []),
        {
          text: tag,
          userId: auth.currentUser.uid,
          creationTimestamp: Date.now(),
        },
      ],
    };
    
    const updatedCards = cards.map((card) =>
      card.fileName === fileToView.fileName ? updatedFileToView : card
    );

    updateCards(updatedCards);

    setTag('');
    };

  const deleteFile = (fileName) => {
    const updatedCards = cards.filter((card) => card.fileName !== fileName);
    updateCards(updatedCards);
  };
  const hasFileLink = (card) => {
  return card.fileLink && card.fileLink.length > 0;
};

  const showDeleteModal = (fileName) => {
    setFileToDelete(fileName);
    setDeleteModalVisible(true);
  };

  const showInfoModal = (file) => {
    setInfoModalVisible(true);
    setFileToView(file);
  };

  const hideDeleteModal = () => {
    setFileToDelete('');
    setDeleteModalVisible(false);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      deleteFile(fileToDelete);
      hideDeleteModal();
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setInfoModalVisible(false);
    setCommentsModalVisible(false);
    setComment('');
  };

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const readData = () => {
  onSnapshot(databaseRef, (snapshot) => {
    const data = snapshot.data();
    if (data) {
      setCards(data.fileLink);
      setCardName(data.cardName);
    }
  });
};
  const getFile = async () => {
    if (!selectedFile) {
      return;
    }

    const fileRef = ref(storage, selectedFile.name);
    const uploadTask = uploadBytesResumable(fileRef, selectedFile);

    try {
      await uploadTask;
      const downloadURL = await getDownloadURL(fileRef);

      const user = auth.currentUser;

      const newFile = {
        downloadURL: downloadURL,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        creationTimestamp: Date.now(),
        userId: user.uid,
      };

      const updatedCards = [...cards, newFile];

      updateCards(updatedCards);

      setIsModalVisible(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const updateCards = (updatedCards) => {
    updateDoc(databaseRef, {
      fileLink: updatedCards,
    });
  };

  const openFile = (downloadURL) => {
    window.open(downloadURL, '_blank');
  };

  const goHome = () => {
    navigate('/drive');
  };
 const openCard = (id, index) => {
    navigateToNestedSpace(id, index);
  };

  const navigateToNestedSpace = (id, index) => {
    // Construct the URL with id and index
    navigate(`/card/${id}/${index}`);
  };



 	useEffect(() => {
		readData();
	}, [])



	return (
		<div> 
			<div className= 'return' onClick={goHome} >
			<Icon icon="icon-park-outline:return" height="60"/>
			</div>
			<div className='icon-container'>
				<div class="upload-btn">
					<Icon icon="mdi:file-document-add-outline" height="60" onClick={showModal} />
				</div> 
			</div> 
			<div className='title'>
			<h1>CardCache </h1>
			</div>
			<div className='folder-title'>
			<h1>{cardName} </h1>
			</div>
			<div className='search-title'>
			<Search cards={cards} filtering={filteredCards}  onFilterChange={handleFilterChange}  />
			</div>
              <span className="view-icons">
         <div  onClick={() => setView('list')}>
      <Icon icon="material-symbols:list" width="60"   />
      </div>
       <div  onClick={() => setView('grid')}>
      <Icon icon="mdi:grid" width="60" />
      </div>
      </span>

    {view === 'grid' ? (
	<div className='card-parent'>
 {filteredCards?.map((card, index) => (
  <div key={index} className='grid-child'>
    {hasFileLink(card) ? (
           <div  key={card.id}>
              <h4 onClick={() => openCard(params.id, index)}>{card.cardName}</h4>
            </div>
      
    ) : (
    <div className="media-container">
          {card?.downloadURL !== '' && (
            <React.Fragment>
              {/\.(png|jpg|jpeg|gif|bmp)$/i.test(card.fileName) ?  (
                <Player mediaURL={card.downloadURL} mediaType='image' mediaName={card.fileName} listing='grid' />
              ) : (
                ''
              )}
              {/\.(mp4|webm|ogg)$/i.test(card.fileName) && (
                <Player className="media" mediaURL={card.downloadURL} autoplay={false} loop={false} mediaName={card.fileName} mediaType='video' listing='grid'/>
              )}
              {/\.(mp3)$/i.test(card.fileName) && (
                <Player className="media" mediaURL={card.downloadURL} autoplay={false} loop={false} mediaName={card.fileName} mediaType='audio' listing='grid'/>
              )}
            </React.Fragment>
          )}
          <div className="file-details">
            <h5 onClick={() => openFile(card.downloadURL)}>
              {card.fileName}
            </h5>
            <div className="file-icons">
              <Icon
                icon="mdi:information"
                height='30'
                onClick={() => showInfoModal(card)}
              />
              <Icon
                icon='ic:outline-comment'
                height='30'
                onClick={() => openCommentsModal(card)}
              />
              <Icon
                icon='jam:trash'
                height='30'
                onClick={() => showDeleteModal(card.fileName)}
              />
            </div>
          </div>
        </div>
    )}
  </div>
))}

</div>
) : (
	<div className='list-parent'>
    {filteredCards?.map((card, index) => (
  <div key={index} className='list-child'>
    {hasFileLink(card) ? (
           <div  key={card.id}>
              <h4 onClick={() => openCard(params.id, index)}>{card.cardName}</h4>
            </div>
      
    ) : (
    <div>
          <div className="list-details">
            <div className="list-icons">
               <h5 onClick={() => openFile(card.downloadURL)}>
              {card.fileName}
            </h5>
             {card?.downloadURL !== '' && (
            <React.Fragment>
              {/\.(png|jpg|jpeg|gif|bmp)$/i.test(card.fileName) ?  (
                <Player mediaURL={card.downloadURL} mediaType='image' mediaName={card.fileName} listing='list' />
              ) : (
                ''
              )}
              {/\.(mp4|webm|ogg)$/i.test(card.fileName) && (
                <Player className="media" mediaURL={card.downloadURL} autoplay={false} loop={false} mediaName={card.fileName} mediaType='video' listing='list'/>
              )}
              {/\.(mp3)$/i.test(card.fileName) && (
                <Player className="media" mediaURL={card.downloadURL} autoplay={false} loop={false} mediaName={card.fileName} mediaType='audio' listing='list' />
              )}
            </React.Fragment>
          )}
              <Icon
                icon="mdi:information"
                height='30'
                onClick={() => showInfoModal(card)}
              />
              <Icon
                icon='ic:outline-comment'
                height='30'
                onClick={() => openCommentsModal(card)}
              />
              <Icon
                icon='jam:trash'
                height='30'
                onClick={() => showDeleteModal(card.fileName)}
              />

            </div>
          </div>
        </div>
    )}
  </div>
))}
</div>
)}


			<Modal 
			title="Add a file" 
			open={isModalVisible} 
			onOk={getFile}
			onCancel = {handleCancel} 
			centered
			>
			<div className="file-drop" onDrop={handleDrop} onDragOver={handleDragOver}>
    <p>Drag and drop files here or click 'Choose file' to add</p>
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
		title={`Information`}
        visible={infoModalVisible}
        centered
		footer={[
			<Button onClick={handleCancel}> Ok </Button>
		]}
      >
		<div>
         {fileToView ? (
         <>
         <div>
		Name: {fileToView.fileName}
		</div>
		<div>
		Time Added: {new Date(fileToView.creationTimestamp).toLocaleString()}
		</div>
		<div>
		Size: {fileToView.fileSize} bytes
		</div>
		<div>
		Owner: {fileToView.userId}
		</div>
         <Input.TextArea
      placeholder="Add a tag"
      value={tag}
      onChange={(e) => setTag(e.target.value)}
    />
	<Icon icon="mdi:tag-add" width="50"  onClick={addTag}/>
        <div>
        {fileToView?.tags?.map((tag, index) => (
      <Tag key={index}>{tag.text}</Tag>
  ))}
        </div>
        </>
        ) : ( 
        <p> No File Information Available. </p>
        )}
        </div>
	  </Modal>

	   <Modal
		title={`Comments for: ${fileToView?.fileName}`}
        visible={commentsModalVisible}
        centered
		footer={[
			<Button onClick={handleCancel}> Ok </Button>
		]}
      >
	   <div className="search-title">
    <Input.TextArea
      placeholder="Add a comment..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />
	<Icon icon="uil:comment-add" width="50"  onClick={addComment}/>
  
  </div>
	 {fileToView?.comments?.map((comment, index) => (
    <div key={index} className="comment">
      <p>{comment.text}</p>
	<div className= "comment-id">
    <Icon icon="material-symbols:person" width="20" /> {comment.userId}
	</div>
    </div>
  ))}
	  </Modal>
		</div>
	)
}