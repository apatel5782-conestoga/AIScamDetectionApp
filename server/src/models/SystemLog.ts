import { Schema, model } from "mongoose";

export interface ISystemLog {
  _id?: unknown;
  type: string;
  message: string;
  metadata?: Record<string, unknown>;
  dedupeKey?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const systemLogSchema = new Schema<ISystemLog>(
  {
    type: { type: String, required: true, trim: true, index: true },
    message: { type: String, required: true, trim: true },
    metadata: { type: Schema.Types.Mixed },
    dedupeKey: { type: String, index: true },
  },
  { timestamps: true },
);

const SystemLogModel = model<ISystemLog>("SystemLog", systemLogSchema);

export default SystemLogModel;
