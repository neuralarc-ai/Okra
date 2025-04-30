import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { expandPrompt, formatExpandedPrompt } from "@/services/promptService";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isAnalyzing: boolean;
  initialMessage?: string;
}

const ChatInput = ({
  onSubmit,
  isAnalyzing,
  initialMessage = ""
}: ChatInputProps) => {
  const [message, setMessage] = useState(initialMessage);
  const [isListening, setIsListening] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if browser supports speech recognition
  const speechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Update message when initialMessage changes
  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      // Adjust textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
      }
    }
  }, [initialMessage]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isAnalyzing) {
      onSubmit(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleExpandPrompt = async () => {
    if (!message.trim()) {
      toast.error("Please enter a basic idea first");
      return;
    }

    try {
      setIsExpanding(true);
      toast.info("Expanding your idea with AI...");
      const suggestion = await expandPrompt(message.trim());
      const expandedPrompt = formatExpandedPrompt(suggestion);
      setMessage(expandedPrompt);
      toast.success("Prompt expanded with AI!");
    } catch (error) {
      console.error('Error expanding prompt:', error);
      toast.error("Failed to expand prompt with AI");
    } finally {
      setIsExpanding(false);
    }
  };
  
  const toggleSpeechRecognition = () => {
    if (!speechRecognitionSupported) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    try {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setIsListening(true);
        toast.info("Listening...");
      };
      recognition.onresult = event => {
        const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
        setMessage(transcript);
      };
      recognition.onerror = event => {
        console.error('Speech recognition error', event.error);
        toast.error(`Error: ${event.error}`);
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    } catch (error) {
      console.error('Speech recognition error', error);
      toast.error("Error starting speech recognition");
      setIsListening(false);
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl flex flex-col gap-2 transition-all duration-300 shadow-lg"
    >
      <div 
        className={`p-4 rounded-xl backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 ${
          isAnalyzing ? 'bg-black/80' : 'chat-container'
        }`}
      >
        <Textarea 
          ref={textareaRef} 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          placeholder="Describe your product or service idea in detail. What problem does it solve? Who is it for? What makes it unique?..." 
          disabled={isAnalyzing} 
          rows={3} 
          className="flex-1 px-4 py-3 bg-transparent placeholder-gray-400 text-white text-lg min-h-[100px] max-h-[200px] resize-none border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&:not(:disabled)]:hover:border-none" 
        />
        
        <div className="flex justify-between items-center px-2 mt-2">
          <div className="text-xs text-gray-400">
            {message.length > 0 ? `${message.length} characters` : "Enter your product idea for analysis"}
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={`rounded-full bg-transparent border-white/40 text-white hover:bg-white/10 ${isExpanding ? 'opacity-50' : ''}`}
              onClick={handleExpandPrompt}
              disabled={isAnalyzing || isExpanding}
            >
              <Wand2 size={18} className={isExpanding ? 'animate-pulse' : ''} />
            </Button>

            {speechRecognitionSupported && 
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className={`rounded-full ${isListening ? 'bg-white text-black' : 'bg-transparent border-white/40 text-white hover:bg-white/10'}`} 
                onClick={toggleSpeechRecognition} 
                disabled={isAnalyzing}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>
            }
            
            <Button 
              type="submit" 
              className="bg-white text-black hover:bg-gray-200 rounded-full px-6 transition-all duration-300" 
              disabled={!message.trim() || isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

// Add type declaration for WebKit speech recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default ChatInput;
