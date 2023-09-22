import { roll } from "./getDescription"
import * as _ from 'lodash'

export const Intro = [
  "Oh hello, how did you get in here?! The restroom's down the hall...",
  "These? I'm cataloguing these specimens for the upcoming unusual minerology exhibit. They're from the collection of Dr. Esterhazy.",
  "Curious? Well... they are pretty neat... I suppose it won't hurt to show you a few."
]

export const greetings = [
  "You sure arrived at an inconvenient time.",
  "Just don't tell anyone I let you in here.",
  "You're in luck, the Head Curator just brought in another box from the archives.",
  "So far I'm just organizing by vibes.",
  "I'm starting to feel a little funny.",
  "Want to see some more weird rocks?",
  "I'm pretty sure these are all haunted.",
  "Can you help me lift this one?",
  "Hang on a second, I need a fresh ledger book."
]

export function getCoda() {
  return roll(0) ? null :
  _.sample([
    " ...Well.",
    " ...I think I read about this one once.",
    " ...This one makes me nervous.",
    " ...I'm not sure this is accurate.",
    " ...I wouldn't get too close."
  ])
}