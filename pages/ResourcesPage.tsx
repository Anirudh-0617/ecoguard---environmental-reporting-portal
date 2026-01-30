import React, { useState } from 'react';
import {
    Building2,
    Globe,
    ExternalLink,
    Leaf,
    Scale,
    Droplets,
    Trees,
    Search,
    Users,
    AlertTriangle,
    Truck,
    Flame,
    Filter
} from 'lucide-react';

const ResourcesPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', 'Central Government', 'Municipal & Local', 'Emergency Services', 'NGOs'];

    const govtBodies = [
        {
            name: "Ministry of Environment, Forest and Climate Change (MoEFCC)",
            category: "Central Government",
            role: "Central Government Ministry",
            description: "The nodal agency in the administrative structure of the Central Government for the planning, promotion, co-ordination and overseeing the implementation of India's environmental and forestry policies and programmes.",
            link: "https://moef.gov.in/",
            icon: <Building2 className="w-6 h-6 text-orange-600" />
        },
        {
            name: "Central Pollution Control Board (CPCB)",
            category: "Central Government",
            role: "Statutory Organisation",
            description: "Provides technical services to the Ministry of Environment and Forests. Principal functions include promoting cleanliness of streams and wells, and improving the quality of air and preventing air pollution.",
            link: "https://cpcb.nic.in/",
            icon: <Droplets className="w-6 h-6 text-blue-600" />
        },
        {
            name: "National Green Tribunal (NGT)",
            category: "Central Government",
            role: "Judicial Body",
            description: "A specialized body equipped with the necessary expertise to handle environmental disputes involving multi-disciplinary issues.",
            link: "https://greentribunal.gov.in/",
            icon: <Scale className="w-6 h-6 text-emerald-600" />
        },
        {
            name: "Forest Survey of India (FSI)",
            category: "Central Government",
            role: "Government Monitor",
            description: "Conducts survey and assessment of forest resources in the country. It publishes the 'India State of Forest Report' biennially.",
            link: "https://fsi.nic.in/",
            icon: <Trees className="w-6 h-6 text-green-700" />
        },
        {
            name: "Greater Hyderabad Municipal Corporation (GHMC)",
            category: "Municipal & Local",
            role: "Local Civic Body",
            description: "Responsible for civic administration and infrastructure in Hyderabad. Handles waste management, sanitation, urban planning, and health services for the city.",
            link: "https://www.ghmc.gov.in/",
            icon: <Truck className="w-6 h-6 text-purple-600" />
        },
        {
            name: "Hyderabad Metropolitan Water Supply and Sewerage Board (HMWSSB)",
            category: "Municipal & Local",
            role: "Water & Sanitation",
            description: "Responsible for water supply and sewerage maintenance in the Hyderabad metropolitan area. Critical for water conservation and pollution control.",
            link: "https://www.hyderabadwater.gov.in/",
            icon: <Droplets className="w-6 h-6 text-blue-500" />
        },
        {
            name: "Telangana State Disaster Response and Fire Services",
            category: "Emergency Services",
            role: "Fire & Rescue",
            description: "Provides fire prevention and protection services. Responds to fire accidents, building collapses, and other emergencies involving hazardous materials.",
            link: "https://fire.telangana.gov.in/",
            icon: <Flame className="w-6 h-6 text-red-600" />
        },
        {
            name: "National Disaster Management Authority (NDMA)",
            category: "Emergency Services",
            role: "Disaster Management",
            description: "Apex body for disaster management in India. Coordinates response to natural and man-made disasters including chemical accidents.",
            link: "https://ndma.gov.in/",
            icon: <AlertTriangle className="w-6 h-6 text-amber-600" />
        }
    ];

    const ngos = [
        {
            name: "Greenpeace India",
            category: "NGOs",
            focus: "Climate Change, Sustainable Agriculture",
            description: "An independent campaigning organization that uses non-violent creative confrontation to expose global environmental problems and force solutions.",
            link: "https://www.greenpeace.org/india/en/",
            icon: <Globe className="w-6 h-6 text-green-500" />
        },
        {
            name: "Centre for Science and Environment (CSE)",
            category: "NGOs",
            focus: "Research & Advocacy",
            description: "A public interest research and advocacy organisation based in New Delhi. It researches into, lobbies for and communicates the urgency of development that is both sustainable and equitable.",
            link: "https://www.cseindia.org/",
            icon: <Search className="w-6 h-6 text-blue-500" />
        },
        {
            name: "Chintan Environmental Research and Action Group",
            category: "NGOs",
            focus: "Waste Management, Air Pollution",
            description: "Works for environmental justice in partnership with people and groups from diverse sections of society. Focuses heavily on waste pickers and sustainable waste management.",
            link: "https://www.chintan-india.org/",
            icon: <Leaf className="w-6 h-6 text-emerald-500" />
        },
        {
            name: "Vanashakti",
            category: "NGOs",
            focus: "Forest & Mangrove Conservation",
            description: "Focused on conservation of forests and wetlands. Known for legal interventions to protect the Aarey Forest and Mumbai's mangroves.",
            link: "http://vanashakti.org/",
            icon: <Trees className="w-6 h-6 text-teal-600" />
        },
        {
            name: "WWF-India",
            category: "NGOs",
            focus: "Wildlife & Nature Conservation",
            description: "Committed to determining and observing the state of nature, identifying the threats to Indian wildlife, and finding practical solutions.",
            link: "https://www.wwfindia.org/",
            icon: <Leaf className="w-6 h-6 text-green-600" />
        },
        {
            name: "Environmentalist Foundation of India (EFI)",
            category: "NGOs",
            focus: "Water Body Restoration",
            description: "Focuses on wildlife conservation and habitat restoration. Known for cleaning and restoring lakes and ponds across India with community participation.",
            link: "https://indiaenvironment.org/",
            icon: <Droplets className="w-6 h-6 text-blue-400" />
        }
    ];

    const allResources = [...govtBodies, ...ngos].filter(item =>
        selectedCategory === 'All' || item.category === selectedCategory
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Environmental Resources</h1>
                <p className="text-gray-500 mb-8">
                    Explore key government bodies and organizations working towards a cleaner, greener India. Learn about their roles and how you can contribute.
                </p>

                {/* Filter Dropdown Section */}
                <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-600">Filter by:</span>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-transparent border-none text-emerald-600 font-bold text-sm focus:ring-0 cursor-pointer"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <Building2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCategory === 'All' ? 'All Authorities & Organizations' : selectedCategory}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allResources.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                    {item.icon}
                                </div>
                                <div className="flex flex-col items-end">
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-emerald-600 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            <div className="mb-3">
                                <span className="inline-block px-2 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
                                    {item.category}
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                    {item.name}
                                </h3>
                            </div>

                            <p className="text-gray-500 text-sm leading-relaxed flex-grow mb-4">
                                {item.description}
                            </p>

                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2.5 rounded-xl border border-gray-100 text-center text-sm font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100 transition-all flex items-center justify-center gap-2"
                            >
                                Visit Website
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    ))}
                </div>

                {allResources.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No resources found for this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourcesPage;
