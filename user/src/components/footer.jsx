
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            YourBrand
          </h2>

          <p className="text-gray-400 text-sm leading-6">
            Connect with trusted event vendors for birthdays,
            weddings, decorations, photography, catering,
            and more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>
              <a
                href="/"
                className="hover:text-white transition"
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="https://vendor.byslot.online/"
                className="hover:text-white transition"
              >
                Vendors
              </a>
            </li>

            {/* <li>
              <a
                href="/about"
                className="hover:text-white transition"
              >
                About
              </a>
            </li> */}

            {/* <li>
              <a
                href="/contact"
                className="hover:text-white transition"
              >
                Contact
              </a>
            </li> */}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Legal
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>
              <a
                href="/privacy-policy"
                className="hover:text-white transition"
              >
                Privacy Policy
              </a>
            </li>

            {/* <li>
              <a
                href="/terms-conditions"
                className="hover:text-white transition"
              >
                Terms & Conditions
              </a>
            </li>

            <li>
              <a
                href="/refund-policy"
                className="hover:text-white transition"
              >
                Refund Policy
              </a>
            </li> */}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Contact
          </h3>

          <ul className="space-y-3 text-gray-400 text-sm">
            <li>Email: byslot10@gmail.com</li>
            <li>Phone: +91 7349343243 OR +91 8088303214</li>
            <li>Location: Karnataka, India</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">

          <p>
            © 2026 YourBrand. All rights reserved.
          </p>

          <div className="flex gap-4 mt-3 md:mt-0">
            <a
              href="/privacy-policy"
              className="hover:text-white transition"
            >
              Privacy
            </a>

            {/* <a
              href="/terms-conditions"
              className="hover:text-white transition"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="hover:text-white transition"
            >
              Support
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
