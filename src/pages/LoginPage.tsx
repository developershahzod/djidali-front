import React, { useMemo, useState, useRef, useCallback } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Phone,
  ShieldAlert,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { djidaliApi } from "../services/djidaliApi";
import { validation, sanitize } from "../utils/validation";

// Cloudflare Turnstile site key from environment
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, translate } = useLanguage();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  // CAPTCHA state
  const [requiresCaptcha, setRequiresCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | undefined>();
  const turnstileRef = useRef<TurnstileInstance>(null);

  // Check login status when email changes (debounced)
  const checkLoginStatus = useCallback(async (email: string) => {
    if (!email || !validation.email(email).isValid) return;

    try {
      const status = await djidaliApi.getLoginStatus(email);
      setRequiresCaptcha(status.requiresCaptcha);
      setIsLocked(status.isLocked);
      setLockoutSeconds(status.lockoutRemainingSeconds);
    } catch {
      // Ignore errors - don't reveal user existence
    }
  }, []);

  // Handle CAPTCHA completion
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  // Reset CAPTCHA on error
  const resetCaptcha = () => {
    setCaptchaToken(null);
    turnstileRef.current?.reset();
  };

  const insights = useMemo(
    () => [t("login.sideStat1"), t("login.sideStat2"), t("login.sideStat3")],
    [t],
  );

  const _socials = useMemo(() => [], [t]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const emailValidation = validation.email(formData.email);
      if (!emailValidation.isValid) {
        setError(emailValidation.error || "Invalid email");
        return;
      }

      // For login, only check if password is provided
      // Full validation (length, uppercase, etc.) only for registration
      if (isLogin) {
        if (!formData.password) {
          setError("Password is required");
          return;
        }
      } else {
        const passwordValidation = validation.password(formData.password);
        if (!passwordValidation.isValid) {
          setError(passwordValidation.error || "Invalid password");
          return;
        }
      }

      // Check if account is locked
      if (isLocked && lockoutSeconds && lockoutSeconds > 0) {
        const minutes = Math.ceil(lockoutSeconds / 60);
        setError(
          t("login.accountLocked")?.replace("{minutes}", String(minutes)) ||
            `Account is temporarily locked. Try again in ${minutes} minutes.`,
        );
        return;
      }

      // Check if CAPTCHA is required but not completed
      if (requiresCaptcha && !captchaToken && TURNSTILE_SITE_KEY) {
        setError(
          t("login.captchaRequired") ||
            "Please complete the CAPTCHA verification",
        );
        return;
      }

      const sanitizedEmail = sanitize.email(formData.email);

      setIsSubmitting(true);

      if (isLogin) {
        await login(
          sanitizedEmail,
          formData.password,
          captchaToken || undefined,
        );
        const currentUser = djidaliApi.getCurrentUser();

        if (
          currentUser?.role === "ADMIN" ||
          currentUser?.role === "SALES_MANAGER"
        ) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError(t("login.passwordMismatchError"));
          return;
        }

        const firstNameValidation = validation.name(formData.firstName);
        if (!firstNameValidation.isValid) {
          setError(`First name: ${firstNameValidation.error}`);
          return;
        }

        const lastNameValidation = validation.name(formData.lastName);
        if (!lastNameValidation.isValid) {
          setError(`Last name: ${lastNameValidation.error}`);
          return;
        }

        const phoneValidation = validation.phone(formData.phoneNumber);
        if (!phoneValidation.isValid) {
          setError(phoneValidation.error || t("login.phoneInvalidError"));
          return;
        }

        const sanitizedFirstName = sanitize.text(formData.firstName);
        const sanitizedLastName = sanitize.text(formData.lastName);
        const sanitizedPhone = sanitize.phone(formData.phoneNumber);

        await register({
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          email: sanitizedEmail,
          password: formData.password,
          role: "CUSTOMER",
          address: "Tashkent, Uzbekistan",
          nationality: "Uzbekistan",
          dateOfBirth: "1990-01-15T00:00:00.000Z",
          passportNumber: "AB1234567",
          phoneNumber: sanitizedPhone,
        });

        const currentUser = djidaliApi.getCurrentUser();

        if (
          currentUser?.role === "ADMIN" ||
          currentUser?.role === "SALES_MANAGER"
        ) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      const errorMessage =
        err instanceof Error ? err.message : t("login.genericError");

      // Check if CAPTCHA is now required
      if (err?.code === "CAPTCHA_REQUIRED" || err?.requiresCaptcha) {
        setRequiresCaptcha(true);
        setError(
          t("login.captchaRequired") ||
            "Please complete the CAPTCHA verification",
        );
        setIsSubmitting(false);
        return;
      }

      // Check if CAPTCHA was invalid
      if (err?.code === "CAPTCHA_INVALID") {
        resetCaptcha();
        setError(
          t("login.captchaInvalid") ||
            "CAPTCHA verification failed. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }

      // Set error message
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F7F1E6] via-[#F1E3D0] to-[#E8D6C0]"
      style={{ paddingTop: 100 }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-[420px] w-[420px] rounded-full bg-[#D8C3A5]/40 blur-3xl" />
        <div className="absolute right-[-160px] top-32 h-[520px] w-[520px] rounded-full bg-[#BFA480]/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[640px] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-full bg-[#D9C4A4]/25 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1180px] flex-col gap-12 px-6 py-14 lg:flex-row lg:items-center lg:gap-20 lg:px-12">
        <aside className="hidden w-full max-w-[420px] flex-col justify-between rounded-[36px] bg-white/35 p-10 shadow-[0_40px_120px_-80px_rgba(33,24,15,0.65)] backdrop-blur-2xl transition-transform duration-500 hover:-translate-y-1 lg:flex">
          <div className="space-y-8">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-3 rounded-full bg-white/75 px-6 py-3 text-sm font-medium text-[#372F25] shadow-sm transition-colors hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("login.backToHome")}
            </button>

            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#BFA480]/20 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#6F5B3F]">
                DJIDALI
              </span>
              <h1 className="text-[2.8rem] font-light leading-tight text-[#2F261C]">
                {t("login.sideHeading")}
              </h1>
              <p className="text-[0.95rem] leading-relaxed text-[#5F4A31]">
                {t("login.sideSubtitle")}
              </p>
            </div>

            <div className="grid gap-6">
              {insights.map((stat) => (
                <div key={stat} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 text-[#856945] shadow-sm">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-[#3B3023]">{stat}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-white/55 p-6 text-sm text-[#5E5140] shadow-inner">
            <p>
              “
              {translate({
                en: "We curate journeys that blend nature, comfort, and authenticity. Every detail is tailored for immersive experiences.",
                ru: "Мы создаём путешествия, где природа, комфорт и подлинность идут рука об руку. Каждая деталь продумана для незабываемых впечатлений.",
                uz: "Biz tabiat, qulaylik va haqiqiylikni uygʻunlashtirgan sayohatlarni yaratamiz. Har bir tafsilot unutilmas taassurotlar uchun yaratilgan.",
              })}
              ”
            </p>
          </div>
        </aside>

        <section className="relative w-full max-w-[520px]">
          <div className="" aria-hidden />

          <div className="mb-10 space-y-4 text-center">
            <img
              src="/svgviewer-png-output.webp"
              alt="DJIDALI ECOLOGICAL TOURISM"
              className="mx-auto h-14 w-auto"
            />
            <div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F1E3D0]/70 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[#8F6E47]">
                  {isLogin ? t("login.accessLabel") : t("login.createLabel")}
                </div>
                <h2 className="text-[2.2rem] font-semibold text-[#2E251C]">
                  {isLogin ? t("login.title") : t("login.registerTitle")}
                </h2>
              </div>
              <p className="mt-4 text-sm text-[#726656]">
                {isLogin ? t("login.loginDesc") : t("login.registerDesc")}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-[18px] border border-[#F3C4C4] bg-[#FEF3F2] px-4 py-3 text-sm text-[#A63A3A]">
              {error}
            </div>
          )}

          <form className="space-y-7" onSubmit={handleSubmit}>
            <div className="grid gap-5">
              {!isLogin && (
                <>
                  <div className="flex items-center gap-3 rounded-2xl bg-[#F8EFE4]/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#8F6E47]">
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    {t("login.joinCommunityBanner")}
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#857157]">
                      {t("login.firstNameLabel")}
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B4A38F]" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="h-12 w-full rounded-2xl border border-[#E1D5C2] bg-white/70 pl-12 pr-4 text-sm text-[#2F261C] shadow-inner focus:border-[#B99571] focus:outline-none focus:ring-2 focus:ring-[#E7D1B6]/60"
                        placeholder={t("login.firstNamePlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#857157]">
                      {t("login.lastNameLabel")}
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B4A38F]" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="h-12 w-full rounded-2xl border border-[#E1D5C2] bg-white/70 pl-12 pr-4 text-sm text-[#2F261C] shadow-inner focus:border-[#B99571] focus:outline-none focus:ring-2 focus:ring-[#E7D1B6]/60"
                        placeholder={t("login.lastNamePlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#857157]">
                      {t("login.phoneLabel")}
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B4A38F]" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="h-12 w-full rounded-2xl border border-[#E1D5C2] bg-white/70 pl-12 pr-4 text-sm text-[#2F261C] shadow-inner focus:border-[#B99571] focus:outline-none focus:ring-2 focus:ring-[#E7D1B6]/60"
                        placeholder={t("login.phonePlaceholder")}
                      />
                    </div>
                    <p className="pl-1 text-[0.72rem] text-[#8F6E47]">
                      {t("login.phoneHint")}
                    </p>
                  </div>
                </>
              )}

              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#857157]">
                  {t("login.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => isLogin && checkLoginStatus(formData.email)}
                  required
                  className="h-12 w-full rounded-2xl border border-[#E1D5C2] bg-white/70 px-4 text-sm text-[#2F261C] shadow-inner focus:border-[#B99571] focus:outline-none focus:ring-2 focus:ring-[#E7D1B6]/60"
                  placeholder="email@example.com"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#857157]">
                  {t("login.password")}
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B4A38F]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-12 w-full rounded-2xl border border-[#E1D5C2] bg-white/70 pl-12 pr-12 text-sm text-[#2F261C] shadow-inner focus:border-[#B99571] focus:outline-none focus:ring-2 focus:ring-[#E7D1B6]/60"
                    placeholder={t("login.password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B4A38F] transition-colors hover:text-[#8F7553]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-[#857157]">
                    {t("login.confirmPassword")}
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B4A38F]" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="h-12 w-full rounded-2xl border border-[#E1D5C2] bg-white/70 pl-12 pr-4 text-sm text-[#2F261C] shadow-inner focus:border-[#B99571] focus:outline-none focus:ring-2 focus:ring-[#E7D1B6]/60"
                      placeholder={t("login.confirmPassword")}
                    />
                  </div>
                </div>
              )}

              {/* CAPTCHA - shown after 3 failed login attempts */}
              {isLogin && requiresCaptcha && TURNSTILE_SITE_KEY && (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1D5C2] bg-[#FEF9F3] p-4">
                  <div className="flex items-center gap-2 text-sm text-[#8F6E47]">
                    <ShieldAlert className="h-5 w-5" />
                    <span>
                      {t("login.captchaMessage") ||
                        "Please verify you're not a robot"}
                    </span>
                  </div>
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={handleCaptchaChange}
                    options={{
                      theme: "light",
                      size: "normal",
                    }}
                  />
                </div>
              )}

              {/* Account locked warning */}
              {isLogin && isLocked && lockoutSeconds && lockoutSeconds > 0 && (
                <div className="flex items-center gap-3 rounded-2xl border border-[#F3C4C4] bg-[#FEF3F2] p-4 text-sm text-[#A63A3A]">
                  <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                  <span>
                    {t("login.accountLockedMessage")?.replace(
                      "{minutes}",
                      String(Math.ceil(lockoutSeconds / 60)),
                    ) ||
                      `Your account is temporarily locked due to too many failed attempts. Please try again in ${Math.ceil(lockoutSeconds / 60)} minutes.`}
                  </span>
                </div>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#6C5740]">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#D8C7B2] text-[#B08655] focus:ring-[#B08655]"
                  />
                  {t("login.rememberMe")}
                </label>
                <a
                  href="#"
                  className="font-semibold text-[#9B7D53] transition-colors hover:text-[#7C623F]"
                >
                  {t("login.forgotPassword")}
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8F6E47] py-3 text-sm font-medium text-white shadow-[0_12px_30px_-18px_rgba(143,110,71,0.9)] transition-all hover:-translate-y-[2px] hover:bg-[#7A5D3C] focus:outline-none focus:ring-2 focus:ring-[#D7C2A3]/70 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t("login.loading")}</span>
                </>
              ) : isLogin ? (
                t("login.loginButton")
              ) : (
                t("login.registerButton")
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsLogin((prev) => !prev)}
              className="w-full text-center text-sm font-semibold text-[#9B7D53] transition-colors hover:text-[#7C623F]"
            >
              {isLogin ? t("login.noAccount") : t("login.haveAccount")}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
