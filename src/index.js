const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

async function extractTableData(imageUrl) {
  try {
    const [result] = await client.textDetection(imageUrl);
    const { textAnnotations } = result;

    if (!textAnnotations || textAnnotations.length === 0) {
      throw new Error('No text detected');
    }

    // Parse the text annotations into a JSON object
    const jsonData = textAnnotations.reduce((acc, text, index) => {
      if (index === 0) {
        // Skip the first element as it contains the entire text
        return acc;
      }
      const [key, value] = text.description.split(':');
      if (key && value) {
        acc[key.trim()] = value.trim();
      } else {
        acc[`line${index}`] = text.description.trim();
      }
      return acc;
    }, {});

    return jsonData;
  } catch (error) {
    console.error('Error extracting table data:', error);
    return null;
  }
}

// Usage example
const imageUrl = './src/lab-results.png';
extractTableData(imageUrl)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
