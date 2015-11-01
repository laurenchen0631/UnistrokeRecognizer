import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DollarRecognizer from './dollar.js';


const styles = {
	canvas: {
		width: 600,
		height: 600,
		backgroundColor: '#f9f9f9',
		// borderStyle: 'double',
	},
};

class Point {
	constructor(x, y) {
		this.X = x;
		this.Y = y;
	}
}

const Recognizer = new DollarRecognizer();
class RecognizerCanvas extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isMoving: false,
			points: [],
		};
	}

	handleMouseDown(e) {
		const canvas = ReactDOM.findDOMNode(this);
		const rect = canvas.getBoundingClientRect();
		this.setState({
			isMoving: true,
			prePoint: new Point(e.clientX - rect.left, e.clientY - rect.top),
			points: [new Point(e.clientX - rect.left, e.clientY - rect.top)],
		});
	}

	handleMouseUp(e) {
		const result = Recognizer.Recognize(this.state.points, false);
		console.log(result);
		// console.log();
		this.setState({
			isMoving: false,
			points: [],
		});

		//clean canvas
		const canvas = ReactDOM.findDOMNode(this);
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	handleMouseMove(e) {
		if (this.state.isMoving) {
			const canvas = ReactDOM.findDOMNode(this);
			const ctx = canvas.getContext('2d');
			const rect = canvas.getBoundingClientRect();

			ctx.beginPath();
				ctx.moveTo(this.state.prePoint.X, this.state.prePoint.Y);
				ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
				ctx.stroke();
			ctx.closePath();
			ctx.fillRect(e.clientX - rect.left - 2, e.clientY - rect.top - 2 , 4, 4);

			this.setState({
				prePoint: new Point(e.clientX - rect.left, e.clientY - rect.top),
				points: this.state.points.concat(
					new Point(e.clientX - rect.left, e.clientY - rect.top)
				),
			});
		}
	}

	handleMouseOut() {

	}

	render() {
		return (
			<canvas
				width={600}
				height={600}
				style={styles.canvas}
				onMouseDown={this.handleMouseDown.bind(this)}
				onMouseMove={this.handleMouseMove.bind(this)}
				onMouseUp={this.handleMouseUp.bind(this)}
			/>
		);
	}
}

class UnistrokeRecognizer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<RecognizerCanvas />
			</div>
		);
	}
}

ReactDOM.render(
	<UnistrokeRecognizer />,
	document.getElementById('mount')
);
