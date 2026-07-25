import { useState } from "react";

const FIELDS = [
  { id: "name", label: "Nom complet", type: "text", placeholder: "Amina El Fassi" },
  { id: "email", label: "E-mail", type: "email", placeholder: "amina@exemple.com" },
  { id: "sujet", label: "Sujet", type: "text", placeholder: "Un projet en tête ?" },
];

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", sujet: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  function handleChange(id, value) {
    setValues((v) => ({ ...v, [id]: value }));
    if (errors[id]) setErrors((e) => ({ ...e, [id]: null }));
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = "Indiquez votre nom.";
    if (!values.email.trim()) next.email = "Indiquez votre e-mail.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Format d'e-mail invalide.";
    if (!values.message.trim()) next.message = "Le message ne peut pas être vide.";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
    }, 900);
  }

  return (
    <>
      <style>{`
        .contact-page {
          min-height: 100vh;
          background-color: #F4F1E9;
          padding: 4rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .contact-container {
          width: 100%;
          max-width: 32rem;
        }

        .contact-eyebrow {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #B08D3E;
          margin: 0 0 0.75rem;
        }

        .contact-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 2.25rem;
          color: #1F3A2E;
          margin: 0 0 0.75rem;
          line-height: 1.2;
        }

        .contact-subtitle {
          color: #5B5A52;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 2.5rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .contact-field label {
          display: block;
          font-size: 13px;
          color: #5B5A52;
          margin-bottom: 0.375rem;
        }

        .contact-field input,
        .contact-field textarea {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #CFC9B8;
          padding: 0.5rem 0;
          font-size: 15px;
          color: #1F3A2E;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        .contact-field textarea {
          resize: none;
        }

        .contact-field input::placeholder,
        .contact-field textarea::placeholder {
          color: #B4B0A2;
        }

        .contact-field input:focus,
        .contact-field textarea:focus {
          border-color: #1F3A2E;
        }

        .contact-field input.has-error,
        .contact-field textarea.has-error {
          border-color: #B4472F;
        }

        .contact-error {
          margin-top: 0.375rem;
          font-size: 12px;
          color: #B4472F;
        }

        .contact-footer {
          padding-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .contact-char-count {
          font-size: 12px;
          color: #B4B0A2;
        }

        .contact-submit {
          position: relative;
          padding: 0.75rem 1.75rem;
          background-color: #1F3A2E;
          color: #F4F1E9;
          font-size: 14px;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease, opacity 0.2s ease;
        }

        .contact-submit:hover:not(:disabled) {
          background-color: #16291F;
        }

        .contact-submit:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .contact-success {
          min-height: 100vh;
          background-color: #F4F1E9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .contact-success-inner {
          max-width: 28rem;
          width: 100%;
          text-align: center;
        }

        .contact-success-icon {
          margin: 0 auto 1.5rem;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid #1F3A2E;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-success-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1.5rem;
          color: #1F3A2E;
          margin: 0 0 0.5rem;
        }

        .contact-success-text {
          color: #5B5A52;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 2rem;
        }

        .contact-success-reset {
          background: none;
          border: none;
          border-bottom: 1px solid #1F3A2E;
          color: #1F3A2E;
          font-size: 14px;
          padding: 0 0 2px;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .contact-success-reset:hover {
          opacity: 0.7;
        }
      `}</style>

      {status === "sent" ? (
        <div className="contact-success">
          <div className="contact-success-inner">
            <div className="contact-success-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 12.5L9.5 18L20 6" stroke="#1F3A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="contact-success-title">Message envoyé</h2>
            <p className="contact-success-text">
              Merci, {values.name.split(" ")[0]}. Une réponse vous parviendra sous peu à {values.email}.
            </p>
            <button
              onClick={() => {
                setValues({ name: "", email: "", sujet: "", message: "" });
                setStatus("idle");
              }}
              className="contact-success-reset"
            >
              Envoyer un autre message
            </button>
          </div>
        </div>
      ) : (
        <div className="contact-page">
          <div className="contact-container">
            <p className="contact-eyebrow">Correspondance</p>
            <h1 className="contact-title">Écrivez-nous</h1>
            <p className="contact-subtitle">
              Une question, une idée, un projet ? Ce formulaire nous parvient directement, comme une lettre glissée sous la porte.
            </p>

            <form onSubmit={handleSubmit} noValidate className="contact-form">
              {FIELDS.map((field) => (
                <div key={field.id} className="contact-field">
                  <label htmlFor={field.id}>{field.label}</label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={values[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className={errors[field.id] ? "has-error" : ""}
                  />
                  {errors[field.id] && <p className="contact-error">{errors[field.id]}</p>}
                </div>
              ))}

              <div className="contact-field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  value={values.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Écrivez ici..."
                  className={errors.message ? "has-error" : ""}
                />
                {errors.message && <p className="contact-error">{errors.message}</p>}
              </div>

              <div className="contact-footer">
                <span className="contact-char-count">
                  {values.message.length} caractère{values.message.length !== 1 ? "s" : ""}
                </span>
                <button type="submit" disabled={status === "sending"} className="contact-submit">
                  {status === "sending" ? "Envoi..." : "Envoyer le message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
