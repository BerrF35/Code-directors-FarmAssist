interface LoadingSpinnerProps {
  message: string;
}

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="text-center p-8">
      <div className="inline-block w-16 h-16 border-4 border-gray-300 border-t-[#2d5016] rounded-full animate-spin mb-4"></div>
      <p className="text-xl text-gray-600">{message}</p>
    </div>
  );
}
