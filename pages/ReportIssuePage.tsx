
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UploadCloud
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { analyzeComplaint } from '../services/geminiService';
import { saveComplaint } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';
import { Complaint, ComplaintStatus } from '../types';

const ReportIssuePage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState({ address: '', lat: 0, lng: 0 });
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file (JPG, PNG, etc.)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const detectLocation = () => {
    setIsDetecting(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (Auto-detected)`
        });
        setIsDetecting(false);
      },
      (err) => {
        alert("Could not detect location. Please enter address manually.");
        setIsDetecting(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please provide a description");
      return;
    }

    setIsSubmitting(true);
    try {
      const analysis = await analyzeComplaint(description, language, image || undefined);
      const complaintId = `COMP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const newComplaint: Complaint = {
        id: complaintId,
        language,
        description,
        imageBase64: image || undefined,
        location,
        category: analysis.category,
        priority: analysis.priority,
        status: ComplaintStatus.NEW,
        department: analysis.department,
        createdAt: new Date().toISOString(),
        resolvedAt: null,
        rating: null,
        aiAnalysis: analysis,
        userId: getCurrentUser()?.id
      };

      saveComplaint(newComplaint);
      setSuccessId(complaintId);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successId) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-emerald-100 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-emerald-100 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6 text-emerald-600">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('successMessage')}</h2>
        <p className="text-gray-600 mb-8">
          {t('complaintIdLabel')} <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">{successId}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/track')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            {t('trackButton')}
          </button>
          <button
            onClick={() => { setSuccessId(null); setDescription(''); setImage(null); }}
            className="text-emerald-600 font-bold hover:underline"
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-emerald-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{t('formTitle')}</h1>
          <p className="text-emerald-50 opacity-90">Help us keep your environment clean and safe. Our AI will route your report immediately.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              Our AI system will automatically classify your report, determine priority, and assign it to the correct department after you submit.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">{t('descriptionLabel')}</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-gray-700"
            />
            <div className="text-right text-xs text-gray-400">
              {description.length} characters
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">{t('imageLabel')}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group min-h-[160px] ${isDragging
                  ? 'bg-emerald-100 border-emerald-500 scale-[0.98]'
                  : 'bg-emerald-50/30 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300'
                  }`}
              >
                {isDragging ? (
                  <UploadCloud className="w-10 h-10 text-emerald-600 animate-bounce mb-2" />
                ) : (
                  <Camera className="w-10 h-10 text-emerald-500 group-hover:scale-110 transition-transform mb-2" />
                )}
                <span className="text-sm font-bold text-emerald-700">
                  {isDragging ? 'Drop Image Here' : 'Click or Drag Image to Upload'}
                </span>
                <span className="text-xs text-gray-400 mt-1">Max 5MB (JPG, PNG)</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {image && (
                <div className="relative rounded-2xl overflow-hidden border border-gray-100 group shadow-sm">
                  <img src={image} alt="Preview" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImage(null); }}
                      className="bg-red-500 text-white p-2 rounded-full transform hover:scale-110 transition-transform"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">{t('locationLabel')}</label>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={detectLocation}
                disabled={isDetecting}
                className="flex items-center gap-2 bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 px-4 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
              >
                {isDetecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                {t('detectLocationButton')}
              </button>
            </div>
            <textarea
              value={location.address}
              onChange={(e) => setLocation({ ...location, address: e.target.value })}
              placeholder={t('manualAddressPlaceholder')}
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-gray-700"
            />
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  AI Processing...
                </>
              ) : (
                <>
                  {t('submitButton')}
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssuePage;
