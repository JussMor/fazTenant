import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
	transpilePackages: ["three"],
	webpack: (config) => {
		config.externals.push("@libsql/client");
		return config;
	},
};



export default nextConfig;
