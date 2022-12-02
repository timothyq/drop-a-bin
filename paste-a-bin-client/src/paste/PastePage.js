import { useEffect, useState } from "react";
import PasteContainer from "./PasteContainer";
import CommentsContainer from "../comments/CommentsContainer";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  createPaste,
  deletePaste,
  getPasteData,
  updatePaste,
} from "./pasteApi";
import MessageCard from "../common/MessageCard";
import PasteAccessControl from "./PasteAccessControl";
import PropTypes from "prop-types";

function PastePage({ currentUser }) {
  // It might make more sense to instantiate your hooks before your functions, as you use hooks within your functions.
  // It'll make the code a bit easier to follow.
  function onEdit() {
    navigate(`/paste/${pasteId}?edit`);
  }

  function onCancel() {
    if (isCreatingPaste) {
      setCreationCancelledMessageCardExpireTs(new Date().getTime() + 5000);
    } else {
      navigate(`/paste/${pasteId}`);
    }
  }

  async function onSave(pasteToSave) {
    if (isCreatingPaste) {
      const res = await createPaste(pasteToSave);
      setCreatedMessageCardExpireTs(new Date().getTime() + 5000);
      navigate(`/paste/${res.pasteId}`);
    } else if (isEditingPaste) {
      await updatePaste(pasteToSave);
      setUpdatedMessageCardExpireTs(new Date().getTime() + 5000);
      navigate(`/paste/${pasteId}`);
    }
  }

  async function onDelete() {
    await deletePaste(pasteData.pasteId);
    setDeletedMessageCardExpireTs(new Date().getTime() + 5000);
  }

  const now = new Date().getTime();
  const navigate = useNavigate();
  const { pasteId } = useParams();
  const [searchParams] = useSearchParams();
  const isCreatingPaste = searchParams.has("create");
  const isEditingPaste = isCreatingPaste || searchParams.has("edit");

  const [pasteRequestError, setPasteRequestError] = useState("");
  const [pastePassword, setPastePassword] = useState("");
  const [updatedMessageCardExpireTs, setUpdatedMessageCardExpireTs] =
    useState(0);
  const [createdMessageCardExpireTs, setCreatedMessageCardExpireTs] =
    useState(0);
  const [deletedMessageCardExpireTs, setDeletedMessageCardExpireTs] =
    useState(0);
  const [
    creationCancelledMessageCardExpireTs,
    setCreationCancelledMessageCardExpireTs,
  ] = useState(0);

  const [pasteData, setPasteData] = useState(null);
  useEffect(() => {
    if (isCreatingPaste) {
      setPasteData({
        content: "",
        isPublic: true,
        isShared: false,
        shareExpireTs: null,
        sharePassword: "",
        isSelfDestroying: false,
        selfDestroyTs: null,
        user: currentUser,
        pasteId: null,
      });
      if (!currentUser) {
        navigate(`/`);
      }
    } else {
      (async () => {
        const data = await getPasteData(pasteId, pastePassword);
        if (data.error) {
          setPasteData(null);
          setPasteRequestError(data.error);
        } else {
          setPasteRequestError(null);
          setPasteData(data);
          if (data.user !== currentUser && isEditingPaste) {
            navigate(`/paste/${pasteId}`);
          }
        }
      })();
    }
  }, [
    pasteId,
    isEditingPaste,
    isCreatingPaste,
    currentUser,
    navigate,
    pastePassword,
  ]);

// There may be a way to shorten the code by conditionally rendering
  // the message card with appropriate information. So instead of displaying four 
  // different MessageCards with different props, you could have one in code, but
  // add the appropriate props for each situation. It ultimately works well the way
  // you have it now, but just thinking of ways to make the code more concise. Good job!
  return (
    <div>
      {pasteRequestError && (
        <PasteAccessControl
          error={pasteRequestError}
          onPasswordSubmit={setPastePassword}
        />
      )}
      <div className="col-12 mb-4">
        <MessageCard
          title="Paste Updated"
          message="The paste has been successfully updated."
          instruction="This message will be dismissed"
          theme="success"
          expireTs={updatedMessageCardExpireTs}
          onFinish={() => {
            setUpdatedMessageCardExpireTs(0);
          }}
        />
        <MessageCard
          title="Paste Created"
          message={`A new paste with id ${pasteId} has been successfully created.`}
          instruction="This message will be dismissed"
          theme="success"
          expireTs={createdMessageCardExpireTs}
          onFinish={() => {
            setCreatedMessageCardExpireTs(0);
          }}
        />
        <MessageCard
          title="Paste Deleted"
          message={`The paste with id ${pasteId} has been successfully deleted.`}
          instruction="You will be redirected to home"
          theme="success"
          expireTs={deletedMessageCardExpireTs}
          onFinish={() => {
            setDeletedMessageCardExpireTs(0);
            navigate(`/`);
          }}
        />
        <MessageCard
          title="Paste Creation Cancelled"
          message={`Creation of the paste has been cancelled. Your changes are not saved.`}
          instruction="You will be redirected to home"
          theme="warning"
          expireTs={creationCancelledMessageCardExpireTs}
          onFinish={() => {
            setCreationCancelledMessageCardExpireTs(0);
            navigate(`/`);
          }}
        />
      </div>
      {pasteData &&
        deletedMessageCardExpireTs < now &&
        creationCancelledMessageCardExpireTs < now && (
          <PasteContainer
            pasteData={pasteData}
            isEditing={isEditingPaste}
            isCreating={isCreatingPaste}
            onEdit={onEdit}
            onDelete={onDelete}
            onSave={onSave}
            onCancelEdit={onCancel}
            currentUser={currentUser}
          />
        )}
      {pasteData && !isCreatingPaste && deletedMessageCardExpireTs < now && (
        <CommentsContainer currentUser={currentUser} pasteId={pasteId} />
      )}
    </div>
  );
}

PastePage.propTypes = {
  currentUser: PropTypes.string,
};

export default PastePage;
