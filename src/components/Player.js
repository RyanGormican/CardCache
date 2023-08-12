import React, { useState } from 'react';
import { Modal,Button } from 'antd';
import { Icon } from '@iconify/react';
export default function Player({ mediaURL, autoplay, loop, mediaType, mediaName }) {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);

  const handleCancel = () => {
    setInfoModalVisible(false);
    setRotationDegrees(0); 
  };

  const rotateLeft = () => {
    setRotationDegrees((prevDegrees) => (prevDegrees - 90) % 360);
  };

  const rotateRight = () => {
    setRotationDegrees((prevDegrees) => (prevDegrees + 90) % 360);
  };

  const flipMedia = () => {

  };
  return (
    <div>
      {mediaType === 'video' ? (
        <div>
          <video
            className="media"
            src={mediaURL}
            autoPlay={autoplay}
            loop={loop}
            onClick={() => setInfoModalVisible(true)}
          />
        </div>
      ) : (
        ''
      )}
      {mediaType === 'image' ? (
        <img
          className="image-preview"
          src={mediaURL}
          alt="image"
          onClick={() => setInfoModalVisible(true)}
        />
      ) : (
        ''
      )}

      <Modal
        title={`Viewing ${mediaName}`}
        visible={infoModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        centered
        bodyStyle={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '80vh',
          overflow: 'auto',
        }}
        width="auto"
        footer={[
          <Icon icon='material-symbols:flip' width="30" onClick={flipMedia}/>,
          <Icon icon='mdi:turn-left' width="30" onClick={rotateLeft} />,
          <Icon icon='mdi:turn-right' width="30"onClick={rotateRight} />,
          <Button onClick={handleCancel}> Ok </Button>
        ]}
      >
        {mediaType === 'video' ? (
          <div>
            <video
              className="media-full"
              src={mediaURL}
              autoPlay={autoplay}
              controls
              loop={loop}
              style={{ transform: `rotate(${rotationDegrees}deg)` }}
            />
          </div>
        ) : (
          ''
        )}
        {mediaType === 'image' ? (
          <img
            className="media-full"
            src={mediaURL}
            alt="image"
            onClick={() => setInfoModalVisible(true)}
            style={{ transform: `rotate(${rotationDegrees}deg)` }}
          />
        ) : (
          ''
        )}
      </Modal>
    </div>
  );
}
