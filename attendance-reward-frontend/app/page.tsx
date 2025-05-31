"use client";

import React, { useEffect, useState } from "react";
import freighterApi from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

interface ParticipationData {
  address: string;
  timestamp: number;
  comment: string;
  rewardClaimed: boolean;
}

export default function Home() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [participationStatus, setParticipationStatus] = useState<'not-participated' | 'participated' | 'reward-claimed'>('not-participated');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(100);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [participationHistory, setParticipationHistory] = useState<ParticipationData[]>([]);

  // Sayfa yüklendiğinde cüzdan bağlı mı kontrol et
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const connected = await freighterApi.isConnected();
        if (connected) {
          const { address } = await freighterApi.getAddress();
          setPublicKey(address);
          await checkParticipationStatus(address);
        }
      } catch (error) {
        console.error("Error checking Freighter connection:", error);
      }
    };

    checkFreighter();
  }, []);

  // Katılım durumunu kontrol et
  const checkParticipationStatus = async (address: string) => {
    try {
      // Bu kısım gerçek smart contract ile entegre edilecek
      // Şimdilik mock data kullanıyoruz
      const mockParticipation = localStorage.getItem(`participation_${address}`);
      if (mockParticipation) {
        const data = JSON.parse(mockParticipation);
        setParticipationStatus(data.rewardClaimed ? 'reward-claimed' : 'participated');
        setComment(data.comment || '');
      }
    } catch (error) {
      console.error("Error checking participation status:", error);
    }
  };

  // Cüzdan bağlantısı
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setErrorMessage('');
    
    try {
      await freighterApi.setAllowed();
      const { address } = await freighterApi.getAddress();
      setPublicKey(address);
      await checkParticipationStatus(address);
      setSuccessMessage('Cüzdan başarıyla bağlandı!');
    } catch (error) {
      console.error("Error connecting to Freighter:", error);
      setErrorMessage('Cüzdan bağlanırken hata oluştu. Freighter cüzdanınızın yüklü olduğundan emin olun.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Katılımı kaydet ve ödül ver
  const handleParticipation = async () => {
    if (!publicKey || !comment.trim()) {
      setErrorMessage('Lütfen yorum alanını doldurun.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Mock participation data
      const participationData: ParticipationData = {
        address: publicKey,
        timestamp: Date.now(),
        comment: comment.trim(),
        rewardClaimed: true
      };

      // Yerel depolama (gerçek uygulamada smart contract kullanılacak)
      localStorage.setItem(`participation_${publicKey}`, JSON.stringify(participationData));
      
      // Katılım geçmişine ekle
      const history = JSON.parse(localStorage.getItem('participation_history') || '[]');
      history.push(participationData);
      localStorage.setItem('participation_history', JSON.stringify(history));

      setParticipationStatus('reward-claimed');
      setSuccessMessage(`Tebrikler! ${rewardAmount} EDU token hesabınıza aktarıldı.`);
      
      // Yorum alanını temizle
      setComment('');
      
    } catch (error) {
      console.error("Error processing participation:", error);
      setErrorMessage('Katılım kaydedilirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cüzdan bağlantısını kes
  const handleDisconnectWallet = () => {
    setPublicKey(null);
    setParticipationStatus('not-participated');
    setComment('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">
          Eğitim Katılım Ödül Sistemi
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Eğitim etkinliklerine katılın, otomatik olarak ödül tokenlarınızı alın ve 
          deneyimlerinizi paylaşın.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">🎓</div>
          <h3 className="text-lg font-semibold text-white mb-2">Eğitim Katılımı</h3>
          <p className="text-gray-300 text-sm">
            Etkinliklere katılın ve otomatik ödül alın
          </p>
        </div>
        
        <div className="glass-effect rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">🪙</div>
          <h3 className="text-lg font-semibold text-white mb-2">EDU Token</h3>
          <p className="text-gray-300 text-sm">
            Her katılım için {rewardAmount} token kazanın
          </p>
        </div>
        
        <div className="glass-effect rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">💬</div>
          <h3 className="text-lg font-semibold text-white mb-2">Geri Bildirim</h3>
          <p className="text-gray-300 text-sm">
            Deneyimlerinizi paylaşın ve sistemi geliştirin
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="glass-effect rounded-2xl p-8 space-y-6">
        {/* Error & Success Messages */}
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 animate-slide-up">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-200 animate-slide-up">
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Wallet Connection Section */}
        {!publicKey ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Cüzdanınızı Bağlayın</h2>
            <p className="text-gray-300">
              Katılım kaydınızı tamamlamak için önce Freighter cüzdanınızı bağlamanız gerekiyor.
            </p>
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="stellar-gradient hover:opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Bağlanıyor<span className="loading-dots"></span></span>
                </span>
              ) : (
                "Freighter Cüzdanını Bağla"
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Connected Wallet Info */}
            <div className="bg-stellar-900/30 rounded-xl p-4 border border-stellar-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Bağlı Cüzdan</h3>
                  <p className="text-gray-300 text-sm font-mono">
                    {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={handleDisconnectWallet}
                  className="text-gray-400 hover:text-red-400 text-sm transition-colors"
                >
                  Bağlantıyı Kes
                </button>
              </div>
            </div>

            {/* Participation Status */}
            {participationStatus === 'not-participated' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Katılım Kaydı</h2>
                <p className="text-gray-300">
                  Eğitim etkinliğine katılımınızı kaydettirin ve otomatik olarak ödül tokenınızı alın.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Katılım Yorumu / Geri Bildirim
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Eğitim hakkındaki düşüncelerinizi, öğrendiklerinizi veya önerilerinizi paylaşın..."
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-stellar-500 focus:outline-none focus:ring-2 focus:ring-stellar-500/50 resize-none"
                      rows={4}
                      maxLength={500}
                    />
                    <div className="text-right text-gray-400 text-sm mt-1">
                      {comment.length}/500
                    </div>
                  </div>

                  <button
                    onClick={handleParticipation}
                    disabled={isSubmitting || !comment.trim()}
                    className="w-full stellar-gradient hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>İşleniyor<span className="loading-dots"></span></span>
                      </span>
                    ) : (
                      `Katılımı Kaydet ve ${rewardAmount} EDU Token Al`
                    )}
                  </button>
                </div>
              </div>
            )}

            {participationStatus === 'participated' && (
              <div className="text-center space-y-4">
                <div className="text-6xl">⏳</div>
                <h2 className="text-2xl font-bold text-white">Katılım Kaydedildi</h2>
                <p className="text-gray-300">
                  Katılımınız başarıyla kaydedildi. Ödül tokenınız yakında hesabınıza aktarılacak.
                </p>
              </div>
            )}

            {participationStatus === 'reward-claimed' && (
              <div className="text-center space-y-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-white">Ödül Alındı!</h2>
                <p className="text-gray-300">
                  Tebrikler! {rewardAmount} EDU token hesabınıza başarıyla aktarıldı.
                </p>
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 max-w-md mx-auto">
                  <div className="text-green-200 font-semibold">
                    ✅ Katılım Tamamlandı
                  </div>
                  <div className="text-green-300 text-sm mt-1">
                    Bir sonraki eğitim etkinliği için bizi takip edin!
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">💡 Nasıl Çalışır?</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-stellar-400 mt-1">•</span>
              <span>Freighter cüzdanınızı bağlayın</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-stellar-400 mt-1">•</span>
              <span>Eğitim deneyiminizi paylaşın</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-stellar-400 mt-1">•</span>
              <span>Otomatik olarak EDU token alın</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-stellar-400 mt-1">•</span>
              <span>Tokenlarınız cüzdanınızda görünür</span>
            </li>
          </ul>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">🔒 Güvenlik</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-stellar-400 mt-1">•</span>
              <span>Stellar ağında güvenli işlemler</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-stellar-400 mt-1">•</span>
              <span>Kişisel verileriniz korunur</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-stellar-400 mt-1">•</span>
              <span>Şeffaf akıllı sözleşmeler</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-stellar-400 mt-1">•</span>
              <span>Merkezi olmayan yapı</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}