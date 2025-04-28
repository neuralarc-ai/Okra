import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OpenRouterModel, OracleSettings } from "@/types/oracle";
import { fetchModels } from "@/services/openRouterService";
import { toast } from "sonner";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: OracleSettings;
  onSettingsChange: (settings: OracleSettings) => void;
}

const SettingsModal = ({ isOpen, onClose, settings, onSettingsChange }: SettingsModalProps) => {
  const [primaryModel, setPrimaryModel] = useState(settings.primaryModel);
  const [fallbackModel, setFallbackModel] = useState(settings.fallbackModel);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Default OpenAI models
  const defaultModels = [
    { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', description: 'Most capable GPT-4 model' },
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model for complex tasks' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient for most tasks' }
  ];

  // Load models on component mount
  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      try {
        const modelsList = await fetchModels();
        if (modelsList.length > 0) {
          setModels(modelsList);
          // toast.success("Successfully connected to OpenAI");
          
          // Only set default models if they haven't been set before
          if (!primaryModel) {
            setPrimaryModel('gpt-4-turbo-preview');
          }
          
          if (!fallbackModel) {
            setFallbackModel('gpt-3.5-turbo');
          }
        } else {
          setModels(defaultModels);
        }
      } catch (error) {
        toast.error("Error loading models");
        setModels(defaultModels);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  // Save settings
  const handleSave = () => {
    const newSettings = {
      primaryModel,
      fallbackModel
    };
    
    onSettingsChange(newSettings);
    localStorage.setItem('oracleSettings', JSON.stringify(newSettings));
    toast.success("Settings saved successfully");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-black/90 text-white border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Oracle Settings</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="primaryModel" className="text-white">Primary Model</Label>
            <ScrollArea className="h-[200px] rounded-md border border-white/10 p-2">
              <Select 
                value={primaryModel} 
                onValueChange={setPrimaryModel}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-black/50 border-white/10 text-white">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 text-white max-h-[200px]">
                  {(models.length > 0 ? models : defaultModels).map((model) => (
                    <SelectItem 
                      key={model.id} 
                      value={model.id} 
                      className="hover:bg-white/10 focus:bg-white/10 focus:text-white"
                    >
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ScrollArea>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="fallbackModel" className="text-white">Fallback Model</Label>
            <ScrollArea className="h-[200px] rounded-md border border-white/10 p-2">
              <Select 
                value={fallbackModel} 
                onValueChange={setFallbackModel}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-black/50 border-white/10 text-white">
                  <SelectValue placeholder="Select a fallback model" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 text-white max-h-[200px]">
                  {(models.length > 0 ? models : defaultModels).map((model) => (
                    <SelectItem 
                      key={model.id} 
                      value={model.id} 
                      className="hover:bg-white/10 focus:bg-white/10 focus:text-white"
                    >
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ScrollArea>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent text-white border border-white/10 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-white text-black hover:bg-gray-200"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
