#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, Map, String, Symbol, Vec,
};

// Hata türleri
#[contracttype]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyParticipated = 1,
    InvalidComment = 2,
    TokenTransferFailed = 3,
    NotAuthorized = 4,
    ParticipationNotFound = 5,
    TokenExpired = 6,
}

// Katılım verisi
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ParticipationData {
    pub participant: Address,
    pub timestamp: u64,
    pub comment: String,
    pub reward_amount: i128,
    pub reward_claimed: bool,
    pub expiry: u64,
}

// Storage anahtarları
#[contracttype]
pub enum DataKey {
    Admin,
    TokenContract,
    RewardAmount,
    TokenExpiry,
    Participation(Address),
    ParticipantList,
    TotalParticipants,
    TotalRewardsDistributed,
}

#[contract]
pub struct EducationRewardContract;

#[contractimpl]
impl EducationRewardContract {
    
    /// Sözleşmeyi başlat
    pub fn initialize(
        env: Env,
        admin: Address,
        token_contract: Address,
        reward_amount: i128,
        token_expiry_days: u64,
    ) {
        // Admin yetkisini kontrol et
        admin.require_auth();
        
        // Storage'a kaydet
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TokenContract, &token_contract);
        env.storage().instance().set(&DataKey::RewardAmount, &reward_amount);
        env.storage().instance().set(&DataKey::TokenExpiry, &token_expiry_days);
        env.storage().instance().set(&DataKey::TotalParticipants, &0u32);
        env.storage().instance().set(&DataKey::TotalRewardsDistributed, &0i128);
        
        // Boş katılımcı listesi
        let empty_list: Vec<Address> = Vec::new(&env);
        env.storage().instance().set(&DataKey::ParticipantList, &empty_list);
    }

    /// Eğitime katılımı kaydet ve ödül ver
    pub fn participate(env: Env, participant: Address, comment: String) -> Result<(), Error> {
        // Katılımcı yetkisini kontrol et
        participant.require_auth();
        
        // Yorum kontrolü
        if comment.len() == 0 