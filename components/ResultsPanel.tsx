
import React, { useState } from 'react';
import { DownloadIcon, EyeIcon, XIcon, RefreshIcon } from './icons';

interface ResultsPanelProps {
  images: string[];
  isLoading: boolean;
  error: string | null;
  onGenerateAgain: (index: number) => void;
  regeneratingIndex: number | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="w-full aspect-square bg-slate-700 rounded-lg animate-pulse"></div>
);

const ResultsPanel: React.FC<ResultsPanelProps> = ({ images, isLoading, error, onGenerateAgain, regeneratingIndex }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleDownload = (imageUrl: string, index: number) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `thien-dang-pixar-result-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center">
                    <p className="text-lg font-semibold mb-6 text-cyan-300">AI đang sáng tạo... Vui lòng chờ trong giây lát!</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </div>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center bg-red-900/20 p-8 rounded-lg">
                    <XIcon className="w-16 h-16 text-red-400 mb-4" />
                    <h3 className="text-xl font-bold text-red-400 mb-2">Đã xảy ra lỗi</h3>
                    <p className="text-red-300">{error}</p>
                </div>
            );
        }
        if (images.length > 0) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="group relative aspect-square rounded-lg overflow-hidden shadow-lg bg-slate-700">
                             {regeneratingIndex === index ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="animate-spin h-10 w-10 text-cyan-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : (
                                <>
                                    <img src={img} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover"/>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                        <button onClick={() => setPreviewImage(img)} className="bg-white/20 p-3 rounded-full text-white hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={regeneratingIndex !== null}>
                                            <EyeIcon className="w-6 h-6"/>
                                        </button>
                                        <button onClick={() => onGenerateAgain(index)} className="bg-white/20 p-3 rounded-full text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={regeneratingIndex !== null}>
                                            <RefreshIcon className="w-6 h-6"/>
                                        </button>
                                        <button onClick={() => handleDownload(img, index)} className="bg-white/20 p-3 rounded-full text-white hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={regeneratingIndex !== null}>
                                            <DownloadIcon className="w-6 h-6"/>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-48 h-48 bg-slate-700/50 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-300">Kết quả của bạn sẽ xuất hiện ở đây</h3>
                <p className="text-gray-400 mt-2">Hãy điền thông tin vào bảng điều khiển và bắt đầu sáng tạo!</p>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-2/3 p-6 h-full overflow-y-auto scrollbar-hide">
            {renderContent()}
            {previewImage && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-4xl max-h-[90vh] p-4">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-contain rounded-lg"/>
                        <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-red-500 transition-colors">
                            <XIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsPanel;