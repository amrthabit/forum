import { Migration } from '@mikro-orm/migrations';

export class Migration20221006051540 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" add column "post_clique" text not null default \'forum\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" drop column "post_clique";');
  }

}
