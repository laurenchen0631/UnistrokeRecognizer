import React from 'react';
import ReactDOM from 'react-dom';
import DollarRecognizer from './dollar.js';


const styles = {
	canvas: {
		width: 600,
		height: 600,
		backgroundColor: '#f9f9f9',
		display: 'block'
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

	componentWillReceiveProps(nextProps) {
		if (nextProps.samples !== this.props.samples) {
			Recognizer.ChangeSampleRate(nextProps.samples);
		}
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

	handleMouseUp() {
		if (this.state.points.length > 0) {
			this.props.onRecognize(
				Recognizer.Recognize(
					this.state.points,
					this.props.samples ,
					this.props.useProtractor
				)
			);
		}
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
		if (this.state.isMoving) {
			this.handleMouseUp();
		}
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
				onMouseLeave={this.handleMouseOut.bind(this)}
			/>
		);
	}
}

class UnistrokeRecognizer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			result: null,
			samples: 64,
			useProtractor: false,
		};
	}

	onChangeAlgorithm(e) {
		this.setState({
			useProtractor: e.target.checked,
		});
	}

	onChangeSamples(e) {
		this.setState({
			samples: Number(e.target.value)
		});
	}

	handleResult(result) {
		this.setState({
			result
		});
	}

	render() {

		const result =
			this.state.result &&
			<div>RESULT: {this.state.result.Name} ({this.state.result.Score})</div>;

		return (
			<div>
				<input
					onChange={this.onChangeAlgorithm.bind(this)}
					type="checkbox"
					ref="checkbox"
				/> Use Protractor
				<br/>

				<span>The number of samples </span>
				<select
					defaultValue={this.state.samples}
					onChange={this.onChangeSamples.bind(this)}
				>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="8">8</option>
					<option value="16">16</option>
					<option value="32">32</option>
					<option value="64">64</option>
				</select>

				<RecognizerCanvas
					useProtractor={this.state.useProtractor}
					onRecognize={this.handleResult.bind(this)}
					samples={this.state.samples}
				/>
				{result}
			</div>
		);
	}
}

ReactDOM.render(
	<UnistrokeRecognizer />,
	document.getElementById('mount')
);
