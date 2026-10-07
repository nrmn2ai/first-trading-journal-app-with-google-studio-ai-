import React from 'react';
import { X, Share, PlusSquare, Smartphone, CheckCircle } from 'lucide-react';
import { sound } from '../../utils/audio';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-[420px] bg-[#121620] border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl flex flex-col"
        dir="rtl"
      >
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 shrink-0 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#121620] rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">نصب اپلیکیشن روی آیفون</h3>
              <p className="text-[11px] text-slate-400">اجرا به شکل اپ بومی بدون نوار مرورگر</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="py-5 space-y-4 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center shrink-0">
              ۱
            </div>
            <div className="flex-1">
              <p className="font-bold text-white mb-0.5">کلیک روی دکمه Share در مرورگر Safari</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                در نوار پایین سافاری آیکون اشتراک‌گذاری <Share className="w-3.5 h-3.5 text-cyan-400" /> را لمس کنید.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center shrink-0">
              ۲
            </div>
            <div className="flex-1">
              <p className="font-bold text-white mb-0.5">انتخاب گزینه Add to Home Screen</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                کمی به پایین اسکرول کنید و <PlusSquare className="w-3.5 h-3.5 text-cyan-400" /> «افزودن به صفحه اصلی» را انتخاب نمایید.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center shrink-0">
              ۳
            </div>
            <div className="flex-1">
              <p className="font-bold text-white mb-0.5">تایید با زدن Add در گوشه بالا</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                آیکون NRMN2AI به صفحه هوم آیفون اضافه می‌شود و آفلاین هم کار می‌کند!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md shadow-cyan-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          متوجه شدم
        </button>
      </div>
    </div>
  );
};
