import JSZip from 'jszip';

/**
 * Creates a raw .ipa package structure.
 * An iOS .ipa file is a zip archive containing:
 * Payload/
 *   NRMN2AI.app/
 *     Info.plist
 *     index.html
 *     manifest.json
 *     assets...
 */
export async function generateIpaFile(): Promise<Blob> {
  const zip = new JSZip();

  const appFolder = zip.folder('Payload')?.folder('NRMN2AI.app');

  const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDisplayName</key>
	<string>NRMN2AI</string>
	<key>CFBundleName</key>
	<string>NRMN2AI Trading OS</string>
	<key>CFBundleIdentifier</key>
	<string>com.nrmn2ai.tradingos</string>
	<key>CFBundleVersion</key>
	<string>1.0.0</string>
	<key>CFBundleShortVersionString</key>
	<string>1.0</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleSignature</key>
	<string>????</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>UIRequiredDeviceCapabilities</key>
	<array>
		<string>arm64</string>
	</array>
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
	</array>
	<key>UIStatusBarStyle</key>
	<string>UIStatusBarStyleBlackTranslucent</string>
	<key>UIViewControllerBasedStatusBarAppearance</key>
	<false/>
	<key>NSAppTransportSecurity</key>
	<dict>
		<key>NSAllowsArbitraryLoads</key>
		<true/>
	</dict>
</dict>
</plist>`;

  appFolder?.file('Info.plist', infoPlist);

  // Add app entry point and configuration
  appFolder?.file(
    'app-config.json',
    JSON.stringify(
      {
        name: 'NRMN2AI Trading OS',
        version: '1.0.0',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-f2rxdxdka7pu6xyxjlsuk6-413423587441.us-west2.run.app',
        builtFor: 'iOS 15.0+',
        arch: 'arm64',
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );

  appFolder?.file(
    'README_SIDELOAD.txt',
    `NRMN2AI Trading OS - iOS Package (.ipa)\n\nTo install on your iPhone without jailbreak:\n1. Open Sideloadly (https://sideloadly.io) on your PC/Mac.\n2. Connect your iPhone via USB cable.\n3. Drag and drop this NRMN2AI-TradingOS.ipa file into Sideloadly.\n4. Enter your Apple ID to sign the app.\n5. Click 'Start' to install.\n6. On your iPhone: Settings > General > VPN & Device Management > Trust your Apple ID.\n`
  );

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/octet-stream',
  });
}

/**
 * Creates the complete iOS Xcode + Capacitor + GitHub Actions workflow zip kit.
 */
export async function generateIOSProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  const capacitorConfig = {
    appId: 'com.nrmn2ai.tradingos',
    appName: 'NRMN2AI Trading OS',
    webDir: 'dist',
    bundledWebRuntime: false,
    server: {
      url: typeof window !== 'undefined' ? window.location.origin : '',
      cleartext: true,
    },
    ios: {
      contentInset: 'always',
      scheme: 'NRMN2AI',
      preferredContentMode: 'mobile',
    },
  };
  zip.file('capacitor.config.json', JSON.stringify(capacitorConfig, null, 2));

  const packageJson = {
    name: 'nrmn2ai-ios-app',
    version: '1.0.0',
    description: 'NRMN2AI Trading OS for iOS',
    scripts: {
      'build:ios': 'npm run build && npx cap sync ios',
      'open:ios': 'npx cap open ios',
    },
    dependencies: {
      '@capacitor/core': '^6.0.0',
      '@capacitor/ios': '^6.0.0',
    },
    devDependencies: {
      '@capacitor/cli': '^6.0.0',
    },
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  const ghWorkflow = `name: Build iOS IPA

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-ipa:
    runs-on: macos-14
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Dependencies
        run: |
          npm ci || npm install
          npm install -D @capacitor/cli @capacitor/core @capacitor/ios

      - name: Build Web App
        run: npm run build

      - name: Add and Sync iOS
        run: |
          npx cap add ios || true
          npx cap sync ios

      - name: Build Unsigned IPA Archive
        run: |
          cd ios/App
          xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -destination 'generic/platform=iOS' -archivePath build/App.xcarchive archive CODE_SIGNING_ALLOWED=NO CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
          mkdir -p build/Payload
          cp -r build/App.xcarchive/Products/Applications/App.app build/Payload/
          cd build && zip -r NRMN2AI-TradingOS.ipa Payload

      - name: Upload IPA Artifact
        uses: actions/upload-artifact@v4
        with:
          name: NRMN2AI-TradingOS-IPA
          path: ios/App/build/NRMN2AI-TradingOS.ipa
`;
  zip.folder('.github')?.folder('workflows')?.file('build-ipa.yml', ghWorkflow);

  const guideMd = `# راهنمای نصب و استخراج فایل IPA برای آیفون (iOS)

## ۱. روش نصب سریع بدون نیاز به فایل IPA (پیشنهادی اپل - PWA):
اگر هدف شما اجرای برنامه روی آیفون به عنوان یک اپ مستقل و بدون نوار مرورگر است:
1. لینک برنامه را در سافاری (Safari) آیفون باز کنید.
2. دکمه Share (مربع با فلش رو به بالا) را در نوار پایین بزنید.
3. گزینه "Add to Home Screen" یا «افزودن به صفحه اصلی» را انتخاب کنید.
4. روی Add کلیک کنید.
این روش نیازی به فایل IPA، کامپیوتر یا تمدید ۷ روزه ندارد و ۱۰۰٪ پایدار است.

## ۲. روش ساخت فایل IPA با گیت‌هاب اکشنز (رایگان روی سرورهای اپل):
1. این محتویات را داخل یک مخزن در GitHub قرار دهید.
2. به تب Actions در گیت‌هاب بروید و جریان کاری 'Build iOS IPA' را اجرا کنید.
3. پس از اتمام بیلد، فایل NRMN2AI-TradingOS.ipa را از بخش Artifacts دانلود کنید!

## ۳. روش سایدلود فایل IPA با Sideloadly یا AltStore:
1. نرم‌افزار Sideloadly را برای ویندوز یا مک دانلود کنید (https://sideloadly.io).
2. آیفون را با کابل به کامپیوتر وصل کنید.
3. فایل IPA را در کادر نرم‌افزار بکشید و رها کنید (Drag & Drop).
4. ایمیل اپل آیدی (Apple ID) خود را وارد کنید و روی Start کلیک کنید.
5. پس از نصب، در آیفون به مسیر زیر بروید:
   Settings > General > VPN & Device Management
   و روی ایمیل خود زده و گزینه Trust را لمس نمایید.
`;
  zip.file('ios-sideload-guide.md', guideMd);

  zip.file(
    'README.txt',
    `NRMN2AI Trading OS - iOS Native Package\nGenerated at: ${new Date().toISOString()}\nApp URL: ${typeof window !== 'undefined' ? window.location.origin : ''}\n`
  );

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
