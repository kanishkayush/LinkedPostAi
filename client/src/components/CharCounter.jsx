import { LINKEDIN_MAX_CHARS } from '../utils/constants';

export default function CharCounter({ count }) {
  const percentage = (count / LINKEDIN_MAX_CHARS) * 100;
  const isWarning = percentage > 80;
  const isDanger = percentage > 95;

  const color = isDanger
    ? 'text-red-500'
    : isWarning
    ? 'text-amber-500'
    : 'text-linkedin-text-secondary';

  const barColor = isDanger
    ? 'bg-red-500'
    : isWarning
    ? 'bg-amber-500'
    : 'bg-linkedin-blue';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className={`text-xs font-semibold ${color} tabular-nums min-w-[70px] text-right`}>
        {count} / {LINKEDIN_MAX_CHARS}
      </span>
    </div>
  );
}
