#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, Env, String, Vec,
};

#[contracterror]
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
    // Sözleşmeyi başlat
    pub fn initialize(
        env: Env,
        admin: Address,
        token_contract: Address,
        reward_amount: i128,
        token_expiry_days: u64,
    ) {
        admin.require_auth();

        let storage = env.storage().instance();

        storage.set(&DataKey::Admin, &admin);
        storage.set(&DataKey::TokenContract, &token_contract);
        storage.set(&DataKey::RewardAmount, &reward_amount);
        storage.set(&DataKey::TokenExpiry, &token_expiry_days);
        storage.set(&DataKey::TotalParticipants, &0u32);
        storage.set(&DataKey::TotalRewardsDistributed, &0i128);

        let empty_list: Vec<Address> = Vec::new(&env);
        storage.set(&DataKey::ParticipantList, &empty_list);
    }

    // Eğitime katıl
    pub fn participate(env: Env, participant: Address, comment: String) -> Result<(), Error> {
        participant.require_auth();

        if comment.len() == 0 {
            return Err(Error::InvalidComment);
        }

        let persistent_storage = env.storage().persistent();
        if persistent_storage.has(&DataKey::Participation(participant.clone())) {
            return Err(Error::AlreadyParticipated);
        }

        let instance_storage = env.storage().instance();

        let token_contract: Address = instance_storage
            .get(&DataKey::TokenContract)
            .expect("Token contract not set");
        let reward_amount: i128 = instance_storage
            .get(&DataKey::RewardAmount)
            .expect("Reward amount not set");
        let token_expiry_days: u64 = instance_storage
            .get(&DataKey::TokenExpiry)
            .expect("Token expiry not set");

        let current_time = env.ledger().timestamp();
        let expiry_time = current_time + (token_expiry_days * 24 * 60 * 60);

        let participation = ParticipationData {
            participant: participant.clone(),
            timestamp: current_time,
            comment,
            reward_amount,
            reward_claimed: false,
            expiry: expiry_time,
        };

        let token_client = token::Client::new(&env, &token_contract);

        // token_client.transfer async değil, Result dönüyor
      let res = token_client.try_transfer(
    &env.current_contract_address(),
    &participant,
    &reward_amount,
);

if res.is_err() {
    return Err(Error::TokenTransferFailed);
}


        // Katılım verisini persistent olarak kaydet
        persistent_storage.set(&DataKey::Participation(participant.clone()), &participation);

        // Katılımcı listesi instance storage'da tutuluyor
        let mut list: Vec<Address> = instance_storage
            .get(&DataKey::ParticipantList)
            .unwrap_or_else(|| Vec::new(&env));
        list.push_back(participant.clone());
        instance_storage.set(&DataKey::ParticipantList, &list);

        let total_participants: u32 = instance_storage
            .get(&DataKey::TotalParticipants)
            .unwrap_or(0);
        let total_rewards: i128 = instance_storage
            .get(&DataKey::TotalRewardsDistributed)
            .unwrap_or(0);

        instance_storage.set(&DataKey::TotalParticipants, &(total_participants + 1));
        instance_storage.set(&DataKey::TotalRewardsDistributed, &(total_rewards + reward_amount));

        Ok(())
    }

    pub fn get_participation(env: Env, participant: Address) -> Option<ParticipationData> {
        env.storage()
            .persistent()
            .get(&DataKey::Participation(participant))
    }

    pub fn get_participants(env: Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&DataKey::ParticipantList)
            .unwrap_or_else(|| Vec::new(&env))
    }

    pub fn get_total_participants(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::TotalParticipants)
            .unwrap_or(0)
    }

    pub fn get_total_rewards_distributed(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalRewardsDistributed)
            .unwrap_or(0)
    }

    pub fn update_reward_amount(
        env: Env,
        caller: Address,
        new_amount: i128,
    ) -> Result<(), Error> {
        caller.require_auth();

        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Admin not set");
        if caller != admin {
            return Err(Error::NotAuthorized);
        }

        env.storage().instance().set(&DataKey::RewardAmount, &new_amount);
        Ok(())
    }

    pub fn is_token_expired(env: Env, participant: Address) -> bool {
        if let Some(data) = Self::get_participation(env.clone(), participant) {
            let now = env.ledger().timestamp();
            now > data.expiry
        } else {
            false
        }
    }

    pub fn cleanup_expired_tokens(env: Env, caller: Address) -> Result<u32, Error> {
        caller.require_auth();

        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Admin not set");
        if caller != admin {
            return Err(Error::NotAuthorized);
        }

        let participants = Self::get_participants(env.clone());
        let persistent_storage = env.storage().persistent();
        let mut cleaned = 0;

        for participant in participants.iter() {
            if Self::is_token_expired(env.clone(), participant.clone()) {
                persistent_storage.remove(&DataKey::Participation(participant.clone()));
                cleaned += 1;
            }
        }

        Ok(cleaned)
    }
}
