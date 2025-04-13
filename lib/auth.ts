import { stripe } from "@better-auth/stripe";
import { LibsqlDialect } from "./db";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import {
	admin,
	bearer,
	customSession,
	multiSession,
	oAuthProxy,
	oidcProvider,
	oneTap,
	openAPI,
	organization,
	twoFactor,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { Stripe } from "stripe";
import { reactInvitationEmail } from "./email/invitation";
import { resend } from "./email/resend";
import { reactResetPasswordEmail } from "./email/reset-password";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const fetchCloudflareContext = async () => {
	return await getCloudflareContext({ async: true }) ;
};

const ctxClf = await fetchCloudflareContext();

const from = ctxClf.env.BETTER_AUTH_EMAIL || "delivered@resend.dev";
const to = ctxClf.env.TEST_EMAIL || "";

const libsql = new LibsqlDialect({
	url: ctxClf.env.TURSO_URL || "",
	authToken: ctxClf.env.TURSO_AUTH_TOKEN || ""
});


if (!libsql) {
	throw new Error("No dialect found");
}

const PROFESSION_PRICE_ID = {
	default: "price_1RDDgNR6Bm4TBhLQd31uPr92",
	annual: "price_1RDDnlR6Bm4TBhLQblgGzGWj",
};
const STARTER_PRICE_ID = {
	default: "price_1RDDokR6Bm4TBhLQRoOeYDsQ",
	annual: "price_1RDDnQR6Bm4TBhLQk9Xch3bt",
};

export const auth = betterAuth({
	appName: "Better Auth Demo",
	database: {
		dialect: libsql,
		type: "sqlite",
	},
	emailVerification: {
		async sendVerificationEmail({ user, url }) {
			const res = await resend.emails.send({
				from,
				to: to || user.email,
				subject: "Verify your email address",
				html: `<a href="${url}">Verify your email address</a>`,
			});
			console.log(res, user.email);
		},
	},
	account: {
		accountLinking: {
			trustedProviders: ["google", "github", "demo-app"],
		},
	},
	emailAndPassword: {
		enabled: true,
		async sendResetPassword({ user, url }) {
			await resend.emails.send({
				from,
				to: user.email,
				subject: "Reset your password",
				react: reactResetPasswordEmail({
					username: user.email,
					resetLink: url,
				}),
			});
		},
	},
	socialProviders: {
		github: {
			clientId: ctxClf.env.GITHUB_CLIENT_ID || "",
			clientSecret: ctxClf.env.GITHUB_CLIENT_SECRET || "",
		},
		google: {
			clientId: ctxClf.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
			clientSecret: ctxClf.env.GOOGLE_CLIENT_SECRET || "",
		},
	},
	plugins: [
		organization({
			async sendInvitationEmail(data) {
				await resend.emails.send({
					from,
					to: data.email,
					subject: "You've been invited to join an organization",
					react: reactInvitationEmail({
						username: data.email,
						invitedByUsername: data.inviter.user.name,
						invitedByEmail: data.inviter.user.email,
						teamName: data.organization.name,
						inviteLink:
							process.env.NODE_ENV === "development"
								? `http://localhost:3000/accept-invitation/${data.id}`
								: `${
										ctxClf.env.BETTER_AUTH_URL ||
										"https://demo.better-auth.com"
									}/accept-invitation/${data.id}`,
					}),
				});
			},
		}),
		twoFactor({
			otpOptions: {
				async sendOTP({ user, otp }) {
					await resend.emails.send({
						from,
						to: user.email,
						subject: "Your OTP",
						html: `Your OTP is ${otp}`,
					});
				},
			},
		}),
		passkey(),
		openAPI(),
		bearer(),
		admin({
			adminUserIds: ["EXD5zjob2SD6CBWcEQ6OpLRHcyoUbnaB"],
		}),
		multiSession(),
		oAuthProxy(),
		nextCookies(),
		oidcProvider({
			loginPage: "/sign-in",
		}),
		oneTap(),
		customSession(async (session) => {
			return {
				...session,
				user: {
					...session.user
				},
			};
		}),
		stripe({
			stripeClient: new Stripe(ctxClf.env.STRIPE_KEY || "sk_test_"),
			stripeWebhookSecret: ctxClf.env.STRIPE_WEBHOOK_SECRET!,
			createCustomerOnSignUp: true,
			subscription: {
				enabled: true,
				plans: [
					{
						name: "Starter",
						priceId: STARTER_PRICE_ID.default,
						annualDiscountPriceId: STARTER_PRICE_ID.annual,
						freeTrial: {
							days: 7,
						},
					},
					{
						name: "Professional",
						priceId: PROFESSION_PRICE_ID.default,
						annualDiscountPriceId: PROFESSION_PRICE_ID.annual,
					},
					{
						name: "Enterprise",
					},
				],
			},
		}),
	],
});
