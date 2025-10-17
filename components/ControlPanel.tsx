
import React from 'react';
import type { CharacterImage, ImageFile, AspectRatio, ImageTransform } from '../types';
import ImageUploader from './ImageUploader';

interface ControlPanelProps {
  characters: (CharacterImage | null)[];
  onCharacterChange: (index: number, image: CharacterImage | null) => void;
  background: ImageFile | null;
  onBackgroundChange: (image: ImageFile | null) => void;
  useBackground: boolean;
  setUseBackground: (use: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const aspectRatioOptions: { value: AspectRatio; label: string }[] = [
    { value: '1:1', label: '1:1 Vuông' },
    { value: '16:9', label: '16:9 Ngang' },
    { value: '9:16', label: '9:16 Dọc' },
    { value: '3:4', label: '3:4 Dọc' },
];

const ControlPanel: React.FC<ControlPanelProps> = ({
  characters,
  onCharacterChange,
  background,
  onBackgroundChange,
  useBackground,
  setUseBackground,
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isLoading
}) => {
    
    const handleCharacterUpload = (index: number) => (image: ImageFile | null) => {
        if (image) {
            onCharacterChange(index, { 
                ...image, 
                selected: true,
                transform: { scale: 1, position: { x: 0, y: 0 } }
            });
        } else {
            onCharacterChange(index, null);
        }
    };

    const handleCharacterTransformChange = (index: number, transform: ImageTransform) => {
        const char = characters[index];
        if (char) {
            onCharacterChange(index, { ...char, transform });
        }
    };

    const handleCharacterSelect = (index: number, selected: boolean) => {
        const char = characters[index];
        if (char) {
            onCharacterChange(index, {...char, selected});
        }
    }

  const isGenerateDisabled = isLoading || characters.every(c => !c || !c.selected) || !prompt.trim();

  return (
    <div className="w-full lg:w-1/3 bg-slate-800 p-6 rounded-l-2xl shadow-lg flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="flex-grow">
        <h2 className="text-xl font-bold mb-4 text-cyan-300">Bảng điều khiển</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-200">1. Nhân vật tham chiếu</h3>
          <p className="text-xs text-gray-400 mb-3 -mt-2">Mẹo: Di chuột và lăn chuột để phóng to, nhấn và kéo để di chuyển ảnh.</p>
          <div className="grid grid-cols-2 gap-4">
            {characters.map((char, index) => (
              <div key={index}>
                <ImageUploader
                  label={`Nhân vật ${index + 1}`}
                  image={char}
                  onImageChange={handleCharacterUpload(index)}
                  isTransformable={!!char}
                  transform={char?.transform}
                  onTransformChange={(newTransform) => handleCharacterTransformChange(index, newTransform)}
                />
                 {char && (
                    <div className="mt-2 flex items-center">
                        <input
                            type="checkbox"
                            id={`char-select-${index}`}
                            className="h-4 w-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-600"
                            checked={char.selected}
                            onChange={(e) => handleCharacterSelect(index, e.target.checked)}
                        />
                        <label htmlFor={`char-select-${index}`} className="ml-2 text-sm text-gray-300">Sử dụng nhân vật này</label>
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-200">2. Bối cảnh tham chiếu</h3>
          <ImageUploader
            label="Ảnh nền"
            image={background}
            onImageChange={onBackgroundChange}
          />
          {background && (
            <div className="mt-2 flex items-center">
                <input
                    type="checkbox"
                    id="bg-select"
                    className="h-4 w-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-600"
                    checked={useBackground}
                    onChange={(e) => setUseBackground(e.target.checked)}
                />
                <label htmlFor="bg-select" className="ml-2 text-sm text-gray-300">Sử dụng bối cảnh này</label>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-200">3. Câu lệnh</h3>
          <textarea
            className="w-full h-32 p-3 bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-gray-200 placeholder-gray-400"
            placeholder="Mô tả hành động, bối cảnh, hoặc bố cục bạn muốn..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-200">4. Tỷ lệ khung hình</h3>
            <div className="flex items-center gap-2 flex-wrap">
                {aspectRatioOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => setAspectRatio(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 border-2
                    ${
                        aspectRatio === option.value
                        ? 'bg-cyan-500 border-cyan-500 text-white'
                        : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500 text-gray-300'
                    }
                    `}
                >
                    {option.label}
                </button>
                ))}
            </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onGenerate}
          disabled={isGenerateDisabled}
          className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center
            ${isGenerateDisabled
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30'
            }`}
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isLoading ? 'Đang tạo ảnh...' : 'Tạo ảnh'}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
