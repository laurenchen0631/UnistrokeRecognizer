import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DollarRecognizer from './dollar.js';

class UnistrokeRecognizer extends React.Component {
	render() {
		return (
			<div>Test</div>
		);
	}
}

ReactDOM.render(
	<UnistrokeRecognizer />,
	document.getElementById('mount')
);
