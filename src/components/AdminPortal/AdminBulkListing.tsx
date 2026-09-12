import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { PropertyListing } from '../../types';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Download,
  Layers,
  ArrowRight,
  Globe,
  FileUp,
  Link as LinkIcon,
  Trash2,
  Edit3,
  Check,
  Building,
  RefreshCw,
} from 'lucide-react';

type IngestionMode = 'URL_LINKS' | 'FILE_UPLOAD' | 'CSV_TEXT';

const SAMPLE_CSV = `title,rent,bedrooms,bathrooms,sqft,propertyType,street,city,state,zip,neighborhood,amenities
"The Ashton Luxury Residences",3200,2,2,1100,CONDO,"101 Colorado St","Austin","TX","78701","Downtown","Pool,Concierge,Gym,Balcony"
"Beacon Hill Historic Brownstone",3450,1,1,780,APARTMENT,"45 Mt Vernon St","Boston","MA","02108","Beacon Hill","Hardwood,Fireplace,Patio"
"Lincoln Park Modern Garden Flat",2750,2,1.5,950,APARTMENT,"2120 N Clark St","Chicago","IL","60614","Lincoln Park","In-Unit Laundry,Central AC"
"LoDo Skyline Loft with Exposed Brick",2600,1,1,850,STUDIO,"1600 Wynkoop St","Denver","CO","80202","Lower Downtown","High Ceilings,Keyless Entry"
"Midtown Atlanta Highrise Terrace",2400,1,1,820,CONDO,"1080 Peachtree St NE","Atlanta","GA","30309","Midtown","Pool,Fitness Center,EV Parking"`;

const SAMPLE_URLS = `https://www.apartments.com/the-ashton-austin-tx/b9d8h2k/
https://www.zillow.com/homedetails/45-Mt-Vernon-St-Boston-MA-02108/59182341_zpid/
https://www.roomster.com/rooms/austin-tx/co-living-luxury-downtown-suite
https://www.apartments.com/lincoln-park-tower-chicago-il/7v29xq1/`;

const SAMPLE_ROOMSTER = `title,rent,bedrooms,bathrooms,sqft,propertyType,rentalCategory,roomType,genderPreference,street,city,state,zip
"Sunny Master Bedroom in SOMA Loft",1450,1,1,320,ROOM,PRIVATE_ROOM,MASTER,ANY,"480 2nd St","San Francisco","CA","94107"
"Furnished Private Room near UT Austin",950,1,1,220,ROOM,PRIVATE_ROOM,PRIVATE,STUDENT,"2400 Speedway","Austin","TX","78705"
"Luxury Room with Private Bath in Williamsburg",1650,1,1,280,ROOM,COLIVING,PRIVATE,ANY,"150 N 5th St","Brooklyn","NY","11249"`;

export const AdminBulkListing: React.FC = () => {
  const { setProperties, addToast, refreshData } = useApp();

  const [mode, setMode] = useState<IngestionMode>('URL_LINKS');
  const [urlInput, setUrlInput] = useState<string>('');
  const [rawInput, setRawInput] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Staged parsed listings for review before committing to database
  const [stagedListings, setStagedListings] = useState<Partial<PropertyListing>[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Execution report
  const [importReport, setImportReport] = useState<{
    total: number;
    successful: number;
    failed: number;
    duplicates: number;
    addedListings: PropertyListing[];
    errors: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample presets
  const handleLoadSampleUrls = () => {
    setUrlInput(SAMPLE_URLS);
    addToast('Sample Links Loaded', '4 verified real estate URLs from Apartments.com, Zillow & Roomster ready for parsing.', 'info');
  };

  const handleLoadSampleCsv = () => {
    setRawInput(SAMPLE_CSV);
    addToast('Sample CSV Loaded', '5 verified rental apartments ready for bulk syndication.', 'info');
  };

  const handleLoadRoomsterCsv = () => {
    setRawInput(SAMPLE_ROOMSTER);
    addToast('Roomster Coliving CSV Loaded', '3 co-living and private room listings ready for parsing.', 'info');
  };

  // Handle file drop / upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text || '');
      addToast('File Loaded', `${file.name} ready for AI parsing.`, 'info');
    };
    reader.readAsText(file);
  };

  // Step 1: Parse input (URLs, File, or Raw CSV) using server-side Gemini/Heuristic parser
  const handleParseData = async () => {
    try {
      setIsProcessing(true);
      let contentToParse = '';
      let inputType = 'text';

      if (mode === 'URL_LINKS') {
        if (!urlInput.trim()) {
          addToast('Empty URLs', 'Please input at least one property link or URL.', 'warning');
          return;
        }
        contentToParse = urlInput;
        inputType = 'url';
      } else if (mode === 'FILE_UPLOAD') {
        if (!fileContent.trim()) {
          addToast('No File Selected', 'Please upload a CSV, JSON, XLSX, XML, or TXT file.', 'warning');
          return;
        }
        contentToParse = fileContent;
        inputType = uploadedFileName.endsWith('.json') ? 'json' : 'file';
      } else {
        if (!rawInput.trim()) {
          addToast('Empty Input', 'Please paste CSV or text listing rows.', 'warning');
          return;
        }
        contentToParse = rawInput;
        inputType = 'csv';
      }

      // Call parseListingInput API
      const result = await api.parseListingInput({
        inputType,
        content: contentToParse,
      });

      if (result.listings && result.listings.length > 0) {
        setStagedListings(result.listings);
        setSelectedIndices(result.listings.map((_, idx) => idx));
        addToast(
          'Parsed Successfully',
          `Parsed ${result.listings.length} properties via ${result.isAiPowered ? 'Gemini AI' : 'Smart Heuristics'}. Review and publish below.`,
          'success'
        );
      } else {
        addToast('No Listings Found', 'Could not extract valid properties from input. Check format or try sample.', 'alert');
      }
    } catch (err: any) {
      console.error('Parsing error:', err);
      addToast('Parse Error', err.message || 'Failed to parse listings.', 'alert');
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle selection in staging table
  const toggleSelectAll = () => {
    if (selectedIndices.length === stagedListings.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(stagedListings.map((_, i) => i));
    }
  };

  const toggleSelectIndex = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleUpdateStagedItem = (index: number, field: string, value: any) => {
    setStagedListings((prev) => {
      const copy = [...prev];
      if (field === 'rent' || field === 'bedrooms' || field === 'bathrooms' || field === 'sqft') {
        (copy[index] as any)[field] = Number(value) || 0;
      } else if (field === 'city' || field === 'street') {
        copy[index].address = {
          ...(copy[index].address as any),
          [field]: value,
        };
      } else {
        (copy[index] as any)[field] = value;
      }
      return copy;
    });
  };

  const handleRemoveStagedItem = (index: number) => {
    setStagedListings((prev) => prev.filter((_, i) => i !== index));
    setSelectedIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
  };

  // Step 2: Final Bulk Syndication into live inventory
  const handleExecuteSyndication = async () => {
    const itemsToImport = stagedListings.filter((_, idx) => selectedIndices.includes(idx));
    if (itemsToImport.length === 0) {
      addToast('No Items Selected', 'Please select at least one property to publish.', 'warning');
      return;
    }

    try {
      setIsPublishing(true);
      const report = await api.bulkImportProperties(itemsToImport);
      setImportReport(report);

      addToast(
        'Bulk Syndication Complete!',
        `Successfully published ${report.successful} properties live on the marketplace.`,
        'success'
      );

      // Clear staged listings if all published
      setStagedListings([]);
      setSelectedIndices([]);
      await refreshData();
    } catch (err: any) {
      console.error('Syndication error:', err);
      addToast('Syndication Error', err.message || 'Failed to publish properties to live inventory.', 'alert');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Universal Bulk Listing &amp; Syndication
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Import and auto-generate verified rental listings from web links (Apartments.com, Zillow, Roomster), CSV/Excel files, or raw text feeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'URL_LINKS' && (
            <button
              onClick={handleLoadSampleUrls}
              className="px-3.5 py-2 rounded-xl bg-teal-950 border border-teal-800 hover:bg-teal-900 text-teal-300 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Load Sample URLs (Apartments.com / Zillow / Roomster)</span>
            </button>
          )}

          {mode === 'CSV_TEXT' && (
            <div className="flex gap-2">
              <button
                onClick={handleLoadSampleCsv}
                className="px-3.5 py-2 rounded-xl bg-teal-950 border border-teal-800 hover:bg-teal-900 text-teal-300 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Standard CSV</span>
              </button>
              <button
                onClick={handleLoadRoomsterCsv}
                className="px-3.5 py-2 rounded-xl bg-rose-950 border border-rose-800 hover:bg-rose-900 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Roomster Coliving CSV</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex gap-2 p-1.5 bg-stone-900 rounded-2xl border border-stone-800 w-fit">
        <button
          onClick={() => setMode('URL_LINKS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mode === 'URL_LINKS'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Web Links / Scraper (Zillow / Apartments / Roomster)</span>
        </button>

        <button
          onClick={() => setMode('FILE_UPLOAD')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mode === 'FILE_UPLOAD'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <FileUp className="w-4 h-4" />
          <span>All File Uploads (.csv, .xlsx, .json, .txt, .xml)</span>
        </button>

        <button
          onClick={() => setMode('CSV_TEXT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mode === 'CSV_TEXT'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Paste CSV / Formatted Text</span>
        </button>
      </div>

      {/* Input Box based on Mode */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
        {mode === 'URL_LINKS' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-teal-400" />
                Input Property Web Links (One URL per line)
              </span>
              <span className="text-[11px] text-stone-400 font-mono">
                Supports Apartments.com, Zillow, Roomster, Craigslist, Redfin, etc.
              </span>
            </div>

            <textarea
              rows={6}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste listing URLs here, e.g.:&#10;https://www.apartments.com/the-ashton-austin-tx/&#10;https://www.zillow.com/homedetails/123-Main-St...&#10;https://www.roomster.com/rooms/austin-tx/..."
              className="w-full p-4 rounded-xl bg-stone-950 border border-stone-800 text-teal-300 font-mono text-xs focus:ring-2 focus:ring-rose-500 outline-none resize-none leading-relaxed"
            />
          </div>
        )}

        {mode === 'FILE_UPLOAD' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileUp className="w-4 h-4 text-amber-400" />
                Upload Any File (.csv, .xlsx, .json, .txt, .xml, .pdf)
              </span>
              <span className="text-[11px] text-stone-400 font-mono">
                Auto-read and parsed with Gemini AI schema recognition
              </span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-700 hover:border-teal-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-stone-950/60"
            >
              <Upload className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">
                {uploadedFileName ? `Loaded: ${uploadedFileName}` : 'Drag & drop file here or click to browse'}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                CSV, XLSX, JSON, XML, TXT, or PDF property schedules accepted
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.json,.txt,.xml,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {mode === 'CSV_TEXT' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-rose-400" />
                Paste Raw CSV or Tabular Text
              </span>
              <span className="text-[11px] text-stone-400 font-mono">
                Headers: title, rent, bedrooms, bathrooms, sqft, propertyType, street, city, state, zip
              </span>
            </div>

            <textarea
              rows={8}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Paste comma-separated rows or tabular data here..."
              className="w-full p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 font-mono text-xs focus:ring-2 focus:ring-rose-500 outline-none resize-none leading-relaxed"
            />
          </div>
        )}

        {/* Action Button: Parse Input */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              setUrlInput('');
              setRawInput('');
              setFileContent('');
              setUploadedFileName('');
            }}
            className="text-xs text-stone-500 hover:text-stone-300 font-semibold"
          >
            Clear Form
          </button>

          <button
            onClick={handleParseData}
            disabled={isProcessing}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'AI Parsing & Extracting...' : 'Parse & Stage Listings'}</span>
          </button>
        </div>
      </div>

      {/* STAGING & REVIEW TABLE (If items have been parsed) */}
      {stagedListings.length > 0 && (
        <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Staged Listings Review &amp; Edit ({stagedListings.length} Properties Ready)
              </h3>
              <p className="text-xs text-stone-400">
                Verify rent, address, and unit details before pushing to live public marketplace.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="text-xs font-bold text-teal-400 hover:underline"
              >
                {selectedIndices.length === stagedListings.length ? 'Deselect All' : 'Select All'}
              </button>

              <button
                onClick={handleExecuteSyndication}
                disabled={isPublishing || selectedIndices.length === 0}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {isPublishing
                    ? 'Publishing...'
                    : `Publish ${selectedIndices.length} Selected to Live Inventory`}
                </span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-800 text-[10px] font-bold uppercase tracking-wider text-stone-400 bg-stone-950/50">
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIndices.length === stagedListings.length && stagedListings.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="p-3">Property Title</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Rent ($/mo)</th>
                  <th className="p-3">Beds / Baths</th>
                  <th className="p-3">Living Sqft</th>
                  <th className="p-3">Street Address</th>
                  <th className="p-3">City / State</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {stagedListings.map((item, idx) => {
                  const isSelected = selectedIndices.includes(idx);
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-stone-850/50 transition-colors ${
                        isSelected ? 'bg-teal-950/20' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectIndex(idx)}
                          className="rounded"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => handleUpdateStagedItem(idx, 'title', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-800 text-white font-semibold text-xs"
                        />
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[10px]">
                          {item.propertyType || 'APARTMENT'}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="relative">
                          <span className="absolute left-2 top-1 text-stone-500 font-bold">$</span>
                          <input
                            type="number"
                            value={item.rent || 0}
                            onChange={(e) => handleUpdateStagedItem(idx, 'rent', e.target.value)}
                            className="w-24 pl-5 pr-2 py-1 rounded bg-stone-950 border border-stone-800 text-emerald-400 font-bold text-xs"
                          />
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-mono text-stone-200">
                          {item.bedrooms ?? 1}bd / {item.bathrooms ?? 1}ba
                        </span>
                      </td>

                      <td className="p-3">
                        <input
                          type="number"
                          value={item.sqft || 800}
                          onChange={(e) => handleUpdateStagedItem(idx, 'sqft', e.target.value)}
                          className="w-20 px-2 py-1 rounded bg-stone-950 border border-stone-800 text-stone-200 text-xs"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={item.address?.street || ''}
                          onChange={(e) => handleUpdateStagedItem(idx, 'street', e.target.value)}
                          className="w-40 px-2 py-1 rounded bg-stone-950 border border-stone-800 text-stone-300 text-xs truncate"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={item.address?.city || 'Austin'}
                          onChange={(e) => handleUpdateStagedItem(idx, 'city', e.target.value)}
                          className="w-24 px-2 py-1 rounded bg-stone-950 border border-stone-800 text-teal-400 text-xs"
                        />
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRemoveStagedItem(idx)}
                          className="p-1 rounded text-stone-500 hover:text-rose-400 transition-colors"
                          title="Remove from batch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import Results Report */}
      {importReport && (
        <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Live Syndication Results
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              Total Ingested: {importReport.total}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800">
              <span className="block text-2xl font-black text-emerald-400">{importReport.successful}</span>
              <span className="text-[11px] text-stone-300">Published Live</span>
            </div>
            <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800">
              <span className="block text-2xl font-black text-amber-400">{importReport.duplicates}</span>
              <span className="text-[11px] text-stone-300">Duplicates Filtered</span>
            </div>
            <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800">
              <span className="block text-2xl font-black text-rose-400">{importReport.failed}</span>
              <span className="text-[11px] text-stone-300">Failed Records</span>
            </div>
          </div>

          {importReport.errors.length > 0 && (
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-[11px] font-bold text-amber-400 block">Ingestion Alerts:</span>
              <ul className="text-[11px] text-stone-400 font-mono space-y-0.5">
                {importReport.errors.map((err, idx) => (
                  <li key={idx}>&bull; {err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
