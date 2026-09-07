import React from "react";
import LegalDocumentView from "../components/LegalDocumentView";
import { privacyPolicy } from "../data/legal/privacyPolicy";

const PrivacyPolicyPage: React.FC = () => (
  <LegalDocumentView document={privacyPolicy} />
);

export default PrivacyPolicyPage;
