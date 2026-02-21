import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="w-full">

      {/* 🔥 TOP HERO SECTION */}
      <div
        className="w-full h-[420px] bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('result_0.jpeg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Text */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="max-w-2xl text-gray-200">
            Due to high volume of interactions, responses may take longer.
            We appreciate your patience.
          </p>
        </div>
      </div>

      {/* 📩 CONTACT SECTION */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-16">
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-10">

          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#00BC91] mb-2">
              Get in Touch
            </h2>
            <p className="text-gray-600">
              We’d love to hear from you. Reach out anytime!
            </p>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Contact Info */}
            <div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 text-gray-700">
                  <FaPhoneAlt className="text-green-500" />
                  <span>+94 77 964 3177</span>
                </div>

                <div className="flex items-center gap-4 text-gray-700">
                  <FaEnvelope className="text-green-500" />
                  <span>contact@example.com</span>
                </div>

                <div className="flex items-center gap-4 text-gray-700">
                  <FaMapMarkerAlt className="text-green-500" />
                  <span>Sri Lanka</span>
                </div>
              </div>

              {/* Google Map */}
              <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-md">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d4572.203136118376!2d80.6166358927918!3d5.9649557093461025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwNTcnNTIuMyJOIDgwwrAzNycxMS4wIkU!5e1!3m2!1sen!2slk!4v1769154774538!5m2!1sen!2slk"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <textarea
                placeholder="Your Message"
                rows="5"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-[#00BC91] text-white py-3 rounded-lg font-semibold hover:bg-[#009f7a] transition shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00BC91]/50"
>
                Send Message
              </button>
            </form>

          </div>
        </div>
      </div>

    </div>
  );
}
