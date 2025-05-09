import {
  Plane,
  Hotel,
  Bus,
  Briefcase,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ icon, title }) => {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white/5 p-4 text-center text-white backdrop-blur-lg transition-all hover:bg-white/10 hover:scale-[1.02] hover:shadow-md border border-white/10 duration-300">
      <div className="mb-2">{icon}</div>
      <span className="text-xs font-semibold md:text-sm">{title}</span>
    </div>
  );
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log("Login attempt with:", { email, password });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl bg-gradient-to-r from-indigo-600 to-indigo-300 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="mt-3 text-gray-500">Access your business travel portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border-0 bg-gray-50 px-12 py-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full rounded-xl border-0 bg-gray-50 px-12 py-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-4 rounded-full hover:bg-gray-100 p-1.5 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-400 py-4 px-6 font-semibold text-white shadow-lg transition-all hover:shadow-md hover:scale-[1.01] disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Signing In...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="mt-6 text-center text-sm">
          <Link
            to="#"
            className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Create account
          </Link>
          <span className="mx-2 text-gray-400">•</span>
          <Link
            to="#"
            className="font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
};

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Side - Branding & Services */}
      <div className="relative flex w-full flex-col justify-between bg-gradient-to-br from-indigo-900 to-indigo-400 p-8 md:w-1/2 md:p-16">
        <div className="relative z-10 space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              TheSkyTrails
            </h1>
            <p className="mt-3 text-xl text-indigo-100">
              Enterprise Travel Platform
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Global Travel Management
            </h2>
            <p className="text-lg text-indigo-100 max-w-xl">
              Streamline corporate travel with integrated solutions for flights,
              accommodations, ground transportation, and visa processing.
            </p>
          </div>
        </div>

        {/* Service Cards */}
        <div className="relative z-10 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { icon: <Plane className="h-7 w-7" />, title: "Flights" },
            { icon: <Hotel className="h-7 w-7" />, title: "Hotels" },
            { icon: <Bus className="h-7 w-7" />, title: "Buses" },
            { icon: <Briefcase className="h-7 w-7" />, title: "Packages" },
            { icon: <CreditCard className="h-7 w-7" />, title: "Visa" },
          ].map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
            />
          ))}
        </div>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-15">
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-purple-900/30" />
          <div className="absolute inset-0 animate-pulse-slow bg-[length:100px_100px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2 md:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="mb-10 text-center md:hidden">
            <h1 className="text-3xl font-bold text-gray-900">TheSkyTrails</h1>
            <p className="mt-2 text-gray-600">Enterprise Travel Platform</p>
          </div>

          <LoginForm />

          <div className="mt-12 text-center text-sm text-gray-500">
            <p>
              Need help?{" "}
              <Link
                to="#"
                className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Contact our team
              </Link>
            </p>
            <p className="mt-4 text-xs text-gray-400">
              © {new Date().getFullYear()} TheSkyTrails • Secure Enterprise
              Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
