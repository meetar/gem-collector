import { pies } from './pies'
import { makes, models, types } from './cars.js'
import { roll } from './getDescription';
import { aDate } from './getDescription';
import { getPlace } from './getDescription'

function animal() {
  return _.sample(['moose', 'skunk', 'jaguar', 'weasel', 'squirrel', 'lemur', 'goose', 'frog', 'rat', 'rabbit', 'musk ox'])
}

function car() {
  const val = roll() ? aDate(1890, 1950) + ' ' + _.sample(makes) + ' ' + _.sample(types) :
    aDate(1910, 1930) + ' ' + _.sample(models);
    return val
}

function pie() {
  return _.sample(pies);
}

export const provenance = [
  'owned',
  'purchased',
  'bought',
  'stolen',
  'seen',
  'smelled',
  'touched',
  'sniffed',
  'accepted',
  'rejected',
  'coveted',
  'loathed',
  'sung to',
  'dismissed',
  'destroyed',
  'gazed upon',
  'tripped over',
  'given as a gift',
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
  'used for nefarious ends',
  'used in alchemical experiments',
  'won in a wager',
  'lost in a wager',
]

export const provenanceFunctions = [
  () => `${pie()} pie`,
  () => `taxidermied ${animal()}`,
  () => `${car()}`,
]