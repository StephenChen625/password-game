import React, { useState } from 'react';
import { X, Circle, Check } from 'lucide-react';

const PasswordSolver = () => {
  const [markedCards, setMarkedCards] = useState({});
  const [userGuess, setUserGuess] = useState(['', '', '']);
  const [digitStatus, setDigitStatus] = useState([null, null, null]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [markMode, setMarkMode] = useState('exclude');

  const answer = [9, 8, 6];

  const clues = [
    { numbers: [2, 4, 6], hint: "1个号码正确，位置正确" },
    { numbers: [2, 5, 8], hint: "1个号码正确，位置不正确" },
    { numbers: [6, 9, 2], hint: "2个号码正确，位置都不正确" },
    { numbers: [1, 7, 4], hint: "没有一个号码正确" },
    { numbers: [4, 1, 9], hint: "1个号码正确，位置不正确" }
  ];

  const handleGuessChange = (index, value) => {
    if (value.length > 1) return;
    
    const newGuess = [...userGuess];
    newGuess[index] = value;
    setUserGuess(newGuess);
    
    if (value !== '') {
      const isCorrect = parseInt(value) === answer[index];
      const newDigitStatus = [...digitStatus];
      newDigitStatus[index] = isCorrect ? 'correct' : 'wrong';
      setDigitStatus(newDigitStatus);

      if (newGuess.every((g, i) => g !== '' && parseInt(g) === answer[i])) {
        setShowCongrats(true);
      } else {
        setShowCongrats(false);
      }
    } else {
      const newDigitStatus = [...digitStatus];
      newDigitStatus[index] = null;
      setDigitStatus(newDigitStatus);
      setShowCongrats(false);
    }
  };

  const NumberCell = ({ num }) => {
    const mark = markedCards[num];
    return (
      <div 
        onClick={() => handleNumberMark(num)}
        className={`
          w-12 h-12 flex items-center justify-center border rounded-lg
          relative cursor-pointer transition-colors
          ${mark?.status === 'excluded' ? 'bg-red-50' : ''}
          ${mark?.status === 'correct' ? 'bg-green-50' : ''}
          hover:bg-gray-50
        `}
      >
        <span className="text-xl">{num}</span>
        {mark?.status === 'excluded' && (
          <X className="absolute text-red-500 w-full h-full p-2 pointer-events-none" />
        )}
        {mark?.status === 'correct' && (
          <Circle className="absolute text-green-500 w-full h-full p-2 pointer-events-none" />
        )}
      </div>
    );
  };

  const handleNumberMark = (num) => {
    setMarkedCards(prev => {
      const current = prev[num]?.status;
      let newStatus;
      
      if (markMode === 'exclude') {
        newStatus = current === 'excluded' ? null : 'excluded';
      } else {
        newStatus = current === 'correct' ? null : 'correct';
      }
      
      return {
        ...prev,
        [num]: { status: newStatus }
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">密码破解练习</h1>
      
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setMarkMode('exclude')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2
            ${markMode === 'exclude' ? 'bg-red-100' : 'bg-gray-100'}`}
        >
          <X className="w-4 h-4" />
          排除模式
        </button>
        <button
          onClick={() => setMarkMode('correct')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2
            ${markMode === 'correct' ? 'bg-green-100' : 'bg-gray-100'}`}
        >
          <Circle className="w-4 h-4" />
          正确标记
        </button>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">已知线索：</h2>
        {clues.map((clue, index) => (
          <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-2 mr-4">
              {clue.numbers.map((num, i) => (
                <NumberCell key={i} num={num} />
              ))}
            </div>
            <span className="flex-1">{clue.hint}</span>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">输入答案：</h2>
        <div className="flex gap-4 mb-4">
          {[0, 1, 2].map(index => (
            <div key={index} className="relative">
              <input
                type="number"
                min="1"
                max="9"
                value={userGuess[index]}
                onChange={(e) => handleGuessChange(index, e.target.value)}
                className={`
                  w-16 h-16 text-2xl text-center border rounded-lg
                  ${digitStatus[index] === 'correct' ? 'border-green-500 bg-green-50' : ''}
                  ${digitStatus[index] === 'wrong' ? 'border-red-500 bg-red-50' : ''}
                `}
              />
              {digitStatus[index] && (
                <div className="absolute -right-2 -top-2">
                  {digitStatus[index] === 'correct' ? (
                    <Check className="w-6 h-6 text-green-500 bg-white rounded-full" />
                  ) : (
                    <X className="w-6 h-6 text-red-500 bg-white rounded-full" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {showCongrats && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
            <Check className="w-5 h-5 inline-block mr-2" />
            恭喜！你成功破解了密码！
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">使用说明：</h2>
        <ul className="list-disc ml-5">
          <li className="mb-2">点击上方按钮切换标记模式</li>
          <li className="mb-2">点击数字可以标记/取消标记</li>
          <li className="mb-2">×表示已排除，○表示可能正确</li>
          <li className="mb-2">输入答案时会立即得到每个数字的正确性反馈</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordSolver;
