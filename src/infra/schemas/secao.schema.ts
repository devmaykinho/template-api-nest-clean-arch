import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface ConteudoDigitalSecaoEntity {
  codigo: string;
  ordem: number;
  contaProgresso: boolean;
}

@Schema({ collection: 'secoes' })
export class SecaoEntity {
  @Prop({ unique: true })
  codigo: string;

  @Prop()
  titulo: string;

  @Prop()
  descricao: string;

  @Prop()
  conteudosDigitais: Array<ConteudoDigitalSecaoEntity>;

  @Prop()
  dataCriacao: Date;

  @Prop()
  usuarioCriacao: string;

  @Prop({ required: false })
  dataAtualizacao?: Date;

  @Prop({ required: false })
  usuarioAtualizacao?: string;
}

export type SecaoDocument = HydratedDocument<SecaoEntity>;
export const SecaoSchema = SchemaFactory.createForClass(SecaoEntity);
