
import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsModal from "./SettingsModal";
import { OracleSettings } from "@/types/oracle";

interface SettingsButtonProps {
  settings: OracleSettings;
  onSettingsChange: (settings: OracleSettings) => void;
}

const SettingsButton = ({ settings, onSettingsChange }: SettingsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button 
        variant="outline" 
        size="icon"
        className="absolute top-4 right-4 rounded-full bg-oracle-card border-oracle-highlight bg-opacity-70 hover:bg-opacity-100 transition-all"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-5 w-5 text-oracle-highlight" />
      </Button>
      
      <SettingsModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </>
  );
};

export default SettingsButton;
