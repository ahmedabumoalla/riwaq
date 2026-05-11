/** تنبيه صوتي وهمي عبر Web Audio — لا ملفات صوتية */

export function playMockOrderChime() {
  if (typeof window === "undefined") return;

  try {
    const Ctx =
      window.AudioContext ||
      (
        window as unknown as {
          webkitAudioContext: typeof AudioContext;
        }
      ).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.11, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.22);
    console.info("[رِواق] تنبيه صوتي وهمي: وصول طلب جديد");
  } catch {
    console.info("[رِواق] تنبيه وهمي (تعذر تشغيل الصوت في هذا المتصفح): طلب جديد");
  }
}
