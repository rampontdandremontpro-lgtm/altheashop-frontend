import { useI18n } from "../../context/I18nContext";

function Loader({ text }) {
  const { t } = useI18n();

  return <div className="box">{text || t("loading")}</div>;
}

export default Loader;