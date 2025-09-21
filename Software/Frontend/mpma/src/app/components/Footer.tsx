import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer py-8 px-4 bg-neutral text-neutral-content">
      <div className="container mx-auto footer text-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <span className="footer-title opacity-100">MPMA</span>
          <Link href="/public/about" className="link link-hover">
            About
          </Link>
          <Link href="/public/contact" className="link link-hover">
            Contact
          </Link>
          <Link href="/public/faq" className="link link-hover">
            FAQ
          </Link>
          <Link href="/status" className="link link-hover font-semibold">
            System Status
          </Link>
        </div>
        <div className="space-y-1">
          <span className="footer-title opacity-100">Legal</span>
          <Link href="/public/terms" className="link link-hover">
            Terms of use
          </Link>
          <Link href="/public/privacy" className="link link-hover">
            Privacy policy
          </Link>
        </div>
        <div className="space-y-1">
          <span className="footer-title opacity-100">
            Build by the University of Moratuwa
          </span>
          <p>Faculty Of Information Technology</p>
          <p>
            As a 2<sup>nd</sup> year Software Project
          </p>
          {/* * Dynamic copyright year that updates automatically */}
          <p>©{new Date().getFullYear()} All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
