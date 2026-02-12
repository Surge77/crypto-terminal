const Footer = () => {
  return (
    <footer className="border-t border-dark-400/30 mt-12 py-8">
      <div className="main-container">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">
              Crypto<span className="text-emerald-500">Nexus</span>
            </span>
            <span className="text-gray-500 text-sm">|</span>
            <span className="text-gray-500 text-sm">Real-Time Crypto Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Built with Next.js & CoinGecko API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
