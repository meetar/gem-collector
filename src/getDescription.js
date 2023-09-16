import * as _ from 'lodash'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'; // Import the OBJLoader module
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { shuffleArray, divideCircleIntoPoints } from './utils';
import { models, combomodels } from './models';
import * as namer from 'color-namer'
import * as adjectives from './adjectives'
import * as secretadjectives from './secretadjectives'
import * as adverbs from './adverbs'
import * as names from './names'
import { servants, relations, namers} from './people'
import * as animals from './animals'
import * as owners from './owners'
import * as places from './places'
import * as harms from './harms'
import { provenance, provenanceFunctions } from './provenance'
import { conditions, gemverbs } from './conditions'

export function roll(chance = .5) {
  return Math.random() < chance;
}

const vowelsy = ['a', 'e', 'i', 'o', 'u', 'y'];
const vowels = ['a', 'e', 'i', 'o', 'u'];
const consonants = ['b', 'g', 'd', 'z', 'th', 'k', 'l', 'm', 'n', 'x', 'p', 'r', 's', 't', 'ph', 'ch', 'ps']

export const getDescription = async (color) => {

  return {
    name: await getName(color),
    desc: getDesc()
  }
}

async function getName(color) {
  const n = _.random(2, 5);
  let string = '';
  for (let i = 0; i < n; i++) {
    string += _.sample(consonants) + _.sample(vowelsy)
  }

  let suffix = _.sample(['ine', 'orum', 'orundum', 'inium', 'itite', 'ite'])

  const prefix = await getPrefix(color);
  let name = `${prefix}${string}${_.sample(consonants)}${suffix}`;
  name = caps(name);
  name = removeDuplicateWords(name);
  return name;
}

function removeDuplicateWords(str) {
  // Split the string into words
  const words = str.split(' ');

  // Use a Set to store unique words
  const uniqueWords = new Set();

  // Iterate through the words and add them to the Set (which automatically removes duplicates)
  words.forEach(word => uniqueWords.add(word));

  // Convert the Set back to an array and join the words into a string
  const uniqueString = Array.from(uniqueWords).join(' ');

  return uniqueString;
}

function gemVerb() {
  let verb = _.sample(gemverbs);
  let condition = _.sample(conditions);
  return ` ${verb} ${roll(1) ? condition : _.sample(adverbs)}.`
}

function getDesc() {
  let intro = roll() ?
  `${cap(anAdv())} ${adj()} ${noun()}`
  :
  roll() ? `${cap(adv())} ${adj()}`
  : `${cap(adj())} and ${adj()}`

  if (roll(.3)) {
    intro += '.'
  } else {
    intro += `, it ${gemVerb()}`
  }
  const loc = roll(.3) ? ` ${cap(location())}.` : '';

  const prov = roll(.3) ? ` ${cap(getProvenance())}.` : '';

  const power = roll(.3) ? ` ${cap(getPower())}.` : '';

  const warning = roll(.3) ? ` ${cap(getWarning())}.` : '';

  // return power;
  return intro + loc + prov + power + warning;
}

function getNamer() {
  let name = _.sample(namers);
  name += name.endsWith('s') ? "' " : "'s ";

  return name;
}

async function getPrefix(color) {
  let adjective = roll(.3) ? adj() +' ' : '';
  const name = await fetchColors(color).then(r => r);
  let col = roll(.3) ? name+' ' : '';
  let returnval = roll() ?
  `${adjective}${col}` :
  `${col}${adjective}`;
  returnval = roll(.05) ? getNamer()+returnval : returnval;
  return returnval;
}

function location() {
  let loc = roll() ? _.sample(['First', 'Last', 'The only known '+noun()+' ', 'This '+noun()])+ ' ' : '';
  loc += roll() ?
  // `${foundIn()} ${aPlace()}`
  `${foundIn()} ${adjPlace()}`
  :
  `${takenFrom()} ${adjPlace()}`
  loc += roll() ?
        roll() ?
          getOwner() :
          getFinder() :
    ''
  return loc;
}

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function caps(string) {
  const words = string.split(' ');
  const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(' ');
}

function getProvenance() {
  const caveat = roll() ? rumorPast()+' ' : '';
  let verb = roll(.8) ? _.sample(provenance) :
   _.sample(['stashed', 'carried', 'hidden', 'lost', 'smuggled']) + ' in a '+_.sample(provenanceFunctions)();

  console.warn(verb);
  let val = `${caveat}${verb} by ${roll()?getDefiniteRelation():''} ${_.sample(owners.owners)}`;
  return val;
}

function getWarning() {
  const caveat = roll(1) ? ' '+getCaveat() : '';
  return `Do not ${_.sample(harms.harms)}${caveat}`;
}

function getCaveat() {
  return _.sample(harms.caveats)
}

function getRelation() {
  const claim = roll() ? _.sample(['someone claiming to be', 'someone known as', 'a person claiming to be']) : '';
  const status = roll() ? _.sample(['true', 'biological', 'supposed', 'fugitive', 'former', 'disproved', 'disgraced', 'original', 'estranged', 'first', 'second', 'third']) : '';

  const relation = roll(1) ? _.sample(relations)+' of' :
    'personal '+_.sample(servants)+' of';

  return `${claim} the ${status} ${relation}`;
}

function getDefiniteRelation() {
  const relation = roll(1) ? _.sample(relations)+' of' :
    'personal '+_.sample(servants)+' of';

  return `the ${status} ${relation}`;
}

function rumorVerb() {
  return _.sample(['once', 'reportedly', 'famously', 'reputed to be', 'said to have been', 'presumed to be', 'rumored to be', 'claimed to be', 'widely supposed to be', 'formerly', 'once', 'occasionally', 'conclusively', 'legally', 'may once have been'])
}

function rumorPast() {
  return _.sample(['was once', 'was', 'famously', 'reputed to have been', 'said to have been', 'presumed to have been', 'rumored to have been', 'claimed to have been', 'widely supposed to have been', 'may once have been'])
}

function rumor() {
  return _.sample(['required to', 'necessary to', 'reputed to', 'said to', 'presumed to', 'rumored to', 'claimed to', ])
}

function pastVerb() {
  return _.sample(['formerly', 'once', 'occasionally', 'sporadically', 'conclusively', 'legally'])
}

function grant() {
  let grant = _.sample(['grant','bestow']);
  grant += ' the '+_.sample(['power', 'ability']);
  return grant
}
function getPower() {
  const action = roll(.33) ?
    `${rumor()} ${grant()} to ${_.sample(animals.animalLikeVerbs)} like the ${_.sample(animals.animalAdjectives)} ${_.sample(animals.animals)} of ${_.sample(animals.remotePlaces)}`
  : roll() ?
    `${rumor()} ${grant()} to ${_.sample(animals.animalVerbs)} the ${_.sample(animals.animalAdjectives)} ${_.sample(animals.animals)} of ${_.sample(animals.remotePlaces)}`
    : `${rumor()} ${grant()} of ${_.sample(animals.superpowers)}`
    return action;
}

function getOwner() {
  const action = _.sample(['owned', 'occupied', 'inherited', 'disposed of', 'disguised', 'hidden', 'burnt', 'used', 'looted', 'destroyed', 'purchased', 'blessed', 'cursed', 'ritually cleansed'])
  const disguise = getDisguise();
  return roll() ?
  ` ${pastVerb()} ${disguise} by ${roll()?getRelation():''} ${_.sample(names)}` :
    ` ${rumorVerb()} ${action} by ${roll()?getRelation():''} ${_.sample(names)}`;
}


function getFinder() {
  return ` by ${getRelation()} ${aPerson()}`;
}

function aPerson() {
  return _.sample(names);
}

function getDisguise() {
  return _.sample([
    'named for',
    'replaced by',
    'built on the site of',
    'confused for',
    'modeled on',
    'disguised as',
    'passed off as',
    'painted to resemble',
    'transformed into',
    'concealed as',
    'mimicking',
    'camouflaged as',
    'altered to appear as',
    'made to look like',
    'crafted as',
    'fashioned as',
    'copied from',
    'described as',
    'modeled on',
  ])+' '+aPlace();
}

function getCar() {
  return `${aDate()} ${carMake()}`
}

export function aDate(startYear = 1900, endYear=1987) {
  const randomYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  return randomYear;
}

function placeAdj() {
  return aan(_.sample(['abandoned', 'secret', 'disused', 'hidden', 'antique', 'underground', 'sunken', 'deserted', 'forgotten', 'ruined', 'burned', 'cryptic']))
}
function place() {
  return _.sample(places)
}

function getPlace() {
  return `${placeAdj} ${place()}`
}

function aPlace() {
  return `${aan(place())}`;
}

function adjPlace() {
  return `${aan(_.sample(secretadjectives))} ${place()}`;
}
function foundIn() {
  return `${_.sample(['found', 'seen', 'detected', 'located', ])} ${roll(1) ? ' in ' + aDate()+' ' : ''}in`;
}

function aan(n) {
  return vowels.includes(n[0]) ? `an ${n}` : `a ${n}`;
}

function takenFrom() {
  return `${_.sample(['taken', 'excavated', 'retrieved', 'looted', 'harvested', 'collected'])} from`;
}

function adj() {
  return _.sample(adjectives)
}
function anAdj() {
  return aan(_.sample(adjectives))
}
function adv() {
  return _.sample(adverbs)
}
function anAdv() {
  return aan(_.sample(adverbs))
}

function noun() {
  return _.sample(['specimen', 'example', 'fragment', 'instance', 'variety', 'sample'])
}

function stripColors(colorName) {
    const stopwords = ['rose', 'color', 'oriental', 'hortense', 'picnic', 'light', 'dark', '(true)', 'red', 'blue', 'purple', 'green', 'yellow', 'orange', 'pink', 'brown', 'black', 'white', 'gray', 'grey', 'violet'];

    colorName = colorName.replace(/-/g, ' ');

    const words = colorName.split(' ');

    // filter out common color names
    const filteredWords = words.filter(word => !stopwords.includes(word.toLowerCase()));

    return filteredWords.join(' ');
}

async function fetchColors(color) {
  color = color.replace('#', ''); // Removes the '#' character
  try {
    const response = roll() ? await fetch(`https://api.color.pizza/v1/?values=${color}&list=thesaurus`) :
                              await fetch(`https://api.color.pizza/v1/?values=${color}&list=ridgway`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Response:', data);

    // Assuming the data structure has a 'value' property
    let colorValue = data.colors[0].name;

    colorValue = stripColors(colorValue)

    // Now you can use 'colorValue' for further processing
    return colorValue;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error if needed
  }
}