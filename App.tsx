
import React, { useState, useCallback } from 'react';
import type { CharacterImage, ImageFile, AspectRatio } from './types';
import ControlPanel from './components/ControlPanel';
import ResultsPanel from './components/ResultsPanel';
import { generateFourImages, generateOneImage } from './services/geminiService';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<(CharacterImage | null)[]>(Array(4).fill(null));
  const [background, setBackground] = useState<ImageFile | null>(null);
  const [useBackground, setUseBackground] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  const handleCharacterChange = useCallback((index: number, image: CharacterImage | null) => {
    setCharacters(prev => {
      const newChars = [...prev];
      newChars[index] = image;
      return newChars;
    });
  }, []);

  const handleBackgroundChange = useCallback((image: ImageFile | null) => {
    setBackground(image);
    if (image) {
      setUseBackground(true);
    } else {
      setUseBackground(false);
    }
  }, []);

  const handleGenerate = async () => {
    const selectedCharacters = characters.filter((c): c is CharacterImage => !!(c && c.selected));
    if (selectedCharacters.length === 0 || !prompt.trim()) {
      setError("Vui lòng tải lên và chọn ít nhất một nhân vật và nhập câu lệnh.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const characterFiles = selectedCharacters.map(c => c.file);
      const backgroundFile = background ? background.file : null;
      const images = await generateFourImages(prompt, characterFiles, backgroundFile, useBackground, aspectRatio);
      setGeneratedImages(images);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAgain = async (indexToRegenerate: number) => {
    const selectedCharacters = characters.filter((c): c is CharacterImage => !!(c && c.selected));
    if (selectedCharacters.length === 0 || !prompt.trim()) {
      setError("Cannot regenerate. Please ensure at least one character is selected and a prompt is provided.");
      return;
    }
    
    setRegeneratingIndex(indexToRegenerate);
    setError(null);

    try {
      const characterFiles = selectedCharacters.map(c => c.file);
      const backgroundFile = background ? background.file : null;
      const newImage = await generateOneImage(prompt, characterFiles, backgroundFile, useBackground, aspectRatio);
      setGeneratedImages(prevImages => {
          const newImages = [...prevImages];
          newImages[indexToRegenerate] = newImage;
          return newImages;
      });
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Failed to regenerate image. Please try again.');
    } finally {
      setRegeneratingIndex(null);
    }
  };


  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 to-gray-900">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
          THIENDANG PIXAR
        </h1>
        <p className="text-gray-400 mt-2">Tạo ảnh đồng nhất nhân vật hoạt hình với AI</p>
      </header>
      <main className="flex-grow flex flex-col lg:flex-row bg-slate-800/50 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden backdrop-blur-sm border border-slate-700/50">
        <ControlPanel
          characters={characters}
          onCharacterChange={handleCharacterChange}
          background={background}
          onBackgroundChange={handleBackgroundChange}
          useBackground={useBackground}
          setUseBackground={setUseBackground}
          prompt={prompt}
          setPrompt={setPrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          onGenerate={handleGenerate}
          isLoading={isLoading || regeneratingIndex !== null}
        />
        <ResultsPanel
          images={generatedImages}
          isLoading={isLoading}
          error={error}
          onGenerateAgain={handleGenerateAgain}
          regeneratingIndex={regeneratingIndex}
        />
      </main>
    </div>
  );
};

export default App;