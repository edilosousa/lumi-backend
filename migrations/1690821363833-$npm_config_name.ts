import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1690821363833 implements MigrationInterface {
    name = ' $npmConfigName1690821363833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tblfatura" ("idfatura" SERIAL NOT NULL, "uccliente" integer NOT NULL, "mesfatura" character varying NOT NULL, "datavencimentofatura" date NOT NULL, "valorenergiaeletricafatura" numeric NOT NULL, "qtdkwhenergiaeletricafatura" integer NOT NULL, "precounitenergiaeletricafatura" numeric NOT NULL, "valorenergiainjetadafatura" numeric NOT NULL, "qtdkwhenergiainjetadafatura" integer NOT NULL, "precounitenergiainjetadafatura" numeric NOT NULL, "valorenergiacompensadafatura" numeric NOT NULL, "qtdkwhenergiacompensadafatura" integer NOT NULL, "precounitenergiacompensadafatura" numeric NOT NULL, "valoriluminacaopublicafatura" numeric NOT NULL, "valortotalfatura" numeric NOT NULL, CONSTRAINT "PK_d244a9eead4ed29c59ffae62d99" PRIMARY KEY ("idfatura"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tblfatura"`);
    }

}
