const crypto = require("crypto");

const {
  dbGetPasteByPasteId,
  dbCreatePaste,
  dbUpdatePaste,
  dbDeletePaste,
  dbGetPasteByObjectId,
  dbGetLatest,
  dbGetPastesByUser,
} = require("../dao/pasteDao");

async function createPaste(paste) {
  paste.ts = new Date().getTime();
  const objectId = await dbCreatePaste(paste);
  const pasteResult = await dbGetPasteByObjectId(objectId);
  const pasteId = await generateUniquePasteId(objectId);
  pasteResult.pasteId = pasteId;
  pasteResult._id = objectId;
  await dbUpdatePaste(pasteResult);
  return pasteId;
}

// Interesting way to check the different scenarios to
// decide whether to return the paste or not. Trying to figure
// out a way to do this alternatively without the use of so many
// else if statements, however I can't think of any. Nice.
async function getPaste(pasteId, user, password) {
  const paste = await dbGetPasteByPasteId(pasteId);
  if (paste.isPublic) {
    return paste;
  } else if (paste.user === user) {
    return paste;
  } else if (!paste.isShared) {
    return { error: AccessError.PasteNotFound };
  } else if (paste.shareExpireTs < new Date().getTime()) {
    return { error: AccessError.PasteNotFound };
  } else if (!password) {
    return { error: AccessError.PasteIsPasswordProtected };
  } else if (paste.sharePassword !== password) {
    return { error: AccessError.PastePasswordIncorrect };
  } else {
    return paste;
  }
}

async function updatePaste(paste) {
  await dbUpdatePaste(paste);
  return await dbGetPasteByPasteId(paste.pasteId);
}

async function deletePaste(pasteId) {
  await dbDeletePaste(pasteId);
}

async function generateUniquePasteId(objectId) {
  let linkId = generateLinkId(objectId);
  while (true) {
    try {
      await dbGetPasteByPasteId(linkId);
    } catch (e) {
      break;
    }
    linkId = generateLinkId(objectId);
  }
  return linkId;
}

async function getHubPastes(user) {
  const latest = await dbGetLatest();
  if (user) {
    const yourPastes = await dbGetPastesByUser(user);
    return { yourPastes, latest };
  } else {
    return { latest };
  }
}

// I haven't used crypto, but this is a cool way to
// create an id.
function generateLinkId(objectId) {
  const sha = crypto.createHash("sha1");
  sha.update(objectId.toString() + new Date().getTime());
  return btoa(sha.digest("hex").substring(0, 7)).replaceAll("=", "");
}

const AccessError = {
  PasteNotFound: "PasteNotFound",
  PasteIsPasswordProtected: "PasteIsPasswordProtected",
  PastePasswordIncorrect: "PastePasswordIncorrect",
};

module.exports = {
  createPaste,
  getPaste,
  updatePaste,
  deletePaste,
  getHubPastes,
  AccessError,
};
