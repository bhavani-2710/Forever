import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* Forever - Description */}
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full md:2/3 text-gray-600">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam
            suscipit magni fugiat consequuntur, minus perspiciatis quos rerum
            ducimus exercitationem corporis natus, saepe molestiae debitis!
            Provident quae vitae magnam ea impedit. Lorem ipsum, dolor sit amet
            consectetur adipisicing elit.
          </p>
        </div>

        {/* Company - Home, About Us, Delivery, Privacy Policy */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-500">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-500">
            <li>+1-212-456-7890</li>
            <li>contact@foreveryou.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom horizontal line and Copyright */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025@ forever.com - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
