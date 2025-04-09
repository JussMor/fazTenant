import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
	transpilePackages: ["three"],
	webpack: (config) => {
		config.externals.push("@libsql/client");
		return config;
	},
};

initOpenNextCloudflareForDev();

export default nextConfig;
