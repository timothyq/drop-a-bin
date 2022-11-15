const { pastesCollection } = require("../db");

async function dbCreatePaste(paste) {
  const result = await pastesCollection.insertOne(paste);
  if (!result || !result.acknowledged || !result.insertedId) {
    throw new Error("Insertion Failed");
  }
  return result.insertedId;
}

async function dbGetPasteByObjectId(objectId) {
  const paste = await pastesCollection.findOne({ _id: objectId });
  if (!paste) {
    throw new Error("Lookup Failed");
  }
  cleanOutput(paste);
  return paste;
}

async function dbGetPasteByPasteId(pasteId) {
  const paste = await pastesCollection.findOne({ pasteId });
  if (
    !paste ||
    (paste.isSelfDestroying && paste.selfDestroyTs < new Date().getTime())
  ) {
    throw new Error("Lookup Failed");
  }
  cleanOutput(paste);
  return paste;
}

async function dbUpdatePaste(paste) {
  let result;
  if (paste._id) {
    result = await pastesCollection.updateOne(
      { _id: paste._id },
      { $set: paste }
    );
  } else {
    result = await pastesCollection.updateOne(
      { pasteId: paste.pasteId },
      { $set: paste }
    );
  }
  if (!result || !result.acknowledged) {
    throw new Error("Update Failed");
  }
}

async function dbDeletePaste(pasteId) {
  const result = await pastesCollection.deleteOne({ pasteId });
  if (!result || !result.acknowledged || result.deletedCount !== 1) {
    throw new Error("Delete Failed");
  }
}

async function dbGetLatest() {
  const result = await pastesCollection.find().sort({ ts: "desc" }).limit(10);
  if (!result) {
    throw new Error("Get latest Failed");
  }
  const pastes = (await result.toArray()).filter(
    (paste) =>
      paste.isPublic &&
      (!paste.isSelfDestroying || paste.selfDestroyTs > new Date().getTime())
  );
  pastes.forEach(cleanOutput);
  return pastes;
}

async function dbGetPastesByUser(user) {
  const result = await pastesCollection.find({ user }).sort({ ts: "desc" });
  if (!result) {
    throw new Error("Get user pastes Failed");
  }
  const pastes = (await result.toArray()).filter(
    (paste) =>
      !paste.isSelfDestroying || paste.selfDestroyTs > new Date().getTime()
  );
  pastes.forEach(cleanOutput);
  return pastes;
}

function cleanOutput(paste) {
  delete paste._id;
  delete paste.ts;
}

module.exports = {
  dbCreatePaste,
  dbGetPasteByPasteId,
  dbUpdatePaste,
  dbDeletePaste,
  dbGetPasteByObjectId,
  dbGetLatest,
  dbGetPastesByUser,
};
