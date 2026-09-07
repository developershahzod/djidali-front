import React from "react";
import LegalDocumentView from "../components/LegalDocumentView";
import { publicOffer } from "../data/legal/publicOffer";

const PublicOfferPage: React.FC = () => (
  <LegalDocumentView document={publicOffer} />
);

export default PublicOfferPage;
