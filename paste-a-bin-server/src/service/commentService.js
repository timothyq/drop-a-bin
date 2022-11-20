const crypto = require("crypto");

const {
  dbCreateComment,
  dbGetCommentByObjectId,
  dbGetCommentByCommentId,
  dbUpdateComment,
  dbDeleteComment,
  dbGetCommentsByPasteId,
} = require("../dao/commentDao");

async function createComment(comment) {
  comment.ts = new Date().getTime();
  const objectId = await dbCreateComment(comment);
  const commentResult = await dbGetCommentByObjectId(objectId);
  const commentId = await generateUniqueCommentId(objectId);
  commentResult.commentId = commentId;
  commentResult._id = objectId;
  await dbUpdateComment(commentResult);
  return commentId;
}

async function getComment(commentId) {
  return await dbGetCommentByCommentId(commentId);
}

async function updateComment(comment) {
  await dbUpdateComment(comment);
  return await dbGetCommentByCommentId(comment.commentId);
}

async function deleteComment(commentId) {
  await dbDeleteComment(commentId);
}

async function getCommentsForPaste(pasteId) {
  return await dbGetCommentsByPasteId(pasteId);
}

async function generateUniqueCommentId(objectId) {
  let commentId = generateCommentId(objectId);
  while (true) {
    try {
      await dbGetCommentByCommentId(commentId);
    } catch (e) {
      break;
    }
    commentId = generateCommentId(objectId);
  }
  return commentId;
}

function generateCommentId(objectId) {
  const sha = crypto.createHash("sha1");
  sha.update(objectId.toString() + new Date().getTime());
  return btoa(sha.digest("hex").substring(0, 7)).replaceAll("=", "");
}

module.exports = {
  createComment,
  getComment,
  updateComment,
  deleteComment,
  getCommentsForPaste,
};
