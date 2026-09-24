import { sendOtpEmail, sendDemoReceivedEmail, sendTeacherAssignedEmail } from '../server/services/emailService.ts';

console.log('🧪 Testing Email & Funnel logic...');

// Test 1: Send OTP
console.log('1. Testing OTP dispatch...');
const otpRes = await sendOtpEmail({
  to: 'upspeaqofficial@gmail.com',
  otp: '9412',
  studentName: 'Aarav Kumar (Grade 10)',
});
console.log('OTP Result:', otpRes);

// Test 2: Send Demo Received Email (No meeting link)
console.log('2. Testing Demo Received email...');
const recvRes = await sendDemoReceivedEmail({
  to: 'upspeaqofficial@gmail.com',
  studentName: 'Aarav Kumar',
  parentName: 'Parent of Aarav',
  studentClass: 'Grade 10',
  dateStr: 'Wed, 24 Sep 2026',
  timeStr: '11:00 AM',
});
console.log('Demo Received Result:', recvRes);

// Test 3: Send Teacher Assigned & Meeting Link Email
console.log('3. Testing Teacher Confirmed Meeting Link email...');
const assignRes = await sendTeacherAssignedEmail({
  to: 'upspeaqofficial@gmail.com',
  studentName: 'Aarav Kumar',
  parentName: 'Parent of Aarav',
  dateStr: 'Wed, 24 Sep 2026',
  timeStr: '11:00 AM',
  teacherName: 'Ms. Ananya Sharma',
  teacherBio: 'Certified Cambridge English & Public Speaking Trainer with 7+ years mentoring school students.',
  teacherExpertise: 'Grade 8-10 Debate & Confidence Specialist',
  meetingLink: 'https://meet.google.com/ups-peaq-demo',
});
console.log('Teacher Assigned Result:', assignRes);

console.log('🎉 All test cases completed!');
