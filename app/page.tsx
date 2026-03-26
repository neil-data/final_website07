'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, FileText, AlertTriangle, Settings, HelpCircle, 
  Bell, User, Search, UploadCloud, ChevronRight, Check, Clock, Phone, 
  MapPin, MessageSquare, Image as ImageIcon, File, ShieldAlert, Pill, 
  Droplets, ArrowRight, Copy, Send, Loader2, Plus, Activity, Share2, LogOut
} from 'lucide-react';
import { analyzeDocument, chatWithDocument } from '@/lib/ai';
import LandingPage from '@/components/LandingPage';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'reports' | 'alerts' | 'chatbot'>('dashboard');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [patientAge, setPatientAge] = useState('');
  const [language, setLanguage] = useState('English');
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [doctorNumber, setDoctorNumber] = useState('');

  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050B1F] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={() => {}} />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMsg('File is over 5MB limit.');
        setFile(null);
      } else {
        setErrorMsg('');
        setFile(selectedFile);
        // Auto-trigger analysis on file select to match the seamless UX
        handleAnalyze(selectedFile);
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalyze = async (selectedFile: File | null, text: string = '') => {
    setLoading(true);
    setErrorMsg('');

    try {
      let base64 = '';
      let mimeType = '';
      if (selectedFile) {
        base64 = await fileToBase64(selectedFile);
        mimeType = selectedFile.type;
      }

      // Call the AI logic
      const jsonResult = await analyzeDocument(base64, mimeType, text, patientAge, language);
      setResult(jsonResult);
      setActiveTab('reports'); // Switch to reports tab when done
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to analyze document. Please try again.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || !result) return;
    
    const newHistory = [...chatHistory, { role: 'user' as const, text: chatInput }];
    setChatHistory(newHistory);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await chatWithDocument(chatInput, result, newHistory);
      setChatHistory([...newHistory, { role: 'ai', text: response || '' }]);
    } catch (error) {
      setChatHistory([...newHistory, { role: 'ai', text: "Sorry, I couldn't process that request." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- UI Components ---

  const SidebarItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: any }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
          isActive 
            ? 'bg-[#1A36A8] text-white shadow-md' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
        {label}
      </button>
    );
  };

  const EmptyState = ({ title, message }: { title: string, message: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <FileText className="w-10 h-10 text-slate-300" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2 font-headline">{title}</h2>
      <p className="text-slate-500 max-w-md mb-8">{message}</p>
      <button 
        onClick={() => setActiveTab('dashboard')}
        className="bg-[#1A36A8] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#12267a] transition-colors"
      >
        Go to Dashboard to Upload
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F5F7FA] font-sans text-slate-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-[#1A36A8] rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0B173E] leading-tight">Medyrax</h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Your Digital Clinician</p>
            </div>
          </div>

          <nav className="space-y-2 border-l-2 border-dashed border-slate-200 pl-4 ml-2 relative">
            <div className="absolute left-[-9px] top-5 w-4 h-4 bg-white border-2 border-slate-200 rounded-full"></div>
            <div className="absolute left-[-9px] top-[4.5rem] w-4 h-4 bg-white border-2 border-slate-200 rounded-full"></div>
            <div className="absolute left-[-9px] top-[8.25rem] w-4 h-4 bg-white border-2 border-slate-200 rounded-full"></div>
            <div className="absolute left-[-9px] top-[12rem] w-4 h-4 bg-white border-2 border-slate-200 rounded-full"></div>
            
            <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" />
            <SidebarItem icon={Calendar} label="Schedule" id="schedule" />
            <SidebarItem icon={FileText} label="Reports" id="reports" />
            <SidebarItem icon={AlertTriangle} label="Safety Alerts" id="alerts" />
            <SidebarItem icon={MessageSquare} label="Chatbot" id="chatbot" />
          </nav>

          <button onClick={() => setShowEmergency(true)} className="w-full mt-8 bg-[#D93838] text-white flex items-center justify-center gap-2 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm">
            <AlertTriangle className="w-4 h-4" /> Emergency Contact
          </button>
        </div>

        <div className="p-6 border-t border-slate-100 space-y-2">
          <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button onClick={() => setShowHelp(true)} className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
            <HelpCircle className="w-5 h-5" /> Help
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-[#0B173E] capitalize md:hidden font-headline">Medyrax</h2>
            {/* Mobile Nav Tabs */}
            <div className="md:hidden flex gap-4 overflow-x-auto pb-1">
              {['dashboard', 'schedule', 'reports', 'alerts', 'chatbot'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`text-sm font-medium capitalize whitespace-nowrap ${activeTab === tab ? 'text-[#1A36A8] border-b-2 border-[#1A36A8]' : 'text-slate-500'}`}
                >
                  {tab.replace('alerts', 'safety alerts')}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search records..." 
                className="bg-slate-100 text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#1A36A8]/20"
              />
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowNotifications(true)} className="text-slate-400 hover:text-slate-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button onClick={() => setShowProfile(true)} className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-300 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto h-full">
            
            {/* --- DASHBOARD TAB --- */}
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-[#0B173E] mb-2 font-headline">Clinical Dashboard</h1>
                  <p className="text-slate-500">Manage your prescriptions and health insights with AI-powered precision.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Upload Section */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-[#0B173E] font-headline">Upload Prescription</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setLanguage(language === 'English' ? 'Hindi' : 'English')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${language === 'Hindi' ? 'bg-[#1A36A8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            {language === 'Hindi' ? 'हिंदी (Hindi)' : 'English'}
                          </button>
                          <button 
                            onClick={() => alert('History and insights saved successfully!')}
                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"
                          >
                            Save History
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Patient Age</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 45" 
                            value={patientAge}
                            onChange={(e) => setPatientAge(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1A36A8]"
                          />
                        </div>
                        <div className="flex-1 flex items-end">
                          <button 
                            onClick={() => setShowTextInput(!showTextInput)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors"
                          >
                            {showTextInput ? 'Hide Text Input' : 'Enter Text Instead'}
                          </button>
                        </div>
                      </div>

                      {showTextInput && (
                        <div className="mb-4">
                          <textarea 
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Type or paste prescription details here..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A36A8] min-h-[100px]"
                          ></textarea>
                          <button 
                            onClick={() => handleAnalyze(null, textInput)}
                            disabled={!textInput.trim() || loading}
                            className="mt-2 bg-[#1A36A8] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#15255b] transition-colors disabled:opacity-50"
                          >
                            Analyze Text
                          </button>
                        </div>
                      )}
                      
                      <div 
                        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all
                          ${loading ? 'border-[#1A36A8] bg-blue-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                        />
                        
                        {loading ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-10 h-10 text-[#1A36A8] animate-spin mb-4" />
                            <p className="text-[#1A36A8] font-medium">Analyzing document with Medyrax AI...</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                              <UploadCloud className="w-6 h-6 text-[#1A36A8]" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-2">Drag and drop your medical files</h4>
                            <p className="text-slate-500 text-sm max-w-sm mb-8">
                              Supported formats: PDF, JPEG, PNG.<br/>
                              Medyrax AI will automatically scan for drug interactions.
                            </p>
                            
                            <div className="flex gap-4">
                              <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#0B173E] text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-[#15255b] transition-colors shadow-sm"
                              >
                                <FileText className="w-4 h-4" /> Select PDF
                              </button>
                              <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-slate-700 border border-slate-200 px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                <ImageIcon className="w-4 h-4" /> Select Image
                              </button>
                            </div>
                            {errorMsg && <p className="text-red-500 text-sm mt-4">{errorMsg}</p>}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[#0B173E] font-headline">Recent Activity</h3>
                        <button className="text-[#1A36A8] text-sm font-medium hover:underline">View All History</button>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">Timeline of your clinical document uploads</p>
                      
                      <div className="space-y-4">
                        {file && result && (
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">{file.name}</h4>
                                <p className="text-xs text-slate-500">Uploaded just now • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">PROCESSED</span>
                          </div>
                        )}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between opacity-70">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">Crestor_Refill_Q3.pdf</h4>
                              <p className="text-xs text-slate-500">Uploaded yesterday • 2.4 MB</p>
                            </div>
                          </div>
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">PROCESSED</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between opacity-70">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">Blood_Panel_Results.jpg</h4>
                              <p className="text-xs text-slate-500">Uploaded 3 days ago • 1.1 MB</p>
                            </div>
                          </div>
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">PROCESSED</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* AI Insight Card */}
                    <div className="bg-[#0B173E] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute -right-10 -bottom-10 opacity-10">
                        <Droplets className="w-48 h-48" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
                          <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                            <Activity className="w-3 h-3" />
                          </div>
                          AI Insight
                        </div>
                        <h3 className="text-2xl font-bold mb-4 font-headline">Hydration & Statins</h3>
                        <p className="text-blue-100 text-sm leading-relaxed mb-8">
                          Based on your recent Lipitor upload, increasing your daily water intake by 500ml can significantly reduce common muscle fatigue side effects. Avoid grapefruit juice as it interacts with this medication.
                        </p>
                        <button className="bg-white text-[#0B173E] px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors">
                          Learn More <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Medyrax Status */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                      <h3 className="text-lg font-bold text-[#0B173E] mb-6 font-headline">Medyrax Status</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-bold text-slate-700">Data Integrity</span>
                            <span className="font-bold text-green-600">98% Verified</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">AI Engine Active</h4>
                              <p className="text-xs text-slate-500">Analyzing 14 drug interactions in real-time.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">Sync Status</h4>
                              <p className="text-xs text-slate-500">Last synced with GP Clinic 2 mins ago.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">Action Required</h4>
                              <p className="text-xs text-orange-600 font-medium">1 prescription pending signature.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- SCHEDULE TAB --- */}
            {activeTab === 'schedule' && (
              !result ? <EmptyState title="No Schedule Available" message="Upload a prescription to generate your automated medication schedule." /> :
              <div className="animate-in fade-in duration-300">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#0B173E] mb-2 font-headline">Medication Schedule</h1>
                    <p className="text-slate-500">View and manage your daily prescriptions. Accuracy is our priority.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => showToast('Downloading Report as PDF...', 'info')} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                      <FileText className="w-4 h-4" /> Download PDF
                    </button>
                    <button onClick={() => showToast('Copied PNG to clipboard for family!')} className="bg-[#1A36A8] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#15255b] transition-colors shadow-sm">
                      <ImageIcon className="w-4 h-4" /> Copy for Family (PNG)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Table */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Medicine</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Dosage</th>
                              <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">M</th>
                              <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">A</th>
                              <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">E</th>
                              <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">N</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Meal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {result.medications?.map((med: any, idx: number) => {
                              const t = med.timing?.toLowerCase() || '';
                              const hasM = t.includes('morning') || t.includes('breakfast');
                              const hasA = t.includes('afternoon') || t.includes('lunch');
                              const hasE = t.includes('evening');
                              const hasN = t.includes('night') || t.includes('bed');
                              
                              const CheckCircle = ({ active }: { active: boolean }) => (
                                <div className="flex justify-center">
                                  {active ? (
                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                                      <Check className="w-4 h-4 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
                                  )}
                                </div>
                              );

                              return (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-5">
                                    <h4 className="font-bold text-slate-800">{med.name}</h4>
                                    <p className="text-xs text-slate-500 mt-1">Duration: {med.days}</p>
                                  </td>
                                  <td className="px-6 py-5 font-medium text-slate-700">{med.dosage}</td>
                                  <td className="px-4 py-5"><CheckCircle active={hasM} /></td>
                                  <td className="px-4 py-5"><CheckCircle active={hasA} /></td>
                                  <td className="px-4 py-5"><CheckCircle active={hasE} /></td>
                                  <td className="px-4 py-5"><CheckCircle active={hasN} /></td>
                                  <td className="px-6 py-5">
                                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">
                                      <Droplets className="w-3 h-3" /> {t.includes('after') ? 'After' : t.includes('before') ? 'Before' : 'Any'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Warning */}
                    {result.sideEffects && result.sideEffects.length > 0 && (
                      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-orange-800 mb-1">Medication Interaction Warning</h4>
                          <p className="text-sm text-orange-700 leading-relaxed">
                            {result.sideEffects[0]} {result.sideEffects[1] ? `Also watch for: ${result.sideEffects[1]}` : ''}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Next Dose */}
                    <div className="bg-[#0B173E] rounded-3xl p-8 text-white shadow-lg">
                      <h3 className="text-blue-300 text-xs font-bold tracking-widest uppercase mb-4 font-headline">Next Dose Reminder</h3>
                      <div className="text-5xl font-bold mb-6 tracking-tight">
                        08:00 <span className="text-xl text-blue-300 font-medium">AM</span>
                      </div>
                      
                      <div className="bg-white/10 rounded-2xl p-4 mb-6 flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center">
                          <Pill className="w-5 h-5 text-blue-200" />
                        </div>
                        <div>
                          <h4 className="font-bold">{result.medications?.[0]?.name || 'Medication'}</h4>
                          <p className="text-xs text-blue-200">{result.medications?.[0]?.dosage || ''} • Upcoming</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => showToast('Dose marked as taken!')}
                        className="w-full bg-white text-[#0B173E] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                      >
                        <Check className="w-5 h-5" /> Mark as Taken
                      </button>
                    </div>

                    {/* Pharmacy Hub */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Activity className="w-4 h-4 text-slate-600" />
                        </div>
                        <h3 className="font-bold text-[#0B173E] font-headline">Pharmacy Hub</h3>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-800">{result.medications?.[0]?.name || 'Medication'} Refill</h4>
                          <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Low Stock</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Expires in 12 days</p>
                        <button className="text-[#1A36A8] text-sm font-bold flex items-center gap-1 hover:underline">
                          Quick Reorder <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <button 
                        onClick={() => showToast('Opening Prescription Manager...', 'info')}
                        className="w-full border border-slate-200 text-[#0B173E] py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                      >
                        Manage All Prescriptions
                      </button>
                    </div>

                    {/* Help Prompt */}
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-green-600" />
                        </div>
                        <h4 className="font-bold text-slate-800">Need help?</h4>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">Chat with your pharmacist about dosage adjustments or side effects.</p>
                      <button className="text-[#1A36A8] text-sm font-bold flex items-center gap-1 hover:underline">
                        Open Secure Chat <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- REPORTS TAB --- */}
            {activeTab === 'reports' && (
              !result ? <EmptyState title="No Analysis Available" message="Upload a prescription to view the AI-generated diagnosis and summary." /> :
              <div className="animate-in fade-in duration-300">
                <div className="mb-8 flex items-center gap-4">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> ANALYSIS COMPLETE
                  </span>
                  <span className="text-sm text-slate-500 font-medium">{file?.name || 'Document.pdf'}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Diagnosis */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                      <h3 className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-6 font-headline">Plain-Language Diagnosis</h3>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#0B173E] leading-tight mb-6 font-headline">
                        {result.diagnosis?.split('.')[0] || "Everything looks stable."}.
                      </h2>
                      <p className="text-lg text-slate-600 leading-relaxed">
                        {result.diagnosis?.substring(result.diagnosis.indexOf('.') + 1) || result.diagnosis}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Quick Share */}
                      <div className="bg-[#0B173E] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                          <Share2 className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col">
                          <h3 className="text-blue-300 text-xs font-bold tracking-widest uppercase mb-4 font-headline">Quick Share Summary</h3>
                          <p className="text-xl font-medium italic mb-8 flex-1">
                            &quot;{result.familySummary}&quot;
                          </p>
                          <button 
                            onClick={() => showToast('Copied to clipboard!')}
                            className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors w-full backdrop-blur-sm"
                          >
                            <Copy className="w-4 h-4" /> Copy for Family
                          </button>
                        </div>
                      </div>

                      {/* Next Action */}
                      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
                        <h3 className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-4 font-headline">Next Action</h3>
                        <h4 className="text-xl font-bold text-[#0B173E] mb-2">Follow-up Recommendations</h4>
                        <p className="text-sm text-slate-500 mb-6">
                          Review these results with your doctor in a quick 15-minute call.
                        </p>
                        
                        {result.followUp && (
                          <div className="space-y-4 mb-8 flex-1">
                            {result.followUp.tests && result.followUp.tests.length > 0 && (
                              <div>
                                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-[#1A36A8]"/> Recommended Tests</h5>
                                <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc">
                                  {result.followUp.tests.map((test: string, i: number) => <li key={i}>{test}</li>)}
                                </ul>
                              </div>
                            )}
                            {result.followUp.diet && result.followUp.diet.length > 0 && (
                              <div>
                                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2"><Droplets className="w-4 h-4 text-green-600"/> Diet</h5>
                                <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc">
                                  {result.followUp.diet.map((item: string, i: number) => <li key={i}>{item}</li>)}
                                </ul>
                              </div>
                            )}
                            {result.followUp.activity && result.followUp.activity.length > 0 && (
                              <div>
                                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2"><User className="w-4 h-4 text-orange-500"/> Activity</h5>
                                <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc">
                                  {result.followUp.activity.map((item: string, i: number) => <li key={i}>{item}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        <button 
                          onClick={() => showToast('Consultation booked successfully!')}
                          className="bg-[#1A36A8] text-white py-3 rounded-xl font-bold hover:bg-[#12267a] transition-colors w-full shadow-sm mt-auto"
                        >
                          Book Consultation
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6 flex flex-col h-full">
                    {/* Terms Decoded */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1">
                      <div className="flex items-center gap-2 mb-6">
                        <FileText className="w-5 h-5 text-[#1A36A8]" />
                        <h3 className="font-bold text-[#0B173E] font-headline">Medical Terms Decoded</h3>
                      </div>
                      
                      <div className="space-y-6">
                        {result.jargonMap?.slice(0, 3).map((item: any, idx: number) => (
                          <div key={idx}>
                            <h4 className="font-bold text-slate-800 mb-1">{item.term}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">{item.explanation}</p>
                          </div>
                        ))}
                      </div>
                      
                      <button className="mt-6 text-[#1A36A8] text-sm font-bold flex items-center gap-1 hover:underline">
                        View Full Glossary <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Chat Prompt */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-[#0B173E] rounded-full flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">Have more questions?</h4>
                          <p className="text-xs text-slate-500 mt-1">Ask me anything about these results. I&apos;m trained to explain medical data simply.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('chatbot')}
                        className="w-full bg-slate-50 border border-slate-200 text-[#1A36A8] py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      >
                        Open AI Chatbot <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- SAFETY ALERTS TAB --- */}
            {activeTab === 'alerts' && (
              !result ? <EmptyState title="No Alerts" message="Upload a prescription to scan for safety alerts and interactions." /> :
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-[#0B173E] mb-2 font-headline">Safety & Alerts</h1>
                  <p className="text-slate-500">Active monitoring for your current regimen.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Watchlist */}
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-orange-500" />
                        <h3 className="text-lg font-bold text-[#0B173E] font-headline">Side Effect Watchlist</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.sideEffects?.map((effect: string, idx: number) => (
                          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-l-4 border-l-orange-400">
                            <h4 className="font-bold text-slate-800 mb-2">{effect.split('.')[0] || 'Side Effect'}</h4>
                            <p className="text-sm text-slate-500 mb-4">{effect}</p>
                            <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                              Moderate Risk
                            </span>
                          </div>
                        ))}
                        {/* Fallback if only 1 side effect */}
                        {result.sideEffects?.length === 1 && (
                          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-l-4 border-l-red-500">
                            <h4 className="font-bold text-slate-800 mb-2">Severe Dizziness</h4>
                            <p className="text-sm text-slate-500 mb-4">May indicate a sudden drop in blood pressure. Sit down immediately if you feel lightheaded.</p>
                            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                              High Priority
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* When to call doctor */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-red-500" />
                          <h3 className="text-lg font-bold text-[#0B173E] font-headline">When to Call the Doctor</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Urgent Indicators</span>
                      </div>

                      <div className="space-y-6">
                        {result.doctorCallWarnings?.map((warning: string, idx: number) => (
                          <div key={idx} className="flex gap-4">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-slate-800 mb-1">{warning.split('.')[0] || 'Warning'}</h4>
                              <p className="text-sm text-slate-500">{warning}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Emergency Card */}
                    <div className="bg-[#0B173E] rounded-3xl p-6 text-white shadow-lg">
                      <div className="flex items-center gap-2 mb-6">
                        <Phone className="w-5 h-5 text-blue-300" />
                        <h3 className="font-bold text-lg font-headline">Emergency</h3>
                      </div>

                      <div className="mb-6">
                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block mb-1">Primary Physician</span>
                        <h4 className="font-bold text-lg">Your Doctor</h4>
                        <p className="text-blue-200 text-sm mb-3">{doctorNumber || 'Number not set'}</p>
                        <button 
                          onClick={() => {
                            if (doctorNumber) {
                              window.open(`https://wa.me/${doctorNumber}`, '_blank');
                            } else {
                              setShowEmergency(true);
                            }
                          }}
                          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" /> WhatsApp
                        </button>
                      </div>

                      <div className="pt-6 border-t border-white/10">
                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block mb-1">Emergency Contact</span>
                        <h4 className="font-bold text-lg">Sarah Jenkins (Spouse)</h4>
                        <p className="text-blue-200 text-sm mb-3">(555) 012-4455</p>
                        <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-sm font-bold transition-colors">
                          Alert via Text
                        </button>
                      </div>
                    </div>

                    {/* Nearest ER Map Placeholder Removed as requested */}
                  </div>
                </div>
              </div>
            )}

            {/* --- CHATBOT TAB --- */}
            {activeTab === 'chatbot' && (
              <div className="animate-in fade-in duration-300 h-full flex flex-col">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-[#0B173E] mb-2 font-headline">AI Health Assistant</h1>
                  <p className="text-slate-500">Ask questions about your health, prescriptions, or medical reports.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
                  {/* Chat History */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {chatHistory.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                          <MessageSquare className="w-8 h-8 text-[#1A36A8]" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2 font-headline">How can I help you today?</h3>
                        <p className="text-slate-500 max-w-md">
                          I can explain medical terms, provide details about your prescriptions, or answer general health questions based on your uploaded documents.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {chatHistory.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-[#1A36A8] text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-4 text-slate-500 italic flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" /> Medyrax is typing...
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Chat Input Area */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <div className="relative max-w-4xl mx-auto">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        placeholder={result ? "Type a question about your report..." : "Please upload a prescription in the Dashboard first to ask questions."}
                        disabled={!result}
                        className="w-full bg-white border border-slate-200 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-[#1A36A8] shadow-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                      />
                      <button 
                        onClick={handleSendChat}
                        disabled={!chatInput.trim() || isTyping || !result}
                        className="absolute right-2 top-2 w-10 h-10 bg-[#0B173E] rounded-full flex items-center justify-center text-white hover:bg-[#1A36A8] disabled:opacity-50 transition-colors"
                      >
                        <Send className="w-4 h-4 -ml-0.5 mt-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Modals */}
      {showEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-red-50">
              <h3 className="text-xl font-bold text-red-700 flex items-center gap-2 font-headline"><AlertTriangle className="w-5 h-5"/> Emergency Contact</h3>
              <button onClick={() => setShowEmergency(false)} className="text-red-400 hover:text-red-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Primary Physician (Optional)</p>
                <input 
                  type="text" 
                  placeholder="Enter Doctor's WhatsApp Number (e.g. 1234567890)" 
                  value={doctorNumber}
                  onChange={(e) => setDoctorNumber(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400 mb-2"
                />
                <button 
                  onClick={() => {
                    if (doctorNumber) {
                      window.open(`https://wa.me/${doctorNumber}`, '_blank');
                    } else {
                      alert('Please enter a doctor number first.');
                    }
                  }}
                  className="w-full bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Message on WhatsApp
                </button>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Spouse</p>
                <h4 className="font-bold text-slate-800">Sarah Jenkins</h4>
                <p className="text-slate-600">(555) 012-4455</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-[#0B173E] flex items-center gap-2 font-headline"><Settings className="w-5 h-5"/> Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Push Notifications</h4>
                  <p className="text-sm text-slate-500">Receive alerts for medications</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Dark Mode</h4>
                  <p className="text-sm text-slate-500">Toggle dark theme</p>
                </div>
                <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Data Sharing</h4>
                  <p className="text-sm text-slate-500">Share data with physician</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-[#0B173E] mb-4">Chatbot Settings</h4>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Voice Responses</h4>
                    <p className="text-xs text-slate-500">Enable AI voice replies</p>
                  </div>
                  <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="w-3.5 h-3.5 bg-white rounded-full absolute left-1 top-0.5 shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Detailed Explanations</h4>
                    <p className="text-xs text-slate-500">Get longer, more detailed answers</p>
                  </div>
                  <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-1 top-0.5 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-[#0B173E] flex items-center gap-2 font-headline"><HelpCircle className="w-5 h-5"/> Help & Support</h3>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
                Need immediate assistance? Our support team is available 24/7.
              </div>
              <button className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Chat with Support
              </button>
              <button className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> Read FAQs
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-[#0B173E] flex items-center gap-2 font-headline"><Bell className="w-5 h-5"/> Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="flex gap-4 items-start p-3 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Analysis Complete</h4>
                  <p className="text-xs text-slate-600">Your recent prescription upload has been analyzed.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Just now</span>
                </div>
              </div>
              <div className="flex gap-4 items-start p-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Pill className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Medication Reminder</h4>
                  <p className="text-xs text-slate-600">Time to take your evening medication.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                </div>
              </div>
              <div className="flex gap-4 items-start p-3">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Weekly Report</h4>
                  <p className="text-xs text-slate-600">Your weekly adherence report is ready.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-[#0B173E] flex items-center gap-2 font-headline"><User className="w-5 h-5"/> My Profile</h3>
              <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#1A36A8] rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.displayName?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-800">{user?.displayName || 'User'}</h4>
                  <p className="text-sm text-slate-500">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm">Date of Birth</span>
                  <span className="font-medium text-slate-800 text-sm">Not Provided</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm">Blood Type</span>
                  <span className="font-medium text-slate-800 text-sm">Not Provided</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm">Weight</span>
                  <span className="font-medium text-slate-800 text-sm">Not Provided</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                  Edit Profile
                </button>
                <button 
                  onClick={() => {
                    setShowProfile(false);
                    handleLogout();
                  }}
                  className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-medium text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-[#1A36A8]'}`}>
            {toast.type === 'success' ? <Check className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
