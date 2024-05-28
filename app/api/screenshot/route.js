import puppeteer from "puppeteer";
import JSZip from "jszip";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // write cors policy

    const { url } = await req.json();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const devices = [
      {
        name: "mobile",
        viewport: {
          width: 390,
          height: 844,
          isMobile: true,
          hasTouch: true,
          isLandscape: false,
        },
      },
      {
        name: "tablet",
        viewport: {
          width: 768,
          height: 1024,
          isMobile: true,
          hasTouch: true,
          isLandscape: false,
        },
      },
      {
        name: "desktop",
        viewport: {
          width: 1920,
          height: 1080,
          isMobile: false,
          hasTouch: false,
          isLandscape: true,
        },
      },
    ];

    const screenshots = [];

    for (const device of devices) {
      await page.setViewport(device.viewport);
      await page.goto(url, { waitUntil: "networkidle2" });

      let scrollPosition = 0;
      let pageHeight = await page.evaluate(() => document.body.scrollHeight);

      while (scrollPosition < pageHeight) {
        const screenshot = await page.screenshot({ encoding: "base64" });
        screenshots.push({ device: device.name, screenshot });

        await page.evaluate((viewportHeight) => {
          window.scrollBy(0, viewportHeight);
        }, device.viewport.height);

        scrollPosition += device.viewport.height;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        pageHeight = await page.evaluate(() => document.body.scrollHeight);
      }
    }

    await browser.close();

    const zip = new JSZip();
    screenshots.forEach((screenshot, index) => {
      const imgData = screenshot.screenshot.replace(
        /^data:image\/png;base64,/,
        ""
      );
      zip.file(`screenshot-${screenshot.device}-${index + 1}.png`, imgData, {
        base64: true,
      });
    });

    const zipBlob = await zip.generateAsync({ type: "nodebuffer" });

    const headers = {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=screenshots.zip",
    };

    const response = new NextResponse(zipBlob, { headers });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
export const config = {
  maxDuration: 180, // Increase the maximum execution time (in seconds)
};
