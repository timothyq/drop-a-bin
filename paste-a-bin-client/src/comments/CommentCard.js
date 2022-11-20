import IndividualButtonGroup from "../common/IndividualButtonGroup";
import AutoResizingTextArea from "../paste/AutoResizingTextArea";
import { useEffect, useState } from "react";
import Dialog from "../common/Dialog";
import "./CommentCard.css";
import PropTypes from "prop-types";

function CommentCard({
  content,
  username,
  currentUser,
  isCreating,
  onSave,
  onDelete,
}) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  const [isEditing, setIsEditing] = useState();
  const [editorContent, setEditorContent] = useState();
  useEffect(() => setEditorContent(content), [content, isEditing]);
  useEffect(() => {
    isCreating && setIsEditing(true);
  }, [isCreating]);

  const buttons = isCreating
    ? [
        {
          text: "Post",
          theme: "primary",
          disabled: !editorContent || editorContent.length === 0,
          onClick: () => {
            onSave(editorContent);
            setEditorContent("");
          },
        },
      ]
    : isEditing
    ? [
        {
          text: "Save",
          theme: "primary",
          disabled: !editorContent || editorContent.length === 0,
          onClick: () => {
            onSave(editorContent);
            setIsEditing(false);
          },
        },
        {
          text: "Cancel",
          theme: "secondary",
          onClick: () => setShowCancelConfirmation(true),
        },
      ]
    : currentUser === username
    ? [
        { text: "Edit", theme: "primary", onClick: () => setIsEditing(true) },
        {
          text: "Delete",
          theme: "danger",
          onClick: () => setShowDeleteConfirmation(true),
        },
      ]
    : [];

  return (
    <div className="col-12 mb-4">
      <div className="card shadow-sm">
        {(isCreating || isEditing) && (
          <h5 className="card-header">
            <label htmlFor="comment-content-input">
              {isCreating ? "New Comment" : "Edit Comment"}
            </label>
          </h5>
        )}
        <div className="card-body">
          <form>
            {!isEditing && (
              <div className="col-12">
                <p className="mb-0 comment-text">{content}</p>
              </div>
            )}

            {isEditing && (
              <div className="col-12">
                <AutoResizingTextArea
                  id="comment-content-input"
                  placeholder="Enter your comment here"
                  content={editorContent}
                  onChange={setEditorContent}
                />
              </div>
            )}

            <small className="text-muted user-name-text">{username}</small>

            {buttons.length > 0 && (
              <div className="mt-4">
                <IndividualButtonGroup buttons={buttons} />
              </div>
            )}
          </form>
        </div>
      </div>
      {showDeleteConfirmation && (
        <Dialog
          title="Confirm delete"
          message="Are you sure you want to delete this comment? This action cannot be undone."
          positiveOption="Yes"
          negativeOption="No"
          positiveAction={() => {
            setShowDeleteConfirmation(false);
            onDelete();
          }}
          negativeAction={() => setShowDeleteConfirmation(false)}
        />
      )}
      {showCancelConfirmation && (
        <Dialog
          title="Discard unsaved changes"
          message="Are you sure you want to cancel without saving? All changes will be lost."
          positiveOption="Yes"
          negativeOption="No"
          positiveAction={() => {
            setShowCancelConfirmation(false);
            setIsEditing(false);
          }}
          negativeAction={() => setShowCancelConfirmation(false)}
        />
      )}
    </div>
  );
}

CommentCard.propTypes = {
  content: PropTypes.string.isRequired,
  username: PropTypes.string,
  currentUser: PropTypes.string,
  isCreating: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default CommentCard;
