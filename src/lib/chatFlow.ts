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

// Minnesota zip code to city mapping (major areas)
const ZIP_TO_CITY: Record<string, string> = {
  // Minneapolis area
  '55401': 'Minneapolis', '55402': 'Minneapolis', '55403': 'Minneapolis', '55404': 'Minneapolis',
  '55405': 'Minneapolis', '55406': 'Minneapolis', '55407': 'Minneapolis', '55408': 'Minneapolis',
  '55409': 'Minneapolis', '55410': 'Minneapolis', '55411': 'Minneapolis', '55412': 'Minneapolis',
  '55413': 'Minneapolis', '55414': 'Minneapolis', '55415': 'Minneapolis', '55416': 'Minneapolis',
  '55417': 'Minneapolis', '55418': 'Minneapolis', '55419': 'Minneapolis', '55420': 'Bloomington',
  '55421': 'Minneapolis', '55422': 'Minneapolis', '55423': 'Richfield', '55424': 'Edina',
  '55425': 'Bloomington', '55426': 'St. Louis Park', '55427': 'Golden Valley', '55428': 'Crystal',
  '55429': 'Brooklyn Center', '55430': 'Brooklyn Center', '55431': 'Bloomington', '55432': 'Fridley',
  '55433': 'Coon Rapids', '55434': 'Blaine', '55435': 'Edina', '55436': 'Edina',
  '55437': 'Bloomington', '55438': 'Bloomington', '55439': 'Edina', '55440': 'Minneapolis',
  '55441': 'Plymouth', '55442': 'Plymouth', '55443': 'Brooklyn Park', '55444': 'Brooklyn Park',
  '55445': 'Brooklyn Park', '55446': 'Plymouth', '55447': 'Plymouth', '55448': 'Coon Rapids',
  '55449': 'Coon Rapids',
  // Saint Paul area
  '55101': 'Saint Paul', '55102': 'Saint Paul', '55103': 'Saint Paul', '55104': 'Saint Paul',
  '55105': 'Saint Paul', '55106': 'Saint Paul', '55107': 'Saint Paul', '55108': 'Saint Paul',
  '55109': 'Maplewood', '55110': 'White Bear Lake', '55111': 'Saint Paul', '55112': 'Arden Hills',
  '55113': 'Roseville', '55114': 'Saint Paul', '55115': 'Mahtomedi', '55116': 'Saint Paul',
  '55117': 'Saint Paul', '55118': 'West Saint Paul', '55119': 'Saint Paul', '55120': 'Mendota Heights',
  '55121': 'Eagan', '55122': 'Eagan', '55123': 'Eagan', '55124': 'Apple Valley',
  '55125': 'Woodbury', '55126': 'Shoreview', '55127': 'Vadnais Heights', '55128': 'Oakdale',
  '55129': 'Woodbury', '55130': 'Saint Paul', '55150': 'Mendota', '55155': 'Saint Paul',
  // Duluth area
  '55801': 'Duluth', '55802': 'Duluth', '55803': 'Duluth', '55804': 'Duluth',
  '55805': 'Duluth', '55806': 'Duluth', '55807': 'Duluth', '55808': 'Duluth',
  '55810': 'Duluth', '55811': 'Duluth', '55812': 'Duluth',
  // Rochester area
  '55901': 'Rochester', '55902': 'Rochester', '55903': 'Rochester', '55904': 'Rochester',
  '55905': 'Rochester', '55906': 'Rochester',
  // Other major cities
  '56301': 'Saint Cloud', '56302': 'Saint Cloud', '56303': 'Saint Cloud', '56304': 'Saint Cloud',
  '55060': 'Owatonna', '55057': 'Northfield', '55082': 'Stillwater', '55379': 'Shakopee',
  '55044': 'Lakeville', '55337': 'Burnsville', '55306': 'Burnsville', '55318': 'Chanhassen',
  '55317': 'Chanhassen', '55343': 'Hopkins', '55344': 'Eden Prairie', '55345': 'Minnetonka',
  '55346': 'Eden Prairie', '55347': 'Eden Prairie', '55305': 'Hopkins', '55391': 'Wayzata',
  '55331': 'Excelsior', '55364': 'Mound', '55369': 'Osseo', '55316': 'Champlin',
  '55303': 'Anoka', '55304': 'Andover', '55014': 'Circle Pines', '55038': 'Hugo',
  '55042': 'Lake Elmo', '55016': 'Cottage Grove', '55076': 'Inver Grove Heights',
  '55077': 'Inver Grove Heights', '55068': 'Rosemount', '55372': 'Prior Lake',
  '55378': 'Savage', '55021': 'Faribault', '55033': 'Hastings', '55003': 'Bayport',
  '55055': 'Newport', '55071': 'Saint Paul Park', '55066': 'Red Wing',
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

  // Handle common abbreviations
  const cityAliases: Record<string, string> = {
    'mpls': 'minneapolis',
    'stpaul': 'saint paul',
    'st paul': 'saint paul',
    'st. paul': 'saint paul',
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
