import { Capacitor } from "@capacitor/core"
import { PushNotifications } from "@capacitor/push-notifications"
import { LocalNotifications } from "@capacitor/local-notifications"

export class NotificationService {
  private static instance: NotificationService
  private initialized = false

  // نمط Singleton للتأكد من وجود نسخة واحدة فقط
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // تهيئة خدمة الإشعارات
  public async initialize(): Promise<void> {
    if (this.initialized) return

    // التحقق مما إذا كان التطبيق يعمل على جهاز محمول
    if (Capacitor.isNativePlatform()) {
      try {
        // طلب الإذن لإرسال الإشعارات
        const permissionStatus = await PushNotifications.requestPermissions()

        if (permissionStatus.receive === "granted") {
          // تسجيل الجهاز لتلقي الإشعارات
          await PushNotifications.register()

          // إعداد المستمعين للإشعارات
          this.setupPushListeners()
          console.log("تم تهيئة خدمة الإشعارات بنجاح")
        } else {
          console.warn("لم يتم منح إذن الإشعارات")
        }
      } catch (error) {
        console.error("خطأ في تهيئة خدمة الإشعارات:", error)
      }
    } else {
      console.log("خدمة الإشعارات غير متاحة في المتصفح")
    }

    this.initialized = true
  }

  // إعداد المستمعين للإشعارات
  private setupPushListeners(): void {
    // عند استلام إشعار جديد
    PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("تم استلام إشعار:", notification)
      // يمكنك هنا تنفيذ أي منطق إضافي عند استلام إشعار
    })

    // عند النقر على إشعار
    PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
      console.log("تم النقر على إشعار:", action)
      // يمكنك هنا تنفيذ أي منطق للتنقل أو فتح صفحة معينة
    })
  }

  // إرسال إشعار محلي (يعمل حتى بدون خادم)
  public async sendLocalNotification(
    title: string,
    body: string,
    id: number = Math.floor(Math.random() * 10000),
  ): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log("الإشعارات المحلية غير متاحة في المتصفح")
      return
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id,
            sound: "default",
            attachments: null,
            actionTypeId: "",
            extra: null,
          },
        ],
      })
      console.log("تم جدولة الإشعار المحلي بنجاح")
    } catch (error) {
      console.error("خطأ في إرسال الإشعار المحلي:", error)
    }
  }

  // تسجيل رمز الجهاز في الخادم (يجب استدعاؤها بعد تسجيل الدخول)
  public async registerDeviceToken(userId: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) return

    try {
      // الحصول على رمز الجهاز
      const { value: token } = await PushNotifications.getDeliveredNotifications()

      // إرسال الرمز إلى الخادم (يجب تنفيذ هذه الوظيفة)
      await this.sendTokenToServer(userId, token)
    } catch (error) {
      console.error("خطأ في تسجيل رمز الجهاز:", error)
    }
  }

  // إرسال رمز الجهاز إلى الخادم (مثال)
  private async sendTokenToServer(userId: string, token: any): Promise<void> {
    // هذه مجرد وظيفة وهمية، يجب استبدالها بالتنفيذ الفعلي
    console.log(`تسجيل رمز الجهاز للمستخدم ${userId}:`, token)

    // مثال على كيفية إرسال الرمز إلى الخادم
    /*
    try {
      const response = await fetch('https://your-api.com/register-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          token,
          platform: Capacitor.getPlatform()
        }),
      });
      
      if (!response.ok) {
        throw new Error('فشل تسجيل الجهاز');
      }
      
      console.log('تم تسجيل الجهاز بنجاح');
    } catch (error) {
      console.error('خطأ في تسجيل الجهاز:', error);
    }
    */
  }

  // إلغاء تسجيل الجهاز (يجب استدعاؤها عند تسجيل الخروج)
  public async unregisterDevice(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return

    try {
      // إلغاء تسجيل الجهاز من خدمة الإشعارات
      await PushNotifications.unregister()
      console.log("تم إلغاء تسجيل الجهاز بنجاح")
    } catch (error) {
      console.error("خطأ في إلغاء تسجيل الجهاز:", error)
    }
  }
}

// تصدير نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const notificationService = NotificationService.getInstance()
