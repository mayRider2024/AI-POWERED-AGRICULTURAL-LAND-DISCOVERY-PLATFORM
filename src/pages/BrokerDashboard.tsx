import { useState } from 'react';

interface ListingSubmission {
  title: string;
  surveyNumber: string;
  district: string;
  taluka: string;
  village: string;
  areaAcres: number;
  pricePerGuntha: number;
  latitude: number;
  longitude: number;
  sellerName: string;
  sellerPhone: string;
  consentPublished: boolean;
  status: 'pending_review' | 'approved' | 'rejected';
}

export default function BrokerDashboard() {
  const [activeTab, setActiveTab] = useState<'listings' | 'submit' | 'enquiries'>('listings');
  const [submittedListings, setSubmittedListings] = useState<ListingSubmission[]>([
    {
      title: 'Panvel Agricultural Land Parcel',
      surveyNumber: '125/2',
      district: 'Raigad',
      taluka: 'Panvel',
      village: 'Apta',
      areaAcres: 10.0,
      pricePerGuntha: 1250000,
      latitude: 18.99,
      longitude: 73.11,
      sellerName: 'V. R. Patil',
      sellerPhone: '+91 98200 XXXXX',
      consentPublished: true,
      status: 'approved',
    },
    {
      title: 'Roha Farm Land Parcel',
      surveyNumber: 'R-004',
      district: 'Raigad',
      taluka: 'Roha',
      village: 'Nagothane',
      areaAcres: 4.5,
      pricePerGuntha: 42000,
      latitude: 18.45,
      longitude: 73.12,
      sellerName: 'A. M. Deshmukh',
      sellerPhone: '+91 99300 XXXXX',
      consentPublished: true,
      status: 'pending_review',
    },
  ]);

  // Form State
  const [title, setTitle] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('');
  const [district, setDistrict] = useState('Raigad');
  const [taluka, setTaluka] = useState('Panvel');
  const [village, setVillage] = useState('');
  const [areaAcres, setAreaAcres] = useState<number | ''>('');
  const [pricePerGuntha, setPricePerGuntha] = useState<number | ''>('');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Seller consent is required before submitting property details.');
      return;
    }

    const newListing: ListingSubmission = {
      title: title || `${surveyNumber} (${taluka})`,
      surveyNumber,
      district,
      taluka,
      village,
      areaAcres: Number(areaAcres),
      pricePerGuntha: Number(pricePerGuntha),
      latitude: district === 'Raigad' ? 18.8 : 19.3,
      longitude: district === 'Raigad' ? 73.1 : 73.0,
      sellerName,
      sellerPhone,
      consentPublished: consent,
      status: 'pending_review',
    };

    setSubmittedListings([newListing, ...submittedListings]);
    setSubmittedNotice(true);
    setTimeout(() => setSubmittedNotice(false), 4000);

    // Reset Form
    setTitle('');
    setSurveyNumber('');
    setVillage('');
    setAreaAcres('');
    setPricePerGuntha('');
    setSellerName('');
    setSellerPhone('');
    setConsent(false);
    setActiveTab('listings');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🤝</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Broker & Seller Portal</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Submit verified agricultural listings, track client enquiries, and manage approvals
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'listings' ? 'bg-white text-green-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            My Listings ({submittedListings.length})
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'submit' ? 'bg-white text-green-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            + Submit Land
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'enquiries' ? 'bg-white text-green-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            Buyer Enquiries (2)
          </button>
        </div>
      </div>

      {submittedNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-medium">
          Listing submitted successfully! Placed in queue for Admin Review & Verification.
        </div>
      )}

      {/* Content depending on active tab */}
      {activeTab === 'listings' && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden space-y-3 p-4">
          <h2 className="font-semibold text-gray-800 text-sm">Your Managed Listings</h2>
          <div className="space-y-3">
            {submittedListings.map((l, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3 hover:bg-gray-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{l.surveyNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      l.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {l.status === 'approved' ? 'Active / Approved' : 'Pending Verification'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{l.village}, {l.taluka}, {l.district}</p>
                  <p className="text-xs font-semibold text-green-700 mt-0.5">
                    {l.areaAcres} Acres · ₹{l.pricePerGuntha.toLocaleString()} / guntha
                  </p>
                </div>
                <div className="text-right text-xs">
                  <span className="text-gray-400 block">Seller Contact:</span>
                  <span className="font-medium text-gray-700">{l.sellerName} ({l.sellerPhone})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'submit' && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 text-base">Submit New Agricultural Property</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Listing Title</label>
              <input
                type="text"
                placeholder="e.g. 5 Acre Agricultural Plot near Alibag"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Survey / Gat Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. 125/2 or 45"
                value={surveyNumber}
                onChange={(e) => setSurveyNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white"
              >
                <option value="Raigad">Raigad</option>
                <option value="Palghar">Palghar</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Taluka</label>
              <input
                type="text"
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                placeholder="e.g. Panvel, Alibag, Dahanu"
                className="w-full border border-gray-300 rounded-lg p-2 bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Village</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Village name"
                className="w-full border border-gray-300 rounded-lg p-2 bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Area (Acres) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={areaAcres}
                onChange={(e) => setAreaAcres(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 2.5"
                className="w-full border border-gray-300 rounded-lg p-2 bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Asking Price per Guntha (₹) *</label>
              <input
                type="number"
                required
                value={pricePerGuntha}
                onChange={(e) => setPricePerGuntha(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 50000"
                className="w-full border border-gray-300 rounded-lg p-2 bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Seller / Authorizer Name *</label>
              <input
                type="text"
                required
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="Authorized Owner / Broker"
                className="w-full border border-gray-300 rounded-lg p-2 bg-white"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 text-green-700 rounded"
              />
              <span className="text-gray-700 font-medium">
                I confirm that I have legal authorization / consent from the land owner to list this property and display contact parameters. Do not publish synthetic listings or unverified contact records.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors"
          >
            Submit for Admin Moderation
          </button>
        </form>
      )}

      {activeTab === 'enquiries' && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-800 text-sm">Active Buyer Inquiries</h2>
          <div className="space-y-3 text-xs">
            <div className="border border-gray-200 rounded-xl p-3.5 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Inquiry on Survey 125/2 (Panvel)</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">New</span>
              </div>
              <p className="text-gray-600">Buyer requesting 7/12 extract verification and road access inspection details.</p>
              <p className="text-gray-400 text-[10px]">Received: Today, 14:30</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-3.5 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Inquiry on R-001 (Alibag)</span>
                <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">Replied</span>
              </div>
              <p className="text-gray-600">Inquiry about boundary fencing and borewell water availability.</p>
              <p className="text-gray-400 text-[10px]">Received: Yesterday</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
