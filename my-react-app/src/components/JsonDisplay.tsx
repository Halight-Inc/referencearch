import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Code, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JsonDisplayProps {
  jsonData: string;
}

export default function JsonDisplay({ jsonData }: JsonDisplayProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonData).then(() => {
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The JSON template has been copied to your clipboard",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };
  
  const handleDownloadJson = () => {
    const element = document.createElement("a");
    const file = new Blob([jsonData], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "scenario-template.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "JSON Downloaded",
      description: "Your template has been downloaded as a JSON file",
    });
  };

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 flex justify-between items-center text-white">
        <div className="flex items-center">
          <Code className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-medium">Template JSON</h3>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-0 flex items-center gap-1"
            onClick={handleDownloadJson}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-0 flex items-center gap-1"
            onClick={handleCopyJson}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      <CardContent className="p-0">
        <div className="bg-slate-900 overflow-auto text-slate-50 p-4 max-h-[500px]">
          <pre className="text-xs md:text-sm whitespace-pre font-mono">{jsonData}</pre>
        </div>
      </CardContent>
    </Card>
  );
}
