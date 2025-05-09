# تطبيق WOLF

<div dir="rtl">

## نظرة عامة

تطبيق WOLF هو تطبيق متكامل للهواتف الذكية يوفر واجهة مستخدم سلسة وجذابة مع دعم كامل للغة العربية. يتميز التطبيق بواجهة حديثة وأداء عالي ودعم للذكاء الاصطناعي مع مستوى متقدم من الأمان وحماية البيانات.

## الميزات الرئيسية

### واجهة المستخدم والتجربة
- ✨ واجهة مستخدم حديثة وجذابة
- 🌐 دعم كامل للغة العربية
- 📱 متوافق مع أجهزة Android
- 🔍 محرك بحث متقدم
- 💻 عارض أكواد متطور
- 🎨 تنسيق متقدم للردود

### الذكاء الاصطناعي والمعالجة
- 🤖 دمج مع خدمات الذكاء الاصطناعي (Google Gemini)
- 🔑 دعم لمفاتيح API مخصصة من Google Gemini
- 🧠 قدرات "التفكير العميق"
- 🗺️ مولد خرائط ذهنية
- 📊 عرض مرئي للتفكير المنطقي
- 🔄 تصدير واستيراد الخرائط الذهنية

### الأمان وحماية البيانات
- 🔐 نظام تسجيل دخول متكامل
- 🔒 تشفير قوي للبيانات (AES-256)
- 👆 التحقق بخطوتين (2FA)
- 🛡️ حماية ضد الهندسة العكسية والعبث
- 📜 نظام التحقق من الترخيص
- 🚨 نظام الكشف عن محاولات الاختراق
- 🔍 مراقبة تكامل التطبيق

### الأداء والتكامل
- ⚡ محسن أداء متقدم
- 🔔 نظام إشعارات متكامل
- 📱 تكامل مع ميزات الجهاز
- 💾 تخزين محلي آمن للبيانات
- 🌐 دعم للعمل دون اتصال بالإنترنت

## متطلبات النظام

- Android 7.0 أو أحدث
- مساحة تخزين: 50 ميجابايت على الأقل
- ذاكرة وصول عشوائي: 2 جيجابايت على الأقل

## التثبيت

1. قم بتنزيل أحدث إصدار من APK من صفحة [الإصدارات](https://github.com/yourusername/wolf-app/releases)
2. قم بتثبيت التطبيق على جهازك
3. ابدأ باستخدام تطبيق WOLF

## إعداد مفتاح API لـ Google Gemini

يمكنك استخدام مفتاح API الخاص بك من Google Gemini في التطبيق باتباع الخطوات التالية:

1. قم بزيارة [Google AI Studio](https://makersuite.google.com/app/apikey) للحصول على مفتاح API
2. انسخ مفتاح API الخاص بك
3. في تطبيق WOLF، انتقل إلى "إعدادات البوت"
4. انقر على "إعداد مفتاح API"
5. أدخل مفتاح API الخاص بك واضغط على "حفظ"

## ميزات الأمان

تطبيق WOLF يتميز بمستوى متقدم من الأمان لحماية بياناتك:

### تشفير البيانات
- تشفير AES-256 لجميع البيانات الحساسة
- تشفير مزدوج للبيانات الحساسة للغاية
- تخزين آمن للبيانات المشفرة

### التحقق بخطوتين (2FA)
- دعم رموز TOTP (مثل Google Authenticator)
- رموز استرداد للحالات الطارئة
- تكامل سلس مع واجهة تسجيل الدخول

### الحماية ضد العبث
- كشف الأجهزة التي تم عمل روت/جيلبريك لها
- كشف المحاكيات
- كشف محاولات التصحيح
- مراقبة تكامل التطبيق

### التحقق من الترخيص
- التحقق عبر الإنترنت ودون اتصال
- ربط الترخيص بمعرف الجهاز
- فترة سماح للعمل دون اتصال

### الكشف عن محاولات الاختراق
- كشف هجمات حقن البيانات
- كشف هجمات القوة الغاشمة
- تسجيل ومراقبة الأنشطة المشبوهة

## للمطورين

### متطلبات التطوير

- Node.js v14 أو أحدث
- npm v6 أو أحدث
- JDK 11 أو أحدث
- Android SDK

### بناء المشروع

\`\`\`bash
# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev

# بناء للإنتاج
npm run build

# بناء تطبيق Android
./build-and-deploy.sh
\`\`\`

### بناء المشروع في بيئة Termux

إذا كنت ترغب في بناء المشروع في بيئة Termux على جهاز Android، يمكنك استخدام السكربت المخصص:

\`\`\`bash
# تعيين الإذن التنفيذي للسكربت
chmod +x termux-build.sh

# تشغيل السكربت
./termux-build.sh
\`\`\`

## هيكل المشروع

\`\`\`
wolf-app/
├── app/                  # مجلد تطبيق Next.js
│   ├── chat/             # صفحة الدردشة
│   ├── login/            # صفحات تسجيل الدخول
│   ├── profile/          # صفحة الملف الشخصي
│   └── ...
├── components/           # مكونات React المشتركة
├── lib/                  # مكتبات ووظائف مساعدة
│   ├── security/         # خدمات الأمان والتشفير
│   ├── ai-processor.ts   # معالج الذكاء الاصطناعي
│   ├── gemini-service.ts # خدمة Google Gemini
│   └── ...
├── public/               # الملفات الثابتة
└── android/              # مشروع Android (يتم إنشاؤه بواسطة Capacitor)
\`\`\`

## التواصل

للاستفسارات والدعم، يرجى التواصل:

- البريد الإلكتروني: sa6aa6116@gmail.com
- الهاتف: +968 94165819

## الترخيص

هذا المشروع مرخص بموجب [ترخيص MIT](LICENSE).

</div>
\`\`\`

## 2. تحديث سكربت البناء والنشر

```shellscript file="build-and-deploy.sh"
#!/bin/bash

# سكربت لإعداد وبناء ونشر تطبيق WOLF
# يقوم هذا السكربت بالخطوات التالية:
# 1. التحقق من البيئة وتثبيت التبعيات
# 2. تثبيت إضافات Capacitor
# 3. إعداد Capacitor
# 4. بناء تطبيق Android (APK)
# 5. توقيع APK
# 6. نشر المشروع على GitHub (اختياري)

# ألوان للطباعة
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# وظيفة للطباعة مع لون
print_color() {
  printf "${1}${2}${NC}\n"
}

# وظيفة للتحقق من نجاح الأمر السابق
check_success() {
  if [ $? -eq 0 ]; then
    print_color "$GREEN" "✓ $1"
  else
    print_color "$RED" "✗ $1"
    print_color "$RED" "حدث خطأ. يرجى التحقق من السجل أعلاه."
    exit 1
  fi
}

# وظيفة للتحقق من وجود أمر
check_command() {
  if ! command -v $1 &> /dev/null; then
    print_color "$RED" "الأمر $1 غير موجود. يرجى تثبيته أولاً."
    return 1
  fi
  return 0
}

# التحقق من البيئة
print_color "$BLUE" "=== التحقق من البيئة ==="
IS_TERMUX=false
if [ -d "/data/data/com.termux" ] || [ -n "$TERMUX_VERSION" ]; then
  IS_TERMUX=true
  print_color "$YELLOW" "تم اكتشاف بيئة Termux"
fi

# التحقق من وجود الأوامر الأساسية
MISSING_DEPS=false
for cmd in node npm java keytool; do
  if ! check_command $cmd; then
    MISSING_DEPS=true
  fi
done

if [ "$MISSING_DEPS" = true ]; then
  print_color "$YELLOW" "تثبيت التبعيات المفقودة..."
  
  if [ "$IS_TERMUX" = true ]; then
    # تثبيت التبعيات في Termux
    pkg update -y
    pkg install -y nodejs openjdk-17 git
    check_success "تم تثبيت التبعيات في Termux"
  else
    # تحديد نوع التوزيعة
    if [ -f "/etc/artix-release" ]; then
      print_color "$YELLOW" "تم اكتشاف توزيعة Artix Linux"
      sudo pacman -Syu --noconfirm
      sudo pacman -S --noconfirm nodejs npm jdk-openjdk git
      check_success "تم تثبيت التبعيات في Artix Linux"
    elif [ -f "/etc/arch-release" ]; then
      sudo pacman -Syu --noconfirm
      sudo pacman -S --noconfirm nodejs npm jdk-openjdk git
      check_success "تم تثبيت التبعيات في Arch Linux"
    elif command -v apt &> /dev/null; then
      sudo apt update
      sudo apt install -y nodejs npm openjdk-17-jdk git
      check_success "تم تثبيت التبعيات باستخدام apt"
    elif command -v dnf &> /dev/null; then
      sudo dnf install -y nodejs npm java-17-openjdk-devel git
      check_success "تم تثبيت التبعيات باستخدام dnf"
    else
      print_color "$RED" "لم يتم التعرف على مدير الحزم. يرجى تثبيت nodejs و npm و java و git يدويًا."
      exit 1
    fi
  fi
fi

# 1. تثبيت تبعيات Node.js
print_color "$BLUE" "=== تثبيت تبعيات Node.js ==="
npm install
check_success "تم تثبيت تبعيات Node.js"

# تثبيت Capacitor CLI عالميًا إذا لم يكن موجودًا
if ! check_command cap; then
  print_color "$YELLOW" "تثبيت Capacitor CLI عالميًا..."
  npm install -g @capacitor/cli
  check_success "تم تثبيت Capacitor CLI"
fi

# 2. تثبيت إضافات Capacitor
print_color "$BLUE" "=== تثبيت إضافات Capacitor ==="
npm install @capacitor/core @capacitor/android @capacitor/ios
npm install @capacitor/push-notifications @capacitor/local-notifications @capacitor/splash-screen
npm install @capacitor/biometric @capacitor/app-launcher @capacitor/device @capacitor/storage
check_success "تم تثبيت إضافات Capacitor"

# 3. إعداد Capacitor
print_color "$BLUE" "=== إعداد Capacitor ==="

# التحقق مما إذا كان Android موجودًا بالفعل
if [ ! -d "android" ]; then
  print_color "$YELLOW" "إضافة منصة Android..."
  npx cap add android
  check_success "تمت إضافة منصة Android"
else
  print_color "$YELLOW" "منصة Android موجودة بالفعل"
fi

# 4. بناء المشروع
print_color "$BLUE" "=== بناء المشروع ==="
npm run build
check_success "تم بناء المشروع"

# تصدير المشروع كملفات ثابتة
print_color "$YELLOW" "تصدير المشروع كملفات ثابتة..."
npm run export
check_success "تم تصدير المشروع"

# مزامنة الملفات مع Capacitor
print_color "$YELLOW" "مزامنة الملفات مع Capacitor..."
npx cap sync
check_success "تمت مزامنة الملفات مع Capacitor"

# 5. إنشاء مفتاح التوقيع إذا لم يكن موجودًا
if [ ! -f "wolf.keystore" ]; then
  print_color "$BLUE" "=== إنشاء مفتاح التوقيع ==="
  
  # استخدام طريقة مختلفة لإنشاء المفتاح في Termux
  if [ "$IS_TERMUX" = true ]; then
    print_color "$YELLOW" "إنشاء مفتاح التوقيع في Termux..."
    keytool -genkey -v -keystore wolf.keystore -alias wolf -keyalg RSA -keysize 2048 -validity 10000 \
      -storepass wolfapp123 -keypass wolfapp123 \
      -dname "CN=WOLF App, OU=Development, O=WOLF, L=Unknown, ST=Unknown, C=OM"
  else
    keytool -genkey -v -keystore wolf.keystore -alias wolf -keyalg RSA -keysize 2048 -validity 10000 \
      -storepass wolfapp123 -keypass wolfapp123 \
      -dname "CN=WOLF App, OU=Development, O=WOLF, L=Unknown, ST=Unknown, C=OM"
  fi
  
  check_success "تم إنشاء مفتاح التوقيع"
else
  print_color "$YELLOW" "مفتاح التوقيع موجود بالفعل"
fi

# 6. إنشاء موارد شاشة البداية
print_color "$BLUE" "=== إنشاء موارد شاشة البداية ==="
npx capacitor-assets generate --splashBackgroundColor "#000000" --splashBackgroundDark "#000000" --iconBackgroundColor "#000000" --iconBackgroundDark "#000000"
check_success "تم إنشاء موارد شاشة البداية"

# 7. تكوين ميزات الأمان في Android
print_color "$BLUE" "=== تكوين ميزات الأمان في Android ==="

# إضافة تكوين ProGuard لتعتيم الكود
if [ -d "android/app" ]; then
  print_color "$YELLOW" "إعداد ProGuard لتعتيم الكود..."
  
  # إنشاء ملف proguard-rules.pro إذا لم يكن موجودًا
  if [ ! -f "android/app/proguard-rules.pro" ]; then
    cat > android/app/proguard-rules.pro << EOL
# تكوين ProGuard لتطبيق WOLF

# الحفاظ على معلومات الخطأ
-keepattributes SourceFile,LineNumberTable

# تعتيم الكود
-obfuscate
-optimizationpasses 5

# تعتيم أسماء الفئات والطرق
-repackageclasses
-allowaccessmodification

# حماية الفئات الخاصة بالتطبيق
-keep class com.wolf.app.** { *; }
-keepclassmembers class com.wolf.app.** { *; }

# حماية فئات Capacitor
-keep class com.getcapacitor.** { *; }
-keep class org.apache.cordova.** { *; }

# حماية فئات الأمان
-keep class com.wolf.app.security.** { *; }
EOL
    check_success "تم إنشاء ملف ProGuard"
  fi
  
  # تحديث build.gradle لتفعيل ProGuard
  if [ -f "android/app/build.gradle" ]; then
    print_color "$YELLOW" "تحديث build.gradle لتفعيل ProGuard..."
    
    # التحقق مما إذا كان ProGuard مفعل بالفعل
    if ! grep -q "minifyEnabled true" android/app/build.gradle; then
      # إضافة تكوين ProGuard
      sed -i '/buildTypes {/,/}/s/release {/release {\n            minifyEnabled true\n            shrinkResources true\n            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"/' android/app/build.gradle
      check_success "تم تفعيل ProGuard في build.gradle"
    else
      print_color "$YELLOW" "ProGuard مفعل بالفعل في build.gradle"
    fi
  fi
fi

# 8. بناء APK
print_color "$BLUE" "=== بناء APK ==="

# التحقق من وجود Gradle
if [ ! -f "android/gradlew" ]; then
  print_color "$RED" "ملف gradlew غير موجود في مجلد android"
  exit 1
fi

# تعيين الإذن التنفيذي لـ gradlew
chmod +x android/gradlew
check_success "تم تعيين الإذن التنفيذي لـ gradlew"

# بناء APK
cd android
if [ "$IS_TERMUX" = true ]; then
  # في Termux، قد نحتاج إلى تعديل بعض الإعدادات لتجنب مشاكل الذاكرة
  print_color "$YELLOW" "تعديل إعدادات Gradle للعمل في Termux..."
  echo "org.gradle.jvmargs=-Xmx1536m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError" > gradle.properties
  echo "org.gradle.parallel=true" >> gradle.properties
  echo "org.gradle.daemon=false" >> gradle.properties
fi

./gradlew assembleRelease
check_success "تم بناء APK"

# نسخ APK إلى المجلد الرئيسي
mkdir -p ../release
cp app/build/outputs/apk/release/app-release.apk ../release/wolf-app.apk
check_success "تم نسخ APK إلى مجلد release"
cd ..

# توقيع APK باستخدام apksigner إذا كان متاحًا (للتأكد من التوقيع الصحيح)
if command -v apksigner &> /dev/null; then
  print_color "$YELLOW" "التحقق من توقيع APK باستخدام apksigner..."
  apksigner verify --verbose release/wolf-app.apk
  check_success "تم التحقق من توقيع APK"
else
  print_color "$YELLOW" "apksigner غير متاح. تخطي التحقق من التوقيع."
fi

# 9. إنشاء ملف معلومات الإصدار
print_color "$BLUE" "=== إنشاء ملف معلومات الإصدار ==="

# الحصول على تاريخ الإصدار
RELEASE_DATE=$(date +"%Y-%m-%d")
VERSION="1.0.0"

# إنشاء ملف معلومات الإصدار
cat > release/RELEASE_NOTES.md << EOL
# تطبيق WOLF - الإصدار $VERSION ($RELEASE_DATE)

## الميزات الجديدة

### الذكاء الاصطناعي
- ✅ دعم لمفاتيح API مخصصة من Google Gemini
- ✅ تحسينات في معالجة الذكاء الاصطناعي
- ✅ مولد خرائط ذهنية متقدم

### الأمان
- ✅ نظام تشفير قوي للبيانات (AES-256)
- ✅ التحقق بخطوتين (2FA)
- ✅ حماية ضد الهندسة العكسية والعبث
- ✅ نظام التحقق من الترخيص
- ✅ نظام الكشف عن محاولات الاختراق

### واجهة المستخدم
- ✅ تحسينات في تنسيق الردود
- ✅ عرض مرئي للتفكير المنطقي
- ✅ تصدير واستيراد الخرائط الذهنية

## إصلاحات الأخطاء
- ✅ تحسين استقرار التطبيق
- ✅ تحسين الأداء العام
- ✅ إصلاح مشكلات في واجهة المستخدم

## متطلبات النظام
- Android 7.0 أو أحدث
- مساحة تخزين: 50 ميجابايت على الأقل
- ذاكرة وصول عشوائي: 2 جيجابايت على الأقل

## التثبيت
1. قم بتنزيل ملف APK
2. قم بتثبيت التطبيق على جهازك
3. ابدأ باستخدام تطبيق WOLF

## التواصل
- البريد الإلكتروني: sa6aa6116@gmail.com
- الهاتف: +968 94165819
EOL

check_success "تم إنشاء ملف معلومات الإصدار"

# 10. نشر المشروع على GitHub (اختياري)
print_color "$YELLOW" "هل ترغب في نشر المشروع على GitHub؟ (y/n)"
read publish_to_github

if [ "$publish_to_github" = "y" ] || [ "$publish_to_github" = "Y" ]; then
  print_color "$BLUE" "=== نشر المشروع على GitHub ==="

  # التحقق مما إذا كان المستودع موجودًا بالفعل
  if [ ! -d ".git" ]; then
    print_color "$YELLOW" "تهيئة مستودع Git..."
    git init
    check_success "تمت تهيئة مستودع Git"
    
    # إنشاء ملف .gitignore
    cat > .gitignore << EOL
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# android
/android/app/build/
/android/build/
/android/captures/
/android/local.properties
/android/.gradle/
/android/.idea/

# keystore
# *.keystore
# *.jks
EOL
    check_success "تم إنشاء ملف .gitignore"
  else
    print_color "$YELLOW" "مستودع Git موجود بالفعل"
  fi

  # إضافة الملفات إلى Git
  git add .
  check_success "تمت إضافة الملفات إلى Git"

  # عمل commit
  git commit -m "إصدار جديد: تطبيق WOLF v$VERSION مع ميزات أمان متقدمة ودعم لمفاتيح API مخصصة"
  check_success "تم عمل commit"

  # إضافة remote إذا لم يكن موجودًا
  if ! git remote | grep -q "origin"; then
    print_color "$YELLOW" "يرجى إدخال عنوان مستودع GitHub الخاص بك:"
    read github_repo
    git remote add origin $github_repo
    check_success "تمت إضافة remote"
  fi

  # دفع التغييرات إلى GitHub
  print_color "$YELLOW" "جاري دفع التغييرات إلى GitHub..."
  git push -u origin master
  check_success "تم دفع التغييرات إلى GitHub"

  # إنشاء tag للإصدار
  git tag -a v$VERSION -m "الإصدار $VERSION مع ميزات أمان متقدمة ودعم لمفاتيح API مخصصة"
  git push origin v$VERSION
  check_success "تم إنشاء tag للإصدار"
  
  # إنشاء إصدار على GitHub (إذا كان gh CLI متاحًا)
  if command -v gh &> /dev/null; then
    print_color "$YELLOW" "إنشاء إصدار على GitHub..."
    gh release create v$VERSION release/wolf-app.apk -F release/RELEASE_NOTES.md -t "تطبيق WOLF v$VERSION"
    check_success "تم إنشاء إصدار على GitHub"
  else
    print_color "$YELLOW" "GitHub CLI (gh) غير متاح. يرجى إنشاء الإصدار يدويًا على GitHub."
  fi
fi

print_color "$GREEN" "=== تم الانتهاء بنجاح! ==="
print_color "$GREEN" "تم بناء تطبيق WOLF بنجاح مع ميزات أمان متقدمة ودعم لمفاتيح API مخصصة"
print_color "$YELLOW" "APK موجود في: $(pwd)/release/wolf-app.apk"
print_color "$YELLOW" "معلومات التواصل: sa6aa6116@gmail.com / +96894165819"
