import { Migration } from '@mikro-orm/migrations';

export class Migration20220828144837 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" drop column "upvoters";');
    this.addSql('alter table "post" drop column "downvoters";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" add column "upvoters" text[] not null, add column "downvoters" text[] not null;');
  }

}
