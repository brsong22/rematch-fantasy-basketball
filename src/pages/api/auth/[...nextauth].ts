import NextAuth, { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
	secret: process.env.AUTH_SECRET,
	providers: [
		{
			id: 'yahoo',
			name: 'Yahoo!',
			type: 'oauth',
			version: '2',
			wellKnown: 'https://api.login.yahoo.com/.well-known/openid-configuration',
			idToken: true,
			clientId: process.env.YAHOO_CLIENT_ID,
			clientSecret: process.env.YAHOO_CLIENT_SECRET,
			profileUrl: 'https://api.login.yahoo.com/openid/v1/userinfo',
			authorization: {
				url: 'https://api.login.yahoo.com/oauth2/request_auth',
				params: {
					client_id: process.env.YAHOO_CLIENT_ID,
					redirect_uri: process.env.REDIRECT_URI,
					response_type: 'code',
				},
			},
			token: {
				url: 'https://api.login.yahoo.com/oauth2/get_token',
				grant_type: 'authorization_code',
			},
			client: {
				authorization_signed_response_alg: 'ES256',
				id_token_signed_response_alg: 'ES256',
			},
			profile: (profile) => {
				return {
					id: profile.sub,
					email: profile.email,
					name: profile.name,
				}
			},
		},
	],
	callbacks: {
		async redirect({ url, baseUrl }: any) {
			return url
		},
		async session({ session, token }: any) {
			session.token = token

			return session
		},
		async signIn({ user, account, profile, email, credentials }: any) {
			return true
		},
		async jwt({ token, account, profile }) {
			if (account) {
				token.accessToken = account.access_token
			}

			return token
		}
	},
}

export default NextAuth({...authOptions})
