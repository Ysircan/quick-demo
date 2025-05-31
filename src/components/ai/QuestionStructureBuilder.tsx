// components/ai/QuestionStructureBuilder.tsx
"use client";

import { useState } from "react";
import { QuestionType, QuestionStructure } from "./type";

const typeMap: Record<QuestionType, string> = {
  choice: "选择题",
  short: "简答题",
  cloze: "填空题"
};

export default function QuestionStructureBuilder({
  structure,
  onChange
}: {
  structure: QuestionStructure[];
  onChange: (updated: QuestionStructure[]) => void;
}) {
  const [tempType, setTempType] = useState<QuestionType>("choice");
  const [tempCount, setTempCount] = useState<number>(1);

  const addStructureItem = () => {
    if (tempCount < 1) return;
    const updated = [...structure, { type: tempType, count: tempCount }];
    onChange(updated); // 把新结构传给外部
    setTempCount(1); // 清空输入
  };

  const removeStructureItem = (index: number) => {
    const updated = [...structure];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
    <select
  value={tempType}
  onChange={(e) => setTempType(e.target.value as QuestionType)}
  className="border p-2 rounded bg-white text-black"
>
  <option value="choice" className="text-black">选择题</option>
  <option value="short" className="text-black">简答题</option>
  <option value="cloze" className="text-black">填空题</option>
</select>


        <input
          type="number"
          value={tempCount}
          onChange={(e) => setTempCount(Number(e.target.value))}
          min={1}
          className="w-20 p-2 border rounded"
        />

        <button
          onClick={addStructureItem}
          className="bg-purple-100 px-3 py-1 rounded hover:bg-purple-200 text-purple-800 font-semibold"
        >
          ➕ 添加
        </button>
      </div>

      <div className="bg-gray-100 p-3 rounded text-sm">
  <h4 className="font-semibold mb-2 text-black">当前结构：</h4>
  {structure.length === 0 ? (
    <p className="text-black">还未添加任何结构</p>
  ) : (
    // ✅ 如果你有结构展示列表，这里也建议统一 text-black
    <ul className="text-black list-disc list-inside">
      {structure.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
              >
                <span>
                  {item.count} 道 {typeMap[item.type]}
                </span>
                <button
                  onClick={() => removeStructureItem(idx)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ❌ 删除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
