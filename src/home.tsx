// Calculator.tsx
import { useState } from "react";
import { DarkMode } from "./darkMode";

type Operator = "+" | "-" | "*" | "/" | null;

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
        <div className="grid grid-cols-4 gap-2">
          <Btn onClick={handleAC} variant="danger">AC</Btn>
          <Btn onClick={handleSign} variant="op">+/-</Btn>
          <Btn onClick={handlePercent} variant="op">%</Btn>
          <Btn onClick={() => handleOp("/")} variant="op">÷</Btn>

          {["7","8","9"].map(n => <Btn key={n} onClick={() => handleNum(n)}>{n}</Btn>)}
          <Btn onClick={() => handleOp("*")} variant="op">×</Btn>

          {["4","5","6"].map(n => <Btn key={n} onClick={() => handleNum(n)}>{n}</Btn>)}
          <Btn onClick={() => handleOp("-")} variant="op">−</Btn>

          {["1","2","3"].map(n => <Btn key={n} onClick={() => handleNum(n)}>{n}</Btn>)}
          <Btn onClick={() => handleOp("+")} variant="op">+</Btn>

          <Btn onClick={() => handleNum("0")} className="col-span-2">0</Btn>
          <Btn onClick={handleDot}>.</Btn>
          <Btn onClick={handleEq} variant="eq">=</Btn>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar de botão
type BtnProps = {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "num" | "op" | "eq" | "danger";
  className?: string;
};

function Btn({ onClick, children, variant = "num", className = "" }: BtnProps) {
  const styles: Record<string, string> = {
    num: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-[#555] dark:text-white dark:hover:bg-[#666]",
    op: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-[#444] dark:text-white dark:hover:bg-[#555]",
    eq: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-[#444] dark:text-white dark:hover:bg-[#555]",
    danger: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-[#222] dark:text-white dark:hover:bg-[#555]",
  };

  return (
    <button
      onClick={onClick}
      className={`h-14 cursor-pointer hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-[.3s_transform,background-color] rounded-xl font-medium text-base active:scale-95 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}