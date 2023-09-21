import * as _ from 'lodash'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { shuffleArray, divideCircleIntoPoints } from './utils';
import { models, combomodels } from './models';
import * as namer from 'color-namer'
import * as adjectives from './adjectives'
import * as secretadjectives from './secretadjectives'
import * as adverbs from './adverbs'
import * as names from './names'
import { jobs, relations, namers} from './people'
import * as animals from './animals'
import * as owners from './owners'
import * as places from './places'
import * as harms from './harms'
import { provenance, provenanceFunctions } from './provenance'
import { conditions, gemverbs } from './conditions'

// flip a coin with a n * 100 percent chance of success
export function roll(chance = .5) {
  return Math.random() < chance;
}

const vowelsy = ['a', 'e', 'i', 'o', 'u', 'y'];
const vowels = ['a', 'e', 'i', 'o', 'u'];
const consonants = ['b', 'g', 'd', 'z', 'th', 'k', 'l', 'm', 'n', 'x', 'p', 'r', 's', 't', 'ph', 'ch', 'ps']

export const getDescription = async (color) => {
  const name = await getName(color);
  const desc = getDesc();
  return {
    name,
    desc
  }
}

async function getName(color) {
  const n = _.random(1, 2);
  let string = '';
  for (let i = 0; i < n; i++) {
    string += _.sample(consonants) + _.sample(vowelsy)
  }

  let suffix = _.sample(['ine', 'orum', 'ium', 'orundum', 'nium', 'tite', 'inium', 'itite', 'ite', 'ite', 'ite', 'ine'])

  const prefix = await getPrefix(color);
  let name = `${prefix}${string}${_.sample(consonants)}${suffix}`;
  name = caps(name);
  name = removeDuplicateWords(name);
  return name;
}

function removeDuplicateWords(str) {
  // split the string into words
  const words = str.split(' ');

  // add the words to a Set to remove duplicates
  const uniqueWords = new Set(words);

  // convert the Set back to an array and join the words into a string
  const uniqueString = Array.from(uniqueWords).join(' ');

  return uniqueString;
}

function gemVerb() {
  let verb = _.sample(gemverbs);
  let condition = _.sample(conditions);
  return `${verb} ${roll() ? condition : _.sample(adverbs)}.`
}

function getDesc() {
  let intro = roll() ?
  `${cap(anAdv())} ${adj()} ${noun()}`
  :
  roll() ? `${cap(adv())} ${adj()}`
  : `${cap(adj())} and ${adj()}`

  if (roll(.4)) {
    intro += '.'
  } else {
    intro += `, it ${gemVerb()}`
  }
  const loc = roll(.4) ? ` ${cap(location())}.` : '';

  const prov = roll(.4) ? ` ${cap(getProvenance())}.` : '';

  const power = roll(.4) ? ` ${cap(getPower())}.` : '';

  const warning = roll(.4) ? ` ${cap(getWarning())}.` : '';

  return intro + loc + prov + power + warning;
}

function getNamer() {
  let name = _.sample(namers);
  name += name.endsWith('s') ? "' " : "'s ";

  return name;
}

async function getPrefix(color) {
  let adjective = roll(.3) ? adj() +' ' : '';
  let col = '';
  if (roll(1)) {
    const name = await fetchColors(color).then(r => r);
    if (name) {
      col = name+' ';
    }
  }
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
            getFinder()
      : ''
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
   _.sample(['stashed', 'carried', 'hidden', 'lost', 'smuggled']) + ' in '+aan(_.sample(provenanceFunctions)());
  let val = `${caveat}${verb} by ${roll()?getDefiniteRelation():''}${_.sample(owners.owners)}`;
  return val;
}

function getWarning() {
  if (roll(.001)) return `Cannot be depicted by a computer.`;
  const caveat = roll() ? ' '+getCaveat() : '';
  return `Do not ${_.sample(harms.harms)}${caveat}`;
}

function getCaveat() {
  return _.sample(harms.caveats)
}

function getStatus() {
  return roll() ? _.sample(['true', 'biological', 'spiritual', 'ancestral', 'supposed', 'fugitive', 'former', 'disproved', 'disgraced', 'original', 'estranged', 'first', 'second', 'third', 'impostor', 'sometime', 'part-time'])+' ' : '';
}

function getRole() {
  return roll() ? _.sample(relations) :
  'personal '+_.sample(jobs);
  // 'pet '+_.sample(animals.animals);
}

function getRelation() {
  const claim = roll() ? _.sample(['someone', 'a person'])+' '+_.sample(['accused of being', 'recognized as', 'who resembled', 'claiming to be', 'known as', 'claiming to represent']) : '';

  return `${claim} the ${getStatus()}${getRole()} of `;
}

function getDefiniteRelation() {
  return `the ${getStatus()}${getRole()} of `;
}

function rumorVerb() {
  return _.sample(['once', 'often', 'sometimes', 'reportedly', 'notably', 'famously', 'reputed to be', 'said to be', 'presumed to be', 'rumored to be', 'claimed to be', 'widely supposed to be', 'formerly', 'once', 'occasionally', 'conclusively', 'legally', 'possibly', 'theoretically'])
}

function rumorPast() {
  return _.sample(['was once', 'was', 'famously', 'notably', 'reputed to have been', 'said to have been', 'presumed to have been', 'rumored to have been', 'claimed to have been', 'widely supposed to have been', 'may once have been'])
}

function rumor() {
  return _.sample(['reputed to', 'said to', 'presumed to', 'rumored to', 'claimed to', 'believed to', 'thought to', 'alleged to', 'reported to', ])
}

function pastVerb() {
  return _.sample(['ritually', 'formerly', 'once', 'occasionally', 'sporadically', 'conclusively', 'legally', 'illegally', 'sometimes'])
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
  const action = _.sample(['owned', 'occupied', 'inherited', 'disposed of', 'disguised', 'hidden', 'burnt', 'used', 'looted', 'destroyed', 'purchased', 'blessed', 'cursed', 'cleansed', 'haunted', 'frequented'])
  const disguise = getDisguise();
  return roll() ?
  ` ${pastVerb()} ${disguise} by ${roll()?getRelation():''}${_.sample(names)}` :
    ` ${rumorVerb()} ${action} by ${roll()?getRelation():''}${_.sample(names)}`;
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

export function aDate(startYear = 1900, endYear=1987) {
  const randomYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  return randomYear;
}

export function placeAdj() {
  return aan(_.sample(['abandoned', 'secret', 'disused', 'hidden', 'antique', 'underground', 'sunken', 'deserted', 'forgotten', 'ruined', 'burned', 'cryptic']))
}
export function place() {
  return _.sample(places)
}

export function getPlace() {
  return `${placeAdj()} ${place()}`
}

function aPlace() {
  return `${aan(place())}`;
}

function adjPlace() {
  return `${aan(_.sample(secretadjectives))} ${place()}`;
}
function foundIn() {
  return `${_.sample(['found', 'seen', 'detected', 'located', ])} ${roll() ? 'in ' + aDate()+' ' : ''}in`;
}

function aan(n) {
  return vowels.includes(n[0]) ? `an ${n}` : `a ${n}`;
}

function takenFrom() {
  return `${_.sample(['pilfered', 'taken', 'excavated', 'retrieved', 'looted', 'harvested', 'collected'])} from`;
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
  return _.sample(['specimen', 'example', 'fragment', 'variety', 'sample'])
}

function stripColors(colorName) {
    const stopwords = ['rose', 'color', 'oriental', 'hortense', 'picnic', 'light', 'dark', '(true)', 'red', 'blue', 'purple', 'green', 'yellow', 'orange', 'pink', 'brown', 'black', 'white', 'gray', 'grey', 'violet'];

    colorName = colorName.replace(/-/g, ' ');

    const words = colorName.split(' ');

    // filter out common color names
    const filteredWords = words.filter(word => !stopwords.includes(word.toLowerCase()));

    return filteredWords.join(' ');
}

// this gets and processes names for a given hex color
async function fetchColors(color) {
  // return false // turn off for now
  color = color.replace('#', ''); // removes the '#' character
  try {
    const response = roll() ? await fetch(`https://api.color.pizza/v1/?values=${color}&list=thesaurus`) :
                              await fetch(`https://api.color.pizza/v1/?values=${color}&list=ridgway`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    // console.log('Response:', data);

    // assuming the data structure has a 'value' property
    let colorValue = data.colors[0].name;

    colorValue = stripColors(colorValue)

    return colorValue;
  } catch (error) {
    console.error('Error:', error);
    // throw error; // rethrow the error if needed
    return false;
  }
}