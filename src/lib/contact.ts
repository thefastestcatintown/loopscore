export const contactEmail = "chris@loopscore.app";
export const contactPhone = "";
export const contactPhoneHref = contactPhone
  ? `tel:${contactPhone.replace(/[^\d+]/g, "")}`
  : "";

export const demoMailto =
  `mailto:${contactEmail}?subject=Interesse%20an%20digitaler%20Adventure%20Golf%20Scorecard`;

export const getContactFormHref = (type = "demo") =>
  `/?anfrage=${encodeURIComponent(type)}#kontakt`;

export const contactFormSubject = "Neue Anfrage über loopscore.app";
export const contactFormEndpoint =
  "https://loopscore-contact.loopscore.workers.dev/contact";
