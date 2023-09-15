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
import * as people from './people'
import * as animals from './animals'
import * as owners from './owners'
import * as places from './places'
import * as harms from './harms'
import { pies } from './pies'

function roll(chance = .5) {
  return Math.random() < chance;
}

const vowelsy = ['a', 'e', 'i', 'o', 'u', 'y'];
const vowels = ['a', 'e', 'i', 'o', 'u'];
const consonants = ['b', 'g', 'd', 'z', 'th', 'k', 'l', 'm', 'n', 'x', 'p', 'r', 's', 't', 'ph', 'ch', 'ps']
function getName(color) {
  const n = _.random(2, 5);
  let string = '';
  for (let i = 0; i < n; i++) {
    string += _.sample(consonants) + _.sample(vowelsy)
  }
  // console.log(string);

  let adjective = roll(.3) ? adj() +' ' : '';
  let col = roll(1) ? color+' ' : '';
  // let col = roll(.3) ? color+' ' : '';
  let suffix = roll(.2) ? 'ine' : roll(.2) ? 'orum' : roll(.2) ? 'orundum' : roll(.2) ? 'inium' : roll(.2) ? 'itite' : 'ite'
  return {
    name: `${adjective}${col}${string}${_.sample(consonants)}${suffix}`,
    desc: desc()
  }
}  

function location() {
  let loc = roll(1) ? _.sample(['First', 'Last', 'The only known '+noun()+' ', 'This '+noun()])+ ' ' : '';
  loc += roll(1) ? 
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

function desc() {
  const intro = roll() ? 
  `A ${adv()} ${adj()} ${noun()}.`
  : 
  `${cap(`${adv()} ${adj()}.`)}`

  const loc = cap(location());
  
  const prov = cap(getProvenance());

  const power = cap(getPower())
  
  const warning = cap(getWarning())

  // return power;
  return intro+' '+loc+'. ' + prov + ' ' + power + ' ' + warning;
}  

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function animal() {
  return _.sample(['moose', 'skunk', 'jaguar', 'weasel', 'squirrel', 'lemur', 'goose', 'frog', 'rat', 'rabbit', 'musk ox'])
}

function pie() {
  return _.sample(pies);
}
function getProvenance() {
  // const caveat = roll() ? ' '+getCaveat() : '';
  // let verb = _.sample(['owned', 'stolen', 'seen', 'smelled', 'touched', 'sniffed', 'dismissed', 'tripped over', 'given as a gift', 'looked at', 'thrown away', 'thrown through a window', `baked in a ${pie()} pie`, 'hidden in a stocking', `hidden in a taxidermied ${animal()}`])
  let verb = _.sample([`baked in a ${pie()} pie`])
  return `May once have been ${verb} by ${roll()?getDefiniteRelation():''} ${_.sample(owners.owners)}.`;
}

function getWarning() {
  const caveat = roll(1) ? ' '+getCaveat() : '';
  return `Do not ${_.sample(harms.harms)}${caveat}.`;
}

function getCaveat() {
  return _.sample(harms.caveats)
}

function getRelation() {
  const claim = roll() ? _.sample(['someone claiming to be', 'someone known as', 'a person claiming to be']) : '';
  const status = roll() ? _.sample(['true', 'biological', 'supposed', 'fugitive', 'former', 'disproved', 'disgraced', 'original', 'estranged', 'first', 'second', 'third']) : '';

  const relation = roll(1) ? _.sample(people.relations)+' of' :
    'personal '+_.sample(people.servants)+' of';

  return `${claim} the ${status} ${relation}`;
}

function getDefiniteRelation() {
  const relation = roll(1) ? _.sample(people.relations)+' of' :
    'personal '+_.sample(people.servants)+' of';

  return `the ${status} ${relation}`;
}

function rumorVerb() {
  return _.sample(['reputed to be', 'said to have been', 'presumed to be', 'rumored to be', 'claimed to be', 'widely supposed to be', 'formerly', 'once', 'occasionally', 'conclusively', 'legally'])
}

function rumor() {
  return _.sample(['reputed to', 'said to', 'presumed to', 'rumored to', 'claimed to', ])
}

function rumorPast() {
  return _.sample(['formerly', 'once', 'occasionally', 'sporadically', 'conclusively', 'legally'])
}

function grant() {
  let grant = _.sample(['grant','bestow']);
  grant += ' the '+_.sample(['power', 'ability']);
  return grant
}
function getPower() {
  const action = roll(.33) ?
    `${rumor()} ${grant()} to ${_.sample(animals.animalLikeVerbs)} like the ${_.sample(animals.animalAdjectives)} ${_.sample(animals.animals)} of ${_.sample(animals.remotePlaces)}.`
  : roll() ?
    `${rumor()} ${grant()} to ${_.sample(animals.animalVerbs)} the ${_.sample(animals.animalAdjectives)} ${_.sample(animals.animals)} of ${_.sample(animals.remotePlaces)}.`
    : `${rumor()} ${grant()} of ${_.sample(animals.superpowers)}.`
    return action;
}

function getOwner() {
  const action = _.sample(['owned', 'occupied', 'inherited', 'disposed of', 'disguised', 'hidden', 'burnt', 'used', 'looted', 'destroyed', 'purchased', 'blessed', 'cursed', 'ritually cleansed'])
  const disguise = getDisguise();
  return roll() ?
  ` ${rumorPast()} ${disguise} by ${roll()?getRelation():''} ${_.sample(names)}` :
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
    'been confused for',
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
    'modeled as',
  ])+' '+aPlace();
}

function getCar() {
  return `${aDate()} ${carMake()}`
}

function aDate(startYear = 1900, endYear=1987) {
  const randomYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  return ' in '+randomYear;
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
  return `${_.sample(['found', 'seen', 'detected', 'located', ])} ${roll(1) ? aDate()+' ' : ''}in`;
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
  return _.sample(['specimen', 'example', 'fragment', 'instance', 'representative', 'variety', 'sample'])
}
export const getDescription = async (color) => {
  // let colorn = namer(color);
  let colorn = await fetchColors(color);
  console.log('>>> >>> colornames:', colorn);
    return getName(colorn);
    // return getName(namer(color).basic[0].name);
}

async function fetchColors(color) {
  color = color.replace('#', ''); // Removes the '#' character

  try {
    const response = await fetch(`https://api.color.pizza/v1/?values=${color}&list=thesaurus`);
    // const response = await fetch(`https://api.color.pizza/v1/?values=${color}&list=ridgway`); // maybe
    // const response = await fetch(`https://api.color.pizza/v1/?values=${color}&list=ral`);
    // const response = await fetch(`https://api.color.pizza/v1/?values=${color}&list=osxcrayons`);
    // const response = await fetch(`https://api.color.pizza/v1/?values=${color}&list=ntc`);
    // const response = await fetch(`https://api.color.pizza/v1/?values=${color}&list=nbsIscc`);
    // const response = await fetch(`https://api.color.pizza/v1/?values=${color}&list=leCorbusier`);
    // const response = await fetch(`https://api.color.pizza/v1/?values=${color}&list=japaneseTraditional`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    console.log('Response:', data);
    
    // Assuming the data structure has a 'value' property
    const colorValue = data.colors[0].name;
    
    // Now you can use 'colorValue' for further processing
    return colorValue;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error if needed
  }
}