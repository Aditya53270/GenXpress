import React, { useContext, useState } from 'react';
import { Mic } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const TextStudio = () => {
  const { generateTextDraft } = useContext(AppContext);
  const [form, setForm] = useState({
    type: 'email',
    topic: '',
    tone: 'professional',
    recipient: '',
    keyPoints: '',
  });
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [isListening, setIsListening] = useState(false);

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const startListening = (field) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(field, transcript);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await generateTextDraft(form);
    setDraft(result || '');
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-20">
      <h1 className="text-3xl font-bold text-zinc-900">Text Studio</h1>
      <p className="text-zinc-600 mt-2">
        Generate ready-to-use Email, Speech, Notice, and Application drafts.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <form onSubmit={onSubmit} className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">Content Type</label>
            <select
              value={form.type}
              onChange={(e) => onChange('type', e.target.value)}
              className="mt-1 w-full border border-zinc-300 rounded-lg px-3 py-2"
            >
              <option value="email">Email</option>
              <option value="speech">Speech</option>
              <option value="notice">Notice</option>
              <option value="application">Application</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Topic</label>
            <div className="mt-1 flex border border-zinc-300 rounded-lg">
              <input
                value={form.topic}
                onChange={(e) => onChange('topic', e.target.value)}
                placeholder="e.g. Leave request for 2 days"
                className="flex-1 px-3 py-2 rounded-l-lg focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => startListening('topic')}
                disabled={isListening}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 transition flex items-center justify-center rounded-r-lg"
              >
                <Mic size={20} className={isListening ? 'text-red-500' : 'text-gray-600'} />
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Tone</label>
            <input
              value={form.tone}
              onChange={(e) => onChange('tone', e.target.value)}
              placeholder="professional, polite, friendly..."
              className="mt-1 w-full border border-zinc-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Recipient / Audience</label>
            <input
              value={form.recipient}
              onChange={(e) => onChange('recipient', e.target.value)}
              placeholder="e.g. Principal, Team Lead, Students"
              className="mt-1 w-full border border-zinc-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Key Points</label>
            <textarea
              value={form.keyPoints}
              onChange={(e) => onChange('keyPoints', e.target.value)}
              placeholder="Write each point on a new line"
              rows={5}
              className="mt-1 w-full border border-zinc-300 rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 text-white rounded-lg py-2.5 hover:bg-purple-800"
          >
            {loading ? 'Generating...' : 'Generate Draft'}
          </button>
        </form>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-zinc-900">Generated Draft</h2>
            {draft && (
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(draft)}
                className="text-sm bg-zinc-900 text-white px-3 py-1 rounded-md"
              >
                Copy
              </button>
            )}
          </div>
          <textarea
            value={draft}
            readOnly
            placeholder="Your generated text will appear here..."
            rows={18}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-zinc-700"
          />
        </div>
      </div>
    </div>
  );
};

export default TextStudio;
