import React,  {useState, useEffect} from 'react';

export default function Player({mediaURL, autoplay, loop,mediaType}) {
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const handleCancel = () => {
    setInfoModalVisible(false);
	}
return (
<div>
	{mediaType === "video" ? (
	<div>
		<video className="media" src={mediaURL} autoPlay={autoplay} controls loop={loop}  onClick={setInfoModalVisible} />
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