async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/health');
    console.log('Local Server Health:', await res.json());
  } catch (err) {
    console.error('Local Server Error:', err.message);
  }
}
test();
