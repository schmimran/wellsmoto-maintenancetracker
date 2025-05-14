
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ToggleSwitchProps = {
  id: string;
  label: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
};

const ToggleSwitch = ({ id, label, isChecked, onChange }: ToggleSwitchProps) => {
  return (
    <div className="flex items-center justify-between py-4">
      <Label htmlFor={id} className="text-base font-normal">
        {label}
      </Label>
      <Switch
        id={id}
        checked={isChecked}
        onCheckedChange={onChange}
        className={isChecked ? "bg-wells-green" : ""}
      />
    </div>
  );
};

export default ToggleSwitch;
