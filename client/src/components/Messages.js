import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Paper from '@material-ui/core/Paper';

import toy from '../container/toy.png';
import kid from '../container/kid.png';
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
	MessageButtons,
	MessageButton,
	MessageTitle,
	MessageMedia,
	TextComposer,
	Row,
	Fill,
	Fit,
	IconButton,
	SendButton,
	EmojiIcon,
	CloseIcon,
	Column,
	RateGoodIcon,
	RateBadIcon,
	Bubble,
	ThemeProvider,
} from '@livechat/ui-kit'

export default class Messages extends Component {
    componentDidUpdate() {
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        const node = ReactDOM.findDOMNode(this.messagesEnd)
        node.scrollIntoView()
    }

    render() {
        var messages = this.props.messages
        const messageElement = []
        console.log('messages: ')
        console.log(messages)

        const theme = {
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
        
        for(let [ index, message ] of messages.entries()) {
            
            if(message.uid === this.props.uid) {
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
            <div>
                <div ref="messages">
                    <Paper>
                        <ThemeProvider theme={theme}>
                            <div style={{ maxWidth: '120%', height: 500 }}>
                                <MessageList active>
                                    { messageElement }
                                </MessageList>
                            </div>
                        </ThemeProvider>
                    </Paper>
                </div>
                <div className="message" ref={ (el) => { this.messagesEnd = el } } />
            </div>
        )
    }
}