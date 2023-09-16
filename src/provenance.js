import { pies } from './pies'
import { makes, models, types } from './cars.js'
import { roll } from './getDescription';
import { aDate } from './getDescription';

function animal() {
  return _.sample(['moose', 'skunk', 'jaguar', 'weasel', 'squirrel', 'lemur', 'goose', 'frog', 'rat', 'rabbit', 'musk ox'])
}

function car() {
console.log(_.sample(makes));
console.log(_.sample(types));
  const val = roll(1) ? aDate(1890, 1950) + ' ' + _.sample(makes) + ' ' + _.sample(types) :
    aDate(1910, 1930) + ' ' + _.sample(models);
    console.error('car:', val);
    return val
}

function pie() {
  return _.sample(pies);
}

export const provenance = [
  'owned',
  'stolen',
  'seen',
  'smelled',
  'touched',
  'sniffed',
  'dismissed',
  'tripped over',
  'given as a gift',
  'looked at',
  'thrown away',
  'thrown through a window',
  'hidden in a stocking',
  'displayed in a museum',
  'lost in a cave',
  'buried in the ground',
  'used as a paperweight',
  'carved into jewelry',
  'worn as a pendant',
  'auctioned at a gallery',
  'encased in glass',
  'counterfeited',
  'duplicated',
  'sold for blackmail money',
  'studied',
  'accidentally dropped',
  'set in a ring',
  'inspired a poem',
  'used in a spell',
  'swallowed accidentally',
  'lost',
  'carried for good luck',
  'sought after',
]

export const provenanceFunctions = [
  () => `${pie()} pie`,
  () => `taxidermied ${animal()}`,
  () => `${car()}`,
]