import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const passStrength = (password) => {
  let passStrength = 0;
  if (password.length >= 10) passStrength += 20;
  if (password.match(/[a-z]/)) passStrength += 20;
  if (password.match(/[A-Z]/)) passStrength += 20;
  if (password.match(/[0-9]/)) passStrength += 20;
  if (password.match(/[^a-zA-Z0-9]/)) passStrength += 20;

  return passStrength;
};

const getColor = (passStrength) => {
  if (passStrength === 0) return "text-black-500";
  if (passStrength <= 20) return "text-red-500";
  if (passStrength <= 40) return "text-orange-500";
  if (passStrength <= 60) return "text-yellow-500";
  if (passStrength <= 80) return "text-green-500";
  return "text-blue-500";
};

const getPassStatus = (strength) => {
    if (strength >= 100) return "Very Strong";
    if (strength >= 80) return "Strong";
    if (strength >= 60) return "Good";
    if (strength >= 40) return "Fair";
    if (strength >= 20) return "Weak";
    return "None";
  };

const PasswordStrength = ({ password }) => {
  const strength = passStrength(password);
  const colorClass = getColor(strength);
  const passStatus = getPassStatus(strength);

  return (
    <div>
        <p className={`${colorClass} font-semibold text-[14px] pb-1`}>{passStatus}</p>
        <Progress value={strength} />
    </div>
    
  );
};

export default PasswordStrength;
