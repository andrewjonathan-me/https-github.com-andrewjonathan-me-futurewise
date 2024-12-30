import { subjectTranslationsId } from './sections/subjects';
import { reportTranslationsId } from './sections/report';
import { footerTranslationsId } from './sections/footer';
import { landingTranslationsId } from './sections/landing';
import { aboutTranslationsId } from './sections/about';
import { privacyTranslationsId } from './sections/privacy';
import { contactTranslationsId } from './sections/contact';
import { searchTranslationsId } from './sections/search';
import { testTranslationsId } from './sections/test';
import { resultsTranslationsId } from './sections/results';
import { profileTranslationsId } from './sections/profile';
import { dashboardTranslationsId } from './sections/dashboard';
import { navigationTranslationsId } from './sections/navigation';
import { newsTranslationsId } from './sections/news';
import { forumTranslationsId } from './sections/forum';
import { postFormTranslationsId } from './sections/postForm';
import { postCardTranslationsId } from './sections/postCard';
import { forumCategoriesId } from './sections/forumCategories';
import { tagTranslationsId } from './sections/tags';
import { tagCategoryTranslationsId } from './sections/tagCategories';
import { subscriptionTranslationsId } from './sections/subscription';
import { paymentTranslationsId } from './sections/payment';

export const idTranslations = {
  // Auth
  "auth.signin.button": "Masuk",
  "auth.continue.with": "atau lanjutkan dengan",
  "auth.signin.with": "Masuk dengan",
  "auth.signup.button": "Daftar",
  "auth.forgot.password": "Lupa kata sandi?",
  "auth.forgot.title": "Atur ulang kata sandi",
  "auth.forgot.description": "Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.",
  "auth.forgot.submit": "Kirim tautan",
  "auth.forgot.email.sent.title": "Email terkirim",
  "auth.forgot.email.sent.description": "Silakan periksa email Anda untuk tautan pengaturan ulang kata sandi.",
  "auth.forgot.email.not.found": "Tidak ada akun yang terdaftar dengan email ini. Silakan periksa email Anda atau daftar akun baru.",
  "auth.forgot.error": "Gagal mengirim email pengaturan ulang",
  "auth.error": "Error",
  "auth.email": "Alamat email",
  "auth.email.placeholder": "Masukkan email Anda",
  "auth.back.to.login": "Kembali ke halaman masuk",
  
  // Import section translations
  ...subjectTranslationsId,
  ...reportTranslationsId,
  ...footerTranslationsId,
  ...landingTranslationsId,
  ...aboutTranslationsId,
  ...privacyTranslationsId,
  ...contactTranslationsId,
  ...searchTranslationsId,
  ...testTranslationsId,
  ...resultsTranslationsId,
  ...profileTranslationsId,
  ...dashboardTranslationsId,
  ...navigationTranslationsId,
  ...newsTranslationsId,
  ...forumTranslationsId,
  ...postFormTranslationsId,
  ...postCardTranslationsId,
  ...forumCategoriesId,
  ...tagTranslationsId,
  ...tagCategoryTranslationsId,
  ...subscriptionTranslationsId,
  ...paymentTranslationsId,
};
