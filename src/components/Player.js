import React,  {useState, useEffect} from 'react';
import {Modal, Input, Checkbox} from 'antd';
export default function Player({mediaURL, autoplay, loop,mediaType}) {
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const handleCancel = () => {
    setInfoModalVisible(false);
	}

return (
<div>
	{mediaType === "video" ? (
	<div>
		<video className="media" src={mediaURL} autoPlay={autoplay} controls loop={loop}  onClick={() => setInfoModalVisible(true)}  />
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
		title={`Viewing`}
        visible={infoModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        centered
		footer={null} 
        bodyStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', overflow: 'auto' }}
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