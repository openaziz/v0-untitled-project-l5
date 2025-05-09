#!/bin/bash

# سكربت لإعداد وبناء ونشر تطبيق WOLF
# يقوم هذا السكربت بالخطوات التالية:
# 1. تثبيت التبعيات
# 2. إعداد Capacitor
# 3. بناء تطبيق Android (APK)
# 4. توقيع APK
# 5. نشر المشروع على GitHub

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
    exit 1
  fi
}

# 1. تثبيت التبعيات
print_color "$BLUE" "=== تثبيت التبعيات ==="
npm install
check_success "تم تثبيت تبعيات Node.js"

# 2. إعداد Capacitor
print_color "$BLUE" "=== إعداد Capacitor ==="

# التحقق مما إذا كان Android موجودًا بالفعل
if [ ! -d "android" ]; then
  print_color "$YELLOW" "إضافة منصة Android..."
  npx cap add android
  check_success "تمت إضافة منصة Android"
else
  print_color "$YELLOW" "منصة Android موجودة بالفعل"
fi

# 3. بناء المشروع
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

# 4. إنشاء مفتاح التوقيع إذا لم يكن موجودًا
if [ ! -f "wolf.keystore" ]; then
  print_color "$BLUE" "=== إنشاء مفتاح التوقيع ==="
  keytool -genkey -v -keystore wolf.keystore -alias wolf -keyalg RSA -keysize 2048 -validity 10000 -storepass wolfapp123 -keypass wolfapp123 -dname "CN=WOLF App, OU=Development, O=WOLF, L=Unknown, ST=Unknown, C=OM"
  check_success "تم إنشاء مفتاح التوقيع"
else
  print_color "$YELLOW" "مفتاح التوقيع موجود بالفعل"
fi

# 5. بناء APK
print_color "$BLUE" "=== بناء APK ==="
cd android && ./gradlew assembleRelease
check_success "تم بناء APK"

# نسخ APK إلى المجلد الرئيسي
cp app/build/outputs/apk/release/app-release.apk ../wolf-app.apk
check_success "تم نسخ APK إلى المجلد الرئيسي"
cd ..

# 6. نشر المشروع على GitHub
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
*.keystore
*.jks
EOL
  check_success "تم إنشاء ملف .gitignore"
  
  # إنشاء ملف README.md
  cat > README.md << EOL
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
EOL
  check_success "تم إنشاء ملف README.md"
else
  print_color "$YELLOW" "مستودع Git موجود بالفعل"
fi

# إضافة الملفات إلى Git
git add .
check_success "تمت إضافة الملفات إلى Git"

# عمل commit
git commit -m "إصدار جديد: تطبيق WOLF v1.0.0"
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
git tag -a v1.0.0 -m "الإصدار 1.0.0"
git push origin v1.0.0
check_success "تم إنشاء tag للإصدار"

print_color "$GREEN" "=== تم الانتهاء بنجاح! ==="
print_color "$GREEN" "تم بناء تطبيق WOLF ونشره على GitHub"
print_color "$YELLOW" "APK موجود في: $(pwd)/wolf-app.apk"
print_color "$YELLOW" "معلومات التواصل: sa6aa6116@gmail.com / +96894165819"
