import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.formData();
    const uploadedFiles = formData.getAll("FILE");

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return new NextResponse("No File Found", { status: 404 });
    }

    const results: Array<{ id: string; originalName: string; text: string }> = [];

    for (const uploaded of uploadedFiles) {
      if (!(uploaded instanceof File)) {
        continue;
      }

      const fileId = uuidv4();
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, `${fileId}.pdf`);

      const fileBuffer = new Uint8Array(await uploaded.arrayBuffer());
      await fs.writeFile(tempFilePath, fileBuffer);

      const parsedText: string = await new Promise<string>((resolve, reject) => {
        const pdfParser = new (PDFParser as any)(null, 1);

        pdfParser.on("pdfParser_dataReady", () => {
          try {
            resolve((pdfParser as any).getRawTextContent());
          } catch (e) {
            reject(e);
          }
        });

        pdfParser.on("pdfParser_dataError", (errData: any) => {
          reject(errData?.parserError ?? new Error("PDF parsing failed"));
        });

        pdfParser.loadPDF(tempFilePath);
      }).finally(async () => {
        try {
          await fs.unlink(tempFilePath);
        } catch {
          // ignore cleanup failures
        }
      });

      results.push({ id: fileId, originalName: uploaded.name, text: parsedText });
    }

    // Preserve backward compatibility: if exactly one file uploaded, return plain text
    if (results.length === 1) {
      const [{ id, text }] = results;
      const response = new NextResponse(text);
      response.headers.set("FileName", id);
      return response;
    }

    // Multiple files: return JSON array with id, originalName, and text
    return NextResponse.json(results);
  } catch (error: any) {
    return new NextResponse(error?.message || "Upload Failed", { status: 500 });
  }
}