'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = 'amzn1.ask.skill.3ac95fba-aa3d-412a-a1e9-8bd1707a512d';// undefined; // TODO replace with your app ID (OPTIONAL).
var acupoints = require('./acupoints');
var imagenes = require('./imagenes');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'RecipeIntent': function () {
        var itemSlot = this.event.request.intent.slots.Item;
        var itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = this.t("DISPLAY_CARD_TITLE", this.t("SKILL_NAME"), itemName);
        var acupoints = this.t("ACUPOINTS");
		var imagenes = this.t("IMAGENES");
        var acupoint = acupoints[itemName];
		var imagen = imagenes[itemName];
        if (acupoint) {
            this.attributes['speechOutput'] = acupoint;
            this.attributes['repromptSpeech'] = this.t("ACUPOINT_REPEAT_MESSAGE");
			// this.emit(':tellWithCard', cardTitle, cardTitle, recipe, recipe);
			// EL ORDEN DEBERIA SER speechOutput, cardTitle, cardContent, imageObj
			/* var imagen = {
				"smallImageUrl": "https://s3.amazonaws.com/alexaimageseva/acupoints-media/smallImageTest.png",
				"largeImageUrl": "https://s3.amazonaws.com/alexaimageseva/acupoints-media/largeImageTest.png"
				};*/
				/*imagen = {
				"smallImageUrl": "https://s3.amazonaws.com/alexaimageseva/acupoints-media/smallImageTest.png",
				"largeImageUrl": "https://s3.amazonaws.com/alexaimageseva/acupoints-media/largeImageTest.png"
				};*/
			this.emit(':tellWithCard', acupoint, cardTitle, acupoint, imagen);
        } else {
            var speechOutput = this.t("ACUPOINT_NOT_FOUND_MESSAGE");
            var repromptSpeech = this.t("ACUPOINT_NOT_FOUND_REPROMPT");
            if (itemName) {
                speechOutput += this.t("ACUPOINT_NOT_FOUND_WITH_ITEM_NAME", itemName);
            } else {
                speechOutput += this.t("ACUPOINT_NOT_FOUND_WITHOUT_ITEM_NAME");
            }
            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'Unhandled': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    }
};

var languageStrings = {
    "en": {
        "translation": {
            "ACUPOINTS": acupoints.ACUPOINT_EN_US,
			"IMAGENES" : imagenes.IMAGEN_EN_US,
            "SKILL_NAME": "Acupuncture Points",
            "WELCOME_MESSAGE": "Welcome to %s. I can help you locate acupuncture points. Ask, where\'s Kidney One? ... Now, what can I help you with.",
            "WELCOME_REPROMPT": "For instructions on what you can say, please say help me.",
            "DISPLAY_CARD_TITLE": "%s  - Location of %s.",
            "HELP_MESSAGE": "You can ask questions such as, where\'s Kidney One, or, you can say exit...Now, what can I help you with?",
            "HELP_REPROMPT": "You can say things like, where\'s Kidney One, or you can say exit...Now, what can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "ACUPOINT_REPEAT_MESSAGE": "Try saying repeat.",
            "ACUPOINT_NOT_FOUND_MESSAGE": "I\'m sorry, I currently do not know ",
            "ACUPOINT_NOT_FOUND_WITH_ITEM_NAME": "where to locate %s. ",
            "ACUPOINT_NOT_FOUND_WITHOUT_ITEM_NAME": "that. ",
            "ACUPOINT_NOT_FOUND_REPROMPT": "What else can I help with?"
        }
    },
    "en-US": {
        "translation": {
            "ACUPOINTS" : acupoints.ACUPOINT_EN_US,
			"IMAGENES"  : imagenes.IMAGEN_EN_US,
            "SKILL_NAME" : "Acupuncture Points"
        }
    },
    "en-GB": {
        "translation": {
            "ACUPOINTS": acupoints.ACUPOINT_EN_GB,
			"IMAGENES": imagenes.IMAGEN_EN_GB,
            "SKILL_NAME": "Acupuncture Points"
        }
    },
    "de": {
        "translation": {
            "ACUPOINTS" : acupoints.ACUPOINT_DE_DE,
			"IMAGENES": imagenes.IMAGEN_DE_DE,
            "SKILL_NAME" : "Acupuncture Points",
            "WELCOME_MESSAGE": "Willkommen bei %s. Du kannst beispielsweise die Frage stellen: Welche Rezepte gibt es für eine Truhe? ... Nun, womit kann ich dir helfen?",
            "WELCOME_REPROMPT": "Wenn du wissen möchtest, was du sagen kannst, sag einfach „Hilf mir“.",
            "DISPLAY_CARD_TITLE": "%s - Rezept für %s.",
            "HELP_MESSAGE": "Du kannst beispielsweise Fragen stellen wie „Wie geht das Rezept für“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?",
            "HELP_REPROMPT": "Du kannst beispielsweise Sachen sagen wie „Wie geht das Rezept für“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?",
            "STOP_MESSAGE": "Auf Wiedersehen!",
            "ACUPOINT_REPEAT_MESSAGE": "Sage einfach „Wiederholen“.",
            "ACUPOINT_NOT_FOUND_MESSAGE": "Tut mir leid, ich kenne derzeit ",
            "ACUPOINT_NOT_FOUND_WITH_ITEM_NAME": "das Rezept für %s nicht. ",
            "ACUPOINT_NOT_FOUND_WITHOUT_ITEM_NAME": "dieses Rezept nicht. ",
            "ACUPOINT_NOT_FOUND_REPROMPT": "Womit kann ich dir sonst helfen?"
        }
    }
};