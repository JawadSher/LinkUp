import { Progress } from "@/components/ui/progress";

const passStrength = (password) => {
    const passStrength = 0;
    if(password.length >= 10) passStrength += 20;
    if(password.match(/[a-z]/)) passStrength += 20;
    if(password.match(/[A-Z]/)) passStrength += 20;
    if(password.match(/[0-0]/)) passStrength += 20;
    if(password.match(/[^a-zA-Z0-9]/)) passStrength += 20;

    return passStrength;
}

const getColor = (passStrength) => {
    if(passStrength <= 20) return "destructive";
    if(passStrength <= 40) return "orange";
    if(passStrength <= 60) return "yellow";
    if(passStrength <= 80) return "green";

    return "blue"
}

const PasswordStrength = ({password}) => {
    const strength = passStrength(password);
    const color = getColor(strength);

  return (
    <Progress value={strength} className={`${color}`}/>
  )
}

export default PasswordStrength