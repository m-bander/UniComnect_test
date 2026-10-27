import { CorsOptions } from "cors";

const allowedOrigins: string[] = [process.env.CLIENT_URL!];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed orgin by cors"));
  },
  optionsSuccessStatus: 200,
};

export { corsOptions, allowedOrigins };
