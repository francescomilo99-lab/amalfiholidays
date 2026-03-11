import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  it: {
    translation: {
      "nav.home": "Home",
      "nav.about": "Chi Siamo",
      "nav.properties": "Proprietà",
      "nav.experiences": "Esperienze",
      "nav.restaurants": "Ristoranti",
      "nav.blog": "Blog",
      "nav.contact": "Contatti",
      "hero.title": "Vivi la Costiera Amalfitana",
      "hero.subtitle": "Case vacanze, ville esclusive ed esperienze indimenticabili.",
      "hero.cta": "Scopri le Proprietà",
      "about.title": "Chi Siamo",
      "about.text": "Amalfi Holidays è il tuo partner di fiducia per soggiorni indimenticabili in Costiera Amalfitana. Offriamo una selezione curata di case vacanze e ville, arricchita da servizi concierge personalizzati.",
      "properties.title": "Le Nostre Proprietà",
      "properties.view_details": "Vedi Dettagli",
      "properties.guests": "Ospiti",
      "properties.bedrooms": "Camere",
      "properties.bathrooms": "Bagni",
      "experiences.title": "Esperienze Uniche",
      "restaurants.title": "I Nostri Consigli",
      "blog.title": "Il Nostro Blog",
      "contact.title": "Contattaci",
      "contact.name": "Nome",
      "contact.email": "Email",
      "contact.message": "Messaggio",
      "contact.send": "Invia Richiesta",
      "contact.whatsapp": "Contattaci su WhatsApp",
      "admin.title": "Pannello di Gestione",
      "admin.properties": "Gestisci Proprietà",
      "admin.experiences": "Gestisci Esperienze",
      "admin.restaurants": "Gestisci Ristoranti",
      "admin.blog": "Gestisci Blog",
      "admin.reviews": "Gestisci Recensioni",
      "admin.add": "Aggiungi",
      "admin.edit": "Modifica",
      "admin.delete": "Elimina",
      "admin.save": "Salva",
      "admin.cancel": "Annulla"
    }
  },
  en: {
    translation: {
      "nav.home": "Home",
      "nav.about": "About Us",
      "nav.properties": "Properties",
      "nav.experiences": "Experiences",
      "nav.restaurants": "Restaurants",
      "nav.blog": "Blog",
      "nav.contact": "Contact",
      "hero.title": "Experience the Amalfi Coast",
      "hero.subtitle": "Holiday homes, exclusive villas and unforgettable experiences.",
      "hero.cta": "Discover Properties",
      "about.title": "About Us",
      "about.text": "Amalfi Holidays is your trusted partner for unforgettable stays on the Amalfi Coast. We offer a curated selection of holiday homes and villas, enriched by personalized concierge services.",
      "properties.title": "Our Properties",
      "properties.view_details": "View Details",
      "properties.guests": "Guests",
      "properties.bedrooms": "Bedrooms",
      "properties.bathrooms": "Bathrooms",
      "experiences.title": "Unique Experiences",
      "restaurants.title": "Our Recommendations",
      "blog.title": "Our Blog",
      "contact.title": "Contact Us",
      "contact.name": "Name",
      "contact.email": "Email",
      "contact.message": "Message",
      "contact.send": "Send Request",
      "contact.whatsapp": "Contact us on WhatsApp",
      "admin.title": "Management Panel",
      "admin.properties": "Manage Properties",
      "admin.experiences": "Manage Experiences",
      "admin.restaurants": "Manage Restaurants",
      "admin.blog": "Manage Blog",
      "admin.reviews": "Manage Reviews",
      "admin.add": "Add",
      "admin.edit": "Edit",
      "admin.delete": "Delete",
      "admin.save": "Save",
      "admin.cancel": "Cancel"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'it',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
