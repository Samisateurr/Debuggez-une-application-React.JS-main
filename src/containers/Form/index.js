import { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [timerId, setTimerId] = useState(null);

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      setSending(true);
      setConfirmationMessage(''); // Réinitialiser le message de confirmation avant l'envoi
      try {
        await mockContactApi();
        setSending(false);
        setConfirmationMessage('Votre message a été envoyé avec succès !');
        onSuccess();

        // Définir un délai pour effacer le message de confirmation
        const id = setTimeout(() => {
          setConfirmationMessage('');
        }, 5000);
        setTimerId(id);
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );

  // Nettoyer le timeout si le composant est démonté avant que le délai soit écoulé
  useEffect(() => () => {
    if (timerId) {
      clearTimeout(timerId);
    }
  }, [timerId]);

  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field placeholder="" label="Nom" />
          <Field placeholder="" label="Prénom" />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
          />
          <Field placeholder="" label="Email" />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
          />
        </div>
      </div>
      {confirmationMessage && (
        <div className="confirmation-message">
          {confirmationMessage}
        </div>
      )}
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;