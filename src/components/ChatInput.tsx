import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Wand2, ArrowRight } from "lucide-react";
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
    <div className="w-full max-w-[1071px] mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="w-full flex flex-col gap-2 transition-all duration-300"
      >
        <div 
          className={`p-4 rounded-xl bg-white transition-all duration-300 relative ${isAnalyzing ? 'opacity-70' : ''}`}
          style={{
            border: '4px solid transparent',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #3987BE 50%, #D48EA3 100%)',
          }}
        >
          <Textarea 
            ref={textareaRef} 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            placeholder="Describe your product or service idea in detail. What problem does it solve? Who is it for? What makes it unique?..." 
            disabled={isAnalyzing} 
            rows={3} 
            className="flex-1 px-4 py-3 bg-transparent placeholder-gray-500 text-[#222] text-lg min-h-[100px] max-h-[200px] resize-none border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&:not(:disabled)]:hover:border-none" 
          />
          
          <div className="flex justify-between items-center px-2 mt-2">
            <div className="text-xs text-gray-500">
              {message.length > 0 ? `${message.length} characters` : "Enter your product idea for analysis"}
            </div>
            
            <div className="flex gap-4 items-center">
              {/* Expand Button */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 52,
                  padding: 14,
                  background: '#F4F4F4',
                  marginRight: 20,
                }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`flex items-center justify-center p-0 bg-[#302D2A] text-white shadow-md ${isExpanding ? 'opacity-50' : ''}`}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 40,
                  }}
                  onClick={handleExpandPrompt}
                  disabled={isAnalyzing || isExpanding}
                >
                  <Wand2 size={24} className={isExpanding ? 'animate-pulse' : ''} />
                </Button>
              </div>

              {/* Mic Button */}
              {speechRecognitionSupported && 
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 52,
                    padding: 14,
                    background: '#F4F4F4',
                    marginRight: 20,
                  }}
                >
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className={`flex items-center justify-center p-0 bg-[#302D2A] text-white shadow-md ${isListening ? 'opacity-80' : ''}`} 
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 40,
                    }}
                    onClick={toggleSpeechRecognition} 
                    disabled={isAnalyzing}
                  >
                    {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                  </Button>
                </div>
              }
              
              {/* Analyze Button */}
              <Button 
                type="submit" 
                className="flex items-center bg-[#302D2A] text-white hover:bg-[#47423C] transition-all duration-300 disabled:bg-[#302D2A] disabled:text-white disabled:opacity-60"
                style={{
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: '24px',
                  letterSpacing: 0,
                  width: 193,
                  height: 64,
                  minWidth: 128,
                  gap: 8,
                  borderRadius: 4,
                  paddingTop: 16,
                  paddingRight: 27,
                  paddingBottom: 16,
                  paddingLeft: 27
                }}
                disabled={!message.trim() || isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : <><span>Start Analysis</span> <ArrowRight size={20} /></>}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
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
