import React,  {useState, useEffect} from 'react';
import {Modal, Input, Checkbox} from 'antd';
export default function Player({mediaURL, autoplay, loop,mediaType, mediaName}) {
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const handleCancel = () => {
    setInfoModalVisible(false);
	}

return (
<div>
	{mediaType === "video" ? (
	<div>
		<video className="media" src={mediaURL} autoPlay={autoplay}  loop={loop}  onClick={() => setInfoModalVisible(true)}  />
	</div>
	) : (
		""
	)}
	{mediaType === "image" ? (
	 <img
            className='image-preview'
            src={mediaURL}
            alt='image'
			onClick={() => setInfoModalVisible(true)} 
          />
	) : (
		""
	)}

	 <Modal
		title={`Viewing ${mediaName}`}
        visible={infoModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        centered
        bodyStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDireaction:'column', minHeight: '80vh', overflow: 'auto' }}
		width='auto'
      >

	  	{mediaType === "video" ? (
	<div>
		<video className="media-full" src={mediaURL} autoPlay={autoplay} controls loop={loop}  onClick={() => setInfoModalVisible(true)}  />
	</div>
	) : (
		""
	)}
	{mediaType === "image" ? (
	 <img
            className='media-full'
            src={mediaURL}
            alt='image'
			onClick={() => setInfoModalVisible(true)} 
          />
	) : (
		""
	)}
	  </Modal>
</div>


);

};