# تطبيق WOLF

تطبيق WOLF هو تطبيق متكامل للهواتف الذكية يوفر واجهة مستخدم سلسة وجذابة.

## الميزات

- واجهة مستخدم حديثة وجذابة
- نظام تسجيل دخول متكامل
- دعم للغة العربية
- متوافق مع أجهزة Android

## التواصل

للاستفسارات والدعم، يرجى التواصل:

- البريد الإلكتروني: sa6aa6116@gmail.com
- الهاتف: +968 94165819

## التثبيت

1. قم بتنزيل أحدث إصدار من APK من صفحة [الإصدارات](https://github.com/yourusername/wolf-app/releases)
2. قم بتثبيت التطبيق على جهازك
3. ابدأ باستخدام تطبيق WOLF

## التطوير

\`\`\`bash
# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev

# بناء للإنتاج
npm run build

# بناء تطبيق Android
npm run build-android-release
\`\`\`

## خطوات تحويل التطبيق إلى APK

1. تثبيت التبعيات:
   \`\`\`bash
   npm install
   \`\`\`

2. إضافة منصة Android:
   \`\`\`bash
   npx cap add android
   \`\`\`

3. بناء وتصدير المشروع:
   \`\`\`bash
   npm run build
   npm run export
   \`\`\`

4. مزامنة الملفات مع Capacitor:
   \`\`\`bash
   npx cap sync
   \`\`\`

5. بناء APK:
   \`\`\`bash
   cd android
   ./gradlew assembleRelease
   \`\`\`

6. توقيع APK:
   \`\`\`bash
   keytool -genkey -v -keystore wolf.keystore -alias wolf -keyalg RSA -keysize 2048 -validity 10000
   \`\`\`

7. استخدام السكربت الشامل:
   \`\`\`bash
   chmod +x build-and-deploy.sh
   ./build-and-deploy.sh
