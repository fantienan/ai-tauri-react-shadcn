pub use sea_orm_migration::prelude::*;

mod m20250426_092940_daily_summary;
mod m20250426_093200_chat;
mod m20250426_102845_message;
mod m20250426_103442_order_product_details;
mod m20250426_112536_user;
mod m20250426_113943_vote;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250426_092940_daily_summary::Migration),
            Box::new(m20250426_093200_chat::Migration),
            Box::new(m20250426_102845_message::Migration),
            Box::new(m20250426_103442_order_product_details::Migration),
            Box::new(m20250426_112536_user::Migration),
            Box::new(m20250426_113943_vote::Migration),
        ]
    }
}
