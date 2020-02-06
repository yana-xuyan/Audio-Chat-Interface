import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactMic } from 'react-mic';
import logo from './sheep.png';
import toy from './toy.png';
import kid from './kid.png';
import song from './song.mp3';
import './App.css';

import { MuiThemeProvider } from 'material-ui/styles';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MicrophoneOn from 'material-ui/svg-icons/av/mic';
import MicrophoneOff from 'material-ui/svg-icons/av/stop';
import ApiPlay from 'material-ui/svg-icons/av/play-arrow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import teal from '@material-ui/core/colors/teal';
import brown from '@material-ui/core/colors/brown';
import amber from '@material-ui/core/colors/amber';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

import {
	Avatar,
	TitleBar,
	MessageList,
	Message,
	MessageText,
	AgentBar,
	Title,
	Subtitle,
	MessageGroup,
	Row,
	Fill,
	Fit,
	IconButton,
	Column,
	Bubble,
	ThemeProvider,
} from '@livechat/ui-kit'
import {  } from '@livechat/ui-kit'

import ReactGA from 'react-ga';


var commons = require('../util/commons')
var api_key = commons.api_key
var request = require("request");
var emo_data = [];
var senti_data = [];
var arousal_data = [];
var message_array = new Array();
var audio = document.getElementById("songPlay");
var toy_audio = document.getElementById("toySound");

ReactGA.initialize('UA-98862819-1');

const styles = theme => ({
	container: {
	  display: 'flex',
	  flexWrap: 'wrap',
	},
	margin: {
	  margin: theme.spacing.unit,
	},
	cssRoot1: {
	  color: theme.palette.getContrastText(teal[400]),
	  backgroundColor: teal[400],
	  '&:hover': {
		backgroundColor: teal[600],
	  },
	},
	cssRoot2: {
		color: theme.palette.getContrastText(brown[200]),
		backgroundColor: "#ccc5af",
		'&:hover': {
		  backgroundColor: brown[300],
		},
	  },
	paper: {
		margin: theme.spacing.unit,
		color: theme.palette.getContrastText(amber[50]),
		backgroundColor: amber[50],
		// width: 1150,
	},
	chip: {
		margin: theme.spacing.unit,
		color: theme.palette.getContrastText(teal[400]),
		backgroundColor: teal[400],
	},
  });
  

class EmotionBarChart extends Component {
	constructor(props) {
		super(props);
		emo_data = [
		{ label: 'Emotion', 
			anger: this.props.anger,
			anxiety: this.props.anxiety,
			happiness: this.props.happiness,
			sadness: this.props.sadness,
			fear: this.props.fear,
			neutral: this.props.neutral,}
		];
	}

	render() {
		return (
			<ResponsiveContainer width='100%'>
			<BarChart layout="vertical" height={180} data={emo_data}
				barSize={23}
				margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
				<XAxis type="number" hide domain={[0, 1]}/>
  				<YAxis type="category" dataKey="label" hide/>
				{/* <Legend layout="vertical" verticalAlign="middle" align="left"/> */}
				<Tooltip />
				<Bar dataKey="anger" fill={commons.anger} background={{ fill: '#dbe0e6' }}/>
				<Bar dataKey="fear" fill={commons.fear} background={{ fill: '#dbe0e6' }}/>
				<Bar dataKey="happiness" fill={commons.happy} background={{ fill: '#dbe0e6' }}/>
				<Bar dataKey="sadness" fill={commons.sad} background={{ fill: '#dbe0e6' }}/>
				<Bar dataKey="anxiety" fill={commons.anxiety} background={{ fill: '#dbe0e6' }}/>
				<Bar dataKey="neutral" fill={commons.neu_emo} background={{ fill: '#dbe0e6' }}/>
			</BarChart>
			</ResponsiveContainer>
		);
	}
}

class SentimentBarChart extends Component {
	constructor(props) {
		super(props);
		senti_data = [
		{ label: 'Sentiment', 
		value: this.props.value}
		];
	}

	render() {
		console.log("sentiment value")
		console.log(senti_data)
		return (
			<ResponsiveContainer width='100%'>
			<BarChart layout="vertical" height={40} data={senti_data}
				barSize={23}
				margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
				<XAxis type="number" hide domain={[0, 1]}/>
  				<YAxis type="category" dataKey="label" hide/>
				{/* <Legend layout="vertical" verticalAlign="middle" align="left"/> */}
				<Tooltip />
				{this.props.level === "negative" && <Bar dataKey="value" fill={commons.negative} background={{ fill: '#dbe0e6' }}/> }
				{this.props.level === "slightly negative" && <Bar dataKey="value" fill={commons.sNegative} background={{ fill: '#dbe0e6' }}/> }
				{this.props.level === "neutral" && <Bar dataKey="value" fill={commons.neutral} background={{ fill: '#dbe0e6' }}/> }
				{this.props.level === "slightly positive" && <Bar dataKey="value" fill={commons.sPositive} background={{ fill: '#dbe0e6' }}/> }
				{this.props.level === "positive" && <Bar dataKey="value" fill={commons.positive} background={{ fill: '#dbe0e6' }}/> }
			</BarChart>
			</ResponsiveContainer>
		);
	}
}

class ArousalBarChart extends Component {
	constructor(props) {
		super(props);
		arousal_data = [
		{ label: 'Arousal', 
		value: this.props.value }
		];
	}

	render() {
		console.log("arousal value")
		console.log(arousal_data)
		return (
			<ResponsiveContainer width='100%'>
			<BarChart layout="vertical" height={40} data={arousal_data}
				barSize={23}
				margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
				<XAxis type="number" hide domain={[0, 1]}/>
  				<YAxis type="category" dataKey="label" hide/>
				{/* <Legend layout="vertical" verticalAlign="middle" align="left"/> */}
				<Tooltip />
				{this.props.label === "high" && <Bar dataKey="value" fill={commons.high} background={{ fill: '#dbe0e6' }}/> }
				{this.props.label === "moderate" && <Bar dataKey="value" fill={commons.neutral} background={{ fill: '#dbe0e6' }}/> }
				{this.props.label === "low" && <Bar dataKey="value" fill={commons.low} background={{ fill: '#dbe0e6' }}/> }
			</BarChart>
			</ResponsiveContainer>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blobObject: null,
			record: false,
			isRecording: false,
			audioPlay: null,
			song: null,
			uid: 0,
			messageKid: "",
			messageToy: "",
			sentiment: 0.6,
			level:"slightly positive",
			arousal_score: 0.3,
			arousal_label: "low",
			anger: 0.2,
			anxiety: 0.1,
			happiness: 0.9,
			sadness: 0.1,
			fear: 0.4,
			neutral: 0.3,
			time: 0, 
			isOn: false, 
			end: false, 
			status: 'press START button'
		}
	}

	componentDidMount() {
		ReactGA.pageview(window.location.pathname);
	}

	componentWillUnmount() {
	}

	renderEmotionBarChart(a,b,c,d,e,f) {
		return <EmotionBarChart 
		anger={a}
		anxiety={b}
		happiness={c}
		sadness={d}
		fear={e}
		neutral={f} />;
	}

	renderSentimentBarChart(i,j) {
		return <SentimentBarChart value={i} level={j}/>;
	}

	renderArousalBarChart(i,j) {
		return <ArousalBarChart value={i} label={j}/>;
	}

	// start state trigger
	start_api() {
		// Setting URL and headers for request
		var options = {
			method: 'POST',
			url: 'https://xxx',
			headers: {}
		};
		// Return new promise 
		return new Promise(function (resolve, reject) {
			// Do async job
			request(options, function (error, response, body) {
				if (error) {
					console.log("start api error")
					console.log(error)
					reject(error);
				} else {
					console.log("> start api() success")
					console.log(body)
					resolve(body);
				}
			});
		})
	}

	// get asr result
	asr_api(audio) {
		// Setting URL and headers for request
		var options = {
		method: 'POST',
		url: 'https://xxx',
		headers: {},
		form: {audio: audio }
		};
		// Return new promise 
		return new Promise(function (resolve, reject) {

		// Do async job
		request(options, function (error, response, body) {
			if (error) {
			reject(error);
			} else {
			resolve(body);
			}
		});
		})
	}
	
	// match intent
	intent_api(body_data) {
		// Setting URL and headers for request
		var options = {
		method: 'POST',
		url: 'https://xxx',
		headers: {},
		form: { kid_text: body_data }
		};
		// Return new promise 
		return new Promise(function (resolve, reject) {

		// Do async job
		request(options, function (error, response, body) {
			if (error) {
			reject(error);
			} else {
			resolve(body);
			}
		});
		})
	}

	updateMessageToy = (msg) => {
		var newMessage = {
			'uid': 1,
			'content': msg,
		};

		console.log("> toy update")
		this.setState({
			messageToy: msg,
			status: 'Response is received. Press RECORD to talk.',
		})
		this.updateMessages(newMessage)
	}

	updateMessageKid = (msg) => {
		var newMessage = {
			'uid': 0,
			'content': msg,
		};
		console.log("> kid update")
		this.setState({
			messageKid: msg,
			status: 'Waiting for response.',
		})
		this.updateMessages(newMessage)
	}

	updateMessages = (newMessage) => {
		console.log("> messages update")
		message_array.push(newMessage)
		this.setState({
			messages: message_array,
		})
		// console.log(message_array)
		console.log(this.state.messages)
		// for(let [ index, message ] of message_array.entries()){
		// 	console.log("> print message after updating")
		// 	console.log(message.content)
		// }
	}

	updateAudio = (url) => {
		this.setState({
			audioPlay: url,
		})
	}

	updateSentiment = (senti) => {
		if(senti<0.2){
			this.setState({
				level: "negative",
			})
		}else if(senti>=0.2&&senti<0.45){
			this.setState({
				level: "slightly negative",
			})
		}else if(senti>=0.45&&senti<0.55){
			this.setState({
				level: "neutral",
			})
		}else if(senti>=0.55&&senti<0.8){
			this.setState({
				level: "slightly positive",
			})
		}else{
			this.setState({
				level: "positive",
			})
		}
		senti_data = [
			{ label: 'Sentiment', 
			value: senti}
		  ];
		this.setState({
			sentiment: senti,
		})
	}

	updateEmotion = (emotion) => {
		console.log("> emotion")
		// console.log(emotion)
		emo_data = [
			{ label: 'Emotion', 
			anger: emotion["anger"],
			anxiety: emotion["anxiety"],
			happiness: emotion["happiness"],
			sadness: emotion["sadness"],
			fear: emotion["fear"],
			neutral: emotion["neutral"],}
		  ];
		this.setState({
			anger: emotion["anger"],
			anxiety: emotion["anxiety"],
			happiness: emotion["happiness"],
			sadness: emotion["sadness"],
			fear: emotion["fear"],
			neutral: emotion["neutral"],
		})
	}

	updateArousalLabel = (label) => {
		console.log("> arousal label")
		console.log(label)
		this.setState({
			arousal_label: label,
		})
	}

	updateArousalScore = (score) => {
		console.log("> arousal score")
		console.log(score)
		arousal_data = [
			{ label: 'Arousal', 
			value: score }
		];
		this.setState({
			arousal_score: score,
		})
	}

	startRecording = () => {
		this.setState({
			isRecording: true
		});
		this.handleTimer(false,0);
	}

	stopRecording = () => {
		this.setState({
			isRecording: false
		});
	}

	startTalking = () => {
		console.log("start talking");
		message_array = [];
		this.setState({
			messages: [],
			audioPlay: null,
			song: null,
			sentiment: 0.5,
			level:"neutral",
			arousal_score: 0.5,
			arousal_label: "moderate",
			anger: 0,
			anxiety: 0,
			happiness: 0,
			sadness: 0,
			fear: 0,
			neutral: 0,
			time: 0, 
			isOn: false, 
			end: false, 
			status: 'Waiting for question.',
		});
		senti_data = [
			{ label: 'Sentiment', 
			value: 0.5}
		  ];
		emo_data = [
			{ label: 'Emotion', 
			  anger: 0,
			  anxiety: 0,
			  happiness: 0,
			  sadness: 0,
			  fear: 0,
				neutral:0,}
		  ];
		arousal_data = [
			{ label: 'Arousal', 
			value: 0.5}
		  ];
		var self = this;
		var start = this.start_api();
		this.handleTimer(false, 0);
		toy_audio = document.getElementById("toySound");
		toy_audio.pause();
		start.then(function (body) {
			var body_json = JSON.parse(body);
			var response = body_json["response"];
			var audio_url = body_json["audio_url"];
			console.log(audio_url);
			self.updateAudio(audio_url);
			self.updateMessageToy(response);
		})
	}

	handleTimer = (letOn,times) => {
        if (!letOn) {
			clearInterval(this.timer);
			this.setState({
				time:0
			});
        } else {
			// if the timer is already exist, clear it first
			if (this.state.isOn) {
				clearInterval(this.timer);
			}
			//timer
			var self = this;
            this.timer = setInterval(() => {
				// call intent_api
				if(times<2){
					var request_intent = this.intent_api("重问问题");
					request_intent.then(function (body){
					console.log("get data from intent-api and here is the body")
					console.log(body);
					var intent_json = JSON.parse(body);
					var response = intent_json["response_text"];
					var question = intent_json["question_text"];
					var url = intent_json["audio_url"];
					times = intent_json["fallback"];
					self.updateAudio(url);
					self.updateMessageToy(response+question);
					});
					this.setState({
						time: times+1 ,// need to be settled later
						status: 'System falls into fallback.'
					})
				}
            }, 45000) // 1000<=>1s
        }
        //change 'isOn' state
        this.setState({isOn: letOn})
	}
	
	songPlay = () => {
		// if the timer is already exist, clear it first
		if (this.state.isOn) {
			clearInterval(this.timer);
		}
		this.timer = setInterval(() => {
			this.setState({
				song: song,
				status: 'A happy song is going to be played! You can press END button to disable the song.',
				isOn: true,
			})
		}, 20000) // 1000<=>1s
	}

	setEnd = () => {
		clearInterval(this.timer);
		this.setState({
			end: true,
			isOn: false,
		})
	}

	endSong = () => {
		clearInterval(this.timer);
		audio = document.getElementById("songPlay");
		audio.pause();
		this.setState({
			audioPlay: null,
			song: null, 
			isOn: false,
		})
	}

	onSave = (blobObject) => {
		var self = this;
		fetch(blobObject.blobURL).then(res => res.blob())
		.then(blob => { //get blob
			var toBuffer = require('blob-to-buffer')
			toBuffer(blob, function (err, buffer) {
				var audio = buffer.toString("base64")
				// console.log(audio)
				var request_asr = self.asr_api(audio);
				request_asr.then(function (body) {
					console.log("get data from asr-api and here is the body")
					console.log(body);
					var asr_json = JSON.parse(body);
					var kid_text = asr_json["kid_text"];
					var emotion = asr_json["emotion"];
					var arousal_label = asr_json["arousal_label"]
					if (arousal_label == "neutral"){
						arousal_label = "moderate"
					}
					var arousal_score = asr_json["arousal_score"]
					self.updateMessageKid(kid_text);
					self.updateArousalLabel(arousal_label);
					self.updateArousalScore(arousal_score);

					// call intent_api
					var request_intent = self.intent_api(kid_text);
					request_intent.then(function (body){
					console.log("get data from intent-api and here is the body")
					console.log(body);
					var intent_json = JSON.parse(body);
					var response = intent_json["response_text"];
					var question = intent_json["question_text"];
					var url = intent_json["audio_url"];
					var senti = intent_json["sentiment"];
					var times = intent_json["fallback"];
					var end = intent_json["end"];
					self.updateAudio(url);
					self.updateMessageToy(response+question);
					self.updateEmotion(emotion);
					self.updateSentiment(senti);
					if(end){
						self.setEnd();
						self.songPlay();
					}else {
						self.handleTimer(true,times);
					}
					});

				});
			});
		});
	}

	onStart = () => {
		console.log('You can tap into the onStart callback');
	}

	onStop = (blobObject) => {
		this.setState({
			blobURL: blobObject.blobURL,
			status: 'Stop recording and send the audio to API',
		});
	}

	onData(recordedBlob) {
		// silent
		// console.log('chunk of real-time data is: ', recordedBlob);
	}

	render() {
		const { isRecording } = this.state;
		const { classes } = this.props;
		const messageElement = []

		const ButtonLeftStyle = {
			marginTop: "5px",
			marginBottom: "5px"
		}

		const ButtonRightStyle = {
			marginLeft: "25px",
			marginTop: "5px",
			marginBottom: "5px"
		}

		const InfoChip = {
			marginLeft: "25px",
		}


		const LogoStyle = {
			height: "100px"
		};

		const AvatarStyle = {
			height: "30px",
		};

		const themeMessage = {
			vars: {
				'primary-color': '#427fe1',
				'secondary-color': '#fbfbfb',
				'tertiary-color': '#fff',
				'avatar-border-color': 'blue',
			},
			Avatar: {
				css: {},
				size: '40px'
			},
			Message: {
				css: {},
				authorName: {
					css: {
						fontSize:'16px',
					},
				},
			},
		}
		
		for(let [ index, message ] of message_array.entries()) {
            
            if(message.uid === this.state.uid) {
                messageElement.push(
                    <MessageGroup onlyFirstWithMeta>
                        <Message isOwn={true} authorName="User">
                            <MessageText className='Speech-bubble-kid'>
                                {message.content}
                            </MessageText>	
                        </Message>
                    </MessageGroup>
                )
            }else {
                messageElement.push(
                    <MessageGroup avatar={toy} onlyFirstWithMeta>
                        <Message authorName="Sheep">
                            <MessageText className='Speech-bubble-toy'>
                                {message.content}
                            </MessageText>
                        </Message>
                    </MessageGroup>
                )
            }
		}

		return (
			<MuiThemeProvider>									
				<div className="App">
					<Grid container className="App-header" justify="center" spacing={16}>
						<Grid item className="App-title" xs={3}>
							<p><b>xxxxx</b></p>
						</Grid>
						<Grid item className="App-subtitle" xs={9}>
							<p>: I am your Ai toy ! </p>
						</Grid>
						{/* <Grid item xs={4}>
						</Grid>
						<Grid item xs={2}>
							<img src={logo} alt="logo" className="App-logo" style={LogoStyle}/>
						</Grid> */}
					</Grid>
					<Grid container className={classes.root} justify="center" spacing={16}>
						<Grid item xs={12}>
						</Grid>
						<Grid item className='App-toy' xs={1}>
							{/* <audio ref="audioSource" controls="controls" autoPlay='autoplay' src={this.state.audioPlay}></audio>
							<audio  id="songPlay" ref="audioSource" controls="controls" autoPlay='autoplay' src={this.state.song} type="audio/mp3"></audio> */}
							<audio id="toySound" ref="audioSource" autoPlay='autoplay' src={this.state.audioPlay}></audio>
							<audio  id="songPlay" ref="audioSource" autoPlay='autoplay' src={this.state.song} type="audio/mp3"></audio>
							<div className="Transparent">
								<ReactMic
									className="oscilloscope"
									record={isRecording}
									backgroundColor="#232F34"
									visualSetting="sinewave"
									audioBitsPerSecond={128000}
									onStop={this.onStop}
									onStart={this.onStart}
									onSave={this.onSave}
									onData={this.onData}
									strokeColor="#FF4081"
									width={320}
									height={50}
								/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<Paper>
							<Grid container spacing={16}>
								{/* chat box */}
								<Grid item className='App-toy' xs={12}>
									<Grid container spacing={16}>
										<Grid item xs={12}>
											<AppBar position="static" color="default">
												<Toolbar variant="dense" className="Chat-bar">
													<Typography variant="h6" color="inherit">
														<img src={toy} alt="toy" className="App-avatar" style={AvatarStyle}/>
														<b>&#8194;xxxxx</b>
													</Typography>
												</Toolbar>
											</AppBar>
										</Grid>
										<Grid item xs={12}>
											{/* here is the chat box */}
												<ThemeProvider theme={themeMessage}>
													<div style={{ maxWidth: '100%', height: 510 }}>
														<MessageList active>
															{ messageElement }
														</MessageList>
													</div>
												</ThemeProvider>
										</Grid>
									</Grid>
								</Grid>
								{/* control buttons */}
								<Grid item className="Control-button" xs={12}>
									<Button variant="contained" color="primary" className={classNames(classes.margin, classes.cssRoot1)}
										style={ButtonLeftStyle}
										secondary={'true'} 
										size={'small'}
										onClick={this.startTalking}>
										<h3>&#8194;Start&#8194;&#8194;</h3>
										<ApiPlay color="disabled" />
									</Button>
									{!this.state.end && this.state.isRecording === false && <Button disabled={isRecording} 
										onClick={this.startRecording} 
										variant="contained" color="secondary" className={classNames(classes.margin, classes.cssRoot2)} style={ButtonRightStyle} 
										size={'small'}> 
										<h3>&#8194;Record</h3>
										<MicrophoneOn color="disabled" />
									</Button>}
									{!this.state.end && this.state.isRecording === true && <Button variant="contained" color="default" className={classes.button} style={ButtonRightStyle} 
										onClick={this.stopRecording} 
										size={'small'}> 
										<h3>&#8194;Stop&#8194;&#8194;&#8194;</h3>
										<MicrophoneOff color="disabled" />
									</Button>}
									{this.state.end && <Button variant="contained" className={classNames(classes.margin, classes.cssRoot2)} style={ButtonRightStyle} 
										color="secondary"
										onClick={this.endSong} 
										size={'small'}> 
										<h3>&#8194;End&#8194;&#8194;&#8194;&#8194;&#8194;</h3>
										<MicrophoneOff color="disabled" />
									</Button>}
									
								</Grid>
							</Grid>
							</Paper>
						</Grid>
						{/* below is the dashboard part */}
						<Grid item xs={4}>
							<Grid container justify="center" spacing={16}>
								<Grid item xs={12}>
									<Paper style={{height:170}}>
										<Grid container spacing={16}>
											<Grid item xs={12}>
												<h3 className="Emotion-head">&#8194;Arousal</h3>
											</Grid>
											<Grid item xs={1}>
											</Grid>
											<Grid item xs={1}>
												<p className="Dashboard-text-other">{this.state.arousal_label}</p>
											</Grid>
											<Grid item xs={9}>
												{this.renderArousalBarChart(this.state.arousal_score,this.state.arousal_label)}																								
											</Grid>
											<Grid item xs={1}>
											</Grid>
										</Grid>
									</Paper>
								</Grid>
								<Grid item xs={12}>
									<Paper style={{height:175}}>
										<Grid container spacing={16}>
											<Grid item xs={12}>
												<h3 className="Emotion-head">&#8194;Sentiment</h3>
											</Grid>
											<Grid item xs={1}>
											</Grid>
											<Grid item xs={1}>
												<p className="Dashboard-text-other">{this.state.level}</p>
											</Grid>
											<Grid item xs={9}>
												{this.renderSentimentBarChart(this.state.sentiment, this.state.level)}																								
											</Grid>
											<Grid item xs={1}>
											</Grid>
										</Grid>
									</Paper>
								</Grid>
								<Grid item xs={12}>
									<Paper style={{height:315}}>
										<Grid container spacing={16}>
											<Grid item xs={12} >
												<h3 className="Emotion-head">&#8194;Emotion</h3>
											</Grid>
											<Grid item xs={1}>
											</Grid>
											<Grid item xs={1}>
												<p className="Dashboard-text-emotion">
												angry<br />
												fear<br />
												happy<br />
												sad<br />
												anxious<br />
												neutral<br />
												</p>
											</Grid>
											<Grid item xs={9}>
												{this.renderEmotionBarChart(
													this.state.anger,
													this.state.anxiety,
													this.state.happiness,
													this.state.sadness,
													this.state.fear,
													this.state.neutral,
													)}
											</Grid>
											<Grid item xs={1}>
											</Grid>
										</Grid>
									</Paper>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={2}>
						</Grid>
						<Grid item xs={12}>
						</Grid>
					</Grid>
					{/* previous */}
					<Grid container className="Black-box" justify="center" spacing={16}>
						<Grid item xs={6}>
							<h1>Status Information</h1>
						</Grid>
						<Grid item xs={6}>
						</Grid>
						<Grid item xs={1}>
						</Grid>
						<Grid item xs={8}>
							<Paper className={classes.paper}>
								<Grid container spacing={16}>
									<Grid item xs={2} style={InfoChip}>
										<p className="System-info">
											Status: 
										</p>
										<p className="System-info">
											Fallback: 
										</p>
										<p className="System-info">
											Timer: 
										</p>
									</Grid>
									<Grid item xs={9}>
										<p className="Status-info">
											{this.state.status}
										</p>
										<p className="Status-info">{this.state.time}</p>
										<p className="Status-info">
											{this.state.isOn && "on"}
											{!this.state.isOn && "off"}
										</p>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
						<Grid item xs={2}>
						</Grid>
					</Grid>
				</div>
			</MuiThemeProvider >
		);
	}
}


App.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
