import type { NextConfig } from "next";

const uploadConfig: NextConfig = {
    /* config options here */
    api: {
        bodyParser: {
            sizeLimit: '2mb' // Set desired value here
        }
    }
};

export default uploadConfig;