import { Users, Lightbulb, GraduationCap } from 'lucide-react';
import logo from '../assets/logo.png';
import container from '../assets/Container.png';
import girl from '../assets/girl.png';
import brain from '../assets/brain.png';
import up from '../assets/up.png';
import target from '../assets/target_icon.png';
import check from '../assets/check.png';




const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          {/* Left: Logo and Brand */}
          <div className="flex items-center gap-2">
            <div>
              <img
                src={logo}
                alt="SkillMatch Logo"
                className="w-10 h-10 mr-2 inline-block"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900">SkillMatch</span>
          </div>
          
          {/* Center: Features and About */}
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#about-section" className="text-gray-600 hover:text-gray-900">About</a>
          </div>
          
          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-8">
            <a href="/login" className="text-gray-600 hover:text-gray-900">Sign In</a>
            <a href="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 mb-10 rounded-lg hover:from-blue-700 inline-block">Empowering Students Through Smart Skill Discovery</p>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Empower Your Skills with SkillMatch
            </h1>
            <p className="text-lg mb-8 text-blue-50">
              Discover, develop, and showcase your strengths through intelligent skill mapping designed for IT students and educators.
            </p>
            <div className="flex gap-4">
              <a href="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Get Started
              </a>
              <a href="#features" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Learn More
              </a>
            </div>
          </div>
          <div>
          <img 
            src={container}
            alt="Students collaborating" 
            className="rounded-2xl w-full h-auto"
          />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Success
            </h2>
            <p className="text-gray-600 text-lg">
              Everything you need to map, track, and grow your skills throughout your academic journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <img src={brain} alt="icon" className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Skill Showcase</h3>
              <p className="text-gray-600">
                Visualize your strengths and gaps with interactive skill mapping.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <img src={up} alt="icon" className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Suggestions</h3>
              <p className="text-gray-600">
                Get AI-powered recommendations tailored to your learning path.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <img src={target} alt="icon" className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Role Tracking</h3>
              <p className="text-gray-600">
                Monitor your progress across projects and build your portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IT Students Section */}
      <section id="about-section" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src={girl} 
              alt="Student studying" 
              className=" w-full h-auto"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Designed for IT Students and Educators
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              SkillMatch empowers students to take control of their learning journey while providing educators with powerful insights into student progress and skill development.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <img src={check} alt="check" className="w-8 h-8" />
                <span className="text-gray-700">Track skills across multiple projects</span>
              </li>
              <li className="flex items-start gap-3">
                <img src={check} alt="check" className="w-8 h-8" />
                <span className="text-gray-700">Get personalized learning recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <img src={check} alt="check" className="w-8 h-8" />
                <span className="text-gray-700">Showcase your growth to employers</span>
              </li>
              <li className="flex items-start gap-3">
                <img src={check} alt="check" className="w-8 h-8" />
                <span className="text-gray-700">Collaborate with peers and instructors</span>
              </li>
            </ul>
            <a href="/signup" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            Join thousands of students already mapping their skills and achieving their goals
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2025 SkillMatch. Empowering students through smart skill discovery.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;