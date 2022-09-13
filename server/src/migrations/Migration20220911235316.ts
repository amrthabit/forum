import { Migration } from '@mikro-orm/migrations';

export class Migration20220911235316 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" drop constraint "comment_commenter_id_foreign";');
    this.addSql('alter table "comment" drop constraint "comment_root_post_id_foreign";');
    this.addSql('alter table "comment" drop constraint "comment_parent_comment_id_foreign";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" add constraint "comment_commenter_id_foreign" foreign key ("commenter_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_root_post_id_foreign" foreign key ("root_post_id") references "post" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_parent_comment_id_foreign" foreign key ("parent_comment_id") references "comment" ("id") on update cascade on delete set null;');
  }

}
