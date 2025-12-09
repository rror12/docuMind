/**
 * Simulates text extraction from a file.
 * This function now includes real PDF parsing using pdf.js.
 * @param file The file to process.
 * @returns A promise that resolves to the extracted text.
 */
const extractText = async (file: File): Promise<string> => {
  if (file.type === 'application/pdf') {
    try {
      // Dynamically import the pdf.js library from a CDN
      const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs');
      
      // The worker is needed for the library to process the PDF in the background
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // The item.str is the text content we want to extract
        const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
        fullText += pageText + '\n\n';
      }
      return `[Content from PDF: ${file.name}]\n\n${fullText.trim()}`;

    } catch (error) {
      console.error('Error parsing PDF:', error);
      return `[Error processing PDF: ${file.name}. The file might be corrupted, protected, or an issue with the parsing library.]`;
    }
  }

  // Keep existing logic for other file types (TXT is real, DOCX is mocked)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file."));
    };
    reader.onload = () => {
      if (file.type === 'text/plain') {
        resolve(reader.result as string);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Mocking DOCX extraction remains as client-side parsing is more complex
        resolve(`[Mocked text from DOCX: ${file.name}]\n\nA report on quarterly earnings shows a 15% increase in revenue, primarily driven by the new AI products division. The report also projects strong growth for the upcoming fiscal year.`);
      } else {
        // Fallback for other file types
        resolve(`[Content from unsupported file: ${file.name}]\n\nAttempting to read as text: ${reader.result as string}`);
      }
    };
    reader.readAsText(file);
  });
};


/**
 * A mock function to simulate a URL safety check.
 * In a real application, this would call a backend service with a proper safety checker.
 * @param url The URL to check.
 * @returns A promise that resolves to true if the URL is "safe".
 */
const isUrlSafe = async (url: string): Promise<boolean> => {
  console.log(`Verifying URL safety for: ${url}`);
  // Mock implementation: all URLs are considered safe for this demo.
  // A real implementation might check against a blocklist or use a service.
  return Promise.resolve(true);
};

const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})(?:&.*)?$/;


/**
 * In a real-world application, fetching a YouTube transcript would require a backend
 * service to bypass browser CORS (Cross-Origin Resource Sharing) restrictions.
 * This function simulates fetching a transcript by selecting a pre-written mock
 * transcript based on the video ID, making the demonstration feel more dynamic.
 *
 * @param videoId The YouTube video ID.
 * @returns A promise that resolves to a mock transcript string.
 */
const getMockTranscript = async (videoId: string): Promise<string> => {
  console.log(`Fetching mock transcript for video ID: ${videoId}`);
  
  const mockTranscripts = [
    {
      topic: "Tech Review",
      content: `[Mock Transcript for Tech Review Video: ${videoId}]\n\nWelcome back to the channel! Today, we're unboxing the new 'Pixel Pro 10'. The screen is absolutely stunning with a 120Hz refresh rate. In our tests, the battery lasted a full day with heavy usage, which is a huge improvement. The camera system is where this phone really shines. The new 'Magic Erase' feature works like a charm, and low-light photos are crisp and clear. Overall, if you're in the market for a high-end smartphone, the Pixel Pro 10 should be at the top of your list.`
    },
    {
      topic: "Cooking Tutorial",
      content: `[Mock Transcript for Cooking Tutorial: ${videoId}]\n\nHi everyone, and welcome to my kitchen! Today we're making a classic lasagna. First, you'll want to brown your ground beef with some onion and garlic. While that's cooking, let's prepare our ricotta mixture. Combine ricotta cheese, one egg, parmesan, and some parsley. Now it's time to layer: start with a thin layer of your meat sauce, then a layer of noodles, followed by the ricotta mixture and mozzarella. Repeat those layers and bake at 375 degrees for about 45 minutes until it's golden and bubbly. Enjoy!`
    },
    {
      topic: "Financial Advice",
      content: `[Mock Transcript for Financial Advice Video: ${videoId}]\n\nLet's talk about building a diversified investment portfolio. One of the core principles is not to put all your eggs in one basket. We recommend a mix of stocks, bonds, and real estate. For beginners, a great starting point is a low-cost index fund that tracks the S&P 500. This gives you instant diversification across 500 of the largest U.S. companies. Remember to think long-term and avoid panic selling during market downturns. Consistency is key.`
    },
    {
      topic: "Travel Vlog",
      content: `[Mock Transcript for Travel Vlog: ${videoId}]\n\nWhat's up, adventurers! We've just landed in Kyoto, Japan, during the cherry blossom season, and it is absolutely breathtaking. Our first stop was the Fushimi Inari shrine with its thousands of iconic red torii gates. It was a bit of a hike, but the views from the top were totally worth it. For lunch, we had some of the best ramen I've ever tasted at a small shop near the Nishiki Market. Tomorrow, we're heading to the Arashiyama Bamboo Grove. Make sure you subscribe so you don't miss it!`
    }
  ];

  // Simple logic to pick a transcript based on the video ID to simulate variety.
  // We'll sum the char codes of the video ID and use modulo to pick an index.
  const index = videoId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % mockTranscripts.length;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return mockTranscripts[index].content;
};


/**
 * Simulates text extraction from a URL.
 * @param url The URL to process.
 * @returns A promise that resolves to the extracted text.
 */
const extractTextFromUrl = async (url: string): Promise<string> => {
  const isSafe = await isUrlSafe(url);
  if (!isSafe) {
    // In a real app, you might want to inform the user more directly.
    return `[Skipped potentially unsafe URL: ${url}]`;
  }

  const youtubeMatch = url.match(youtubeUrlRegex);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    // In a real app, you would replace `getMockTranscript` with a call
    // to your backend service that fetches the actual transcript.
    return getMockTranscript(videoId);
  }

  // Mocking general URL content fetching
  // In a real-world scenario, this would require a backend proxy to bypass CORS issues.
  return `[Mocked content from URL: ${url}]\n\nThis web page contains an article about the latest trends in renewable energy. It highlights recent advancements in solar panel efficiency and wind turbine technology. The article concludes that sustainable energy sources are becoming increasingly cost-competitive.`;
};


/**
 * Processes arrays of files and URLs, extracts their text content, and combines them
 * into a single string to be used as context for the RAG model.
 * @param files An array of File objects.
 * @param urls An array of URL strings.
 * @returns A promise that resolves to the combined text content.
 */
export const processSourcesToText = async (files: File[], urls: string[]): Promise<string> => {
  if ((!files || files.length === 0) && (!urls || urls.length === 0)) {
    return '';
  }

  const filePromises = files ? files.map(extractText) : [];
  const urlPromises = urls ? urls.map(extractTextFromUrl) : [];
  
  const texts = await Promise.all([...filePromises, ...urlPromises]);

  // Each document's content is separated by a clear delimiter.
  return texts.join('\n\n--- DOCUMENT SEPARATOR ---\n\n');
};