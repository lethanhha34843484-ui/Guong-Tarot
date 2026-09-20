const SYSTEM = `Bạn là facilitator phản tư cho Gương Tarot. Tarot ở đây là stimulus biểu tượng để mở góc nhìn, không phải bằng chứng siêu nhiên hay lời tiên tri. Luôn giữ agency của người dùng; không đọc tâm trí người khác, không khẳng định định mệnh, không chẩn đoán sức khỏe/tâm lý. Phân biệt observation, interpretation, hypothesis và evidence. Khi có nhiều cách giải thích, nêu chúng như giả thuyết và khuyến khích kiểm chứng bằng dữ kiện thực tế.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'OPENAI_API_KEY is not configured' });
  const { input } = req.body || {};
  if (!input || typeof input !== 'string') return res.status(400).json({ error: 'input must be a non-empty string' });
  if (input.length > 20000) return res.status(413).json({ error: 'input is too long' });
  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-5.6-luna', instructions: SYSTEM, input })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'OpenAI API error' });
    const text = data.output_text || (data.output || []).flatMap(x => x.content || []).filter(x => x.type === 'output_text').map(x => x.text).join('');
    return res.status(200).json({ text, response_id: data.id, model: data.model });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
