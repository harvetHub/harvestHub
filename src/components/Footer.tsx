import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="myContainer mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} HarvestHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
