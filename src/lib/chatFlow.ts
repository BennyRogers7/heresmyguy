import { ChatMessage, ChatState, City } from './types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function createBotMessage(content: string): ChatMessage {
  return {
    id: generateId(),
    type: 'bot',
    content,
    timestamp: new Date(),
  };
}

function createUserMessage(content: string): ChatMessage {
  return {
    id: generateId(),
    type: 'user',
    content,
    timestamp: new Date(),
  };
}

// Empathetic acknowledgments based on issue keywords
function getEmpatheticResponse(issue: string): string {
  const lower = issue.toLowerCase();

  // Emergency/urgent situations
  if (lower.includes('flood') || lower.includes('flooding')) {
    return "Oh no, flooding is so stressful! Let me help you find someone right away.";
  }
  if (lower.includes('burst') || lower.includes('broken pipe')) {
    return "A burst pipe is never fun - I'm sorry you're dealing with that. Let's get you help fast.";
  }
  if (lower.includes('no water') || lower.includes('no hot water')) {
    return "Being without water is really tough. I'll help you find someone who can fix this.";
  }
  if (lower.includes('sewage') || lower.includes('sewer') || lower.includes('backup')) {
    return "Ugh, sewer issues are the worst. I'm on it - let's find you help.";
  }

  // Common issues
  if (lower.includes('leak') || lower.includes('leaking') || lower.includes('drip')) {
    return "Leaks can be such a headache. Let me help you find someone to take care of it.";
  }
  if (lower.includes('clog') || lower.includes('drain') || lower.includes('blocked')) {
    return "Clogged drains are so frustrating! I'll help you find the right person for this.";
  }
  if (lower.includes('toilet')) {
    return "Toilet troubles are never convenient. Let's get you connected with someone who can help.";
  }
  if (lower.includes('water heater') || lower.includes('hot water')) {
    return "Water heater issues can really disrupt your day. I'll find you some good options.";
  }
  if (lower.includes('faucet') || lower.includes('sink')) {
    return "Got it! Let me find you a plumber who can take care of that.";
  }

  // Generic empathetic responses
  const genericResponses = [
    "I hear you - plumbing problems are never fun. Let me help you find the right person.",
    "Thanks for sharing that. Let me connect you with someone who can help.",
    "Got it! I'll find you some great options to get this fixed.",
    "No problem - I'm here to help. Let me find the right plumber for you.",
  ];

  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

// Emergency question follow-ups
const EMERGENCY_QUESTIONS = [
  "Is this something that needs immediate attention?",
  "Would you say this is urgent?",
  "Do you need help right away?",
];

// Location questions
const LOCATION_QUESTIONS = [
  "What city are you in?",
  "Where in Minnesota are you located?",
  "And what's your city?",
];

// Searching messages
const SEARCHING_MESSAGES = [
  "Perfect! Let me find the best plumbers near you...",
  "Great - searching for top-rated pros in your area...",
  "On it! Finding the best matches...",
];

// Follow-up messages
const FOLLOWUP_MESSAGES = [
  "Is there anything else I can help you with?",
  "Need help with another issue?",
  "Anything else you'd like me to look up?",
];

// Zip code request
const ZIP_CODE_REQUESTS = [
  "I'm not finding that city. Could you give me your zip code instead?",
  "Hmm, I don't have that city listed. What's your zip code?",
  "I couldn't find that one. Can you share your zip code?",
];

const YES_KEYWORDS = ['yes', 'yeah', 'yep', 'yup', 'y', 'emergency', 'urgent', 'asap', 'now', 'immediately', 'right away', 'help', 'please', 'definitely', 'absolutely'];
const NO_KEYWORDS = ['no', 'nope', 'nah', 'n', 'not really', 'not urgent', 'can wait', 'later', 'whenever', 'not an emergency', 'no rush'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function isEmergencyResponse(text: string): boolean | null {
  const normalized = normalizeText(text);
  if (YES_KEYWORDS.some(kw => normalized.includes(kw))) return true;
  if (NO_KEYWORDS.some(kw => normalized.includes(kw))) return false;
  return null;
}

// Minnesota zip code to city/neighborhood mapping
// Minneapolis/St. Paul proper map to neighborhoods, suburbs map to corrected city names
const ZIP_TO_CITY: Record<string, string> = {
  // Minneapolis neighborhoods
  '55413': 'Minneapolis Northeast', '55414': 'Minneapolis Northeast', '55418': 'Minneapolis Northeast',
  '55401': 'Minneapolis Downtown', '55402': 'Minneapolis Downtown', '55403': 'Minneapolis Downtown',
  '55404': 'Minneapolis Downtown', '55415': 'Minneapolis Downtown',
  '55408': 'Minneapolis Uptown',
  '55406': 'Minneapolis South', '55407': 'Minneapolis South', '55417': 'Minneapolis South', '55419': 'Minneapolis South',
  '55409': 'Minneapolis Southwest', '55410': 'Minneapolis Southwest',
  '55411': 'Minneapolis North', '55412': 'Minneapolis North',
  // Saint Paul neighborhoods
  '55101': 'St. Paul Downtown', '55102': 'St. Paul Downtown',
  '55116': 'St. Paul Highland',
  '55104': 'St. Paul Hamline-University', '55105': 'St. Paul Hamline-University',
  '55103': 'St. Paul East Side', '55106': 'St. Paul East Side', '55119': 'St. Paul East Side', '55130': 'St. Paul East Side',
  '55107': 'St. Paul West Side',
  // Suburbs (corrected from Minneapolis/St. Paul)
  '55449': 'Plymouth', '55441': 'Plymouth', '55447': 'Plymouth',
  '55428': 'Crystal', '55429': 'Crystal',
  '55426': 'St. Louis Park',
  '55369': 'Osseo',
  '55432': 'Fridley', '55433': 'Fridley', '55434': 'Fridley',
  '55423': 'Richfield', '55431': 'Richfield',
  '55112': 'Shoreview', '55113': 'Shoreview',
  '55416': 'Golden Valley', '55427': 'Golden Valley',
  '55421': 'Columbia Heights',
  '55420': 'Bloomington', '55437': 'Bloomington', '55438': 'Bloomington',
  '55337': 'Burnsville',
  '55110': 'White Bear Lake', '55115': 'White Bear Lake',
  '55117': 'Roseville',
  '55121': 'Eagan', '55122': 'Eagan', '55123': 'Eagan', '55124': 'Eagan',
  '55125': 'Woodbury', '55128': 'Woodbury', '55129': 'Woodbury',
  '55127': 'Vadnais Heights',
  '55042': 'Lake Elmo', '55055': 'Stillwater',
  // Additional suburbs
  '55443': 'Brooklyn Park', '55444': 'Brooklyn Park', '55445': 'Brooklyn Park',
  '55430': 'Brooklyn Center',
  '55442': 'Plymouth', '55446': 'Plymouth',
  '55448': 'Coon Rapids',
  '55014': 'Circle Pines',
  '55304': 'Andover',
  '55344': 'Eden Prairie', '55346': 'Eden Prairie', '55347': 'Eden Prairie',
  '55391': 'Wayzata',
  '55305': 'Hopkins', '55343': 'Hopkins',
  '55316': 'Champlin',
  '55311': 'Maple Grove',
  '55303': 'Anoka',
  '55424': 'Edina', '55425': 'Bloomington', '55435': 'Edina', '55436': 'Edina', '55439': 'Edina',
  // Saint Paul area suburbs
  '55109': 'Maplewood',
  '55038': 'Hugo',
  '55068': 'Rosemount',
  '55075': 'South St. Paul',
  '55120': 'Mendota Heights',
  '55076': 'Inver Grove Heights', '55077': 'Inver Grove Heights',
  '55016': 'Cottage Grove',
  '55090': 'North St. Paul',
  '55044': 'Lakeville',
  '55024': 'Farmington',
  '55118': 'West Saint Paul',
  '55126': 'Shoreview', '55150': 'Mendota',
  // Duluth area
  '55801': 'Duluth', '55802': 'Duluth', '55803': 'Duluth', '55804': 'Duluth',
  '55805': 'Duluth', '55806': 'Duluth', '55807': 'Duluth', '55808': 'Duluth',
  '55810': 'Duluth', '55811': 'Duluth', '55812': 'Duluth',
  // Rochester area
  '55901': 'Rochester', '55902': 'Rochester', '55903': 'Rochester', '55904': 'Rochester',
  '55905': 'Rochester', '55906': 'Rochester',
  // Other major cities (non-duplicates)
  '56301': 'Saint Cloud', '56302': 'Saint Cloud', '56303': 'Saint Cloud', '56304': 'Saint Cloud',
  '55060': 'Owatonna', '55057': 'Northfield', '55082': 'Stillwater', '55379': 'Shakopee',
  '55306': 'Burnsville', '55318': 'Chanhassen', '55317': 'Chanhassen', '55345': 'Minnetonka',
  '55331': 'Excelsior', '55364': 'Mound', '55372': 'Prior Lake',
  '55378': 'Savage', '55021': 'Faribault', '55033': 'Hastings', '55003': 'Bayport',
  '55071': 'Saint Paul Park', '55066': 'Red Wing',
  '56071': 'New Ulm', '56001': 'Mankato', '56002': 'Mankato', '55987': 'Winona',
  '55720': 'Cloquet', '55746': 'Hibbing', '55792': 'Virginia', '55744': 'Grand Rapids',
  '56501': 'Detroit Lakes', '56560': 'Moorhead', '56601': 'Bemidji',
  '55912': 'Austin', '55334': 'Fairmont', '56537': 'Fergus Falls',
  '55616': 'Two Harbors', '55604': 'Grand Marais', '55731': 'Ely',
};

function getCityFromZip(zip: string): string | null {
  const cleanZip = zip.replace(/\D/g, '').substring(0, 5);
  return ZIP_TO_CITY[cleanZip] || null;
}

function isZipCode(input: string): boolean {
  const cleanInput = input.replace(/\D/g, '');
  return cleanInput.length === 5 && cleanInput.startsWith('55') || cleanInput.startsWith('56');
}

// City matching
function findCity(input: string, cities: City[]): City | null {
  const normalized = normalizeText(input);

  // Check if it's a zip code first
  if (isZipCode(input)) {
    const cityName = getCityFromZip(input);
    if (cityName) {
      const city = cities.find(c => normalizeText(c.name) === normalizeText(cityName));
      if (city) return city;
    }
    return null;
  }

  // Handle common abbreviations and neighborhood variations
  const cityAliases: Record<string, string> = {
    'mpls': 'minneapolis',
    'stpaul': 'saint paul',
    'st paul': 'saint paul',
    'st. paul': 'saint paul',
    // Minneapolis neighborhood aliases
    'northeast minneapolis': 'minneapolis northeast',
    'ne minneapolis': 'minneapolis northeast',
    'downtown minneapolis': 'minneapolis downtown',
    'uptown minneapolis': 'minneapolis uptown',
    'south minneapolis': 'minneapolis south',
    'southwest minneapolis': 'minneapolis southwest',
    // St. Paul neighborhood aliases
    'downtown st paul': 'st. paul downtown',
    'downtown saint paul': 'st. paul downtown',
    'highland park': 'st. paul highland',
    'highland st paul': 'st. paul highland',
    'hamline': 'st. paul hamline-university',
    'university ave': 'st. paul hamline-university',
    'east side st paul': 'st. paul east side',
    'east side': 'st. paul east side',
  };
  const aliasedInput = cityAliases[normalized] || normalized;

  // Exact match
  const exact = cities.find(c =>
    normalizeText(c.name) === aliasedInput ||
    c.slug === aliasedInput ||
    c.slug === normalized
  );
  if (exact) return exact;

  // Starts with match (only if clear match)
  const startsWith = cities.filter(c =>
    normalizeText(c.name).startsWith(aliasedInput) ||
    c.slug.startsWith(aliasedInput)
  );
  if (startsWith.length === 1) return startsWith[0];

  return null;
}

export function createInitialState(): ChatState {
  return {
    step: 'welcome',
    messages: [], // Start empty - user types first
    intent: {},
  };
}

export interface ProcessResult {
  newState: ChatState;
  botResponse: string | null;
  showResults: boolean;
}

export function processUserInput(
  state: ChatState,
  input: string,
  cities: City[]
): ProcessResult {
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return { newState: state, botResponse: null, showResults: false };
  }

  const newMessages = [...state.messages, createUserMessage(trimmedInput)];
  const newIntent = { ...state.intent };
  let botResponse: string | null = null;
  let nextStep = state.step;
  let showResults = false;

  switch (state.step) {
    case 'welcome':
      // User described their issue - respond with empathy
      if (trimmedInput.length < 3) {
        botResponse = "Could you tell me a bit more about what's going on?";
      } else {
        newIntent.issue = trimmedInput;
        const empathy = getEmpatheticResponse(trimmedInput);
        nextStep = 'emergency';
        botResponse = `${empathy} ${pickRandom(EMERGENCY_QUESTIONS)}`;
      }
      break;

    case 'emergency':
      const isEmergency = isEmergencyResponse(trimmedInput);
      if (isEmergency === null) {
        botResponse = "Just so I find the right help - is this urgent, or can it wait a bit?";
      } else {
        newIntent.isEmergency = isEmergency;
        nextStep = 'location';
        if (isEmergency) {
          botResponse = `Okay, I'll prioritize plumbers who offer emergency service. ${pickRandom(LOCATION_QUESTIONS)}`;
        } else {
          botResponse = `No rush - got it. ${pickRandom(LOCATION_QUESTIONS)}`;
        }
      }
      break;

    case 'location':
      const matchedCity = findCity(trimmedInput, cities);
      if (matchedCity) {
        newIntent.city = matchedCity.name;
        newIntent.citySlug = matchedCity.slug;
        nextStep = 'results';
        // Repeat the problem back in the results message
        const issue = newIntent.issue || 'your plumbing issue';
        const urgencyNote = newIntent.isEmergency ? ' who offer emergency service' : '';
        botResponse = `Got it - "${issue}" in ${matchedCity.name}. Let me find the best plumbers${urgencyNote} for you...`;
        showResults = true;
      } else {
        // Ask for zip code instead of guessing
        botResponse = pickRandom(ZIP_CODE_REQUESTS);
      }
      break;

    case 'results':
    case 'followup':
      // User wants to search again
      newIntent.issue = trimmedInput;
      newIntent.isEmergency = undefined;
      newIntent.city = undefined;
      newIntent.citySlug = undefined;
      const empathy = getEmpatheticResponse(trimmedInput);
      nextStep = 'emergency';
      botResponse = `${empathy} ${pickRandom(EMERGENCY_QUESTIONS)}`;
      break;
  }

  const updatedMessages = botResponse
    ? [...newMessages, createBotMessage(botResponse)]
    : newMessages;

  return {
    newState: {
      step: nextStep,
      messages: updatedMessages,
      intent: newIntent,
    },
    botResponse,
    showResults,
  };
}

export function addFollowupMessage(state: ChatState): ChatState {
  return {
    ...state,
    step: 'followup',
    messages: [...state.messages, createBotMessage(pickRandom(FOLLOWUP_MESSAGES))],
  };
}

export function resetChat(): ChatState {
  return createInitialState();
}
