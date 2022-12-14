export const TWITCH_LINK = 'https://www.twitch.tv/*';

export const SPOTIFY_TRACK_LINK_REGEX = /^https?:\/\/open\.spotify\.com\/track\/.+$/;
export const YOUTUBE_MOBILE_VIDEO_LINK_REGEX = /^https:\/\/youtu\.be\/.+$/;
export const YOUTUBE_VIDEO_LINK_REGEX =
	/(^https:\/\/www\.youtube\.com\/watch\?v=.+$)|(^https:\/\/youtu\.be\/.+$)/;

export const LOGO_MUSIC_BLUE = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/musical-notes_1f3b6.png';
export const LOGO_MUSIC_PURPLE = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/multiple-musical-notes_1f3b6.png';
export const RED_FUEL_PUMP = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/google/313/fuel-pump_26fd.png';

export const LOGO_SOURCES = {
	YOUTUBE: 'https://img.icons8.com/color/344/youtube-play.png',
	SPOTIFY: 'https://img.icons8.com/color/344/spotify.png',
};

export const BUTTON = {
	PLAY_RESPONSE: {
		content: '❌ This song is not available !',
		ephemeral: true,
	},
};

/**
 * A week convert in milliseconds
 */
export const CLEANER_TIMEOUT = 60480000;

export const API = {
	FUEL: {
		URL: 'https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-carburants-fichier-instantane-test-ods-copie',
		ROWS: '&rows=3',
		QUERY: '&q=',
		FACETS: [
			'&facet=id',
			'&facet=adresse',
			'&facet=ville',
			'&facet=prix_maj',
			'&facet=prix_nom',
			'&facet=com_arm_name',
			'&facet=epci_name',
			'&facet=dep_name',
			'&facet=reg_name',
			'&facet=services_service',
			'&facet=horaires_automate_24_24',
			'&facet=dep_code',
		],
		TIMEZONE: '&timezone=Europe%2FParis',
		ERROR: '🥲 Sorry but no fuel has been found ⛽!',
	},
	/** @deprecated */
	BURGER: {
		/** @deprecated */
		URL: 'https://foodish-api.herokuapp.com/api/images/burger/',
		ERROR: '🥲 Sorry but no burger has been found 🍔!',
	},
};

export const PLAY_TOGETHER_ACTIVITY = [
	{ name:'youtube', actif: true },
	{ name:'youtubedev', actif: false },
	{ name:'poker', actif: null },
	{ name:'betrayal', actif: false },
	{ name:'fishing', actif: false },
	{ name:'chess', actif: null },
	{ name:'chessdev', actif: false },
	{ name:'lettertile', actif: false },
	{ name:'wordsnack', actif: false },
	{ name:'doodlecrew', actif: false },
	{ name:'awkword', actif: false },
	{ name:'spellcast', actif: false },
	{ name:'checkers', actif: null },
	{ name:'puttparty', actif: false },
	{ name:'sketchheads', actif: null },
	{ name:'ocho', actif: false },
	{ name:'puttpartyqa', actif: false },
	{ name:'sketchyartist', actif: false },
	{ name:'land', actif: null },
	{ name:'meme', actif: false },
	{ name:'askaway', actif: false },
	{ name:'bobble', actif: false },
];
