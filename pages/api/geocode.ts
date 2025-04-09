// pages/api/geocode.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lng } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!lat || !lng || !apiKey) {
    return res.status(400).json({ error: 'Missing lat, lng or API key' });
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: 'No results found' });
    }

    const locationName = data.results[0].formatted_address;
    return res.status(200).json({ name: locationName });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch location name' });
  }
}
