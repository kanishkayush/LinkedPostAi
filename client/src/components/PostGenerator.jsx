import { useState } from 'react';
import { TOPICS, PROJECTS, TONES } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

export default function PostGenerator({ onGenerate, isGenerating }) {
  const [topic, setTopic] = useState('');
  const [project, setProject] = useState('none');
  const [tone, setTone] = useState('');
  const [customInput, setCustomInput] = useState('');

  const handleGenerate = () => {
    const topicLabel = TOPICS.find(t => t.id === topic)?.label || topic;
    const toneLabel = TONES.find(t => t.id === tone)?.label || tone;
    const projectLabel = PROJECTS.find(p => p.id === project)?.label || project;
    onGenerate({
      topic: topic === 'custom' ? customInput : topicLabel,
      project: projectLabel,
      tone: toneLabel,
      customInput: topic === 'custom' ? '' : customInput,
    });
  };

  const canGenerate = topic && tone && (topic !== 'custom' || customInput.trim());

  return (
    <div className="space-y-6">
      {/* Topic Selector */}
      <div>
        <p className="section-title">📌 What's your post about?</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button key={t.id} onClick={() => setTopic(t.id)}
              className={`chip ${topic === t.id ? 'chip-active' : ''}`}>
              <span className="mr-1.5">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {topic === 'custom' && (
          <textarea value={customInput} onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Describe what you want to write about..."
            className="mt-3 w-full px-4 py-3 rounded-xl border-2 border-linkedin-border bg-white
                       text-sm text-linkedin-text placeholder:text-linkedin-text-secondary
                       focus:border-linkedin-blue focus:outline-none transition-colors resize-none"
            rows={3} />
        )}
      </div>

      {/* Project Selector */}
      <div>
        <p className="section-title">🛠️ Highlight a project?</p>
        <div className="flex flex-wrap gap-2">
          {PROJECTS.map((p) => (
            <button key={p.id} onClick={() => setProject(p.id)}
              className={`chip ${project === p.id ? 'chip-active' : ''}`}>
              <span className="mr-1.5">{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selector */}
      <div>
        <p className="section-title">🎨 Tone of voice</p>
        <div className="grid grid-cols-2 gap-2">
          {TONES.map((t) => (
            <button key={t.id} onClick={() => setTone(t.id)}
              className={`relative overflow-hidden rounded-xl border-2 p-3 text-left transition-all duration-200
                         ${tone === t.id
                           ? 'border-linkedin-blue bg-gradient-to-r ' + t.color + ' text-white shadow-lg scale-[1.02]'
                           : 'border-linkedin-border bg-white hover:border-linkedin-blue hover:shadow-sm'
                         }`}>
              <span className="text-lg">{t.icon}</span>
              <p className={`text-xs font-semibold mt-1 ${tone === t.id ? 'text-white' : 'text-linkedin-text'}`}>
                {t.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button onClick={handleGenerate} disabled={!canGenerate || isGenerating}
        className="btn-primary w-full text-base py-4 flex items-center justify-center gap-3">
        {isGenerating ? (
          <><LoadingSpinner size="sm" /> Generating with Claude AI...</>
        ) : (
          <>✨ Generate Post</>
        )}
      </button>
    </div>
  );
}
