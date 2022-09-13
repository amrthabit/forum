import { Migration } from '@mikro-orm/migrations';

export class Migration20220911232209 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" add column "is_deleted" boolean not null;');
    this.addSql('alter table "comment" alter column "parent_comment_id" type int using ("parent_comment_id"::int);');
    this.addSql('alter table "comment" alter column "parent_comment_id" drop not null;');
    this.addSql('alter table "comment" add constraint "comment_commenter_id_foreign" foreign key ("commenter_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_root_post_id_foreign" foreign key ("root_post_id") references "post" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_parent_comment_id_foreign" foreign key ("parent_comment_id") references "comment" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" drop constraint "comment_commenter_id_foreign";');
    this.addSql('alter table "comment" drop constraint "comment_root_post_id_foreign";');
    this.addSql('alter table "comment" drop constraint "comment_parent_comment_id_foreign";');

    this.addSql('alter table "comment" alter column "parent_comment_id" type int using ("parent_comment_id"::int);');
    this.addSql('alter table "comment" alter column "parent_comment_id" set not null;');
    this.addSql('alter table "comment" drop column "is_deleted";');
  }

}
