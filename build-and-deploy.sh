#!/bin/bash

# سكربت ذكي لإعداد وبناء ونشر تطبيق WOLF
# يقوم هذا السكربت بالخطوات التالية:
# 1. التحقق من البيئة وتثبيت جميع التبعيات تلقائيًا
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
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# وظيفة للطباعة مع لون
print_color() {
  printf "${1}${2}${NC}\n"
}

# وظيفة للطباعة مع لون وإطار
print_header() {
  local text="$1"
  local color="$2"
  local length=${#text}
  local border=$(printf '=%.0s' $(seq 1 $((length + 10))))
  
  echo ""
  printf "${color}${border}${NC}\n"
  printf "${color}=====  ${text}  =====${NC}\n"
  printf "${color}${border}${NC}\n"
}

# وظيفة للتحقق من نجاح الأمر السابق
check_success() {
  if [ $? -eq 0 ]; then
    print_color "$GREEN" "✓ $1"
    return 0
  else
    print_color "$RED" "✗ $1"
    print_color "$RED" "حدث خطأ. يرجى التحقق من السجل أعلاه."
    return 1
  fi
}

# وظيفة للتحقق من وجود أمر
check_command() {
  if command -v $1 &> /dev/null; then
    return 0
  else
    return 1
  fi
}

# وظيفة لتثبيت حزمة باستخدام مدير الحزم المناسب
install_package() {
  local package_name="$1"
  local display_name="${2:-$1}"
  
  print_color "$YELLOW" "جاري تثبيت $display_name..."
  
  if [ "$IS_TERMUX" = true ]; then
    pkg install -y $package_name
  elif [ "$IS_ARCH" = true ]; then
    sudo pacman -S --noconfirm $package_name
  elif [ "$IS_DEBIAN" = true ]; then
    sudo apt-get install -y $package_name
  elif [ "$IS_FEDORA" = true ]; then
    sudo dnf install -y $package_name
  else
    print_color "$RED" "لا يمكن تحديد مدير الحزم المناسب لتثبيت $display_name"
    return 1
  fi
  
  if check_success "تم تثبيت $display_name"; then
    return 0
  else
    return 1
  fi
}

# وظيفة لتثبيت Node.js
install_nodejs() {
  if [ "$IS_TERMUX" = true ]; then
    install_package nodejs "Node.js"
  elif [ "$IS_ARCH" = true ]; then
    install_package nodejs "Node.js"
  elif [ "$IS_DEBIAN" = true ]; then
    # تثبيت Node.js من NodeSource
    if ! check_command curl; then
      install_package curl "curl"
    fi
    
    print_color "$YELLOW" "إضافة مستودع NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    check_success "تمت إضافة مستودع NodeSource"
    
    install_package nodejs "Node.js"
  elif [ "$IS_FEDORA" = true ]; then
    install_package nodejs "Node.js"
  else
    print_color "$RED" "لا يمكن تثبيت Node.js تلقائيًا. يرجى تثبيته يدويًا."
    return 1
  fi
}

# وظيفة لتثبيت Java JDK
install_java() {
  if [ "$IS_TERMUX" = true ]; then
    install_package openjdk-17 "Java JDK"
  elif [ "$IS_ARCH" = true ]; then
    install_package jdk-openjdk "Java JDK"
  elif [ "$IS_DEBIAN" = true ]; then
    install_package openjdk-17-jdk "Java JDK"
  elif [ "$IS_FEDORA" = true ]; then
    install_package java-17-openjdk-devel "Java JDK"
  else
    print_color "$RED" "لا يمكن تثبيت Java JDK تلقائيًا. يرجى تثبيته يدويًا."
    return 1
  fi
}

# وظيفة لتثبيت Android SDK
install_android_sdk() {
  if [ "$IS_TERMUX" = true ]; then
    print_color "$YELLOW" "تثبيت Android SDK في Termux..."
    
    # إنشاء مجلد Android SDK
    mkdir -p $HOME/android-sdk
    
    # تنزيل أدوات Android SDK
    if ! check_command wget; then
      install_package wget "wget"
    fi
    
    # تنزيل Android SDK Command Line Tools
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O android-sdk-tools.zip
    
    # فك ضغط الملف
    if ! check_command unzip; then
      install_package unzip "unzip"
    fi
    
    unzip -q android-sdk-tools.zip -d $HOME/android-sdk
    check_success "تم تنزيل وفك ضغط Android SDK Command Line Tools"
    
    # تنظيف
    rm android-sdk-tools.zip
    
    # إعداد متغيرات البيئة
    export ANDROID_HOME=$HOME/android-sdk
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/bin
    
    # قبول التراخيص
    yes | sdkmanager --licenses
    
    # تثبيت الأدوات الأساسية
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
    check_success "تم تثبيت Android SDK"
    
    # إضافة متغيرات البيئة إلى .bashrc
    echo "export ANDROID_HOME=\$HOME/android-sdk" >> $HOME/.bashrc
    echo "export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/bin:\$ANDROID_HOME/platform-tools" >> $HOME/.bashrc
    
  elif [ "$IS_ARCH" = true ] || [ "$IS_DEBIAN" = true ] || [ "$IS_FEDORA" = true ]; then
    print_color "$YELLOW" "تثبيت Android SDK..."
    
    # إنشاء مجلد Android SDK
    mkdir -p $HOME/Android/Sdk
    
    # تنزيل أدوات Android SDK
    if ! check_command wget; then
      if [ "$IS_ARCH" = true ]; then
        install_package wget "wget"
      elif [ "$IS_DEBIAN" = true ]; then
        install_package wget "wget"
      elif [ "$IS_FEDORA" = true ]; then
        install_package wget "wget"
      fi
    fi
    
    # تنزيل Android SDK Command Line Tools
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O android-sdk-tools.zip
    
    # فك ضغط الملف
    if ! check_command unzip; then
      if [ "$IS_ARCH" = true ]; then
        install_package unzip "unzip"
      elif [ "$IS_DEBIAN" = true ]; then
        install_package unzip "unzip"
      elif [ "$IS_FEDORA" = true ]; then
        install_package unzip "unzip"
      fi
    fi
    
    unzip -q android-sdk-tools.zip -d $HOME/Android/Sdk
    check_success "تم تنزيل وفك ضغط Android SDK Command Line Tools"
    
    # تنظيف
    rm android-sdk-tools.zip
    
    # إعداد متغيرات البيئة
    export ANDROID_HOME=$HOME/Android/Sdk
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/bin
    
    # قبول التراخيص
    yes | sdkmanager --licenses
    
    # تثبيت الأدوات الأساسية
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
    check_success "تم تثبيت Android SDK"
    
    # إضافة متغيرات البيئة إلى .bashrc
    echo "export ANDROID_HOME=\$HOME/Android/Sdk" >> $HOME/.bashrc
    echo "export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/bin:\$ANDROID_HOME/platform-tools" >> $HOME/.bashrc
    
  else
    print_color "$RED" "لا يمكن تثبيت Android SDK تلقائيًا. يرجى تثبيته يدويًا."
    return 1
  fi
}

# وظيفة لتثبيت Gradle
install_gradle() {
  if [ "$IS_TERMUX" = true ]; then
    install_package gradle "Gradle"
  elif [ "$IS_ARCH" = true ]; then
    install_package gradle "Gradle"
  elif [ "$IS_DEBIAN" = true ]; then
    install_package gradle "Gradle"
  elif [ "$IS_FEDORA" = true ]; then
    install_package gradle "Gradle"
  else
    print_color "$RED" "لا يمكن تثبيت Gradle تلقائيًا. يرجى تثبيته يدويًا."
    return 1
  fi
}

# وظيفة لتثبيت Git
install_git() {
  if [ "$IS_TERMUX" = true ]; then
    install_package git "Git"
  elif [ "$IS_ARCH" = true ]; then
    install_package git "Git"
  elif [ "$IS_DEBIAN" = true ]; then
    install_package git "Git"
  elif [ "$IS_FEDORA" = true ]; then
    install_package git "Git"
  else
    print_color "$RED" "لا يمكن تثبيت Git تلقائيًا. يرجى تثبيته يدويًا."
    return 1
  fi
}

# وظيفة لتثبيت GitHub CLI
install_github_cli() {
  if [ "$IS_TERMUX" = true ]; then
    install_package gh "GitHub CLI"
  elif [ "$IS_ARCH" = true ]; then
    install_package github-cli "GitHub CLI"
  elif [ "$IS_DEBIAN" = true ]; then
    # تثبيت GitHub CLI من المستودع الرسمي
    if ! check_command curl; then
      install_package curl "curl"
    fi
    
    print_color "$YELLOW" "إضافة مستودع GitHub CLI..."
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    sudo apt-get update
    check_success "تمت إضافة مستودع GitHub CLI"
    
    install_package gh "GitHub CLI"
  elif [ "$IS_FEDORA" = true ]; then
    install_package gh "GitHub CLI"
  else
    print_color "$RED" "لا يمكن تثبيت GitHub CLI تلقائيًا. يرجى تثبيته يدويًا."
    return 1
  fi
}

# وظيفة لتثبيت npm
install_npm() {
  if [ "$IS_TERMUX" = true ]; then
    install_package nodejs "npm (مع Node.js)"
  elif [ "$IS_ARCH" = true ]; then
    install_package npm "npm"
  elif [ "$IS_DEBIAN" = true ]; then
    install_package npm "npm"
  elif [ "$IS_FEDORA" = true ]; then
    install_package npm "npm"
  else
    print_color "$RED" "لا يمكن تثبيت npm تلقائيًا. يرجى تثبيته يدويًا."
    return 1
  fi
}

# وظيفة لتثبيت keytool
install_keytool() {
  # keytool يأتي مع Java JDK
  install_java
}

# وظيفة لتثبيت apksigner
install_apksigner() {
  # apksigner يأتي مع Android SDK
  install_android_sdk
}

# وظيفة لتثبيت جميع التبعيات الأساسية
install_all_dependencies() {
  print_header "تثبيت جميع التبعيات الأساسية" "$BLUE"
  
  # تثبيت Node.js و npm
  if ! check_command node; then
    install_nodejs
  else
    print_color "$GREEN" "✓ Node.js موجود بالفعل ($(node --version))"
  fi
  
  if ! check_command npm; then
    install_npm
  else
    print_color "$GREEN" "✓ npm موجود بالفعل ($(npm --version))"
  fi
  
  # تثبيت Java JDK
  if ! check_command java; then
    install_java
  else
    print_color "$GREEN" "✓ Java موجود بالفعل ($(java -version 2>&1 | head -n 1))"
  fi
  
  # تثبيت Git
  if ! check_command git; then
    install_git
  else
    print_color "$GREEN" "✓ Git موجود بالفعل ($(git --version))"
  fi
  
  # تثبيت keytool
  if ! check_command keytool; then
    install_keytool
  else
    print_color "$GREEN" "✓ keytool موجود بالفعل"
  fi
  
  # تثبيت Gradle
  if ! check_command gradle; then
    install_gradle
  else
    print_color "$GREEN" "✓ Gradle موجود بالفعل ($(gradle --version | head -n 1))"
  fi
  
  # تثبيت Android SDK (اختياري)
  if [ -z "$ANDROID_HOME" ]; then
    print_color "$YELLOW" "هل ترغب في تثبيت Android SDK؟ (y/n)"
    read install_android_sdk_choice
    
    if [ "$install_android_sdk_choice" = "y" ] || [ "$install_android_sdk_choice" = "Y" ]; then
      install_android_sdk
    else
      print_color "$YELLOW" "تخطي تثبيت Android SDK"
    fi
  else
    print_color "$GREEN" "✓ Android SDK موجود بالفعل في $ANDROID_HOME"
  fi
  
  # تثبيت GitHub CLI (اختياري)
  if ! check_command gh; then
    print_color "$YELLOW" "هل ترغب في تثبيت GitHub CLI؟ (y/n)"
    read install_github_cli_choice
    
    if [ "$install_github_cli_choice" = "y" ] || [ "$install_github_cli_choice" = "Y" ]; then
      install_github_cli
    else
      print_color "$YELLOW" "تخطي تثبيت GitHub CLI"
    fi
  else
    print_color "$GREEN" "✓ GitHub CLI موجود بالفعل ($(gh --version | head -n 1))"
  fi
  
  print_color "$GREEN" "تم تثبيت جميع التبعيات الأساسية بنجاح!"
}

# التحقق من البيئة
print_header "التحقق من البيئة" "$BLUE"

# تحديد نوع البيئة
IS_TERMUX=false
IS_ARCH=false
IS_DEBIAN=false
IS_FEDORA=false

if [ -d "/data/data/com.termux" ] || [ -n "$TERMUX_VERSION" ]; then
  IS_TERMUX=true
  print_color "$YELLOW" "تم اكتشاف بيئة Termux"
elif [ -f "/etc/arch-release" ] || [ -f "/etc/artix-release" ]; then
  IS_ARCH=true
  print_color "$YELLOW" "تم اكتشاف توزيعة Arch/Artix Linux"
elif [ -f "/etc/debian_version" ] || [ -f "/etc/ubuntu_version" ] || command -v apt &> /dev/null; then
  IS_DEBIAN=true
  print_color "$YELLOW" "تم اكتشاف توزيعة Debian/Ubuntu"
elif [ -f "/etc/fedora-release" ] || command -v dnf &> /dev/null; then
  IS_FEDORA=true
  print_color "$YELLOW" "تم اكتشاف توزيعة Fedora"
else
  print_color "$YELLOW" "لم يتم التعرف على نوع التوزيعة. سيتم محاولة اكتشاف مدير الحزم."
  
  if command -v apt &> /dev/null; then
    IS_DEBIAN=true
    print_color "$YELLOW" "تم اكتشاف مدير الحزم apt"
  elif command -v dnf &> /dev/null; then
    IS_FEDORA=true
    print_color "$YELLOW" "تم اكتشاف مدير الحزم dnf"
  elif command -v pacman &> /dev/null; then
    IS_ARCH=true
    print_color "$YELLOW" "تم اكتشاف مدير الحزم pacman"
  else
    print_color "$RED" "لم يتم التعرف على مدير الحزم. قد تحتاج إلى تثبيت التبعيات يدويًا."
  fi
fi

# تحديث مدير الحزم
if [ "$IS_TERMUX" = true ]; then
  print_color "$YELLOW" "تحديث مدير الحزم..."
  pkg update -y
  check_success "تم تحديث مدير الحزم"
elif [ "$IS_ARCH" = true ]; then
  print_color "$YELLOW" "تحديث مدير الحزم..."
  sudo pacman -Syu --noconfirm
  check_success "تم تحديث مدير الحزم"
elif [ "$IS_DEBIAN" = true ]; then
  print_color "$YELLOW" "تحديث مدير الحزم..."
  sudo apt-get update
  check_success "تم تحديث مدير الحزم"
elif [ "$IS_FEDORA" = true ]; then
  print_color "$YELLOW" "تحديث مدير الحزم..."
  sudo dnf update -y
  check_success "تم تحديث مدير الحزم"
fi

# تثبيت جميع التبعيات
install_all_dependencies

# 1. تثبيت تبعيات Node.js
print_header "تثبيت تبعيات Node.js" "$BLUE"
npm install
check_success "تم تثبيت تبعيات Node.js"

# تثبيت Capacitor CLI عالميًا إذا لم يكن موجودًا
if ! check_command cap; then
  print_color "$YELLOW" "تثبيت Capacitor CLI عالميًا..."
  npm install -g @capacitor/cli
  check_success "تم تثبيت Capacitor CLI"
else
  print_color "$GREEN" "✓ Capacitor CLI موجود بالفعل ($(cap --version))"
fi

# 2. تثبيت إضافات Capacitor
print_header "تثبيت إضافات Capacitor" "$BLUE"
npm install @capacitor/core @capacitor/android @capacitor/ios
npm install @capacitor/push-notifications @capacitor/local-notifications @capacitor/splash-screen
npm install @capacitor/biometric @capacitor/app-launcher @capacitor/device @capacitor/storage
check_success "تم تثبيت إضافات Capacitor"

# 3. إعداد Capacitor
print_header "إعداد Capacitor" "$BLUE"

# التحقق مما إذا كان Android موجودًا بالفعل
if [ ! -d "android" ]; then
  print_color "$YELLOW" "إضافة منصة Android..."
  npx cap add android
  check_success "تمت إضافة منصة Android"
else
  print_color "$YELLOW" "منصة Android موجودة بالفعل"
fi

# 4. بناء المشروع
print_header "بناء المشروع" "$BLUE"
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
  print_header "إنشاء مفتاح التوقيع" "$BLUE"
  
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
print_header "إنشاء موارد شاشة البداية" "$BLUE"

# تثبيت capacitor-assets إذا لم يكن موجودًا
if ! check_command capacitor-assets; then
  print_color "$YELLOW" "تثبيت capacitor-assets..."
  npm install -g @capacitor/assets
  check_success "تم تثبيت capacitor-assets"
else
  print_color "$GREEN" "✓ capacitor-assets موجود بالفعل"
fi

npx capacitor-assets generate --splashBackgroundColor "#000000" --splashBackgroundDark "#000000" --iconBackgroundColor "#000000" --iconBackgroundDark "#000000"
check_success "تم إنشاء موارد شاشة البداية"

# 7. تكوين ميزات الأمان في Android
print_header "تكوين ميزات الأمان في Android" "$BLUE"

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
print_header "بناء APK" "$BLUE"

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
if check_command apksigner; then
  print_color "$YELLOW" "التحقق من توقيع APK باستخدام apksigner..."
  apksigner verify --verbose release/wolf-app.apk
  check_success "تم التحقق من توقيع APK"
else
  print_color "$YELLOW" "apksigner غير متاح. تخطي التحقق من التوقيع."
fi

# 9. إنشاء ملف معلومات الإصدار
print_header "إنشاء ملف معلومات الإصدار" "$BLUE"

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
print_header "نشر المشروع على GitHub (اختياري)" "$BLUE"
print_color "$YELLOW" "هل ترغب في نشر المشروع على GitHub؟ (y/n)"
read publish_to_github

if [ "$publish_to_github" = "y" ] || [ "$publish_to_github" = "Y" ]; then
  # التحقق من وجود Git
  if ! check_command git; then
    install_git
  fi
  
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
  if check_command gh; then
    print_color "$YELLOW" "إنشاء إصدار على GitHub..."
    gh release create v$VERSION release/wolf-app.apk -F release/RELEASE_NOTES.md -t "تطبيق WOLF v$VERSION"
    check_success "تم إنشاء إصدار على GitHub"
  else
    print_color "$YELLOW" "GitHub CLI (gh) غير متاح. يرجى إنشاء الإصدار يدويًا على GitHub."
    
    # هل ترغب في تثبيت GitHub CLI؟
    print_color "$YELLOW" "هل ترغب في تثبيت GitHub CLI الآن؟ (y/n)"
    read install_gh_now
    
    if [ "$install_gh_now" = "y" ] || [ "$install_gh_now" = "Y" ]; then
      install_github_cli
      
      if check_command gh; then
        print_color "$YELLOW" "إنشاء إصدار على GitHub..."
        gh release create v$VERSION release/wolf-app.apk -F release/RELEASE_NOTES.md -t "تطبيق WOLF v$VERSION"
        check_success "تم إنشاء إصدار على GitHub"
      fi
    fi
  fi
fi

print_header "تم الانتهاء بنجاح!" "$GREEN"
print_color "$GREEN" "تم بناء تطبيق WOLF بنجاح مع ميزات أمان متقدمة ودعم لمفاتيح API مخصصة"
print_color "$YELLOW" "APK موجود في: $(pwd)/release/wolf-app.apk"
print_color "$YELLOW" "معلومات التواصل: sa6aa6116@gmail.com / +96894165819"
