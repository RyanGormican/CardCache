import React,  {useState, useEffect} from 'react';

export default function Player({mediaURL, autoplay, loop,mediaType}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
return (
<div>
	{mediaType === "video" ? (
	<div>
		<video className="media" src={mediaURL} autoPlay={autoplay} controls loop={loop} />
	</div>
	) : (
		""
	)}
	{mediaType === "image" ? (
	 <img
            className='image-preview'
            src={mediaURL}
            alt='image'
          />
	) : (
		""
	)}
</div>

 <Modal
		title={`Viewing`}
        visible={infoModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        centered
      >
	  </Modal>
);

};