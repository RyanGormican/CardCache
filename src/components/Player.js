import React, { useState } from 'react';
import { Modal,Button } from 'antd';
import { Icon } from '@iconify/react';
export default function Player({ mediaURL, autoplay, loop, mediaType, mediaName, listing }) {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [flipDirectionH, setFlipDirectionH] = useState('none');
  const [flipDirectionV, setFlipDirectionV] = useState('none');
  const handleCancel = () => {
    setInfoModalVisible(false);
    setRotationDegrees(0); 
    setFlipDirectionH('none');
    setFlipDirectionV('none');
  };

  const rotateLeft = () => {
    setRotationDegrees((prevDegrees) => (prevDegrees - 90) % 360);
  };

  const rotateRight = () => {
    setRotationDegrees((prevDegrees) => (prevDegrees + 90) % 360);
  };

  const flipMediaH = () => {
setFlipDirectionH((prevDirection) => (prevDirection === 'horizontal' ? 'none' : 'horizontal'));
  };
    const flipMediaV = () => {
setFlipDirectionV((prevDirection) => (prevDirection === 'vertical' ? 'none' : 'vertical'));
  };
  return (
    <div>
      {mediaType === 'video' && listing === 'grid' ? (
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

          {mediaType === 'video' && listing === 'list' ? (
      <Icon
     icon="mdi:video"
      height="30"
      onClick={() => setInfoModalVisible(true)}
    />
       
      ) : (
        ''
      )}
      {mediaType === 'image' && listing === 'grid'? (
        <img
          className="image-preview"
          src={mediaURL}
          alt="image"
          onClick={() => setInfoModalVisible(true)}
        />
     
      ) : (
        ''
      )}
        {mediaType === 'image' && listing === 'list'? (
    <Icon
      icon="material-symbols:photo"
      height="30"
      onClick={() => setInfoModalVisible(true)}
    />
      ) : (
        ''
      )}
           {mediaType === 'audio' ? (
      <Icon icon="heroicons:musical-note-20-solid"  height={listing ==='list'?"30" : "50"} width={listing ==='list'?"30" : "50"}   onClick={() => setInfoModalVisible(true)}/>
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
        mediaType === 'audio' ? 
        [ <Button onClick={handleCancel}> Ok </Button> ]
        :[
    flipDirectionV === 'vertical' ? (
      <Icon icon="material-symbols:flip" width="30" rotate={1} onClick={flipMediaV} />
    ) : (
      <Icon icon="material-symbols:flip" width="30" rotate={3} onClick={flipMediaV} />
    ),
    flipDirectionH === 'horizontal' ? (
      <Icon icon='material-symbols:flip' width="30" onClick={flipMediaH} />
    ) : (
      <Icon icon='material-symbols:flip' width="30" rotate={2} onClick={flipMediaH} />
    ),
    <Icon icon='mdi:turn-left' width="30" onClick={rotateLeft} />,
    <Icon icon='mdi:turn-right' width="30" onClick={rotateRight} />,
    <Button onClick={handleCancel}> Ok </Button>
    ]

  ]}
>
      >
        {mediaType === 'video' ? (
          <div>
            <video
              className="media-full"
              src={mediaURL}
              autoPlay={autoplay}
              controls
              loop={loop}
              style={{ transform: `rotate(${rotationDegrees}deg) scaleX(${flipDirectionH === 'horizontal' ? -1 : 1}) scaleY(${flipDirectionV === 'vertical' ? -1 : 1})` }}
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
            style={{ transform: `rotate(${rotationDegrees}deg) scaleX(${flipDirectionH === 'horizontal' ? -1 : 1}) scaleY(${flipDirectionV === 'vertical' ? -1 : 1})` }}
          />
        ) : (
          ''
        )}
          {mediaType === 'audio' ? (
          <div>
          <audio
            className="media-full"
            src={mediaURL}
            autoPlay={autoplay}
            controls
            onClick={() => setInfoModalVisible(true)}
            style={{ transform: `rotate(${rotationDegrees}deg) scaleX(${flipDirectionH === 'horizontal' ? -1 : 1}) scaleY(${flipDirectionV === 'vertical' ? -1 : 1})` }}
          />
          </div>
        ) : (
          ''
        )}
      </Modal>
    </div>
  );
}
