use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Vote::Table)
          .if_not_exists()
          .col(text(Vote::ChatId))
          .col(text(Vote::MessageId))
          .col(integer(Vote::IsUpvoted))
          .primary_key(Index::create().col(Vote::ChatId).col(Vote::MessageId))
          .to_owned(),
      )
      .await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Vote::Table).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
enum Vote {
  Table,
  ChatId,
  MessageId,
  IsUpvoted,
}
