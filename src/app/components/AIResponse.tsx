interface AIResponseProps {
  title: string;
  content: string;
}

export function AIResponse({ title, content }: AIResponseProps) {
  // Convert markdown-like formatting to HTML
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/(\d+\.\s)/g, '<br>$1');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border-l-8 border-[#2d5016]">
      <div className="flex items-center gap-3 mb-4 text-[#2d5016] text-2xl font-semibold">
        <span>🤖</span>
        <span>{title}</span>
      </div>
      <div
        className="text-lg leading-relaxed text-gray-800 prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: `<p>${formatContent(content)}</p>` }}
      />
    </div>
  );
}
