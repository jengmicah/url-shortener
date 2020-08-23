export {};

import mongoose, { Schema, Document } from "mongoose";

export interface IRedirect extends Document {
  url: string;
  slug: string;
  date: Date;
}

const RedirectSchema: Schema = new Schema({
  url: { type: String, required: true },
  slug: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

RedirectSchema.index({ slug: 1 }, { unique: true });
const Redirect = mongoose.model<IRedirect>("Redirect", RedirectSchema);
export { Redirect };
