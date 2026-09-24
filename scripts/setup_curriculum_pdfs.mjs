import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'C:/Users/KASHIF/.gemini/antigravity-ide/brain/b6b485c3-08ef-4a72-975f-c1ed1afe58c4/.user_uploaded';
const targetDir = 'c:/Users/KASHIF/Desktop/upspeaq_copy/public/curriculum';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. media_1790188715617.pdf -> Class 1
// 2. media_1790188715151.pdf -> Class 2
// 3. media_1790188715485.pdf -> Class 3
// 4. media_1790188715345.pdf -> Class 4
// 5. media_1790188900694.pdf -> Grade 5
// 6. media_1790188900265.pdf -> Grade 6
// 7. media_1790188900451.pdf -> Grade 7
// 8. media_1790188900620.pdf -> Grade 8

const mapping = [
  { file: 'media_1790188715617.pdf', dest: 'upspeaq-class-1-curriculum.pdf' },
  { file: 'media_1790188715151.pdf', dest: 'upspeaq-class-2-curriculum.pdf' },
  { file: 'media_1790188715485.pdf', dest: 'upspeaq-class-3-curriculum.pdf' },
  { file: 'media_1790188715345.pdf', dest: 'upspeaq-class-4-curriculum.pdf' },
  { file: 'media_1790188900694.pdf', dest: 'upspeaq-class-5-curriculum.pdf' },
  { file: 'media_1790188900265.pdf', dest: 'upspeaq-class-6-curriculum.pdf' },
  { file: 'media_1790188900451.pdf', dest: 'upspeaq-class-7-curriculum.pdf' },
  { file: 'media_1790188900620.pdf', dest: 'upspeaq-class-8-curriculum.pdf' },
  { file: 'media_1790188965717.pdf', dest: 'upspeaq-class-9-curriculum.pdf' },
  { file: 'media_1790188965737.pdf', dest: 'upspeaq-class-10-curriculum.pdf' },
];

for (const item of mapping) {
  const src = path.join(srcDir, item.file);
  const dst = path.join(targetDir, item.dest);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`Copied ${item.file} -> ${item.dest} (${fs.statSync(dst).size} bytes)`);
  } else {
    console.warn(`Source not found: ${src}`);
  }
}
