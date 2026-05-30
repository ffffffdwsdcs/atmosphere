import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure the local public/uploads directory exists on disk
    await fs.mkdir(uploadDir, { recursive: true });

    const urls = [];

    for (const file of files) {
      if (typeof file === 'string') continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || '.jpg';
      const filename = `${uuidv4()}${ext}`;
      const filePath = path.join(uploadDir, filename);

      await fs.writeFile(filePath, buffer);
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ success: true, urls });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}