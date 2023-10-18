import { connect } from "@planetscale/database";

export const config = {
  url: process.env.DATABASE_URL,
};

export const conn = connect(config);
