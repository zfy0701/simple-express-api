import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";

@Entity()
export class Block {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(type => Block, block => block.children,  { nullable: true })
    parent: Block;

    @OneToMany(type => Block, block => block.parent)
    children: Block[];

    @Column("json", { nullable: true })
    properties: { };
}

// CREATE TABLE public.block
// (
//     id uuid NOT NULL DEFAULT uuid_generate_v4(),
//     properties json NOT NULL DEFAULT '{}'::json,
//     "parentId" uuid,
//     CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY (id),
//     CONSTRAINT "FK_fdad3187d4180ced5df952a2452" FOREIGN KEY ("parentId")
// )
