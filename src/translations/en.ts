import { subjectTranslationsEn } from './sections/subjects';
import { reportTranslationsEn } from './sections/report';
import { footerTranslationsEn } from './sections/footer';
import { landingTranslationsEn } from './sections/landing';
import { aboutTranslationsEn } from './sections/about';
import { privacyTranslationsEn } from './sections/privacy';
import { contactTranslationsEn } from './sections/contact';
import { searchTranslationsEn } from './sections/search';
import { testTranslationsEn } from './sections/test';
import { resultsTranslationsEn } from './sections/results';
import { profileTranslationsEn } from './sections/profile';
import { dashboardTranslationsEn } from './sections/dashboard';
import { navigationTranslationsEn } from './sections/navigation';
import { newsTranslationsEn } from './sections/news';
import { forumTranslationsEn } from './sections/forum';
import { postFormTranslationsEn } from './sections/postForm';
import { postCardTranslationsEn } from './sections/postCard';
import { forumCategoriesEn } from './sections/forumCategories';
import { tagTranslationsEn } from './sections/tags';
import { tagCategoryTranslationsEn } from './sections/tagCategories';
import { subscriptionTranslationsEn } from './sections/subscription';
import { paymentTranslationsEn } from './sections/payment';

export const enTranslations = {
  // Auth
  "auth.signin.button": "Sign In",
  "auth.continue.with": "or continue with",
  "auth.signin.with": "Sign in with",
  "auth.signup.button": "Sign Up",
  "auth.forgot.password": "Forgot password?",
  "auth.forgot.title": "Reset your password",
  "auth.forgot.description": "Enter your email address and we'll send you a link to reset your password.",
  "auth.forgot.submit": "Send reset link",
  "auth.forgot.email.sent.title": "Reset email sent",
  "auth.forgot.email.sent.description": "Please check your email for the password reset link.",
  "auth.forgot.email.not.found": "No account found with this email address. Please check your email or sign up for a new account.",
  "auth.forgot.error": "Failed to send reset email",
  "auth.error": "Error",
  "auth.email": "Email address",
  "auth.email.placeholder": "Enter your email",
  "auth.back.to.login": "Back to login",

  // Navigation
  "nav.home": "Home",
  "nav.news": "News",
  "nav.about": "About",
  "nav.signin": "Sign In",
  "nav.signup": "Sign Up",
  
  // Common
  "common.loading": "Loading...",
  "common.error": "Error",
  "common.success": "Success",
  "common.warning": "Warning",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.submit": "Submit",
  "common.ok": "OK",
  "common.back": "Back",
  "common.processing": "Processing...",
  
  // Import section translations
  ...subjectTranslationsEn,
  ...reportTranslationsEn,
  ...footerTranslationsEn,
  ...landingTranslationsEn,
  ...aboutTranslationsEn,
  ...privacyTranslationsEn,
  ...contactTranslationsEn,
  ...searchTranslationsEn,
  ...testTranslationsEn,
  ...resultsTranslationsEn,
  ...profileTranslationsEn,
  ...dashboardTranslationsEn,
  ...navigationTranslationsEn,
  ...newsTranslationsEn,
  ...forumTranslationsEn,
  ...postFormTranslationsEn,
  ...postCardTranslationsEn,
  ...forumCategoriesEn,
  ...tagTranslationsEn,
  ...tagCategoryTranslationsEn,
  ...subscriptionTranslationsEn,
  ...paymentTranslationsEn,
};
