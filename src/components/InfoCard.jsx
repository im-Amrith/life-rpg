export default function InfoCard({ title, image, stats }) {
  return (
    <div className="bg-[#121212] rounded-xl border border-gray-800 overflow-hidden group hover:border-gray-600 transition-colors">
      {/* Header Image */}
      <div className="h-24 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent z-10"></div>
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      
      {/* Content */}
      <div className="p-4 relative z-20 -mt-8">
        <h3 className="text-white font-bold flex items-center gap-2 mb-3">
          <span className="text-xl">💻</span> {title}
        </h3>
        
        <div className="space-y-3 text-xs text-gray-400">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span>{stat.label}</span>
                <span>{stat.value}</span>
              </div>
              {stat.progress !== undefined && (
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${stat.progress}%` }}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}