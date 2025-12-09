import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const PrivacyPolicyPage: React.FC = () => {
  const { language, translate } = useLanguage();

  const content = {
    ru: {
      title: "Политика конфиденциальности",
      intro:
        "Мы уважаем вашу конфиденциальность и стремимся защитить ваши персональные данные. Эта политика конфиденциальности объясняет, как мы собираем, используем и защищаем вашу информацию.",
      sections: [
        {
          title: "Сбор информации",
          content:
            "Мы собираем информацию, которую вы предоставляете нам при использовании наших услуг, включая имя, адрес электронной почты и контактные данные.",
        },
        {
          title: "Использование информации",
          content:
            "Мы используем собранную информацию для предоставления и улучшения наших услуг, обработки ваших запросов и связи с вами.",
        },
        {
          title: "Защита данных",
          content:
            "Мы применяем соответствующие технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, изменения или раскрытия.",
        },
      ],
      lastUpdated: "Последнее обновление: 2025",
    },
    uz: {
      title: "Maxfiylik siyosati",
      intro:
        "Biz sizning maxfiyligingizni hurmat qilamiz va shaxsiy ma'lumotlaringizni himoya qilishga intilamiz. Ushbu maxfiylik siyosati biz qanday qilib ma'lumotlaringizni yig'ishimiz, ishlatishimiz va himoya qilishimizni tushuntiradi.",
      sections: [
        {
          title: "Ma'lumotlarni yig'ish",
          content:
            "Biz xizmatlarimizdan foydalanganingizda taqdim etgan ma'lumotlaringizni yig'amiz, jumladan ism, elektron pochta manzili va aloqa ma'lumotlari.",
        },
        {
          title: "Ma'lumotlardan foydalanish",
          content:
            "Biz to'plangan ma'lumotlardan xizmatlarimizni taqdim etish va yaxshilash, so'rovlaringizni qayta ishlash va siz bilan bog'lanish uchun foydalanamiz.",
        },
        {
          title: "Ma'lumotlarni himoya qilish",
          content:
            "Biz shaxsiy ma'lumotlaringizni ruxsatsiz kirish, o'zgartirish yoki oshkor qilishdan himoya qilish uchun tegishli texnik va tashkiliy choralarni qo'llaymiz.",
        },
      ],
      lastUpdated: "Oxirgi yangilanish: 2025",
    },
    en: {
      title: "Privacy Policy",
      intro:
        "We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information.",
      sections: [
        {
          title: "Information Collection",
          content:
            "We collect information that you provide to us when using our services, including name, email address, and contact details.",
        },
        {
          title: "Use of Information",
          content:
            "We use the collected information to provide and improve our services, process your requests, and communicate with you.",
        },
        {
          title: "Data Protection",
          content:
            "We apply appropriate technical and organizational measures to protect your personal data from unauthorized access, modification, or disclosure.",
        },
      ],
      lastUpdated: "Last updated: 2025",
    },
    de: {
      title: "Datenschutzrichtlinie",
      intro:
        "Wir respektieren Ihre Privatsphäre und sind bestrebt, Ihre persönlichen Daten zu schützen. Diese Datenschutzrichtlinie erklärt, wie wir Ihre Informationen sammeln, verwenden und schützen.",
      sections: [
        {
          title: "Datenerfassung",
          content:
            "Wir erfassen Informationen, die Sie uns bei der Nutzung unserer Dienste zur Verfügung stellen, einschließlich Name, E-Mail-Adresse und Kontaktdaten.",
        },
        {
          title: "Verwendung der Informationen",
          content:
            "Wir verwenden die gesammelten Informationen, um unsere Dienste bereitzustellen und zu verbessern, Ihre Anfragen zu bearbeiten und mit Ihnen zu kommunizieren.",
        },
        {
          title: "Datenschutz",
          content:
            "Wir wenden geeignete technische und organisatorische Maßnahmen an, um Ihre persönlichen Daten vor unbefugtem Zugriff, Änderung oder Offenlegung zu schützen.",
        },
      ],
      lastUpdated: "Zuletzt aktualisiert: 2025",
    },
  };

  const currentContent = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-[#F4F2ED]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E0D5]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#8F7B49] hover:text-[#7a6839] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">
              {translate({
                ru: "На главную",
                uz: "Bosh sahifaga",
                en: "Back to Home",
                de: "Zur Startseite",
              })}
            </span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-[#333333]">
            {currentContent.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          {/* Intro */}
          <p className="text-lg text-[#666666] leading-relaxed mb-10">
            {currentContent.intro}
          </p>

          {/* Sections */}
          <div className="space-y-8">
            {currentContent.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold text-[#333333] mb-3">
                  {section.title}
                </h2>
                <p className="text-[#666666] leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Last Updated */}
          <div className="mt-12 pt-6 border-t border-[#E5E0D5]">
            <p className="text-sm text-[#999999] italic">
              {currentContent.lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
