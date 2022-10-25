import { Migration } from '@mikro-orm/migrations';

export class Migration20221007054552 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "clique" rename column "description" to "describtion";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "clique" rename column "describtion" to "description";');
  }

}
