'use strict'

const infourl = 'https://data.similarweb.com/api/v1/data?domain='

let rankTable = {};
let countryTable = {};

function shortTextForNumber (number) {
	if (number < 1000) {
		return number.toString()
	} else if (number < 10**5) {
		return Math.floor(number / 1000)
			.toString() + "k"
	} else if (number < 10**6) { 
		return Math.floor(number / 10**5) 
			.toString() + "hk"
	} else if(number<10**8){
		return Math.floor(number / 10**6) 
			.toString() + "m"
	} else{
		return Math.floor(number / 10**8)
			.toString() + "hm"
	}
}
/*const shortTextForNumber = (number) => {
	if (number < 10000) {
		return number.toString()
	} else if (number < 1000000) {
		return Math.floor(number / 1000)
			.toString() + "k"
	} else {
		return Math.floor(number / 1000 / 1000)
			.toString() + "m"
	}
}*/


function onClicked(tab) {
	let url = 'https://www.similarweb.com/website/' + new URL(tab.url).hostname;
	chrome.tabs.create({ "url": url });
}

chrome.browserAction.onClicked.addListener(onClicked);
let fetchCount=0;
async function committed(details) {
	if (details.frameId !== 0) { return; }
	const hostname = new URL(details.url).hostname;
	if (typeof rankTable[hostname] === 'undefined') {
		console.log(`${fetchCount++} fetch ${hostname}`);
		const res = await fetch(infourl + hostname);
		if (res.status === 404) {
			rankTable[hostname] = '0';
		}
		else {
			if (res.status !== 200) {
				chrome.browserAction.setBadgeText({
					tabId: details.tabId,
					text: 'E' + res.status
				});
				return;
			}
			const doc = await res.json();
			rankTable[hostname] = shortTextForNumber(doc.GlobalRank.Rank);
			try {
				countryTable[hostname] = `${doc.SiteName} ${doc.GlobalRank.Rank}
${countryListNumeric[doc.CountryRank.Country]} ${doc.CountryRank.Rank}
${doc.CategoryRank.Category} ${doc.CategoryRank.Rank}`
			} catch (e) { console.log(e) }

		}
	}

	chrome.browserAction.setBadgeText({
		tabId: details.tabId,
		text: rankTable[hostname]
	});
	if (countryTable[hostname]) {
		chrome.browserAction.setTitle({
			tabId: details.tabId,
			title: countryTable[hostname]
		});
	}

}
chrome.webNavigation.onCommitted.addListener(committed, { url: [{ schemes: ["https", "http"] }] });

const countryListNumeric = {
	"004": "Afghanistan",
	"008": "Albania",
	"012": "Algeria",
	"016": "American Samoa",
	"020": "Andorra",
	"024": "Angola",
	"660": "Anguilla",
	"010": "Antarctica",
	"028": "Antigua and Barbuda",
	"032": "Argentina",
	"051": "Armenia",
	"533": "Aruba",
	"036": "Australia",
	"040": "Austria",
	"031": "Azerbaijan",
	"044": "Bahamas (the)",
	"048": "Bahrain",
	"050": "Bangladesh",
	"052": "Barbados",
	"112": "Belarus",
	"056": "Belgium",
	"084": "Belize",
	"204": "Benin",
	"060": "Bermuda",
	"064": "Bhutan",
	"068": "Bolivia (Plurinational State of)",
	"535": "Bonaire, Sint Eustatius and Saba",
	"070": "Bosnia and Herzegovina",
	"072": "Botswana",
	"074": "Bouvet Island",
	"076": "Brazil",
	"086": "British Indian Ocean Territory (the)",
	"096": "Brunei Darussalam",
	"100": "Bulgaria",
	"854": "Burkina Faso",
	"108": "Burundi",
	"132": "Cabo Verde",
	"116": "Cambodia",
	"120": "Cameroon",
	"124": "Canada",
	"136": "Cayman Islands (the)",
	"140": "Central African Republic (the)",
	"148": "Chad",
	"152": "Chile",
	"156": "China",
	"162": "Christmas Island",
	"166": "Cocos (Keeling) Islands (the)",
	"170": "Colombia",
	"174": "Comoros (the)",
	"180": "Congo (the Democratic Republic of the)",
	"178": "Congo (the)",
	"184": "Cook Islands (the)",
	"188": "Costa Rica",
	"191": "Croatia",
	"192": "Cuba",
	"531": "Curaçao",
	"196": "Cyprus",
	"203": "Czechia",
	"384": "Côte d'Ivoire",
	"208": "Denmark",
	"262": "Djibouti",
	"212": "Dominica",
	"214": "Dominican Republic (the)",
	"218": "Ecuador",
	"818": "Egypt",
	"222": "El Salvador",
	"226": "Equatorial Guinea",
	"232": "Eritrea",
	"233": "Estonia",
	"748": "Eswatini",
	"231": "Ethiopia",
	"238": "Falkland Islands (the) [Malvinas]",
	"234": "Faroe Islands (the)",
	"242": "Fiji",
	"246": "Finland",
	"250": "France",
	"254": "French Guiana",
	"258": "French Polynesia",
	"260": "French Southern Territories (the)",
	"266": "Gabon",
	"270": "Gambia (the)",
	"268": "Georgia",
	"276": "Germany",
	"288": "Ghana",
	"292": "Gibraltar",
	"300": "Greece",
	"304": "Greenland",
	"308": "Grenada",
	"312": "Guadeloupe",
	"316": "Guam",
	"320": "Guatemala",
	"831": "Guernsey",
	"324": "Guinea",
	"624": "Guinea-Bissau",
	"328": "Guyana",
	"332": "Haiti",
	"334": "Heard Island and McDonald Islands",
	"336": "Holy See (the)",
	"340": "Honduras",
	"344": "Hong Kong",
	"348": "Hungary",
	"352": "Iceland",
	"356": "India",
	"360": "Indonesia",
	"364": "Iran (Islamic Republic of)",
	"368": "Iraq",
	"372": "Ireland",
	"833": "Isle of Man",
	"376": "Israel",
	"380": "Italy",
	"388": "Jamaica",
	"392": "Japan",
	"832": "Jersey",
	"400": "Jordan",
	"398": "Kazakhstan",
	"404": "Kenya",
	"296": "Kiribati",
	"408": "Korea (the Democratic People's Republic of)",
	"410": "Korea (the Republic of)",
	"414": "Kuwait",
	"417": "Kyrgyzstan",
	"418": "Lao People's Democratic Republic (the)",
	"428": "Latvia",
	"422": "Lebanon",
	"426": "Lesotho",
	"430": "Liberia",
	"434": "Libya",
	"438": "Liechtenstein",
	"440": "Lithuania",
	"442": "Luxembourg",
	"446": "Macao",
	"450": "Madagascar",
	"454": "Malawi",
	"458": "Malaysia",
	"462": "Maldives",
	"466": "Mali",
	"470": "Malta",
	"584": "Marshall Islands (the)",
	"474": "Martinique",
	"478": "Mauritania",
	"480": "Mauritius",
	"175": "Mayotte",
	"484": "Mexico",
	"583": "Micronesia (Federated States of)",
	"498": "Moldova (the Republic of)",
	"492": "Monaco",
	"496": "Mongolia",
	"499": "Montenegro",
	"500": "Montserrat",
	"504": "Morocco",
	"508": "Mozambique",
	"104": "Myanmar",
	"516": "Namibia",
	"520": "Nauru",
	"524": "Nepal",
	"528": "Netherlands (the)",
	"540": "New Caledonia",
	"554": "New Zealand",
	"558": "Nicaragua",
	"562": "Niger (the)",
	"566": "Nigeria",
	"570": "Niue",
	"574": "Norfolk Island",
	"580": "Northern Mariana Islands (the)",
	"578": "Norway",
	"512": "Oman",
	"586": "Pakistan",
	"585": "Palau",
	"275": "Palestine, State of",
	"591": "Panama",
	"598": "Papua New Guinea",
	"600": "Paraguay",
	"604": "Peru",
	"608": "Philippines (the)",
	"612": "Pitcairn",
	"616": "Poland",
	"620": "Portugal",
	"630": "Puerto Rico",
	"634": "Qatar",
	"807": "Republic of North Macedonia",
	"642": "Romania",
	"643": "Russian Federation (the)",
	"646": "Rwanda",
	"638": "Réunion",
	"652": "Saint Barthélemy",
	"654": "Saint Helena, Ascension and Tristan da Cunha",
	"659": "Saint Kitts and Nevis",
	"662": "Saint Lucia",
	"663": "Saint Martin (French part)",
	"666": "Saint Pierre and Miquelon",
	"670": "Saint Vincent and the Grenadines",
	"882": "Samoa",
	"674": "San Marino",
	"678": "Sao Tome and Principe",
	"682": "Saudi Arabia",
	"686": "Senegal",
	"688": "Serbia",
	"690": "Seychelles",
	"694": "Sierra Leone",
	"702": "Singapore",
	"534": "Sint Maarten (Dutch part)",
	"703": "Slovakia",
	"705": "Slovenia",
	"090": "Solomon Islands",
	"706": "Somalia",
	"710": "South Africa",
	"239": "South Georgia and the South Sandwich Islands",
	"728": "South Sudan",
	"724": "Spain",
	"144": "Sri Lanka",
	"729": "Sudan (the)",
	"740": "Suriname",
	"744": "Svalbard and Jan Mayen",
	"752": "Sweden",
	"756": "Switzerland",
	"760": "Syrian Arab Republic",
	"158": "Taiwan",
	"762": "Tajikistan",
	"834": "Tanzania, United Republic of",
	"764": "Thailand",
	"626": "Timor-Leste",
	"768": "Togo",
	"772": "Tokelau",
	"776": "Tonga",
	"780": "Trinidad and Tobago",
	"788": "Tunisia",
	"792": "Turkey",
	"795": "Turkmenistan",
	"796": "Turks and Caicos Islands (the)",
	"798": "Tuvalu",
	"800": "Uganda",
	"804": "Ukraine",
	"784": "United Arab Emirates (the)",
	"826": "United Kingdom of Great Britain and Northern Ireland (the)",
	"581": "United States Minor Outlying Islands (the)",
	"840": "United States of America (the)",
	"858": "Uruguay",
	"860": "Uzbekistan",
	"548": "Vanuatu",
	"862": "Venezuela (Bolivarian Republic of)",
	"704": "Viet Nam",
	"092": "Virgin Islands (British)",
	"850": "Virgin Islands (U.S.)",
	"876": "Wallis and Futuna",
	"732": "Western Sahara",
	"887": "Yemen",
	"894": "Zambia",
	"716": "Zimbabwe",
	"248": "Åland Islands"
};
