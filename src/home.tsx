// Calculator.tsx
import { useState } from "react";
import { DarkMode } from "./darkMode";
// import { Btn } from "./buttonsOp";
import { ButtonsGroup } from "./buttonsGroup";

type Operator = "+" | "-" | "*" | "/" | null;
export type btnsStateProps = {
  onNum: (d: string) => void;
  onDot(): void;
  onOp(op: Operator): void;
  onEq(): void;
  onAC(): void;
  onSign(): void;
  onPercent(): void;
};

export default function Calculator() {
  const [cur, setCur] = useState("0");
  const [prev, setPrev] = useState("");
  const [operator, setOperator] = useState<Operator>(null);
  const [justCalc, setJustCalc] = useState(false);

  const opSymbols: Record<string, string> = {
    "/": "÷", "*": "×", "-": "−", "+": "+",
  };

  function handleNum(d: string) {
    setCur((c) => (justCalc ? d : c === "0" ? d : c + d));
    setJustCalc(false);
  }

  function handleDot() {
    setCur((c) => {
      if (justCalc) { setJustCalc(false); return "0."; }
      return c.includes(".") ? c : c + ".";
    });
  }

  function handleOp(op: Operator) {
    setOperator(op);
    setPrev(cur);
    setJustCalc(true);
  }

  function calc(a: string, b: string, op: Operator): string {
    const n1 = parseFloat(a), n2 = parseFloat(b);
    if (op === "/") return n2 !== 0 ? String(parseFloat((n1 / n2).toFixed(10))) : "Erro";
    if (op === "*") return String(parseFloat((n1 * n2).toFixed(10)));
    if (op === "-") return String(parseFloat((n1 - n2).toFixed(10)));
    if (op === "+") return String(parseFloat((n1 + n2).toFixed(10)));
    return b;
  }

  function handleEq() {
    if (!operator || !prev) return;
    setCur(calc(prev, cur, operator));
    setPrev(""); setOperator(null); setJustCalc(true);
  }

  function handleAC() {
    setCur("0"); setPrev(""); setOperator(null); setJustCalc(false);
  }

  function handleSign() {
    setCur((c) => c.startsWith("-") ? c.slice(1) : "-" + c);
  }

  function handlePercent() {
    setCur((c) => String(parseFloat(c) / 100));
  }

  const expr = prev && operator ? `${prev} ${opSymbols[operator]}` : "";

  return (
    <div className="flex justify-center items-center min-h-screen p-8 dark:bg-[#333]">
      <DarkMode />
      <div className="bg-white rounded-2xl border p-6 w-72 dark:border-white dark:bg-[#333] shadow-[0_10px_25px_rgba(0,0,0,0.4)] dark:shadow-[0_10px_25px_rgba(255,255,255,0.05)]">
        {/* Display */}
        <div className="bg-gray-100 dark:bg-[#444444] dark:text-white rounded-xl p-4 mb-4 text-right min-h-18">
          <p className="text-gray-400 text-sm font-mono h-5">{expr}</p>
          <p className="text-3xl font-mono font-medium truncate">{cur}</p>
        </div>

        {/* Botões */}
        <ButtonsGroup 
          onNum={handleNum}
          onDot={handleDot}
          onOp={handleOp}
          onEq={handleEq}
          onAC={handleAC}
          onSign={handleSign}
          onPercent={handlePercent}
        />
      </div>
    </div>
  );
}

// Componente auxiliar de botão
export type BtnProps = {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "num" | "op" | "eq" | "danger";
  className?: string;
};

