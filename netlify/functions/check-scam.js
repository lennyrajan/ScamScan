// netlify/functions/check-scam.js
exports.handler = async function (event) {
  const data = JSON.parse(event.body || '{}');
  const message = data.message || '';

  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ verdict: "No message provided" }),
    };
  }

  if (message.toLowerCase().includes("lottery") || message.toLowerCase().includes("win money")) {
    return {
      statusCode: 200,
      body: JSON.stringify({ verdict: "Scam", reason: "Contains common scam keywords like 'lottery' or 'win money'" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ verdict: "Likely safe", reason: "No obvious scam terms found" }),
  };
};
