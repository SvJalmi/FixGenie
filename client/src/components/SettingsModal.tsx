import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Settings, Volume2, Palette, Code, Zap, Save, RotateCcw } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  // Settings state
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [autoAnalysis, setAutoAnalysis] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState([1.0]);
  const [volume, setVolume] = useState([80]);
  const [theme, setTheme] = useState("dark");
  const [codeFont, setCodeFont] = useState("Monaco");
  const [fontSize, setFontSize] = useState([14]);
  const [errorSeverity, setErrorSeverity] = useState("medium");
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved:", {
      ttsEnabled,
      autoAnalysis,
      speechSpeed: speechSpeed[0],
      volume: volume[0],
      theme,
      codeFont,
      fontSize: fontSize[0],
      errorSeverity,
      notifications,
    });
    onClose();
  };

  const handleReset = () => {
    setTtsEnabled(true);
    setAutoAnalysis(false);
    setSpeechSpeed([1.0]);
    setVolume([80]);
    setTheme("dark");
    setCodeFont("Monaco");
    setFontSize([14]);
    setErrorSeverity("medium");
    setNotifications(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-dark-elevated border border-blue-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-text-primary">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            FixGenie Settings
            <Badge variant="secondary" className="bg-accent-blue/20 text-accent-blue">
              Advanced Configuration
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Customize your FixGenie experience with advanced AI-powered settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="audio" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-dark border border-blue-500/20">
            <TabsTrigger value="audio" className="data-[state=active]:bg-gradient-primary">
              <Volume2 className="w-4 h-4 mr-2" />
              Audio & TTS
            </TabsTrigger>
            <TabsTrigger value="editor" className="data-[state=active]:bg-gradient-primary">
              <Code className="w-4 h-4 mr-2" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-gradient-primary">
              <Zap className="w-4 h-4 mr-2" />
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-gradient-primary">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* Audio & TTS Settings */}
          <TabsContent value="audio" className="space-y-6">
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium text-text-primary">Enable Text-to-Speech</Label>
                  <p className="text-sm text-text-secondary">
                    Allow FixGenie to read error explanations and code suggestions aloud
                  </p>
                </div>
                <Switch
                  checked={ttsEnabled}
                  onCheckedChange={setTtsEnabled}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium text-text-primary">Speech Speed</Label>
                <div className="px-4">
                  <Slider
                    value={speechSpeed}
                    onValueChange={setSpeechSpeed}
                    max={2.0}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-text-secondary mt-2">
                    <span>Slow (0.5x)</span>
                    <span className="font-medium text-accent-blue">{speechSpeed[0].toFixed(1)}x</span>
                    <span>Fast (2.0x)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium text-text-primary">Audio Volume</Label>
                <div className="px-4">
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-text-secondary mt-2">
                    <span>Mute</span>
                    <span className="font-medium text-accent-blue">{volume[0]}%</span>
                    <span>Max</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Code Editor Settings */}
          <TabsContent value="editor" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium text-text-primary">Font Family</Label>
                <Select value={codeFont} onValueChange={setCodeFont}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monaco">Monaco</SelectItem>
                    <SelectItem value="Consolas">Consolas</SelectItem>
                    <SelectItem value="Source Code Pro">Source Code Pro</SelectItem>
                    <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                    <SelectItem value="Fira Code">Fira Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium text-text-primary">Font Size</Label>
                <div className="px-4">
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    max={24}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-text-secondary mt-2">
                    <span>Small (10px)</span>
                    <span className="font-medium text-accent-blue">{fontSize[0]}px</span>
                    <span>Large (24px)</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AI Analysis Settings */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium text-text-primary">Auto Analysis</Label>
                  <p className="text-sm text-text-secondary">
                    Automatically analyze code as you type (with 2-second delay)
                  </p>
                </div>
                <Switch
                  checked={autoAnalysis}
                  onCheckedChange={setAutoAnalysis}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium text-text-primary">Error Detection Sensitivity</Label>
                <Select value={errorSeverity} onValueChange={setErrorSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Only critical errors</SelectItem>
                    <SelectItem value="medium">Medium - Errors and warnings</SelectItem>
                    <SelectItem value="high">High - All issues including style</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium text-text-primary">Push Notifications</Label>
                  <p className="text-sm text-text-secondary">
                    Get notified when analysis completes or errors are found
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium text-text-primary">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                    <SelectItem value="light">Light Mode</SelectItem>
                    <SelectItem value="auto">System Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2 border-dark-border text-text-secondary hover:bg-dark-elevated"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-primary hover:opacity-90 text-white flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}