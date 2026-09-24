async function test() {
  console.log('Testing Vercel Live API...');
  try {
    const health = await fetch('https://teaching1.vercel.app/api/health');
    console.log('Health status:', health.status, await health.text());

    const otpRes = await fetch('https://teaching1.vercel.app/api/leads/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'upspeaqofficial@gmail.com', studentName: 'Vercel Test' }),
    });
    console.log('OTP status:', otpRes.status, await otpRes.text());
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
