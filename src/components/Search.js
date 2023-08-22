import React, { useState, useEffect } from 'react';
import { Modal, Button, Checkbox } from 'antd';
import { Icon } from '@iconify/react';

export default function Search({ cards, filtering, onFilterChange,type }) {
  const [search, setSearch] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [sortOrder, setSortOrder] = useState('ascending');
  const [fileTypes, setFileTypes] = useState({
    documents: true,
    images: true,
    videos: true,
    audios: true,
    png: true,
    jpg: true,
    jpeg: true,
    gif: true,
    bmp: true,
    pdf: true,
    json: true,
    txt: true,
    mp4: true,
    mp3: true,
  });
  
  const handleCancel = () => {
    setSearchModalVisible(false);
  };

const filterByType = (card) => {
    if (card.sharedWith && card.sharedWith.length > 0) {
      return true; // Include shared cards regardless of file types
    }

    if (card.fileLink) {
      return card.fileLink.some((file) => {
        const extension = file.fileName.split('.').pop();
        return fileTypes[extension];
      });
    }

    const extension = card.fileName.split('.').pop();
    return fileTypes[extension];
  };



  const sortByOption = (option) => {
    const order = sortOrder === 'ascending' ? 1 : -1;
    switch (option) {
      case 'name':
        return (a, b) => a.fileName.localeCompare(b.fileName) * order;
      case 'size':
        return (a, b) => a.fileSize - b.fileSize * order;
      case 'time':
        return (a, b) => a.creationTimestamp - b.creationTimestamp * order;
      case 'user':
        return (a, b) => a.userId.localeCompare(b.userId) * order;
      default:
        return () => 0;
    }
  };

const filteredCards = cards
  .filter((card) => {
    const isSharedCard = card.sharedWith && card.sharedWith.length > 0;

    return (
      (isSharedCard && card.sharedWith.includes(search.toLowerCase())) ||
      (card.fileLink
        ? card.fileLink.some(
            (file) =>
              file.fileName && file.fileName.toLowerCase().includes(search.toLowerCase()) ||
              (file.tags && file.tags.some(tag => tag.text.toLowerCase().includes(search.toLowerCase())))
          ) ||
          (card.cardName && card.cardName.toLowerCase().includes(search.toLowerCase()))||
      (card.tags && card.tags.some(tag => tag.text.toLowerCase().includes(search.toLowerCase())))
        : card.fileName && card.fileName.toLowerCase().includes(search.toLowerCase())) ||
      (card.tags && card.tags.some(tag => tag.text.toLowerCase().includes(search.toLowerCase())))
    );
  })
  .filter((card) => filterByType(card) || (card.sharedWith && card.sharedWith.length > 0))
  .sort(sortByOption(selectedSort));




   
    useEffect(() => {

    // Invoke the callback to notify parent component of filter changes
    onFilterChange(filteredCards);
  }, [filteredCards, onFilterChange]);

  const showSearchModal = () => {
    setSearchModalVisible(true);
  };

  const toggleCheck = (fileType) => {
    if (fileType === 'documents') {
      setFileTypes((prevValues) => ({
        ...prevValues,
        pdf: !prevValues[fileType],
        txt: !prevValues[fileType],
        json: !prevValues[fileType],
        documents: !prevValues[fileType],
      }));
    } else if (fileType === 'images') {
      setFileTypes((prevValues) => ({
        ...prevValues,
        png: !prevValues[fileType],
        jpg: !prevValues[fileType],
        jpeg: !prevValues[fileType],
        gif: !prevValues[fileType],
        bmp: !prevValues[fileType],
        images: !prevValues[fileType],
      }));
    } else if (fileType === 'videos') {
      setFileTypes((prevValues) => ({
        ...prevValues,
        mp4: !prevValues[fileType],
        videos: !prevValues[fileType],
      }));
    } else if (fileType === 'audios') {
      setFileTypes((prevValues) => ({
        ...prevValues,
        mp3: !prevValues[fileType],
        audios: !prevValues[fileType],
      }));
    } else {
      setFileTypes((prevValues) => ({
        ...prevValues,
        [fileType]: !prevValues[fileType],
      }));
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {type ==='drive'? (
        ""
        ) : (
        <Icon icon="mdi:eye-outline" height="30" onClick={showSearchModal} />
        )}
      </div>
      <Modal
        title={`Advanced Search`}
        visible={searchModalVisible}
        centered
        footer={[
          <Button onClick={handleCancel} key="ok">
            Ok
          </Button>,
        ]}
      >
        <div className="sort-dropdown">
          <span>Sort by:</span>
          <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}>
            <option value="">None</option>
            <option value="name">File Name</option>
            <option value="size">File Size</option>
            <option value="time">Time Added</option>
            <option value="user">Owner</option>
          </select>
          {sortOrder === 'ascending' ? (
            <Icon icon="bxs:up-arrow" onClick={() => setSortOrder('descending')} />
          ) : (
            <Icon icon="bxs:down-arrow" onClick={() => setSortOrder('ascending')} />
          )}
        </div>
        <div className="checkbox-container">
          <Checkbox checked={fileTypes['documents']} onChange={(e) => toggleCheck('documents')}>
            Documents
          </Checkbox>
          <Checkbox checked={fileTypes['images']} onChange={(e) => toggleCheck('images')}>
            Images
          </Checkbox>
          <Checkbox checked={fileTypes['videos']} onChange={(e) => toggleCheck('videos')}>
            Videos
          </Checkbox>
          <Checkbox checked={fileTypes['audios']} onChange={(e) => toggleCheck('audios')}>
            Audios
          </Checkbox>
        </div>
        <div className="checkbox-container">
          {Object.keys(fileTypes)
            .filter((fileType) => !['documents', 'images', 'videos', 'audios'].includes(fileType))
            .map((fileType) => (
              <Checkbox
                key={fileType}
                checked={fileTypes[fileType]}
                onChange={() => toggleCheck(fileType)}
              >
                {fileType}
              </Checkbox>
            ))}
        </div>
      </Modal>
    </div>
  );
}
