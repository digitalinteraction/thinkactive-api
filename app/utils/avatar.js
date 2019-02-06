const avatars = [
  'deer',
  'boar',
  'giraffe',
  'dog',
  'octopus',
  'cow',
  'horse',
  'elephant',
  'badger',
  'bear',
  'duck',
  'goat',
  'hedgehog',
  'rhinoceros',
  'kangaroo',
  'panda',
  'ladybird',
  'parrot',
  'fox',
  'owl',
  'penguin',
  'antelope',
  'bee',
  'buffalo',
  'tiger',
  'pig',
  'lion',
  'donkey',
  'hippopotamus',
  'crocodile',
  'zebra',
  'hamster',
  'wolf',
  'frog',
  'monkey',
  'koala',
  'sheep',
  'puma',
  'reindeer',
  'snake',
  'hen',
  'cat',
  'snail',
  'camel',
  'bunny',
  'squirrel',
  'walrus',
  'mouse'
];

const colours = [
  'red',
  'blue',
  'green',
  'orange',
  'purple',
  'yellow'
];

module.exports = {
  // TODO: Update function to ensure that we don't use duplicate
  generate: (numberOfAvatars, numberOfGroups) => {
    if (numberOfAvatars > (avatars.length * colours.length)) {
      throw new Error(`You must not exceed ${(avatars.length * colours.length)} avatars in each deployment`);
    }

    // check we don't have more groups than avatars
    if (numberOfGroups > numberOfAvatars) {
      throw new Error('You cannot create more groups than you have avatars');
    }

    // check we don't create more groups than colours
    if (numberOfGroups > colours.length) {
      throw new Error(`You cannot have more than ${colours.length} groups`);
    }

    const identites = [];

    // loop through each avatar and associate with a colour group and number
    for (let i = 0; i < numberOfAvatars; i += 1) {
      const colourIndex = Math.floor(i / Math.ceil(numberOfAvatars / numberOfGroups));
      const avatarIndex = i % avatars.length;

      identites.push({
        colour: colours[colourIndex],
        animal: avatars[avatarIndex],
        avatar: `${colours[colourIndex]}-${avatars[avatarIndex]}`
      });
    }

    return identites;
  }
};
