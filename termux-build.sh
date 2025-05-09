#!/data/data/com.termux/files/usr/bin/bash

# سكربت خاص لبناء تطبيق WOLF في بيئة Termux
# هذا السكربت مبسط ومخصص للعمل في بيئة Termux

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

# التحقق من أننا في Termux
if [ ! -d "/data/data/com.termux" ] && [ -z "$TERMUX_VERSION" ]; then
  print_color "$RED" "هذا السكربت مخصص للعمل في بيئة Termux فقط."
  exit 1
fi

# 1. تثبيت التبعيات الأساسية
print_color "$BLUE" "=== تثبيت التبعيات الأساسية ==="
pkg update -y
pkg install -y nodejs openjdk-17 git
check_success "تم تثبيت التبعيات الأساسية"

# 2. تثبيت تبعيات Node.js
print_color "$BLUE" "=== تثبيت تبعيات Node.js ==="
npm install
check_success "تم تثبيت تبعيات Node.js"

# تثبيت Capacitor CLI عالميًا
npm install -g @capacitor/cli
check_success "تم تثبيت Capacitor CLI"

# 3. إعداد Capacitor
print_color "$BLUE" "=== إعداد Capacitor ==="
if [ ! -d "android" ]; then
  npx cap add android
  check_success "تمت إضافة منصة Android"
else
  print_color "$YELLOW" "منصة Android موجودة بالفعل"
fi

# 4. بناء المشروع
print_color "$BLUE" "=== بناء المشروع ==="
npm run build
check_success "تم بناء المشروع"

npm run export
check_success "تم تصدير المشروع"

npx cap sync
check_success "تمت مزامنة الملفات مع Capacitor"

# 5. إنشاء مفتاح التوقيع
if [ ! -f "wolf.keystore" ]; then
  print_color "$BLUE" "=== إنشاء مفتاح التوقيع ==="
  keytool -genkey -v -keystore wolf.keystore -alias wolf -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass wolfapp123 -keypass wolfapp123 \
    -dname "CN=WOLF App, OU=Development, O=WOLF, L=Unknown, ST=Unknown, C=OM"
  check_success "تم إنشاء مفتاح التوقيع"
else
  print_color "$YELLOW" "مفتاح التوقيع موجود بالفعل"
fi

# 6. تعديل إعدادات Gradle للعمل في Termux
print_color "$BLUE" "=== تعديل إعدادات Gradle ==="
mkdir -p android/app/src/main/assets
echo "org.gradle.jvmargs=-Xmx1536m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError" > android/gradle.properties
echo "org.gradle.parallel=true" >> android/gradle.properties
echo "org.gradle.daemon=false" >> android/gradle.properties
check_success "تم تعديل إعدادات Gradle"

# 7. بناء APK
print_color "$BLUE" "=== بناء APK ==="
chmod +x android/gradlew
cd android
./gradlew assembleRelease
check_success "تم بناء APK"

# نسخ APK إلى المجلد الرئيسي
mkdir -p ../release
cp app/build/outputs/apk/release/app-release.apk ../release/wolf-app.apk
check_success "تم نسخ APK إلى مجلد release"
cd ..

print_color "$GREEN" "=== تم الانتهاء بنجاح! ==="
print_color "$GREEN" "تم بناء تطبيق WOLF بنجاح في بيئة Termux"
print_color "$YELLOW" "APK موجود في: $(pwd)/release/wolf-app.apk"
print_color "$YELLOW" "يمكنك الآن استخدام MT Manager أو أي تطبيق آخر لتثبيت APK"
