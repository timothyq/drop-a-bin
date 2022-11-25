const { createComment } = require("../service/commentService");
const { createPaste } = require("../service/pasteService");

const usernames = [
  "boneshaker",
  "2kool",
  "datstick2",
  "hamsoda",
  "ednamode",
  "netpiebee",
  "pulsarpie",
  "rollingrn",
  "sputnik1",
  "fishlemon",
];
const sentences = [
  "Enim sed faucibus turpis in. Egestas dui id ornare arcu.",
  "Tortor condimentum lacinia quis vel eros. Enim nec dui nunc mattis enim ut tellus elementum sagittis.",
  "Rhoncus mattis rhoncus urna neque viverra justo nec. Diam vel quam elementum pulvinar etiam non quam.",
  "Varius vel pharetra vel turpis nunc eget. Varius sit amet mattis vulputate enim nulla aliquet porttitor lacus.",
  "Lacus viverra vitae congue eu consequat ac. Mattis molestie a iaculis at erat pellentesque adipiscing.",
  "Pharetra diam sit amet nisl suscipit adipiscing. A lacus vestibulum sed arcu.",
  "Aliquam ultrices sagittis orci a scelerisque purus semper. Egestas sed sed risus pretium quam vulputate dignissim suspendisse.",
  "Eu tincidunt tortor aliquam nulla facilisi. Ipsum dolor sit amet consectetur.",
  "Sapien pellentesque habitant morbi tristique senectus et. Nibh praesent tristique magna sit amet purus.",
  "Morbi tristique senectus et netus et malesuada fames. Dolor sit amet consectetur adipiscing.",
  "Diam quam nulla porttitor massa id. Pharetra magna ac placerat vestibulum.",
  "Feugiat vivamus at augue eget arcu dictum. Laoreet sit amet cursus sit.",
  "Senectus et netus et malesuada fames ac turpis egestas integer. Elit ullamcorper dignissim cras tincidunt.",
  "Quam pellentesque nec nam aliquam sem et. Hac habitasse platea dictumst vestibulum rhoncus est.",
  "Laoreet sit amet cursus sit amet. Sed risus pretium quam vulputate dignissim.",
  "Accumsan lacus vel facilisis volutpat est velit egestas dui. Integer feugiat scelerisque varius morbi.",
  "Accumsan in nisl nisi scelerisque eu ultrices vitae. Viverra justo nec ultrices dui sapien eget.",
  "Eget dolor morbi non arcu risus quis varius quam quisque. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque.",
  "Est ante in nibh mauris cursus mattis molestie. Urna id volutpat lacus laoreet non curabitur gravida.",
  "Nibh mauris cursus mattis molestie a. Integer quis auctor elit sed vulputate mi sit.",
  "Facilisi morbi tempus iaculis urna id volutpat lacus. Quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor.",
  "Eget felis eget nunc lobortis mattis aliquam faucibus. Nam at lectus urna duis.",
  "Dolor morbi non arcu risus. Sed libero enim sed faucibus turpis in eu mi bibendum.",
  "Egestas dui id ornare arcu odio ut sem nulla. Elit at imperdiet dui accumsan sit.",
  "Quis ipsum suspendisse ultrices gravida dictum fusce. Vitae aliquet nec ullamcorper sit amet risus nullam.",
  "Gravida in fermentum et sollicitudin. Faucibus ornare suspendisse sed nisi.",
  "Dignissim diam quis enim lobortis scelerisque fermentum dui. Urna nunc id cursus metus.",
  "Ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Nisl vel pretium lectus quam.",
  "In est ante in nibh mauris cursus mattis. Quis risus sed vulputate odio ut enim blandit volutpat.",
  "Duis ultricies lacus sed turpis. Tempus urna et pharetra pharetra massa massa ultricies mi.",
  "Velit scelerisque in dictum non consectetur a erat nam at. Faucibus interdum posuere lorem ipsum dolor.",
  "Vitae tortor condimentum lacinia quis vel eros donec. Aliquet risus feugiat in ante metus dictum at tempor commodo.",
  "Massa massa ultricies mi quis hendrerit dolor magna eget est. Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras.",
  "Varius vel pharetra vel turpis nunc eget lorem dolor. Tortor vitae purus faucibus ornare suspendisse.",
  "Sit amet purus gravida quis blandit turpis cursus in hac. Facilisi morbi tempus iaculis urna id volutpat lacus.",
  "Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque. Aliquam sem et tortor consequat id porta nibh venenatis.",
  "Vitae congue mauris rhoncus aenean vel. Nibh nisl condimentum id venenatis.",
  "Nunc eget lorem dolor sed viverra ipsum nunc aliquet. Enim ut tellus elementum sagittis.",
  "Amet nulla facilisi morbi tempus iaculis urna id. Lobortis mattis aliquam faucibus purus in massa tempor nec feugiat.",
];

const pasteIds = [];

function randomSelect(arr, number) {
  const result = [];
  const index = Math.floor(Math.random() * arr.length);
  for (let i = 0; i < number; i++) {
    result.push(arr[(index + i) % arr.length]);
  }
  return result;
}

function getRandomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

function getRandomBoolean(trueProbability) {
  return Math.random() < trueProbability;
}

async function populate() {
  for (let i = 0; i < 1000; i++) {
    const isPublic = getRandomBoolean(0.7);
    const isShared = !isPublic && getRandomBoolean(0.8);
    const isSelfDestroying = getRandomBoolean(0.2);

    const paste = {
      content: randomSelect(sentences, getRandomInt(5, 20)).join(" "),
      user: randomSelect(usernames, 1)[0],
      isPublic,
      isShared,
      shareExpireTs: isShared ? 1679981879076 : 0,
      sharePassword: isShared ? "1234" : "",
      isSelfDestroying,
      selfDestroyTs: isSelfDestroying ? 1679981879076 : 0,
    };
    const pasteId = await createPaste(paste);
    pasteIds.push(pasteId);
  }
  for (let i = 0; i < 5000; i++) {
    const comment = {
      pasteId: randomSelect(pasteIds, 1)[0],
      content: randomSelect(sentences, 1)[0],
      user: randomSelect(usernames, 1)[0],
    };
    await createComment(comment);
  }
  console.log("Done!");
}

populate().then();
