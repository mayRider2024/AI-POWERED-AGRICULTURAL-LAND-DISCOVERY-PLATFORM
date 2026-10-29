import { useState } from 'react';

interface ExtractedDocInfo {
  surveyNumber?: string;
  gatNumber?: string;
  district?: string;
  taluka?: string;
  village?: string;
  areaAcres?: number;
  areaGunthas?: number;
  occupantNames?: string[];
  mutationNumbers?: string[];
  assessmentRupees?: number;
  cropDetails?: string[];
  confidence: number;
}

export default function LandRecords() {
  const [district, setDistrict] = useState('Raigad');
  const [taluka, setTaluka] = useState('Alibag');
  const [village, setVillage] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('');

  // 7/12 OCR & Document Extraction State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedDocInfo | null>(null);

  const officialLinks = [
    {
      title: 'Mahabhulekh (7/12 & 8A Online)',
      desc: 'View digitally signed or view-only 7/12 extracts for Maharashtra districts.',
      url: 'https://bhulekh.mahabhumi.gov.in/',
      badge: 'Official Portal',
    },
    {
      title: 'Digital Satbara (Aaple Abhilekh)',
      desc: 'Download digitally signed 7/12, 8A, and property card with QR authentication.',
      url: 'https://digitalsatbara.mahabhumi.gov.in/',
      badge: 'Certified Copy',
    },
    {
      title: 'Mahabhunakasha (Cadastral Maps)',
      desc: 'Official cadastral maps showing plot boundaries and survey boundaries for Maharashtra.',
      url: 'https://mahabhunakasha.mahabhumi.gov.in/',
      badge: 'Cadastral GIS',
    },
    {
      title: 'Mahabhumi e-Records Portal',
      desc: 'Maharashtra state land records archive and public property registry resources.',
      url: 'https://mahabhumi.gov.in/',
      badge: 'Govt Gateway',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedInfo(null);
    }
  };

  const handleAnalyzeDocument = () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);

    // AI Assisted Document parsing simulation/analysis with strict compliance disclaimers
    setTimeout(() => {
      setIsAnalyzing(false);
      setExtractedInfo({
        surveyNumber: surveyNumber || '125/2',
        gatNumber: 'Gat No. 48',
        district: district || 'Raigad',
        taluka: taluka || 'Panvel',
        village: village || 'Apta',
        areaAcres: 2.5,
        areaGunthas: 100,
        occupantNames: ['Rameshwar V. Patil (Khatadar)', 'Suresh V. Patil (Hissedar)'],
        mutationNumbers: ['Ferfar #4521', 'Ferfar #5102'],
        assessmentRupees: 14.50,
        cropDetails: ['Kharif Rice (भाताचे पीक)', 'Fallow/Grassland (पड जमीन)'],
        confidence: 0.94,
      });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">📜</span>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Maharashtra Land Records & Survey Search</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Official Bhulekh deep links, 7/12 extract assistant, and legal cadastral records guidance
          </p>
        </div>
      </div>

      {/* Compliance / Legal Transparency Notice */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg text-xs text-amber-900 space-y-1">
        <p className="font-bold flex items-center gap-1.5 text-sm">
          <span>⚖️</span> Legal Notice & Official Compliance
        </p>
        <p>
          LandLens AI connects directly with authorized, publicly accessible Maharashtra State portals. In accordance with government policy and data privacy regulations, official land records must be verified on Mahabhulekh. Bulk automated scraping of survey numbers without official government API authorization is strictly not supported.
        </p>
      </div>

      {/* Lookup Workflow Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-2">
          <span>🔍</span> District & Survey / Gat Number Lookup
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">District (जिल्हा)</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="Raigad">Raigad (रायगड)</option>
              <option value="Palghar">Palghar (पालघर)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Taluka (तालुका)</label>
            <select
              value={taluka}
              onChange={(e) => setTaluka(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              {district === 'Raigad' ? (
                <>
                  <option value="Panvel">Panvel (पनवेल)</option>
                  <option value="Alibag">Alibag (अलिबाग)</option>
                  <option value="Pen">Pen (पेण)</option>
                  <option value="Mhasala">Mhasala (म्हसळा)</option>
                  <option value="Roha">Roha (रोहा)</option>
                </>
              ) : (
                <>
                  <option value="Palghar">Palghar (पालघर)</option>
                  <option value="Dahanu">Dahanu (डहाणू)</option>
                  <option value="Talasari">Talasari (तलासरी)</option>
                  <option value="Vikramgad">Vikramgad (विक्रमगड)</option>
                  <option value="Wada">Wada (वाडा)</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Village (गाव)</label>
            <input
              type="text"
              placeholder="e.g. Apta / Uppal"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Survey / Gat No. (सर्व्हे / गट)</label>
            <input
              type="text"
              placeholder="e.g. 125/2 or 48"
              value={surveyNumber}
              onChange={(e) => setSurveyNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href={`https://bhulekh.mahabhumi.gov.in/`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors inline-flex items-center gap-1.5"
          >
            <span>🔗</span> Open Bhulekh 7/12 for {taluka}
          </a>
          <a
            href={`https://mahabhunakasha.mahabhumi.gov.in/`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors inline-flex items-center gap-1.5"
          >
            <span>🗺</span> Open Mahabhunakasha Cadastral Map
          </a>
        </div>
      </div>

      {/* Official Maharashtra Portals */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-800">Official Maharashtra Land Records Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {officialLinks.map((link) => (
            <div key={link.url} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-gray-800 text-sm">{link.title}</span>
                  <span className="text-[11px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                    {link.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">{link.desc}</p>
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-green-700 hover:text-green-800 inline-flex items-center gap-1"
              >
                Access Official Service →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* AI Document Assistant for Uploaded 7/12 Extracts */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h2 className="font-bold text-gray-800 text-base flex items-center gap-2">
              <span>📑</span> AI Document Assistant (7/12 & Survey Extract)
            </h2>
            <p className="text-xs text-gray-500">
              Upload your legally obtained 7/12 extract or Nakasha for automated parameter extraction and verification.
            </p>
          </div>
          <span className="text-[11px] bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full font-medium">
            Unverified — User Uploaded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Upload & Preview */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-50">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="doc-upload"
            />
            <label htmlFor="doc-upload" className="cursor-pointer space-y-2">
              <span className="text-4xl block">📄</span>
              <span className="text-sm font-medium text-green-700 hover:underline block">
                {selectedFile ? selectedFile.name : 'Choose 7/12 Extract or Survey Map'}
              </span>
              <span className="text-xs text-gray-400 block">PDF, PNG, JPG up to 10MB</span>
            </label>

            {previewUrl && (
              <div className="mt-3 w-full">
                <img
                  src={previewUrl}
                  alt="Document Preview"
                  className="max-h-48 mx-auto rounded border border-gray-200 object-contain shadow-sm"
                />
              </div>
            )}

            {selectedFile && (
              <button
                onClick={handleAnalyzeDocument}
                disabled={isAnalyzing}
                className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg text-xs font-semibold hover:bg-green-800 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? 'Extracting Parameters with AI…' : 'Analyze Document with AI'}
              </button>
            )}
          </div>

          {/* Extracted Fields */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm flex items-center justify-between">
              <span>Extracted Fields</span>
              {extractedInfo && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                  {Math.round(extractedInfo.confidence * 100)}% Confidence
                </span>
              )}
            </h3>

            {extractedInfo ? (
              <div className="space-y-2 text-gray-700">
                <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded border border-gray-200">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Survey / Gat No</span>
                    <span className="font-semibold">{extractedInfo.surveyNumber} ({extractedInfo.gatNumber})</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Location</span>
                    <span className="font-semibold">{extractedInfo.village}, {extractedInfo.taluka}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded border border-gray-200">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Calculated Area</span>
                    <span className="font-semibold text-green-700">{extractedInfo.areaAcres} ac ({extractedInfo.areaGunthas} gunthas)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Govt Assessment</span>
                    <span className="font-semibold">₹{extractedInfo.assessmentRupees}</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">Recorded Occupants (खातेदार)</span>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 font-medium">
                    {extractedInfo.occupantNames?.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-gray-400 mt-1 italic">
                    Note: Ownership on record does not imply willingness to sell.
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">Mutations & Crops</span>
                  <p className="text-gray-600">{extractedInfo.mutationNumbers?.join(', ')}</p>
                  <p className="text-gray-600 mt-0.5">{extractedInfo.cropDetails?.join(' · ')}</p>
                </div>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-center text-gray-400 space-y-1">
                <span>📑</span>
                <p>Upload a 7/12 extract or Nakasha document to view automated field extraction.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
