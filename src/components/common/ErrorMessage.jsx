function ErrorMessage({ message = "Une erreur est survenue." }) {
  return <div className="box error-box">{message}</div>;
}

export default ErrorMessage;