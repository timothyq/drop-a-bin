import Section from "../common/Section";
import CommentCard from "./CommentCard";
import { useEffect, useState } from "react";
import {
  createComment,
  deleteComment,
  getCommentsForPaste,
  updateComment,
} from "./commentApi";
import MessageCard from "../common/MessageCard";
import PropTypes from "prop-types";

function CommentsContainer({ currentUser, pasteId }) {
  async function onSave(commentId, content) {
    if (commentId) {
      await updateComment({
        pasteId,
        content,
        commentId,
      });
    } else {
      await createComment({
        pasteId,
        content,
        user: currentUser,
      });
    }
    setChanged(new Date().getTime());
  }

  async function onDelete(commentId, index) {
    await deleteComment(commentId);
    setLastDeletedIndex(index);
    setCommentDeletedMessageCardExpireTs(new Date().getTime() + 5000);
    setChanged(new Date().getTime());
  }

  const [lastDeletedIndex, setLastDeletedIndex] = useState(0);
  const [
    commentDeletedMessageCardExpireTs,
    setCommentDeletedMessageCardExpireTs,
  ] = useState(0);
  const [commentsData, setCommentsData] = useState([]);
  const [changed, setChanged] = useState(0);

  useEffect(() => {
    (async () => {
      const data = await getCommentsForPaste(pasteId);
      setCommentsData(data);
    })();
  }, [pasteId, changed]);

  const commentCards = [];
  if (commentsData) {
    for (let i = 0; i < commentsData.length; i++) {
      const comment = commentsData[i];
      commentCards.push(
        <CommentCard
          key={comment.commentId}
          content={comment.content}
          username={comment.user}
          currentUser={currentUser}
          onSave={(content) => onSave(comment.commentId, content)}
          onDelete={() => onDelete(comment.commentId, i)}
        />
      );
    }
  }

  const commentDeletedMessageCard = commentDeletedMessageCardExpireTs >
    new Date().getTime() && (
    <div className="mb-4" key="deleted-message-card">
      <MessageCard
        title="Comment Deleted"
        message={`The comment has been successfully deleted.`}
        instruction="This message will be dismissed"
        theme="success"
        expireTs={commentDeletedMessageCardExpireTs}
        onFinish={() => setCommentDeletedMessageCardExpireTs(0)}
      />
    </div>
  );
  commentCards.splice(lastDeletedIndex, 0, commentDeletedMessageCard);

  return (
    <div>
      {(currentUser || (commentCards && commentCards.length > 1)) && (
        <Section title="Comments">
          {currentUser && (
            <CommentCard
              isCreating
              onSave={(content) => onSave(null, content)}
              content=""
            />
          )}
          {commentCards}
        </Section>
      )}
    </div>
  );
}

CommentsContainer.propTypes = {
  currentUser: PropTypes.string,
  pasteId: PropTypes.string.isRequired,
};

export default CommentsContainer;
