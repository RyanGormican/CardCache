import React, { useState } from 'react';
import { Modal, Input, Icon } from 'antd';

export default function UploadModal({ onUpload }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cardName, setCardName] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const cardUpload = () => {
    onUpload(cardName);
    setIsModalVisible(false);
  };

  return (
    <div>
      <div className='icon-container'>
        <div className="upload-btn">
          <Icon icon="mdi:file-document-add-outline" height="60" />
          <input type="file" name="myfile" />
        </div>
        <Icon icon="material-symbols:folder" height="60" onClick={showModal} />
      </div>
      <Modal
        title="Upload"
        visible={isModalVisible}
        onOk={cardUpload}
        onCancel={handleCancel}
        centered
      >
        <Input
          placeholder="Enter the Name..."
          onChange={(event) => setCardName(event.target.value)}
          value={cardName}
        />
      </Modal>
    </div>
  );
}
