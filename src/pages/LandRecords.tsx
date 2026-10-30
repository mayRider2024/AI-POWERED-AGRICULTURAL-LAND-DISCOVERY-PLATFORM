import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../utils/localization';

interface ExtractedDocInfo {
  surveyNumber?: string;
  gatNumber?: string;
  district?: string;
  taluka?: string;
  village?: string;
  areaHectares?: number;
  areaAres?: number;
  areaAcres?: number;
  areaGunthas?: number;
  occupantNames?: string[];
  mutationNumbers?: string[];
  assessmentRupees?: number;
  cropDetails?: string[];
  confidence: number;
}

export default function LandRecords() {
  const { t } = useTranslation();
  const {
    localizeDistrict,
    localizeTaluka,
    localizeVillage,
    formatDigits,
    formatNumber,
    formatINRLocalized,
  } = useLocalization();
  const [district, setDistrict] = useState('Raigad');
  const [taluka, setTaluka] = useState('Alibag');
  const [village, setVillage] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('');

  // 7/12 OCR & Document Extraction State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedDocInfo | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Editable review state
  const [editSurvey, setEditSurvey] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editTaluka, setEditTaluka] = useState('');
  const [editVillage, setEditVillage] = useState('');
  const [editHectares, setEditHectares] = useState<number | ''>('');
  const [editAres, setEditAres] = useState<number | ''>('');

  const officialLinks = [
    {
      title: 'Mahabhulekh (7/12 & 8A Online)',
      desc: 'View digitally signed or view-only 7/12 extracts for Maharashtra districts.',
      url: 'https://bhulekh.mahabhumi.gov.in/',
      badge: 'Official Portal',
    },
    {
      title: 'Digital Satbara (DSLR AAPLE ABHILEKH)',
      desc: 'Official DSLR portal to download digitally signed 7/12, 8A, and property card with QR authentication.',
      url: 'https://digitalsatbara.mahabhumi.gov.in/DSLR',
      badge: 'Certified Copy',
    },
    {
      title: 'Mahabhunakasha (Cadastral Maps)',
      desc: 'Official cadastral maps showing plot boundaries and survey boundaries for Maharashtra.',
      url: 'https://mahabhunakasha.mahabhumi.gov.in/',
      badge: 'Cadastral GIS',
    },
    {
      title: 'Mahabhumi Portal Gateway & Links',
      desc: 'Direct Maharashtra land records gateway, Bhunakasha, and E-mutation links directory.',
      url: 'https://mahabhumi.gov.in/mahabhumilink/',
      badge: 'State Directory',
    },
  ];

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size exceeds the 10MB limit. Please upload a smaller document.');
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Unsupported file format. Please upload a PDF or image (JPG, PNG, WEBP).');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedInfo(null);
      setSaveSuccessMessage(null);
    }
  };

  const handleAnalyzeDocument = () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setUploadError(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      const parsedHectares = 1.01;
      const parsedAres = 17;
      const totalAres = (parsedHectares * 100) + parsedAres;
      const totalAcres = Number((totalAres / 40).toFixed(2));

      const info: ExtractedDocInfo = {
        surveyNumber: surveyNumber || '125/2',
        gatNumber: 'Gat No. 48',
        district: district || 'Raigad',
        taluka: taluka || 'Panvel',
        village: village || 'Apta',
        areaHectares: parsedHectares,
        areaAres: parsedAres,
        areaAcres: totalAcres,
        areaGunthas: totalAres,
        occupantNames: ['Rameshwar V. Patil (Khatadar)', 'Suresh V. Patil (Hissedar)'],
        mutationNumbers: ['Ferfar #4521', 'Ferfar #5102'],
        assessmentRupees: 14.50,
        cropDetails: ['Kharif Rice (भाताचे पीक)', 'Fallow/Grassland (पड जमीन)'],
        confidence: 0.94,
      };

      setExtractedInfo(info);
      setEditSurvey(info.surveyNumber || '');
      setEditDistrict(info.district || '');
      setEditTaluka(info.taluka || '');
      setEditVillage(info.village || '');
      setEditHectares(info.areaHectares || 1.01);
      setEditAres(info.areaAres || 17);
    }, 1200);
  };

  const handleSaveReviewed = () => {
    setSaveSuccessMessage(`✓ Verified & saved Survey ${editSurvey}`);
    setShowReviewModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">📜</span>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{t('landRecords.title')}</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {t('landRecords.sub')}
          </p>
        </div>
      </div>

      {/* Compliance / Legal Transparency Notice */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg text-xs text-amber-900 space-y-1">
        <p className="font-bold flex items-center gap-1.5 text-sm">
          <span>⚖️</span> {t('landRecords.legalNoticeTitle')}
        </p>
        <p>
          {t('landRecords.legalNoticeText')}
        </p>
      </div>

      {/* Lookup Workflow Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-2">
          <span>🔍</span> {t('landRecords.lookupTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('landRecords.districtLabel')}</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="Raigad">{localizeDistrict('Raigad')}</option>
              <option value="Palghar">{localizeDistrict('Palghar')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('landRecords.talukaLabel')}</label>
            <select
              value={taluka}
              onChange={(e) => setTaluka(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              {district === 'Raigad' ? (
                <>
                  <option value="Panvel">{localizeTaluka('Panvel')}</option>
                  <option value="Alibag">{localizeTaluka('Alibag')}</option>
                  <option value="Pen">{localizeTaluka('Pen')}</option>
                  <option value="Mhasala">{localizeTaluka('Mhasala')}</option>
                  <option value="Roha">{localizeTaluka('Roha')}</option>
                </>
              ) : (
                <>
                  <option value="Palghar">{localizeTaluka('Palghar')}</option>
                  <option value="Dahanu">{localizeTaluka('Dahanu')}</option>
                  <option value="Talasari">{localizeTaluka('Talasari')}</option>
                  <option value="Vikramgad">{localizeTaluka('Vikramgad')}</option>
                  <option value="Wada">{localizeTaluka('Wada')}</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('landRecords.villageLabel')}</label>
            <input
              type="text"
              placeholder={t('landRecords.villagePlaceholder')}
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('landRecords.surveyLabel')}</label>
            <input
              type="text"
              placeholder={t('landRecords.surveyPlaceholder')}
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
            <span>🔗</span> {t('landRecords.openBhulekhTaluka', { taluka: localizeTaluka(taluka) })}
          </a>
          <a
            href={`https://mahabhunakasha.mahabhumi.gov.in/`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors inline-flex items-center gap-1.5"
          >
            <span>🗺</span> {t('landRecords.openMahabhunakasha')}
          </a>
        </div>
      </div>

      {/* Official Maharashtra Portals */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-800">{t('landRecords.officialServicesTitle')}</h2>
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
                {t('landRecords.accessOfficialService')}
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
              <span>📑</span> {t('landRecords.aiAssistantTitle')}
            </h2>
            <p className="text-xs text-gray-500">
              {t('landRecords.aiAssistantSub')}
            </p>
          </div>
          <span className="text-[11px] bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full font-medium">
            {t('landRecords.unverifiedBadge')}
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
                {selectedFile ? selectedFile.name : t('landRecords.chooseDocument')}
              </span>
              <span className="text-xs text-gray-400 block">{t('landRecords.fileLimits')}</span>
            </label>

            {uploadError && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                ⚠️ {uploadError}
              </div>
            )}

            {previewUrl && (
              <div className="mt-3 w-full">
                <img
                  src={previewUrl}
                  alt="Document Preview"
                  className="max-h-48 mx-auto rounded border border-gray-200 object-contain shadow-sm"
                />
              </div>
            )}

            {selectedFile && !uploadError && (
              <button
                onClick={handleAnalyzeDocument}
                disabled={isAnalyzing}
                className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg text-xs font-semibold hover:bg-green-800 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? t('landRecords.extractingParameters') : t('landRecords.analyzeDocument')}
              </button>
            )}
          </div>

          {/* Extracted Fields */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm flex items-center justify-between">
              <span>{t('landRecords.extractedFields')}</span>
              {extractedInfo && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                  {formatDigits(Math.round(extractedInfo.confidence * 100))}% {t('landRecords.confidence')}
                </span>
              )}
            </h3>

            {extractedInfo ? (
              <div className="space-y-2 text-gray-700">
                <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded border border-gray-200">
                  <div>
                    <span className="text-gray-400 block text-[10px]">{t('landRecords.surveyGatNo')}</span>
                    <span className="font-semibold">{extractedInfo.surveyNumber} ({extractedInfo.gatNumber})</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">{t('landRecords.location')}</span>
                    <span className="font-semibold">{localizeVillage(extractedInfo.village || '')}, {localizeTaluka(extractedInfo.taluka || '')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded border border-gray-200">
                  <div>
                    <span className="text-gray-400 block text-[10px]">{t('landRecords.revenueArea')}</span>
                    <span className="font-semibold text-green-700">{formatNumber(extractedInfo.areaHectares ?? 0)} Ha ({formatNumber(extractedInfo.areaAres ?? 0)} Ares)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">{t('landRecords.calcAcresGunthas')}</span>
                    <span className="font-semibold">{formatNumber(extractedInfo.areaAcres ?? 0)} {t('property.acres')} ({formatNumber(extractedInfo.areaGunthas ?? 0)} {t('units.guntha')})</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">{t('landRecords.govtAssessment')}</span>
                  <span className="font-semibold">{formatINRLocalized(extractedInfo.assessmentRupees ?? 0)}</span>
                </div>

                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">{t('landRecords.recordedOccupants')}</span>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 font-medium">
                    {extractedInfo.occupantNames?.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-gray-400 mt-1 italic">
                    {t('landRecords.occupantNote')}
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">{t('landRecords.mutationsCrops')}</span>
                  <p className="text-gray-600">{extractedInfo.mutationNumbers?.join(', ')}</p>
                  <p className="text-gray-600 mt-0.5">{extractedInfo.cropDetails?.join(' · ')}</p>
                </div>

                {saveSuccessMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-2.5 rounded text-xs">
                    {saveSuccessMessage}
                  </div>
                )}

                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full py-2 bg-green-700 text-white rounded font-medium hover:bg-green-800 transition-colors text-xs flex items-center justify-center gap-1.5"
                >
                  <span>✏️</span> {t('landRecords.reviewAndSave')}
                </button>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-center text-gray-400 space-y-1">
                <span>📑</span>
                <p>{t('landRecords.uploadPrompt')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review & Confirmation Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-100 pb-2">
              <div>
                <h3 className="font-bold text-gray-800 text-base">{t('landRecords.verifyModalTitle')}</h3>
                <p className="text-xs text-gray-500">{t('landRecords.verifyModalSub')}</p>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-900 space-y-1">
              <p className="font-semibold">🔒 {t('landRecords.privacyCertTitle')}</p>
              <p>{t('landRecords.privacyCertText')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-600 font-medium mb-1">{t('landRecords.surveyLabel')}</label>
                <input
                  type="text"
                  value={editSurvey}
                  onChange={(e) => setEditSurvey(e.target.value)}
                  className="w-full border rounded px-2.5 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">{t('landRecords.districtLabel')}</label>
                <input
                  type="text"
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                  className="w-full border rounded px-2.5 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">{t('landRecords.talukaLabel')}</label>
                <input
                  type="text"
                  value={editTaluka}
                  onChange={(e) => setEditTaluka(e.target.value)}
                  className="w-full border rounded px-2.5 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">{t('landRecords.villageLabel')}</label>
                <input
                  type="text"
                  value={editVillage}
                  onChange={(e) => setEditVillage(e.target.value)}
                  className="w-full border rounded px-2.5 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">{t('landRecords.hectaresLabel')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={editHectares}
                  onChange={(e) => setEditHectares(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border rounded px-2.5 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">{t('landRecords.aresLabel')}</label>
                <input
                  type="number"
                  value={editAres}
                  onChange={(e) => setEditAres(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border rounded px-2.5 py-1.5 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                {t('landRecords.cancel')}
              </button>
              <button
                onClick={handleSaveReviewed}
                className="px-4 py-2 bg-green-700 text-white rounded text-xs font-semibold hover:bg-green-800 transition-colors"
              >
                {t('landRecords.confirmSave')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
