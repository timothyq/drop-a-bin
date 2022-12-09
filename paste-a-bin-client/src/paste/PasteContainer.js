import RadioButtonGroup from "./RadioButtonGroup";
import IndividualButtonGroup from "../common/IndividualButtonGroup";
import Section from "../common/Section";
import { useEffect, useState } from "react";
import PasteDetailItem from "./PasteDetailItem";
import AutoResizingTextArea from "./AutoResizingTextArea";
import Dialog from "../common/Dialog";
import "./PasteContainer.css";
import PropTypes from "prop-types";

function PasteContainer({
  pasteData,
  isEditing,
  isCreating,
  onEdit,
  onDelete,
  onSave,
  onCancelEdit,
  currentUser,
}) {
  function formatTimestamp(ts) {
    const date = new Date(0);
    date.setUTCMilliseconds(ts);
    return date.toLocaleString();
  }

  function getTimestampAfterDays(numberOfDays) {
    return new Date().getTime() + numberOfDays * 86400000;
  }

  function getPasteToSave() {
    return {
      content: editorContent,
      user: pasteData.user,
      isPublic: editorIsPublic,
      isShared: editorIsShared,
      shareExpireTs: editorModifyShareDays
        ? getTimestampAfterDays(editorShareDays)
        : pasteData.shareExpireTs,
      sharePassword: editorSharePassword,
      isSelfDestroying: editorIsSelfDestroying,
      selfDestroyTs: editorModifySelfDestroyDays
        ? getTimestampAfterDays(editorSelfDestroyDays)
        : pasteData.selfDestroyTs,
      pasteId: isCreating ? null : pasteData.pasteId,
    };
  }

  const [editorContent, setEditorContent] = useState();
  useEffect(
    () => setEditorContent(pasteData.content),
    [pasteData.content, isEditing]
  );

  const [editorIsPublic, setEditorIsPublic] = useState();
  useEffect(
    () => setEditorIsPublic(pasteData.isPublic),
    [pasteData.isPublic, isEditing]
  );

  const [editorIsShared, setEditorIsShared] = useState();
  useEffect(
    () => setEditorIsShared(pasteData.isShared),
    [pasteData.isShared, isEditing]
  );

  const [editorModifyShareDays, setEditorModifyShareDays] = useState();
  useEffect(() => setEditorModifyShareDays(false), [isCreating, isEditing]);

  const [editorShareDays, setEditorShareDays] = useState();
  useEffect(() => setEditorShareDays(1), [isEditing]);

  const [editorSharePassword, setEditorSharePassword] = useState();
  useEffect(
    () => setEditorSharePassword(pasteData.sharePassword),
    [pasteData.sharePassword, isEditing]
  );

  const [editorIsSelfDestroying, setEditorIsSelfDestroying] = useState();
  useEffect(
    () => setEditorIsSelfDestroying(pasteData.isSelfDestroying),
    [pasteData.isSelfDestroying, isEditing]
  );

  const [editorModifySelfDestroyDays, setEditorModifySelfDestroyDays] =
    useState();
  useEffect(
    () => setEditorModifySelfDestroyDays(false),
    [isCreating, isEditing]
  );

  const [editorSelfDestroyDays, setEditorSelfDestroyDays] = useState();
  useEffect(() => setEditorSelfDestroyDays(1), [isEditing]);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  const showSharePasteControl =
    (isEditing && !editorIsPublic) ||
    (!isEditing && !pasteData.isPublic && pasteData.isShared);
  const showSharedFeatures =
    showSharePasteControl &&
    ((isEditing && editorIsShared) || (!isEditing && pasteData.isShared));
  const showShareExpiresAtControl =
    showSharedFeatures && !editorModifyShareDays;
  const showSharePasteForControl =
    showSharedFeatures && isEditing && editorModifyShareDays;
  const showSharePasswordControl = showSharedFeatures;

  const showSelfDestroyControl = isEditing || pasteData.isSelfDestroying;
  const showSelfDestroyFeatures =
    showSelfDestroyControl &&
    ((isEditing && editorIsSelfDestroying) ||
      (!isEditing && pasteData.isSelfDestroying));
  const showSelfDestroyAtControl =
    showSelfDestroyFeatures && !editorModifySelfDestroyDays;
  const showSelfDestroyAfterControl =
    showSelfDestroyFeatures && isEditing && editorModifySelfDestroyDays;

  const isContentValid = editorContent && editorContent.length > 0;
  const isPasswordValid =
    !editorIsShared || (editorSharePassword && editorSharePassword.length > 0);

  const editorButtons = isEditing
    ? [
        {
          text: "Save",
          theme: "primary",
          onClick: () => onSave(getPasteToSave()),
          disabled: !isContentValid || !isPasswordValid,
        },
        {
          text: "Cancel",
          theme: "secondary",
          onClick: () => setShowCancelConfirmation(true),
        },
      ]
    : currentUser === pasteData.user
    ? [
        { text: "Edit", theme: "primary", onClick: onEdit },
        {
          text: "Delete",
          theme: "danger",
          onClick: () => setShowDeleteConfirmation(true),
        },
      ]
    : [];

  return (
    <Section
      title={isCreating ? "Create Paste" : isEditing ? "Edit Paste" : "Paste"}
    >
      <div className="col-12 mb-4">
        <div className="card shadow-sm">
          <h3 className="card-header">
            {isCreating ? "New Paste" : pasteData.pasteId}
          </h3>
          <div className="card-body">
            <form className="d-grid gap-4">
              <PasteDetailItem
                itemName={"Content"}
                text={pasteData.content}
                showText={!isEditing}
                showControls={isEditing}
              >
                <label htmlFor="paste-content-input" hidden>
                  Content
                </label>
                <AutoResizingTextArea
                  id="paste-content-input"
                  placeholder="Paste your content here"
                  content={editorContent}
                  onChange={setEditorContent}
                />
                {!isContentValid && (
                  <small className="text-danger">*Required</small>
                )}
              </PasteDetailItem>

              <PasteDetailItem
                itemName={"Access"}
                text={pasteData.isPublic ? "Public" : "Private"}
                showText={!isEditing}
                showControls={isEditing}
              >
                <RadioButtonGroup
                  name="paste-access-input"
                  value={editorIsPublic}
                  onChange={(value) => {
                    setEditorIsPublic(value);
                    setEditorIsShared(false);
                  }}
                  options={[
                    { value: true, text: "Public" },
                    { value: false, text: "Private" },
                  ]}
                />
              </PasteDetailItem>

              {showSharePasteControl && (
                <PasteDetailItem
                  itemName={"Share Paste"}
                  text={
                    pasteData.isShared
                      ? `Shared at ${window.location.origin}/paste/${pasteData.pasteId}`
                      : "No"
                  }
                  showText={!isEditing}
                  showControls={isEditing}
                >
                  <RadioButtonGroup
                    name="paste-share-input"
                    value={editorIsShared}
                    onChange={(value) => {
                      setEditorIsShared(value);
                      setEditorSharePassword("");
                      setEditorShareDays(1);
                      setEditorModifyShareDays(true);
                    }}
                    options={[
                      { value: false, text: "No" },
                      { value: true, text: "Yes" },
                    ]}
                  />
                </PasteDetailItem>
              )}

              {showShareExpiresAtControl && (
                <PasteDetailItem
                  itemName={
                    pasteData.shareExpireTs > new Date().getTime()
                      ? "Share Expires At"
                      : "Share Expired At"
                  }
                  text={formatTimestamp(pasteData.shareExpireTs)}
                  showText={true}
                  showControls={isEditing}
                >
                  <button
                    type="button"
                    className="btn btn-sm btn-primary detail-input"
                    onClick={() => setEditorModifyShareDays(true)}
                  >
                    Modify
                  </button>
                </PasteDetailItem>
              )}

              {showSharePasteForControl && (
                <PasteDetailItem
                  itemName="Share Paste For"
                  showText={!isEditing}
                  showControls={isEditing}
                >
                  <RadioButtonGroup
                    name="paste-share-duration-input"
                    value={editorShareDays}
                    onChange={setEditorShareDays}
                    options={[
                      { value: 1, text: "1 Day" },
                      { value: 7, text: "7 Days" },
                      { value: 14, text: "14 Days" },
                    ]}
                  />
                </PasteDetailItem>
              )}

              {showSharePasswordControl && (
                <PasteDetailItem
                  itemName="Share Password"
                  text={pasteData.sharePassword}
                  showText={!isEditing}
                  showControls={isEditing}
                >
                  <label htmlFor="paste-password-input" hidden>
                    Share Password
                  </label>
                  <input
                    type="password"
                    className="form-control detail-input"
                    id="paste-password-input"
                    placeholder="Password for shared paste"
                    value={editorSharePassword}
                    onInput={(e) => setEditorSharePassword(e.target.value)}
                    required
                  />
                  {!isPasswordValid && (
                    <small className="text-danger">*Required</small>
                  )}
                </PasteDetailItem>
              )}

              {showSelfDestroyControl && (
                <PasteDetailItem
                  itemName="Self Destroy"
                  text={pasteData.isSelfDestroying ? "Yes" : "No"}
                  showText={!isEditing}
                  showControls={isEditing}
                >
                  <RadioButtonGroup
                    name="paste-self-destroy-input"
                    value={editorIsSelfDestroying}
                    onChange={(value) => {
                      setEditorIsSelfDestroying(value);
                      setEditorSelfDestroyDays(1);
                      setEditorModifySelfDestroyDays(true);
                    }}
                    options={[
                      { value: false, text: "No" },
                      { value: true, text: "Yes" },
                    ]}
                  />
                </PasteDetailItem>
              )}

              {showSelfDestroyAtControl && (
                <PasteDetailItem
                  itemName="Self Destroy At"
                  text={formatTimestamp(pasteData.selfDestroyTs)}
                  showText={true}
                  showControls={isEditing}
                >
                  <button
                    type="button"
                    className="btn btn-sm btn-primary detail-input"
                    onClick={() => setEditorModifySelfDestroyDays(true)}
                  >
                    Modify
                  </button>
                </PasteDetailItem>
              )}

              {showSelfDestroyAfterControl && (
                <PasteDetailItem
                  itemName="Self Destroy After"
                  showText={!isEditing}
                  showControls={isEditing}
                >
                  <RadioButtonGroup
                    name="paste-self-destroy-after-input"
                    value={editorSelfDestroyDays}
                    onChange={setEditorSelfDestroyDays}
                    options={[
                      { value: 1, text: "1 Day" },
                      { value: 7, text: "7 Days" },
                      { value: 14, text: "14 Days" },
                    ]}
                  />
                </PasteDetailItem>
              )}

              <small className="text-muted user-name-text">
                {pasteData.user}
              </small>

              {editorButtons.length > 0 && (
                <IndividualButtonGroup buttons={editorButtons} />
              )}
            </form>
          </div>
        </div>
      </div>
      {showDeleteConfirmation && (
        <Dialog
          title="Confirm delete"
          message="Are you sure you want to delete this paste? This action cannot be undone."
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
            onCancelEdit();
          }}
          negativeAction={() => setShowCancelConfirmation(false)}
        />
      )}
    </Section>
  );
}

PasteContainer.propTypes = {
  pasteData: PropTypes.PropTypes.exact({
    content: PropTypes.string.isRequired,
    isPublic: PropTypes.bool.isRequired,
    isShared: PropTypes.bool.isRequired,
    shareExpireTs: PropTypes.number,
    sharePassword: PropTypes.string.isRequired,
    isSelfDestroying: PropTypes.bool.isRequired,
    selfDestroyTs: PropTypes.number,
    user: PropTypes.string.isRequired,
    pasteId: PropTypes.string,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
  currentUser: PropTypes.string,
};

export default PasteContainer;
