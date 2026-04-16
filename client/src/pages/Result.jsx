import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import sample_img_2 from '../assets/sample_img_2.png';
import { AppContext } from '../context/AppContext';

const Result = () => {
  const [image, setImage] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [enhancePromptToggle, setEnhancePromptToggle] = useState(true);
  const [enhancedPromptPreview, setEnhancedPromptPreview] = useState('');
  const [usedPrompt, setUsedPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [scheduling, setScheduling] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const {
    generateContent,
    enhanceUserPrompt,
    scheduleGeneratedContent,
    fetchScheduledContent,
  } = useContext(AppContext);

  const loadScheduledPosts = async () => {
    const rows = await fetchScheduledContent();
    setScheduledPosts(rows);
  };

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const startListening = () => {
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
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    setEnhancedPromptPreview('');

    let finalEnhancedPrompt = '';
    if (enhancePromptToggle) {
      const preview = await enhanceUserPrompt(input);
      if (preview) {
        finalEnhancedPrompt = preview;
        setEnhancedPromptPreview(preview);
      } else {
        setLoading(false);
        return;
      }
    }

    const response = await generateContent(
      input,
      enhancePromptToggle,
      finalEnhancedPrompt
    );
    if (response) {
      setIsImageLoaded(true);
      setImage(response.imageUrl);
      setTitle(response.title);
      setCaption(response.caption);
      setHashtags(response.hashtags);
      setEnhancedPromptPreview(response.enhancedPrompt || '');
      setUsedPrompt(response.usedPrompt || '');
    }

    setLoading(false);
  };

  const resetHandler = () => {
    setIsImageLoaded(false);
    setImage(null);
    setInput('');
    setTitle('');
    setCaption('');
    setHashtags('');
    setEnhancedPromptPreview('');
    setUsedPrompt('');
    setScheduledTime('');
  };

  const scheduleHandler = async () => {
    if (!image || !caption || !scheduledTime) return;
    setScheduling(true);

    const ok = await scheduleGeneratedContent({
      imageUrl: image,
      caption,
      hashtags,
      scheduledTime,
    });

    if (ok) {
      setScheduledTime('');
      loadScheduledPosts();
    }

    setScheduling(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center my-24 p-6 md:px-10"
    >
      <form onSubmit={onSubmitHandler} className="w-full max-w-3xl">
        {!isImageLoaded && (
          <div className="flex w-full bg-white text-zinc-900 text-sm p-0.5 mt-10 rounded-lg border border-zinc-300 shadow-sm">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Describe your vision"
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={startListening}
              disabled={isListening}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 transition flex items-center justify-center"
            >
              <Mic size={20} className={isListening ? 'text-red-500' : 'text-gray-600'} />
            </button>
            <button
              type="submit"
              className="bg-purple-700 px-10 py-3 rounded-r-lg text-white hover:bg-purple-800 transition"
            >
              Generate
            </button>
          </div>
        )}

        <label className="flex items-center gap-2 mt-4 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={enhancePromptToggle}
            onChange={(e) => setEnhancePromptToggle(e.target.checked)}
          />
          Enhance Prompt
        </label>

        {enhancedPromptPreview && (
          <div className="mt-3 bg-white border border-purple-200 rounded-lg p-3 text-sm text-zinc-700 shadow-sm">
            <p className="font-semibold text-purple-700 mb-1">Enhanced Prompt Preview</p>
            <p>{enhancedPromptPreview}</p>
          </div>
        )}
      </form>

      {loading && (
        <div className="w-full max-w-3xl mt-6 animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded mt-4"></div>
          <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
        </div>
      )}

      <div className="relative w-full max-w-3xl mt-6">
        {!isImageLoaded ? (
          <img src={sample_img_2} alt="preview" className="w-full rounded-lg" />
        ) : (
          <img src={image} alt="Generated" className="w-full rounded-lg" />
        )}
        <span
          className={`absolute bottom-0 left-0 h-1 bg-purple-700 ${
            loading ? 'w-full transition-all duration-[10s]' : 'w-0'
          }`}
        ></span>
      </div>

      {isImageLoaded && (
        <div className="w-full max-w-3xl mt-6 space-y-4">
          {enhancePromptToggle && enhancedPromptPreview && (
            <div className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs px-3 py-1 border border-emerald-300">
              Generated using enhanced prompt
            </div>
          )}
          <div className="bg-white rounded-lg border border-zinc-200 p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Title</p>
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
          <div className="bg-white rounded-lg border border-zinc-200 p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Caption</p>
            <p className="text-zinc-800">{caption}</p>
          </div>
          <div className="bg-white rounded-lg border border-zinc-200 p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Hashtags</p>
            <p className="text-purple-700">{hashtags}</p>
          </div>
          <div className="bg-white rounded-lg border border-zinc-200 p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Prompt Used For Generation</p>
            <p className="text-zinc-800">{usedPrompt || input}</p>
          </div>

          <div className="bg-white rounded-lg border border-zinc-200 p-4 shadow-sm">
            <p className="font-semibold mb-3">Schedule this post</p>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="border border-zinc-300 bg-white rounded-lg px-3 py-2 flex-1"
              />
              <button
                type="button"
                disabled={scheduling}
                onClick={scheduleHandler}
                className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
              >
                {scheduling ? 'Scheduling...' : 'Schedule Post'}
              </button>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap justify-center text-sm mt-10">
            <button
              onClick={resetHandler}
              type="button"
              className="border border-zinc-900 text-zinc-900 px-8 py-3 rounded-full cursor-pointer hover:bg-zinc-100 transition"
            >
              Generate Another
            </button>
            <a
              href={image}
              download="generated.png"
              className="bg-yellow-900 text-white px-10 py-3 rounded-full cursor-pointer hover:bg-yellow-800 transition"
            >
              <img src="/download_icon.svg" alt="Download" className="inline-block mr-2" />
              Download
            </a>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mt-12">
        <h3 className="text-xl font-semibold mb-4">Scheduled Content Dashboard</h3>
        <div className="space-y-3">
          {scheduledPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg border border-zinc-200 p-4 shadow-sm">
              <p className="text-sm text-zinc-700">{post.caption}</p>
              <p className="text-xs text-purple-700 mt-1">{post.hashtags}</p>
              <div className="flex gap-4 mt-2 text-xs text-zinc-500">
                <span>Time: {new Date(post.scheduledTime).toLocaleString()}</span>
                <span>Status: {post.status}</span>
              </div>
            </div>
          ))}
          {scheduledPosts.length === 0 && (
            <p className="text-sm text-zinc-500">No scheduled posts yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Result;