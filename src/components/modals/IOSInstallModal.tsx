import React, { useState } from 'react';
import {
  X,
  Share,
  PlusSquare,
  Smartphone,
  CheckCircle,
  Download,
  Apple,
  FileCode,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Terminal,
  FolderArchive,
  Loader2,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { generateIpaFile, generateIOSProjectZip, triggerDownload } from '../../utils/ipaExporter';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'download_ipa' | 'pwa_safari' | 'sideload_guide';

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('download_ipa');
  const [isGeneratingIpa, setIsGeneratingIpa] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadIpa = async () => {
    try {
      sound.playTap();
      setIsGeneratingIpa(true);
      setDownloadSuccessMessage(null);
      const ipaBlob = await generateIpaFile();
      triggerDownload(ipaBlob, 'NRMN2AI-TradingOS.ipa');
      sound.playSuccess();
      setDownloadSuccessMessage('فایل NRMN2AI-TradingOS.ipa با موفقیت دانلود شد!');
      setTimeout(() => setDownloadSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Failed to generate IPA', err);
    } finally {
      setIsGeneratingIpa(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      sound.playTap();
      setIsGeneratingZip(true);
      setDownloadSuccessMessage(null);
      const zipBlob = await generateIOSProjectZip();
      triggerDownload(zipBlob, 'NRMN2AI-iOS-Xcode-Package.zip');
      sound.playSuccess();
      setDownloadSuccessMessage('پکیج کامل پروژه iOS و ورک‌فلو (.zip) با موفقیت دانلود شد!');
      setTimeout(() => setDownloadSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Failed to generate ZIP', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleCopyUrl = () => {
    sound.playTap();
    const appUrl = window.location.href;
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-[500px] max-h-[90vh] bg-[#10141d] border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col overflow-hidden"
        dir="rtl"
      >
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-3 shrink-0 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-[#10141d] rounded-[14px] flex items-center justify-center">
                <Apple className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">دانلود فایل IPA و نصب آیفون</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  iOS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">دانلود بسته IPA یا نصب مستقیم بدون نیاز به کامپیوتر</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success toast if triggered */}
        {downloadSuccessMessage && (
          <div className="my-2 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shrink-0">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-2xl my-3 border border-white/5 shrink-0">
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('download_ipa');
            }}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'download_ipa'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>دانلود IPA</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('pwa_safari');
            }}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pwa_safari'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>نصب Safari</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('sideload_guide');
            }}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'sideload_guide'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>راهنمای ساین</span>
          </button>
        </div>

        {/* Tab Contents (Scrollable) */}
        <div className="overflow-y-auto space-y-3.5 py-1 pr-0.5 ios-scrollbar text-slate-300">
          {activeTab === 'download_ipa' && (
            <div className="space-y-3 animate-fade-in">
              {/* Option 1: Direct .ipa Download */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border border-cyan-500/30 relative overflow-hidden group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                      <Apple className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-white">فایل اپلیکیشن NRMN2AI (.ipa)</h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          v1.0.0
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        بسته استاندارد iOS IPA آماده برای نصب از طریق Sideloadly، AltStore یا TrollStore بر روی آیفون.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-500 font-mono">Format: .ipa (iOS Package)</span>
                  <button
                    onClick={handleDownloadIpa}
                    disabled={isGeneratingIpa}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isGeneratingIpa ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        در حال آماده‌سازی...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        دانلود مستقیم IPA
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Option 2: Full iOS Xcode & Cloud Build Package (.zip) */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                    <FolderArchive className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-white">پکیج کامل پروژه iOS و بیلد خودکار (.zip)</h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Capacitor + CI/CD
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      شامل پروژه کامل Capacitor iOS، کانفیگ Xcode و فایل GitHub Actions برای ساخت خودکار فایل IPA روی سرورهای مک‌او‌اس گیت‌هاب (کاملاً رایگان).
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-mono">Size: Full Project Package</span>
                      <button
                        onClick={handleDownloadZip}
                        disabled={isGeneratingZip}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-md shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isGeneratingZip ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            در حال ایجاد...
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            دانلود پکیج (.ZIP)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Helpful Tip */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300/90 text-[11px] flex items-start gap-2.5 leading-relaxed">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block mb-0.5">نکته مهم امنیتی سیستم عامل iOS:</strong>
                  اپل برای نصب فایل‌های .ipa نیازمند ساین (Sign) با اپل آیدی است. اگر کامپیوتر در دسترس ندارید، پیشنهاد می‌کنیم از روش <strong>«نصب Safari»</strong> استفاده کنید که بدون نیاز به فایل IPA و بدون محدودیت زمانی مستقیماً روی آیفون نصب می‌شود!
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pwa_safari' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] leading-relaxed">
                ✨ <strong>بهترین و سریع‌ترین روش برای آیفون:</strong> بدون نیاز به کامپیوتر یا تمدید ۷ روزه گواهی.
                کافیست در مرورگر Safari آیفون ۳ مرحله زیر را انجام دهید:
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center shrink-0">
                  ۱
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-xs mb-0.5">کلیک روی دکمه Share در مرورگر Safari</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                    در نوار پایین یا بالای مرورگر آیکون اشتراک‌گذاری <Share className="w-3.5 h-3.5 text-cyan-400" /> را لمس کنید.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center shrink-0">
                  ۲
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-xs mb-0.5">انتخاب گزینه Add to Home Screen</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                    در لیست منو به پایین اسکرول کرده و گزینه <PlusSquare className="w-3.5 h-3.5 text-cyan-400" /> «افزودن به صفحه اصلی» را بزنید.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center shrink-0">
                  ۳
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-xs mb-0.5">تایید با زدن Add در گوشه بالا</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                    آیکون NRMN2AI با کیفیت بالا به صفحه اصلی گوشی اضافه شده و آفلاین کار می‌کند!
                  </p>
                </div>
              </div>

              {/* Copy URL Button */}
              <button
                onClick={handleCopyUrl}
                className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                {copiedUrl ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">آدرس کپی شد! در سافاری آیفون باز کنید</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>کپی آدرس جهت باز کردن در Safari آیفون</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'sideload_guide' && (
            <div className="space-y-3 animate-fade-in text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  آموزش نصب فایل IPA با نرم‌افزار Sideloadly (ویندوز یا مک):
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-300 leading-relaxed pr-1">
                  <li>
                    نرم‌افزار رایگان <strong>Sideloadly</strong> را از سایت{' '}
                    <a
                      href="https://sideloadly.io"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 underline inline-flex items-center gap-0.5"
                    >
                      sideloadly.io <ExternalLink className="w-2.5 h-2.5" />
                    </a>{' '}
                    دانلود و روی کامپیوتر نصب کنید.
                  </li>
                  <li>گوشی آیفون را با کابل USB به کامپیوتر متصل کنید.</li>
                  <li>
                    فایل <strong>NRMN2AI-TradingOS.ipa</strong> دانلود شده را به درون کادر نرم‌افزار بکشید (Drag & Drop).
                  </li>
                  <li>اپل آیدی (Apple ID) معمولی خود را در کادر نرم‌افزار وارد کنید.</li>
                  <li>روی دکمه <strong>Start</strong> کلیک کنید تا عملیات ساین و نصب انجام شود.</li>
                  <li>
                    در آیفون به مسیر زیر بروید تا مجوز اجرا صادر شود:
                    <div className="mt-1 p-2 rounded-lg bg-black/40 font-mono text-[10px] text-cyan-300 ltr text-left">
                      Settings &gt; General &gt; VPN &amp; Device Management &gt; Trust [Your Apple ID]
                    </div>
                  </li>
                  <li>در iOS 16 و بالاتر، Developer Mode را در Settings &gt; Privacy &amp; Security روشن کنید.</li>
                </ol>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-center justify-between">
                <span>فایل IPA را هنوز دانلود نکرده‌اید؟</span>
                <button
                  onClick={handleDownloadIpa}
                  disabled={isGeneratingIpa}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-extrabold text-[11px] shadow hover:bg-cyan-400"
                >
                  دانلود IPA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/5 mt-2 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
