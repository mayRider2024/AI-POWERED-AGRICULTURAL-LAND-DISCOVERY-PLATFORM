
import { useParams, useNavigate } from 'react-router-dom';
import { properties } from '../data/properties';
import { useSaved } from '../context/SavedPropertiesContext';


export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = properties.find((p) => p.id === id);

  const { savedIds, toggleSave } = useSaved();


  if (!property) {
    return (
      <div className="p-4">
        <p className="text-red-600">Property not found.</p>
        <button
          className="mt-2 px-3 py-1 bg-gray-600 text-white rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const isSaved = savedIds.includes(property.id);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold">{property.surveyNumber}</h1>
      <p><strong>District:</strong> {property.district}</p>
      <p><strong>Taluka:</strong> {property.taluka}</p>
      <p><strong>Village:</strong> {property.village}</p>
      <p><strong>Area:</strong> {property.areaAcres} acres</p>
      <p><strong>Price:</strong> ₹{property.totalPrice.toLocaleString()}</p>
      <p><strong>Status:</strong> {property.verificationStatus}</p>
      <div className="flex space-x-2 mt-4">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="px-3 py-1 bg-green-600 text-white rounded"
          onClick={() => toggleSave(property.id)}
        >
          {isSaved ? 'Unsave' : 'Save'}
        </button>
      </div>
    </div>
  );
}
