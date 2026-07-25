import phone from "../img/phone.png";
import location from "../img/location.png";
import av from "../img/availability.png";
import arroba from "../img/arroba.png";
import logo from "../img/logo.png";
import "../styles/footer.css";
import FadeIn from "./fadein";

const contactItems = [
  {
    icon: phone,
    label: "Appelez-nous 24h/24 et 7j/7",
    value: "+208-555-0112",
    href: "tel:+2085550112",
  },
  {
    icon: arroba,
    label: "Demander un devis",
    value: "example@gmail.com",
    href: "mailto:example@gmail.com",
  },
  {
    icon: av,
    label: "Heures d'ouverture",
    value: "Lundi - Vendredi : 9h00 - 18h00",
  },
  {
    icon: location,
    label: "Adresse",
    value: "Faculté des Sciences et Techniques de Fès",
  },
];

function Footer() {
  return (
    <FadeIn delay={0.3}>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__grid">
            {contactItems.map((item) => (
              <div className="site-footer__card" key={item.label}>
                <div className="site-footer__icon-wrap">
                  <img src={item.icon} alt="" aria-hidden="true" />
                </div>
                <div className="site-footer__content">
                  <p className="site-footer__label">{item.label}</p>
                  {item.href ? (
                    <a className="site-footer__value" href={item.href}>
                      {item.value}
                    </a>
                  ) : (
                    <p className="site-footer__value">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="site-footer__brand">
            <img
              className="site-footer__logo"
              src={logo}
              alt="Pacific Fruit logo"
            />
            <p className="site-footer__rights">
              © {new Date().getFullYear()} Tous droits réservés par{" "}
              <span>PACIFIC FRUIT</span>.
            </p>
          </div>
        </div>
      </footer>
    </FadeIn>
  );
}

export default Footer;
