import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col" id="about">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About Us</h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              FutureWise is an innovative platform designed to assist high school students in making informed decisions about their higher education journey. With an emphasis on personalized recommendations, relevant information, and a collaborative community, we aim to simplify the process of choosing a university and major.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-300">
                The vision of FutureWise is to be the leading platform that helps students in Indonesia prepare for higher education by providing accurate and relevant tools and information. We want to ensure that every student has access to the necessary information to make the right decisions about their major and university, based on objective data and comprehensive analysis.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Providing Personalized Recommendations</h3>
                  <p className="text-gray-600 dark:text-gray-300">By using Machine Learning technology, we offer tailored recommendations for each student based on their aptitude and interest test results as well as their academic grades.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Offering Easy Access to Educational Information</h3>
                  <p className="text-gray-600 dark:text-gray-300">We provide comprehensive information about majors and universities, including tuition fees, accreditation, and admission requirements, so students can easily conduct their research.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Providing an Interactive Discussion Forum</h3>
                  <p className="text-gray-600 dark:text-gray-300">We recognize the importance of sharing experiences in choosing a major and university. That's why we provide a discussion forum where students can ask questions, share, and discuss their choices with others who have similar experiences.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Helping with Academic Feasibility Evaluation</h3>
                  <p className="text-gray-600 dark:text-gray-300">With the grade input feature, students can evaluate their chances of being accepted at specific universities, so they can plan the right steps toward higher education.</p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Features</h2>
              <ul className="list-disc pl-6 space-y-4 text-gray-600 dark:text-gray-300">
                <li><strong>Aptitude and Interest Test:</strong> We provide tests to help students understand which majors align with their interests and skills.</li>
                <li><strong>Grade Input:</strong> A feature that allows students to enter their grades and assess their chances of being accepted into their desired universities.</li>
                <li><strong>Education Search Engine:</strong> Makes it easy for students to find information about majors, universities, tuition fees, accreditation, and more.</li>
                <li><strong>Latest Educational News:</strong> Offers the latest news and updates about the education world to help students prepare for the future.</li>
                <li><strong>Discussion Forum:</strong> A place for students to share experiences, ask questions, and discuss major and university choices.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Choose FutureWise?</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We believe that by adopting a data-driven and technology-based approach, students can make more focused and confident decisions about their future. We do not just provide tools and information but also create a community that supports one another. With FutureWise, we hope that every student can achieve their best potential in higher education.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Join Us</h2>
              <p className="text-gray-600 dark:text-gray-300">
                If you are a high school student looking to prepare for your educational future, or a parent who wants to assist their child in making the right educational choices, FutureWise is the right place for you. Find information, consult your choices, and make smarter decisions for a brighter future!
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
