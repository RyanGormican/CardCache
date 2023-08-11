import React from 'react';

export default function Player({mediaURL, autoplay, loop}) {

return (
	<div>
		<video className="media" src={mediaURL} autoPlay={autoplay} controls loop={loop} />
	</div>
);

};