'use strict'

const
	express = require('express'),
	bodyParser = require('body-parser'),
	request = require('request'),
	config = require('./config.json');

let app = express();

// var user = require('./components/user');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mainMenu = {
	"persistent_menu": [
		{
			"locale": "default",
			"composer_input_disabled": true,
			"call_to_actions": [
				{
					"title": "See Packages",
					"type": "postback",
					"payload": "MENU_SEE_PACKAGES"
				},
				{
					"title": "Contact Master",
					"type": "postback",
					"payload": "MENU_CONTACT_MASTER"
				},
				{
					"title": "Unsubscribe",
					"type": "postback",
					"payload": "MENU_UNSUBSCRIBE"
				}
			]
		}
	]
}

const packagesCarousel = {
	"attachment": {
		"type": "template",
		"payload": {
			"template_type": "generic",
			"elements": [
				{
					"title": "PREMIUM",
					"image_url": "https://i.ibb.co/0KJgJxG/RIVO-CAROUSEL-PREMIUM.png",
					"subtitle": "Amazing Messenger BOT.\n$500",
					"buttons": [
						{
							"title": "Learn More",
							"type": "postback",
							"payload": "PACKAGE_PREMIUM"
						}
					]
				},
				{
					"title": "STANDARD",
					"image_url": "https://i.ibb.co/jGVSf14/RIVO-CAROUSEL-STANDARD.png",
					"subtitle": "Intermediate Messenger BOT.\n$300",
					"buttons": [
						{
							"title": "Learn More",
							"type": "postback",
							"payload": "PACKAGE_STANDARD"
						}
					]
				},
				{
					"title": "BASIC",
					"image_url": "https://i.ibb.co/g7s73Z1/RIVO-CAROUSEL-BASIC.png",
					"subtitle": "Simple Messenger BOT\n$150",
					"buttons": [
						{
							"title": "Learn More",
							"type": "postback",
							"payload": "PACKAGE_BASIC"
						}
					]
				},
				{
					"title": "TERMS AND AGREEMENT",
					"image_url": "https://i.ibb.co/thMybhM/RIVO-CAROUSEL-TERMS-AND-AGREEMENT.png",
					"subtitle": "See process and payment method.",
					"buttons": [
						{
							"title": "Learn More",
							"type": "postback",
							"payload": "TERMS_AND_AGREEMENT"
						}
					]
				}
			]
		}
	}
}

var senderAction = (sender_psid, action) => {
	let request_body = {
		"recipient": {
			"id": sender_psid
		},
		"sender_action": action
	}

	request ({
		"uri": `https://graph.facebook.com/${config.GRAPH_VERSION}/me/messages`,
		"qs": {
			"access_token": config.ACCESS_TOKEN
		},
		"method": "POST",
		"json": request_body
	}, (err, res, body) => {
		if (!err) {
			console.log("Action sent!");
		} else {
			console.error("Unable to send action:" + err);
		}
	})
}

var callSendAPI = (sender_psid, response) => {
	let request_body = {
		"recipient": {
			"id": sender_psid
		},
		"message": response
	}

	request ({
		"uri": `https://graph.facebook.com/${config.GRAPH_VERSION}/me/messages`,
		"qs": {
			"access_token": config.ACCESS_TOKEN
		},
		"method": "POST",
		"json": request_body
	}, (err, res, body) => {
		if (!err) {
			console.log("Message sent!");
			senderAction(sender_psid, "typing_off");
		} else {
			console.error("Unable to send message:" + err);
		}
	})
}

// FUNCTION THAT HANDLE MESSAGES
var handleMessage = (sender_psid, received_message) => {
	let response;

	if (received_message.text === "I Agree.") {
		senderAction(sender_psid, "typing_on");
		response = packagesCarousel;
	} else if (received_message.text === "BUY"){
		senderAction(sender_psid, "typing_on");
		let temp;

		temp = "TERMS AND AGREEMENT\n\n";
		temp += "We will give you free consultation and exchange of ideas so we can build the best for your business. ";
		temp += "After the discussion, my master will send to you the development document based of what we agreed which includes timeline, design and feature. ";
		temp += "We're always willing to help and assist you in terms of Facebook approval so we can launch it the soonest. ";
		temp += "Fifty percent (50%) down payment for the start of the development, twenty five percent (25%) when the development is finished and twenty five percent (25%) after successful launch of the Messenger BOT.\n\n";
		temp += "Thank you!";

		response = {
			"text": temp,
			"quick_replies": [
				{
					"content_type": "text",
					"title": "Proceed",
					"payload": "MENU_CONTACT_MASTER"
				},
				{
					"content_type": "text",
					"title": "See Packages",
					"payload": "MENU_SEE_PACKAGES"
				}
			]
		};
	} else if (received_message.text === "BACK") {
		senderAction(sender_psid, "typing_on");
		response = packagesCarousel;
	} else if (received_message.text === "Proceed"){
		senderAction(sender_psid, "typing_on");
		let temp;

		temp = "Contact my Master at:\n";
		temp += "- Facebook: https://www.facebook.com/ghianrhoi\n";
		temp += "- Email: girocalvario@gmail.com\n";
		temp += "- Fiverr: https://www.fiverr.com/giro0710\n\n";
		temp += "Thank you!";

		response = {
			"text": temp
		};
	} else if (received_message.text === "See Packages") {
		senderAction(sender_psid, "typing_on");
		response = packagesCarousel;
	}

	callSendAPI(sender_psid, response);
}

// FUNCTION THAT HANDLE POSTBACKS
var handlePostback = (sender_psid, received_postback) => {
	let response;
  
	let payload = received_postback.payload;

	if (payload === "GET_STARTED") {
		response = { 
			"text": "Hi Visitor,\n\n Good day! My name is Rivo and I'am a bot created to serve you. Im very excited to help your business in terms of customer service and management. Once you agree and continue, you will automatically receives update about new things about me that can also help your business. \n\nThank you!",
			"quick_replies": [
				{
					"content_type": "text",
					"title": "I Agree.",
					"payload": "USER_AGREE"
				}
			]
		}
	} else if (payload === "MENU_SEE_PACKAGES") {
		response = packagesCarousel;
	} else if (payload === "PACKAGE_PREMIUM") {
		senderAction(sender_psid, "typing_on");
		let temp;

		temp = "Package: PREMIUM\n";
		temp += "Price: $500\n\n";
		temp += "Details:\n";
		temp += "- Up to 15 conversion steps\n";
		temp += "- Get Started Button\n";
		temp += "- With Icon Menus\n";
		temp += "- Sender Action\n";
		temp += "- With Icon Quick Replies\n";
		temp += "- Media Templates\n";
		temp += "- Media Buttons\n";
		temp += "- Carousel\n";
		temp += "- Web View\n";
		temp += "- Broadcasting\n";
		temp += "- API Integration\n";
		temp += "- 5 Revisions\n";
		temp += "- 10 Days Delivery\n";
		temp += "- 5 Days (+$100)\n";

		response = {
			"text": temp,
			"quick_replies": [
				{
					"content_type": "text",
					"title": "BUY",
					"payload": "MENU_CONTACT_MASTER"
				},
				{
					"content_type": "text",
					"title": "BACK",
					"payload": "MENU_SEE_PACKAGES"
				}
			]
		};
	} else if (payload === "PACKAGE_STANDARD") {
		senderAction(sender_psid, "typing_on");
		let temp; 

		temp = "Package: STANDARD\n";
		temp += "Price: $300\n\n";
		temp += "Details:\n";
		temp += "- Up to 10 conversion steps\n";
		temp += "- Get Started Button\n";
		temp += "- Normal Menus\n";
		temp += "- Sender Action\n";
		temp += "- Normal Quick Replies\n";
		temp += "- Media Templates\n";
		temp += "- Carousel\n";
		temp += "- 3 Revisions\n";
		temp += "- 5 Days Delivery\n";
		temp += "- 3 Days (+$50)\n";

		response = {
			"text": temp,
			"quick_replies": [
				{
					"content_type": "text",
					"title": "BUY",
					"payload": "MENU_CONTACT_MASTER"
				},
				{
					"content_type": "text",
					"title": "BACK",
					"payload": "MENU_SEE_PACKAGES"
				}
			]
		};
	} else if (payload === "PACKAGE_BASIC") {
		senderAction(sender_psid, "typing_on");
		let temp;

		temp = "Package: BASIC\n";
		temp += "Price: $100\n\n";
		temp += "Details:\n";
		temp += "- Up to 5 conversion steps\n";
		temp += "- Get Started Button\n";
		temp += "- Normal Menu\n";
		temp += "- Sender Action\n";
		temp += "- 1 Revision\n";
		temp += "- 3 Days Delivery\n";
		temp += "- 1 Day (+$50)\n";

		response = {
			"text": temp,
			"quick_replies": [
				{
					"content_type": "text",
					"title": "BUY",
					"payload": "MENU_CONTACT_MASTER"
				},
				{
					"content_type": "text",
					"title": "BACK",
					"payload": "MENU_SEE_PACKAGES"
				}
			]
		};
	} else if (payload === "MENU_CONTACT_MASTER") {
		senderAction(sender_psid, "typing_on");
		let temp;

		temp = "Contact my Master at:\n";
		temp += "- Facebook: https://www.facebook.com/ghianrhoi\n";
		temp += "- Email: girocalvario@gmail.com\n";
		temp += "- Fiverr: https://www.fiverr.com/giro0710\n\n";
		temp += "Thank you!";

		response = {
			"text": temp
		};
	} else if (payload === "TERMS_AND_AGREEMENT") {
		senderAction(sender_psid, "typing_on");
		let temp;

		temp = "TERMS AND AGREEMENT\n\n";
		temp += "We will give you free consultation and exchange of ideas so we can build the best for your business. ";
		temp += "After the discussion, my master will send to you the development document based of what we agreed which includes timeline, design and feature. ";
		temp += "We're always willing to help and assist you in terms of Facebook approval so we can launch it the soonest. ";
		temp += "Fifty percent (50%) down payment for the start of the development, twenty five percent (25%) when the development is finished and twenty five percent (25%) after successful launch of the Messenger BOT.\n\n";
		temp += "Thank you!";

		response = {
			"text": temp,
			"quick_replies": [
				{
					"content_type": "text",
					"title": "See Packages",
					"payload": "MENU_SEE_PACKAGES"
				}
			]
		};
	}

	callSendAPI(sender_psid, response);
}

// CREATE THE PERSISTENT MENU
var persistentMenu = () => { 
	request({
		"uri": `https://graph.facebook.com/${config.GRAPH_VERSION}/me/messenger_profile`,
		"qs": {
			"access_token": config.ACCESS_TOKEN
		},
		"method": "POST",
		"json": mainMenu
	}, (err, res, body) => {
		if (!err) {
			console.log("Persistent menu successfully created.");
		} else {
			console.log("Unable to create persistent menu");
		}
	})
}

// CREATE THE GET STARTED BUTTON
var getStarted = () => { 
	let menu = {
		"get_started": {
			"payload": "GET_STARTED"
		}
	}

	request({
		"uri": `https://graph.facebook.com/${config.GRAPH_VERSION}/me/messenger_profile`,
		"qs": {
			"access_token": config.ACCESS_TOKEN
		},
		"method": "POST",
		"json": menu
	}, (err, res, body) => {
		if (!err) {
			console.log("Get started button successfully created.");
			persistentMenu();
		} else {
			console.log("Unable to create get started button");
		}
	})
}

getStarted();

var checkUserData = (sender_psid) => {
	user.checkUserData(sender_psid, (result1) => {
		if (result1.length == 0) {
			user.logUserData(sender_psid)
		}
	})
}

// WEBHOOK END POINT
app.post('/webhook', (req, res) => {
	let body = req.body;

	if (body.object === 'page') {
		body.entry.forEach(function(entry) {

			let webhook_event = entry.messaging[0];
			let sender_psid = webhook_event.sender.id;
			console.log('Sender PSID:' + sender_psid);

			// checkUserData(sender_psid);
			senderAction(sender_psid, "mark_seen");

			if (webhook_event.message) {
				handleMessage(sender_psid, webhook_event.message);
			} else if (webhook_event.postback) {
				handlePostback(sender_psid, webhook_event.postback);
			}

		})
		res.status(200).send('EVENT_RECEIVED');
	} else {
		res.sendStatus(404);
	}
})

// WEBHOOK VERIFICATION
app.get('/webhook', (req, res) => {
	let VERIFY_TOKEN = config.VERIFY_TOKEN;
	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

	if (mode && token) {
		if (mode == 'subscribe' && token == VERIFY_TOKEN) {
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);
		}
	} else {
		res.send(404);
	}
})

app.listen(process.env.PORT || 1337, () => {
	console.log('Server is now running.');
})