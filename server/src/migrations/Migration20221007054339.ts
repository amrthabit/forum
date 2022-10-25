import { Migration } from '@mikro-orm/migrations';

export class Migration20221007054339 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "clique" ("id" serial primary key, "clique_id" text not null, "description" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "status" text not null default \'open\');');
    this.addSql('alter table "clique" add constraint "clique_clique_id_unique" unique ("clique_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "clique" cascade;');
  }

}
