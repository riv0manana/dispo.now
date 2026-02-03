import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "../atoms/Button";

interface ApiKeyDisplayProps {
  apiKey?: string;
}

export function ApiKeyDisplay({ apiKey }: ApiKeyDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md">
      <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">API Key</span>
      <code className="text-sm text-zinc-300 font-mono">
        {apiKey === "sk_live_demo_key" ? "Hidden (Only shown on create)" : apiKey}
      </code>
      <Button 
        variant="icon"
        onClick={handleCopy}
        title="Copy API Key"
        className="ml-2"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </Button>
    </div>
  );
}
