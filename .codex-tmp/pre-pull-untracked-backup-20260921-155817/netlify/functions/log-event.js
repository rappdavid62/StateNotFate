const { BigQuery } = require('@google-cloud/bigquery');

// BigQuery configuration
const PROJECT_ID = "fluted-century-466523-k4";
const DATASET_ID = "snf_analytics";
const TABLE_ID = "app_events";

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const { session_id, event_type, event_data, device_info } = payload;

    if (!event_type) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'event_type is required' })
      };
    }

    // Initialize BigQuery client
    let bqOptions = { projectId: PROJECT_ID };

    // If a service account key is stored in environment variables, parse and use it
    if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
      try {
        const credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY);
        bqOptions.credentials = credentials;
      } catch (err) {
        console.error('Failed to parse GCP_SERVICE_ACCOUNT_KEY:', err);
      }
    }

    const bigquery = new BigQuery(bqOptions);

    const row = {
      event_timestamp: bigquery.timestamp(new Date()),
      session_id: session_id || null,
      event_type: event_type,
      event_data: typeof event_data === 'object' ? JSON.stringify(event_data) : event_data || null,
      device_info: device_info || event.headers['user-agent'] || 'Netlify Serverless Function'
    };

    console.log(`Inserting row into ${PROJECT_ID}.${DATASET_ID}.${TABLE_ID}:`, row);

    await bigquery
      .dataset(DATASET_ID)
      .table(TABLE_ID)
      .insert([row]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Event successfully logged to BigQuery' })
    };

  } catch (error) {
    console.error('Error logging event to BigQuery:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
    };
  }
};
