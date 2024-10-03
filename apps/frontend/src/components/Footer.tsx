const Footer = () => {
  return (
    <div className="border-t  md:mt-12 mt-6 ">
      <footer className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 RealTime Q&A. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-xs hover:underline underline-offset-4"
            href="https://x.com/Jashandeep31"
          >
            Jashandeep31
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
