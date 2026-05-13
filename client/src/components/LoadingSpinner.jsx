export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-[3px] border-linkedin-border`} />
        <div
          className={`${sizes[size]} rounded-full border-[3px] border-transparent border-t-linkedin-blue 
                      absolute top-0 left-0 animate-spin`}
        />
      </div>
      {text && (
        <p className="text-sm text-linkedin-text-secondary font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
}
