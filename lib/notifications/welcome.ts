import { sendEmailNotification } from "./email";
import { sendSmsNotification } from "./sms";

type Params = {
  userId: string;
  email?: string | null;
  phone?: string | null;
  fullName?: string | null;
};

export async function sendWelcomeIfNeeded({
  email,
  phone,
  fullName,
}: Params) {
  try {
    if (email) {
      await sendEmailNotification({
        to: email,
        subject: "مرحبًا بك في رِواق",
        html: `
          <div dir="rtl">
            <h2>مرحبًا ${fullName ?? ""}</h2>
            <p>تم إنشاء حسابك بنجاح.</p>
          </div>
        `,
      });
    }

    if (phone) {
      await sendSmsNotification({
        to: phone,
        body: "مرحبًا بك في رِواق",
      });
    }

    return { sent: true };
  } catch (error) {
    console.error(error);
    return { sent: false };
  }
}