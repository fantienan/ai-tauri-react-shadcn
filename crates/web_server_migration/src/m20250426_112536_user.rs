use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(User::Table)
          .if_not_exists()
          .col(pk_uuid(User::Id).primary_key())
          .col(text(User::Email))
          .col(text(User::Password))
          .col(text(User::CreatedAt))
          .to_owned(),
      )
      .await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(User::Table).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
pub enum User {
  Table,
  Id,
  Email,
  Password,
  CreatedAt,
}
