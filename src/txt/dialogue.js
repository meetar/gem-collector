import { roll } from ".././getDescription"
import * as _ from 'lodash'

export const IntroLines = [
  "Oh hello, how did you get in here?! The restroom's down the hall...",
  "These? I'm cataloguing specimens for the upcoming rare minerals exhibit. They're from the collection of Dr. Esterhazy.",
  "Curious, huh? Well... they are pretty neat... I suppose it won't hurt to show you a few.",
  "(Feel free to zoom in and rotate them. Just wash your hands afterward.)"
]

export const asides = [
  "You sure arrived at an inconvenient time.",
  "Just don't tell anyone I let you in here.",
  "You're in luck, I just found another box.",
  "So far I'm just organizing by vibes.",
  "I'm starting to feel a little funny.",
  "Want to see some more weird rocks?",
  "I'm pretty sure these are all haunted.",
  "Can you help me lift this one?",
  "Maybe there are some leftover snacks in the conference room.",
  "I should have ordered takeout.",
  "Hang on, I've run out of space on this drive.",
  "Wow, it's getting late, and I've barely started.",
  "I feel like I'm missing a few.",
  "This is taking forever.",
  "God, there's so many.",
  "Who was this so-called Dr. Esterhazy, anyhow?",
  "Hey, want to take over? No? Maybe after a few more?",
  "I think I'm almost done! ...with this box!",
  "I'm beginning to regret volunteering for this cataloguing job...",
  "Okay, It's all starting to make sense. I think.",
  "...I think that's most of them. Oh wait, here's another crate.",
]

export function getCoda() {
  return roll(.6) ? null :
  _.sample([
    " ...Well.",
    " ...Hmm.",
    " ...I think I read about this one once.",
    " ...This one makes me nervous.",
    " ...I'm not sure this description is accurate.",
    " ...I wouldn't get too close.",
    " ...It's heavier than it looks.",
    " ...I can't look away.",
    " ...We might have two of these.",
    " ...I don't know who wrote these.",
    " ...I'm not sure how you'd check that.",
    " ...This one might be fake.",
    " ...Intriguing.",
    " ...Fascinating.",
    " ...I kind of want it.",
    " ...They won't miss one or two, right?",
    " ...I'm not 100% sure these were ethically sourced.",
    " ...Let's put that one back.",
    " ...Do you hear a high-pitched noise?",
    " ...It might be a teensy bit radioactive.",
    " ...This one needs a special case.",
    " ...I should probably be wearing gloves.",
    " ...How odd.",
    " ...They don't teach you this in grad school.",
    " ...You might want to take two steps back.",
    " ...Cool!",
  ])
}