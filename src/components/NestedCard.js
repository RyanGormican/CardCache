import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Button, Input } from 'antd';
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
export default function NestedCard() {
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
 {
 const nestedCard = filteredCards[index];

  // ... fetch nested cards based on id and nestingLevel ...



	return (
		<div> 
			<div className= 'return' onClick={goHome} >
			<Icon icon="icon-park-outline:return" height="60"/>
			</div>
			<div className='icon-container'>
				<div class="upload-btn">
					<Icon icon="mdi:file-document-add-outline" height="60" onClick={showModal} />
					<AddCard cards={cards} setCards={setCards} cardId={params?.id}/>
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
	<div className='card-parent'>
 {filteredCards?.map((card, index) => (
  <div key={index} className='grid-child'>
    {hasFileLink(card) ? (
           <div  key={card.id}>
              <h4 onClick={() => navigateToNestedSpace(index, 1)}>{card.cardName}</h4>
            </div>
      
    ) : (
    <div className="media-container">
          {card?.downloadURL !== '' && (
            <React.Fragment>
              {/\.(png|jpg|jpeg|gif|bmp)$/i.test(card.fileName) ?  (
                <Player mediaURL={card.downloadURL} mediaType='image' mediaName={card.fileName} />
              ) : (
                ''
              )}
              {/\.(mp4|webm|ogg)$/i.test(card.fileName) && (
                <Player className="media" mediaURL={card.downloadURL} autoplay={false} loop={false} mediaName={card.fileName} mediaType='video' />
              )}
              {/\.(mp3)$/i.test(card.fileName) && (
                <Player className="media" mediaURL={card.downloadURL} autoplay={false} loop={false} mediaName={card.fileName} mediaType='audio' />
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
